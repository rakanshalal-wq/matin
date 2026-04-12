import jwt from 'jsonwebtoken';
import crypto from 'crypto';
// pool موحّد من db.ts — يمنع إنشاء اتصالات مكررة
import dbPool from './db';
export const pool = dbPool;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('[Startup] JWT_SECRET غير معيّن. يجب تعيين JWT_SECRET في .env.local');
}
// TypeScript: بعد التحقق أعلاه، JWT_SECRET مضمون أنه string
const JWT_SECRET_SAFE = JWT_SECRET as string;
const JWT_EXPIRES = '7d';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const ALGORITHM = 'aes-256-gcm';

// ===== الأدوار الستة المعتمدة في منصة متين =====
export type UserRole = 'super_admin' | 'owner' | 'admin' | 'teacher' | 'trainer' | 'muhaffiz' | 'supervisor' | 'caregiver' | 'parent' | 'student' | 'trainee';

export const ROLES: Record<UserRole, { label: string; dashboardPath: string; level: number }> = {
  super_admin: { label: 'مالك المنصة', dashboardPath: '/owner', level: 6 },
  owner:       { label: 'مالك مدرسة',  dashboardPath: '/dashboard/owner', level: 5 },
  admin:       { label: 'مدير مدرسة',  dashboardPath: '/dashboard/admin', level: 4 },
  teacher:     { label: 'معلم',         dashboardPath: '/dashboard/teacher', level: 3 },
  parent:      { label: 'ولي أمر',      dashboardPath: '/dashboard/parent', level: 2 },
  trainer:     { label: 'مدرب',         dashboardPath: '/dashboard/trainer', level: 3 },
  trainee:     { label: 'متدرب',        dashboardPath: '/dashboard/trainee', level: 1 },
  muhaffiz:    { label: 'محفّظ',        dashboardPath: '/dashboard/muhaffiz', level: 3 },
  supervisor:  { label: 'مشرف حلقات',   dashboardPath: '/dashboard/supervisor', level: 4 },
  caregiver:   { label: 'مربية',        dashboardPath: '/dashboard/caregiver', level: 3 },
  student:     { label: 'طالب',         dashboardPath: '/dashboard/student', level: 1 },
};

export function getDashboardPath(role: string): string {
  return ROLES[role as UserRole]?.dashboardPath || '/dashboard';
}

export function hasPermission(userRole: string, requiredLevel: number): boolean {
  const level = ROLES[userRole as UserRole]?.level || 0;
  return level >= requiredLevel;
}

