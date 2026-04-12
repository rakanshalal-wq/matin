/**
 * validation.ts
 * دوال التحقق من صحة المدخلات لـ API routes
 */

// ─── أنواع ────────────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ─── دوال مساعدة ─────────────────────────────────

/** يتحقق أن القيمة سلسلة نصية غير فارغة */
export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

/** يتحقق أن القيمة رقم صحيح موجب */
export function isPositiveInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v > 0;
}

/** يتحقق صيغة البريد الإلكتروني */
export function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/** يتحقق صيغة رقم الجوال (يقبل أرقام سعودية وخليجية) */
export function isValidPhone(v: unknown): v is string {
  return typeof v === 'string' && /^[\d\s\+\-]{7,20}$/.test(v.trim());
}

/** يقطع النص إلى الحد الأقصى */
export function sanitizeString(v: string, maxLength = 500): string {
  return v.trim().slice(0, maxLength);
}

// ─── Validators ───────────────────────────────────

/** التحقق من بيانات تسجيل الحضور */
export function validateAttendancePayload(body: Record<string, unknown>): ValidationResult {
  const { class_id, records } = body;
  if (!isPositiveInt(class_id)) {
    return { valid: false, error: 'class_id يجب أن يكون رقماً صحيحاً موجباً' };
  }
  if (!Array.isArray(records) || records.length === 0) {
    return { valid: false, error: 'records يجب أن تكون قائمة غير فارغة' };
  }
  const validStatuses = ['present', 'absent', 'late', 'excused'];
  for (const r of records) {
    if (!isPositiveInt(r.student_id)) {
      return { valid: false, error: 'كل سجل يجب أن يحتوي على student_id صحيح' };
    }
    if (!validStatuses.includes(r.status)) {
      return { valid: false, error: `status يجب أن يكون أحد: ${validStatuses.join('، ')}` };
    }
  }
  return { valid: true };
}

/** التحقق من بيانات الواجب المنزلي */
export function validateHomeworkPayload(body: Record<string, unknown>): ValidationResult {
  const { title } = body;
  if (!isNonEmptyString(title)) {
    return { valid: false, error: 'عنوان الواجب مطلوب' };
  }
  if ((title as string).length > 255) {
    return { valid: false, error: 'عنوان الواجب طويل جداً (الحد 255 حرفاً)' };
  }
  return { valid: true };
}

/** التحقق من بيانات طلب الانضمام */
export function validateJoinRequestPayload(body: Record<string, unknown>): ValidationResult {
  const { parent_name, student_name, phone } = body;
  if (!isNonEmptyString(parent_name)) {
    return { valid: false, error: 'اسم ولي الأمر مطلوب' };
  }
  if (!isNonEmptyString(student_name)) {
    return { valid: false, error: 'اسم الطالب مطلوب' };
  }
  if (!isValidPhone(phone)) {
    return { valid: false, error: 'رقم الجوال غير صحيح' };
  }
  if (body.email && !isValidEmail(body.email)) {
    return { valid: false, error: 'صيغة البريد الإلكتروني غير صحيحة' };
  }
  return { valid: true };
}
