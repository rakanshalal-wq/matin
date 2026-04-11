import { z } from 'zod';

/**
 * مخطط التحقق من بيانات تسجيل الدخول
 */
export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
});

/**
 * مخطط التحقق من بيانات الرسوم الدراسية
 */
export const studentFeeSchema = z.object({
  student_name: z.string().min(3, 'اسم الطالب مطلوب'),
  amount: z.coerce.number().positive('المبلغ يجب أن يكون رقماً موجباً'),
  paid_amount: z.coerce.number().nonnegative('المبلغ المدفوع لا يمكن أن يكون سالباً'),
  due_date: z.string().optional(),
  status: z.enum(['paid', 'pending', 'overdue', 'partial', 'waived']),
  fee_type: z.string().default('رسوم دراسية'),
});

/**
 * مخطط التحقق من إعدادات المؤسسة
 */
export const institutionSettingsSchema = z.object({
  name: z.string().min(2, 'اسم المؤسسة مطلوب'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'الرابط الفرعي غير صحيح (أحرف إنجليزية وأرقام وشرطات فقط)'),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'كود اللون غير صحيح'),
  institution_type: z.enum(['school', 'university', 'training_center', 'quran_center', 'nursery']),
});

/**
 * مخطط التحقق من منشورات المجتمع
 */
export const communityPostSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن لا يقل عن 5 أحرف'),
  content: z.string().min(10, 'المحتوى يجب أن لا يقل عن 10 أحرف'),
  school_id: z.number().positive(),
});