// ===== تشفير وفك تشفير الحقول الحساسة (AES-256-GCM) =====
export function encryptField(text: string): string {
  if (!text || !ENCRYPTION_KEY) return text;
  try {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `ENC:${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch { return text; }
}

export function decryptField(encrypted: string): string {
  if (!encrypted || !encrypted.startsWith('ENC:')) return encrypted;
  try {
    const [, ivHex, authTagHex, encryptedData] = encrypted.split(':');
    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch { return encrypted; }
}

// ===== JWT =====
export function generateToken(user: any): string {
  return jwt.sign(
    { id: user.id, role: user.role, school_id: user.school_id, owner_id: user.owner_id, package: user.package || 'free' },
    JWT_SECRET_SAFE,
    { expiresIn: JWT_EXPIRES }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET_SAFE);
  } catch { return null; }
}

// ===== استخراج المستخدم من الطلب =====
export async function getUserFromRequest(request: Request): Promise<any> {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded) {
        const result = await pool.query(
          'SELECT id, name, email, role, school_id, owner_id, package, status FROM users WHERE id = $1 AND status = $2',
          [decoded.id, 'active']
        );
        if (result.rows[0]) return result.rows[0];
      }
    }
    const cookies = request.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/matin_token=([^;]+)/);
    if (tokenMatch) {
      const decoded = verifyToken(tokenMatch[1]);
      if (decoded) {
        const result = await pool.query(
          'SELECT id, name, email, role, school_id, owner_id, package, status FROM users WHERE id = $1 AND status = $2',
          [decoded.id, 'active']
        );
        if (result.rows[0]) return result.rows[0];
      }
    }
    return null;
  } catch { return null; }
}

// ===== فلتر SQL حسب الدور - عزل البيانات الذهبي =====
// القاعدة الذهبية: كل مدرسة معزولة 100% عن الأخرى
// - super_admin: يرى كل شيء (لكن لا يرى محتوى الاختبارات المشفرة)
// - owner: يرى فقط بيانات مدرسته (owner_id = user.id)
// - admin/teacher/parent/student: يرون فقط بيانات مدرستهم (school_id = user.school_id)
export function getFilterSQL(user: any, paramStart: number = 1): { sql: string; params: any[] } {
  if (!user) return { sql: 'AND 1=0', params: [] };

  switch (user.role) {
    case 'super_admin':
      // مالك المنصة يرى كل شيء - لكن لا يرى المحتوى المشفر
      return { sql: '', params: [] };

    case 'owner':
      // مالك المدرسة يرى بيانات مدارسه عبر owner_id (ليس school_id)
      // المالك لا ينتمي لمدرسة بل يملكها، لذا نفلتر بـ owner_id = user.id
      return { sql: `AND owner_id = $${paramStart}`, params: [user.id] };

    case 'admin':
    case 'supervisor':
      // مدير المدرسة يرى بيانات مدرسته فقط
      if (!user.school_id) return { sql: 'AND 1=0', params: [] };
      return { sql: `AND school_id = $${paramStart}`, params: [user.school_id] };

    case 'teacher':
    case 'trainer':
    case 'muhaffiz':
    case 'caregiver':
      // المعلم يرى بيانات مدرسته فقط
      if (!user.school_id) return { sql: 'AND 1=0', params: [] };
      return { sql: `AND school_id = $${paramStart}`, params: [user.school_id] };

    case 'parent':
      // ولي الأمر يرى بيانات أبنائه فقط في مدرستهم
      if (!user.school_id) return { sql: 'AND 1=0', params: [] };
      return { sql: `AND school_id = $${paramStart}`, params: [user.school_id] };

    case 'student':
    case 'trainee':
      // الطالب يرى بياناته الشخصية فقط
      if (!user.school_id) return { sql: 'AND 1=0', params: [] };
      return { sql: `AND school_id = $${paramStart}`, params: [user.school_id] };

    default:
      return { sql: 'AND 1=0', params: [] };
  }
}

// فلتر خاص للطالب - يرى بياناته هو فقط
export function getStudentFilterSQL(user: any, paramStart: number = 1): { sql: string; params: any[] } {
  if (!user || user.role !== 'student') return { sql: 'AND 1=0', params: [] };
  return { sql: `AND school_id = $${paramStart} AND student_id = $${paramStart + 1}`, params: [user.school_id, user.id] };
}

// فلتر خاص لولي الأمر - يرى بيانات أبنائه فقط
export function getParentFilterSQL(user: any, paramStart: number = 1): { sql: string; params: any[] } {
  if (!user || user.role !== 'parent') return { sql: 'AND 1=0', params: [] };
  return { sql: `AND school_id = $${paramStart} AND parent_id = $${paramStart + 1}`, params: [user.school_id, user.id] };
}

// ===== معرفات الإدراج =====
export function getInsertIds(user: any): { school_id: number | null; owner_id: number | null } {
  return {
    school_id: user?.school_id || null,
    owner_id: user?.role === 'owner' ? user.id : (user?.owner_id || null)
  };
}

// ===== التحقق من صلاحية الوصول لمدرسة معينة =====
export function canAccessSchool(user: any, schoolId: number, ownerId: number): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  if (user.role === 'owner') return user.id === ownerId;
  return user.school_id === schoolId;
}

// ===== مستويات الصلاحيات =====
export const PERMISSION_LEVELS = {
  VIEW_PLATFORM_STATS: 6,    // super_admin فقط
  MANAGE_SCHOOLS: 6,          // super_admin فقط
  MANAGE_SCHOOL: 5,           // owner فقط
  MANAGE_STAFF: 4,            // admin فوق
  MANAGE_CLASSES: 4,          // admin فوق
  VIEW_REPORTS: 4,            // admin فوق
  MANAGE_EXAMS: 3,            // teacher فوق
  RECORD_ATTENDANCE: 3,       // teacher فوق
  ENTER_GRADES: 3,            // teacher فوق
  VIEW_CHILD_DATA: 2,         // parent فوق
  PAY_FEES: 2,                // parent فوق
  VIEW_OWN_DATA: 1,           // student فوق
};
