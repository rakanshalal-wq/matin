/**
 * lib/offboarding.ts — إدارة حذف المؤسسات (Offboarding)
 *
 * عند إلغاء اشتراك مؤسسة:
 *  1. تُعيَّن حالتها إلى 'offboarding' ويُسجَّل تاريخ الحذف المجدول (30 يوم)
 *  2. يُرسَل تنبيه إلكتروني فوري للمؤسسة
 *  3. بعد 23 يوماً يُرسَل تنبيه ثانٍ (7 أيام قبل الحذف)
 *  4. عند انتهاء 30 يوماً يُحذف الـ Schema نهائياً
 *
 * دوال دورة الحياة:
 *  - scheduleOffboarding(schoolId)   : يبدأ فترة السماح
 *  - exportTenantData(schemaName)    : يصدّر بيانات المؤسسة كـ JSON
 *  - processOffboardingQueue()       : يُشغَّل بواسطة cron — يرسل تنبيهات ويحذف
 *  - cancelOffboarding(schoolId)     : يُلغي الحذف (إعادة الاشتراك)
 */

import { Pool } from 'pg';
import { invalidateTenantQuotaCache } from './tenant';

const MATIN_DB_URL =
  process.env.MATIN_DATABASE_URL || process.env.DATABASE_URL || '';

const pool = new Pool({
  connectionString: MATIN_DB_URL,
  max: 5,
  ssl:
    MATIN_DB_URL.includes('localhost') || MATIN_DB_URL.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false },
});

/** فترة السماح قبل الحذف النهائي (30 يوماً) */
const GRACE_PERIOD_DAYS = 30;
/** عدد الأيام قبل الحذف التي يُرسَل فيها التنبيه الثاني */
const SECOND_NOTICE_DAYS = 7;

// ─── إرسال البريد الإلكتروني عبر Resend ──────────────────────────
async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.warn('[Offboarding] RESEND_API_KEY غير محدد — تخطي إرسال البريد');
    return;
  }
  const fromEmail = process.env.EMAIL_FROM || 'noreply@matin.app';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `منصة متين <${fromEmail}>`,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error('[Offboarding] فشل إرسال البريد:', body);
  }
}

// ─── جلب بريد صاحب المؤسسة ────────────────────────────────────────
async function getOwnerEmail(
  schoolId: string | number
): Promise<{ email: string; name: string; schemaName: string } | null> {
  const { rows } = await pool.query<{
    email: string;
    name: string;
    schema_name: string;
  }>(
    `SELECT u.email, u.name, t.schema_name
     FROM tenants t
     JOIN users u ON u.id = t.owner_id::integer
     WHERE t.school_id = $1
     LIMIT 1`,
    [String(schoolId)]
  );
  if (!rows[0]) return null;
  return {
    email: rows[0].email,
    name: rows[0].name,
    schemaName: rows[0].schema_name,
  };
}

