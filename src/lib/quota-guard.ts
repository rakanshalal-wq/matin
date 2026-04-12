/**
 * lib/quota-guard.ts — حراسة الحصص (Quota Guard)
 *
 * يُستدعى من API Routes قبل أي عملية إضافة طالب أو رفع ملف،
 * ويمنع العملية إذا تجاوزت المؤسسة حدود باقتها.
 */

import { checkTenantQuota } from './tenant';

export interface GuardResult {
  allowed: boolean;
  error?: string;
  upgrade_url?: string;
  current?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────
// فحص حصة الطلاب قبل إضافة طالب جديد
// ─────────────────────────────────────────────────────────────────
export async function guardStudentAdd(schoolId: string | number): Promise<GuardResult> {
  try {
    const quota = await checkTenantQuota(schoolId, 'students');
    if (!quota.allowed) {
      return {
        allowed: false,
        error: `وصلت إلى الحد الأقصى من الطلاب (${quota.current} / ${quota.limit}). يرجى ترقية الباقة للمتابعة.`,
        upgrade_url: '/dashboard/subscription',
        current: quota.current,
        limit: quota.limit,
      };
    }
    return { allowed: true, current: quota.current, limit: quota.limit };
  } catch {
    // في حال فشل فحص الحصة، نسمح بالعملية (fail-open) لتجنب تعطيل الخدمة
    return { allowed: true };
  }
}

// ─────────────────────────────────────────────────────────────────
// فحص حصة التخزين قبل رفع ملف
// ─────────────────────────────────────────────────────────────────
export async function guardFileUpload(
  schoolId: string | number,
  fileSizeBytes: number
): Promise<GuardResult> {
  try {
    const quota = await checkTenantQuota(schoolId, 'storage', fileSizeBytes);
    if (!quota.allowed) {
      const currentGB = (quota.currentStorageBytes / (1024 ** 3)).toFixed(2);
      const limitGB   = (quota.limitStorageBytes  / (1024 ** 3)).toFixed(0);
      return {
        allowed: false,
        error: `وصلت إلى حد التخزين (${currentGB} / ${limitGB} GB). يرجى ترقية الباقة للمتابعة.`,
        upgrade_url: '/dashboard/subscription',
      };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}
