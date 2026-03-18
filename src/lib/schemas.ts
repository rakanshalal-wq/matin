/**
 * مخططات التحقق (Validation Schemas) باستخدام Zod
 * يُستخدم هذا الملف في جميع API routes للتحقق من صحة البيانات الواردة
 */
import { z } from 'zod';

// ===== Auth Schemas =====

export const LoginSchema = z.object({
  email: z
    .string({ error: 'البريد الإلكتروني مطلوب' })
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255, 'البريد الإلكتروني طويل جداً'),
  password: z
    .string({ error: 'كلمة المرور مطلوبة' })
    .min(1, 'كلمة المرور مطلوبة')
    .max(128, 'كلمة المرور طويلة جداً'),
});

export const RegisterSchema = z.object({
  name: z
    .string({ error: 'الاسم مطلوب' })
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً')
    .trim(),
  email: z
    .string({ error: 'البريد الإلكتروني مطلوب' })
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255, 'البريد الإلكتروني طويل جداً')
    .toLowerCase()
    .trim(),
  password: z
    .string({ error: 'كلمة المرور مطلوبة' })
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .max(128, 'كلمة المرور طويلة جداً'),
  phone: z
    .string()
    .max(20, 'رقم الجوال طويل جداً')
    .optional()
    .nullable(),
  bio: z.string().max(500, 'النبذة طويلة جداً').optional().nullable(),
  avatar: z.string().url('رابط الصورة غير صحيح').optional().nullable().or(z.literal('')),
  package: z.string().max(50).optional().nullable(),
});

export const ChangePasswordSchema = z.object({
  current_password: z
    .string({ error: 'كلمة المرور الحالية مطلوبة' })
    .min(1, 'كلمة المرور الحالية مطلوبة'),
  new_password: z
    .string({ error: 'كلمة المرور الجديدة مطلوبة' })
    .min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
    .max(128, 'كلمة المرور طويلة جداً'),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ error: 'البريد الإلكتروني مطلوب' })
    .email('صيغة البريد الإلكتروني غير صحيحة'),
});

export const ResetPasswordSchema = z.object({
  token: z.string({ error: 'رمز الاستعادة مطلوب' }).min(1),
  password: z
    .string({ error: 'كلمة المرور الجديدة مطلوبة' })
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .max(128, 'كلمة المرور طويلة جداً'),
});

// ===== Student Schema =====

export const StudentSchema = z.object({
  name: z
    .string({ error: 'اسم الطالب مطلوب' })
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً')
    .trim(),
  email: z
    .string()
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255)
    .optional()
    .nullable()
    .or(z.literal('')),
  phone: z.string().max(20, 'رقم الجوال طويل جداً').optional().nullable(),
  grade: z.string().max(50, 'الصف طويل جداً').optional().nullable(),
  class_id: z.number().int().positive().optional().nullable(),
  gender: z.enum(['male', 'female', 'other']).optional().nullable(),
  birth_date: z.string().optional().nullable(),
  guardian_name: z.string().max(100).optional().nullable(),
  guardian_phone: z.string().max(20).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// ===== Employee Schema =====

export const EmployeeSchema = z.object({
  name: z
    .string({ error: 'اسم الموظف مطلوب' })
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً')
    .trim(),
  email: z
    .string()
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255)
    .optional()
    .nullable()
    .or(z.literal('')),
  phone: z.string().max(20).optional().nullable(),
  role: z.string().max(50).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  salary: z.number().nonnegative('الراتب لا يمكن أن يكون سالباً').optional().nullable(),
  hire_date: z.string().optional().nullable(),
  national_id: z.string().max(20).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// ===== Announcement Schema =====

export const AnnouncementSchema = z.object({
  title: z
    .string({ error: 'عنوان الإعلان مطلوب' })
    .min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً')
    .trim(),
  content: z
    .string({ error: 'محتوى الإعلان مطلوب' })
    .min(10, 'المحتوى يجب أن يكون 10 أحرف على الأقل')
    .max(5000, 'المحتوى طويل جداً'),
  type: z.enum(['general', 'urgent', 'event', 'exam', 'holiday']).optional().default('general'),
  target_role: z.string().max(50).optional().nullable(),
  expires_at: z.string().optional().nullable(),
});

// ===== Exam Schema =====

export const ExamSchema = z.object({
  title: z
    .string({ error: 'عنوان الاختبار مطلوب' })
    .min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً')
    .trim(),
  subject: z.string().max(100).optional().nullable(),
  grade: z.string().max(50).optional().nullable(),
  duration_minutes: z
    .number()
    .int()
    .min(1, 'مدة الاختبار يجب أن تكون دقيقة على الأقل')
    .max(480, 'مدة الاختبار لا يمكن أن تتجاوز 8 ساعات')
    .optional()
    .nullable(),
  pass_score: z
    .number()
    .min(0)
    .max(100, 'درجة النجاح لا يمكن أن تتجاوز 100')
    .optional()
    .nullable(),
  instructions: z.string().max(2000).optional().nullable(),
  starts_at: z.string().optional().nullable(),
  ends_at: z.string().optional().nullable(),
});

// ===== Course / Lecture Schema =====

export const CourseSchema = z.object({
  title: z
    .string({ error: 'عنوان الدورة مطلوب' })
    .min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً')
    .trim(),
  description: z.string().max(2000).optional().nullable(),
  subject: z.string().max(100).optional().nullable(),
  grade: z.string().max(50).optional().nullable(),
  cover_image: z.string().url('رابط الصورة غير صحيح').optional().nullable().or(z.literal('')),
  is_active: z.boolean().optional().default(true),
});

// ===== Payment / Invoice Schema =====

export const PaymentSchema = z.object({
  student_id: z.number().int().positive('معرف الطالب غير صحيح').optional().nullable(),
  amount: z
    .number({ error: 'المبلغ مطلوب' })
    .positive('المبلغ يجب أن يكون أكبر من صفر')
    .max(1_000_000, 'المبلغ كبير جداً'),
  description: z.string().max(500).optional().nullable(),
  due_date: z.string().optional().nullable(),
  payment_method: z
    .enum(['cash', 'bank_transfer', 'online', 'check', 'other'])
    .optional()
    .nullable(),
});

// ===== Settings Schema =====

export const SettingSchema = z.object({
  key: z
    .string({ error: 'مفتاح الإعداد مطلوب' })
    .min(1)
    .max(100)
    .regex(/^[a-z0-9_]+$/, 'مفتاح الإعداد يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطة سفلية فقط'),
  value: z.string().max(5000, 'قيمة الإعداد طويلة جداً'),
});

// ===== Helper: تحويل أخطاء Zod إلى رسالة واضحة =====

export function formatZodError(error: z.ZodError): string {
  // Zod v4 uses .issues instead of .errors
  return error.issues.map((e) => e.message).join(' | ');
}

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type StudentInput = z.infer<typeof StudentSchema>;
export type EmployeeInput = z.infer<typeof EmployeeSchema>;
export type AnnouncementInput = z.infer<typeof AnnouncementSchema>;
export type ExamInput = z.infer<typeof ExamSchema>;
export type CourseInput = z.infer<typeof CourseSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