// ─────────────────────────────────────────────────────────────────
// 1. بدء فترة السماح — يُستدعى عند إلغاء الاشتراك
// ─────────────────────────────────────────────────────────────────
export async function scheduleOffboarding(
  schoolId: string | number
): Promise<void> {
  const offboardAt = new Date();
  offboardAt.setDate(offboardAt.getDate() + GRACE_PERIOD_DAYS);

  await pool.query(
    `UPDATE tenants
     SET status = 'offboarding',
         offboard_at = $2,
         offboard_notified = false
     WHERE school_id = $1`,
    [String(schoolId), offboardAt.toISOString()]
  );

  invalidateTenantQuotaCache(schoolId);

  // إرسال التنبيه الأول فوراً
  const owner = await getOwnerEmail(schoolId);
  if (owner) {
    const dateStr = offboardAt.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    await sendEmail({
      to: owner.email,
      subject: '⚠️ إشعار إلغاء اشتراك منصة متين',
      html: `
        <div dir="rtl" style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#C9A84C">إشعار إلغاء الاشتراك</h2>
          <p>عزيزي ${owner.name}،</p>
          <p>
            تم إلغاء اشتراك مؤسستك في منصة متين.
            سيتم حذف جميع بيانات مؤسستك نهائياً في
            <strong>${dateStr}</strong>.
          </p>
          <p>
            يمكنك تصدير بياناتك قبل هذا التاريخ من خلال
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://matin.app'}/dashboard/export">
              لوحة التحكم
            </a>.
          </p>
          <p>
            لإعادة تفعيل الاشتراك والاحتفاظ ببياناتك، قم بزيارة
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://matin.app'}/dashboard/subscription">
              صفحة الاشتراك
            </a>.
          </p>
          <hr style="border-color:#333" />
          <p style="color:#999;font-size:12px">فريق منصة متين</p>
        </div>`,
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// 2. تصدير بيانات المؤسسة (JSON)
// ─────────────────────────────────────────────────────────────────
export async function exportTenantData(
  schemaName: string
): Promise<Record<string, unknown[]>> {
  const client = await pool.connect();
  const tables = [
    'students',
    'teachers',
    'classes',
    'attendance',
    'grades',
    'schedules',
    'uploaded_files',
  ];
  const exported: Record<string, unknown[]> = {};

  try {
    await client.query(`SET search_path = "${schemaName}", public`);
    for (const table of tables) {
      try {
        const { rows } = await client.query(`SELECT * FROM ${table}`);
        exported[table] = rows;
      } catch {
        // الجدول غير موجود في هذا الـ Schema — تخطي
        exported[table] = [];
      }
    }
  } finally {
    client.release();
  }

  return exported;
}

// ─────────────────────────────────────────────────────────────────
// 3. معالجة قائمة الانتظار — يُشغَّل بواسطة cron يومياً
// ─────────────────────────────────────────────────────────────────
export async function processOffboardingQueue(): Promise<{
  notified: number;
  deleted: number;
}> {
  const now = new Date();

  // حساب التاريخ الذي يجب إرسال التنبيه الثاني عنده
  const secondNoticeThreshold = new Date(now);
  secondNoticeThreshold.setDate(now.getDate() + SECOND_NOTICE_DAYS);

  // ── أ. إرسال التنبيه الثاني (7 أيام قبل الحذف) ─────────────────
  const { rows: pendingNotice } = await pool.query<{
    school_id: string;
    schema_name: string;
    offboard_at: Date;
  }>(
    `SELECT t.school_id::text, t.schema_name, t.offboard_at
     FROM tenants t
     WHERE t.status = 'offboarding'
       AND t.offboard_notified = false
       AND t.offboard_at <= $1`,
    [secondNoticeThreshold.toISOString()]
  );

  let notified = 0;
  for (const row of pendingNotice) {
    const owner = await getOwnerEmail(row.school_id);
    if (owner) {
      const dateStr = new Date(row.offboard_at).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      await sendEmail({
        to: owner.email,
        subject: '🚨 تنبيه أخير — حذف بيانات مؤسستك خلال 7 أيام',
        html: `
          <div dir="rtl" style="font-family:sans-serif;max-width:600px;margin:auto">
            <h2 style="color:#EF4444">تنبيه أخير قبل حذف البيانات</h2>
            <p>عزيزي ${owner.name}،</p>
            <p>
              تبقى <strong>7 أيام فقط</strong> قبل حذف جميع بيانات مؤسستك نهائياً
              في <strong>${dateStr}</strong>.
            </p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://matin.app'}/dashboard/export"
                 style="background:#C9A84C;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">
                تصدير بياناتي الآن
              </a>
            </p>
            <p>
              أو قم بإعادة تفعيل اشتراكك من
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://matin.app'}/dashboard/subscription">هنا</a>.
            </p>
            <hr style="border-color:#333" />
            <p style="color:#999;font-size:12px">فريق منصة متين</p>
          </div>`,
      });
    }
    await pool.query(
      `UPDATE tenants SET offboard_notified = true WHERE school_id = $1`,
      [row.school_id]
    );
    notified++;
  }

  // ── ب. حذف المؤسسات التي انتهت فترة سماحها ──────────────────────
  const { rows: toDelete } = await pool.query<{
    id: number;
    school_id: string;
    schema_name: string;
  }>(
    `SELECT id, school_id::text, schema_name
     FROM tenants
     WHERE status = 'offboarding'
       AND offboard_at <= $1`,
    [now.toISOString()]
  );

  let deleted = 0;
  for (const row of toDelete) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // حذف الـ Schema نهائياً
      await client.query(
        `DROP SCHEMA IF EXISTS "${row.schema_name}" CASCADE`
      );
      // حذف سجل tenant + quota (CASCADE يكفي)
      await client.query(`DELETE FROM tenants WHERE id = $1`, [row.id]);
      await client.query('COMMIT');
      invalidateTenantQuotaCache(row.school_id);
      deleted++;
      console.log(`[Offboarding] حُذف Schema ${row.schema_name} نهائياً`);
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error(
        `[Offboarding] فشل حذف ${row.schema_name}:`,
        err
      );
    } finally {
      client.release();
    }
  }

  return { notified, deleted };
}

// ─────────────────────────────────────────────────────────────────
// 4. إلغاء الحذف — عند إعادة تفعيل الاشتراك
// ─────────────────────────────────────────────────────────────────
export async function cancelOffboarding(
  schoolId: string | number
): Promise<void> {
  await pool.query(
    `UPDATE tenants
     SET status = 'active',
         offboard_at = NULL,
         offboard_notified = false
     WHERE school_id = $1`,
    [String(schoolId)]
  );
  invalidateTenantQuotaCache(schoolId);
}
