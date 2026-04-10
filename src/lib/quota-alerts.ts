/**
 * lib/quota-alerts.ts — تنبيهات الحصص (80% و 95%)
 *
 * يُشغَّل بواسطة cron يومياً عبر /api/cron/quota-alerts
 * يرسل إشعاراً للمؤسسة عند وصولها لـ 80% من الحد،
 * وتنبيهاً أشد عند 95%.
 *
 * يحتفظ بجدول quota_alert_log لتجنب إرسال نفس التنبيه مرتين
 * في نفس اليوم.
 */

import { Pool } from 'pg';

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

export type AlertLevel = '80' | '95';

interface TenantUsageRow {
  tenant_id: number;
  school_id: string;
  schema_name: string;
  owner_email: string;
  owner_name: string;
  current_students: number;
  max_students: number;
  current_storage_bytes: number;
  max_storage_bytes: number;
}

// ─────────────────────────────────────────────────────────────────
// إنشاء جدول سجل التنبيهات إن لم يكن موجوداً
// ─────────────────────────────────────────────────────────────────
export async function ensureAlertLogTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quota_alert_log (
      id          SERIAL PRIMARY KEY,
      tenant_id   INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      alert_level VARCHAR(5)  NOT NULL,     -- '80' أو '95'
      metric      VARCHAR(20) NOT NULL,     -- 'students' أو 'storage'
      sent_at     DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE (tenant_id, alert_level, metric, sent_at)
    )
  `);
}

// ─────────────────────────────────────────────────────────────────
// إرسال البريد الإلكتروني
// ─────────────────────────────────────────────────────────────────
async function sendAlert(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.warn('[QuotaAlerts] RESEND_API_KEY غير محدد — تخطي إرسال البريد');
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
    console.error('[QuotaAlerts] فشل إرسال البريد:', await res.text());
  }
}

// ─────────────────────────────────────────────────────────────────
// بناء HTML التنبيه
// ─────────────────────────────────────────────────────────────────
function buildAlertHtml(opts: {
  ownerName: string;
  level: AlertLevel;
  metric: 'students' | 'storage';
  current: number;
  limit: number;
  unit: string;
  percentage: number;
}): { subject: string; html: string } {
  const color = opts.level === '95' ? '#EF4444' : '#F59E0B';
  const urgency = opts.level === '95' ? '🚨 تنبيه عاجل' : '⚠️ تنبيه';
  const metricLabel =
    opts.metric === 'students' ? 'الطلاب المسجلين' : 'مساحة التخزين';
  const subject = `${urgency} — وصلت مؤسستك لـ ${opts.level}% من حد ${metricLabel}`;

  const html = `
    <div dir="rtl" style="font-family:sans-serif;max-width:600px;margin:auto;background:#0D0D1A;color:#EEEEF5;padding:24px;border-radius:12px">
      <h2 style="color:${color}">${urgency}: ${opts.percentage.toFixed(0)}% من ${metricLabel}</h2>
      <p>عزيزي ${opts.ownerName}،</p>
      <p>
        وصلت مؤسستك إلى <strong style="color:${color}">${opts.percentage.toFixed(0)}%</strong>
        من الحد الأقصى لـ ${metricLabel}.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr style="background:#1A1A2E">
          <td style="padding:12px;border:1px solid #333">الاستهلاك الحالي</td>
          <td style="padding:12px;border:1px solid #333;color:${color};font-weight:bold">
            ${opts.current.toLocaleString('ar-SA')} ${opts.unit}
          </td>
        </tr>
        <tr>
          <td style="padding:12px;border:1px solid #333">الحد الأقصى</td>
          <td style="padding:12px;border:1px solid #333">
            ${opts.limit.toLocaleString('ar-SA')} ${opts.unit}
          </td>
        </tr>
      </table>
      <p>
        ${
          opts.level === '95'
            ? 'ستتوقف الإضافات الجديدة قريباً عند الوصول للحد الأقصى.'
            : 'قد تحتاج إلى ترقية باقتك قريباً.'
        }
      </p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://matin.app'}/dashboard/subscription"
         style="display:inline-block;background:#C9A84C;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
        ترقية الباقة
      </a>
      <hr style="border-color:#333;margin-top:24px" />
      <p style="color:#666;font-size:12px">فريق منصة متين</p>
    </div>`;

  return { subject, html };
}

// ─────────────────────────────────────────────────────────────────
// الدالة الرئيسية — تُشغَّل يومياً بواسطة cron
// ─────────────────────────────────────────────────────────────────
export async function processQuotaAlerts(): Promise<{
  checked: number;
  alertsSent: number;
}> {
  await ensureAlertLogTable();

  // جلب كل المؤسسات النشطة مع بيانات الحصص
  const { rows } = await pool.query<TenantUsageRow>(`
    SELECT
      t.id                                               AS tenant_id,
      t.school_id::text,
      t.schema_name,
      u.email                                            AS owner_email,
      u.name                                             AS owner_name,
      tq.current_students,
      sp.max_students,
      tq.current_storage_bytes,
      (sp.max_storage_gb::bigint * 1024 * 1024 * 1024)  AS max_storage_bytes
    FROM tenants t
    JOIN tenant_quotas tq      ON tq.tenant_id = t.id
    JOIN users u               ON u.id = t.owner_id::integer
    JOIN schools sc            ON sc.id = t.school_id::integer
    JOIN subscriptions sub     ON sub.school_id = sc.id AND sub.status = 'active'
    JOIN subscription_plans sp ON sp.id = sub.plan_id
    WHERE t.status = 'active'
  `);

  let alertsSent = 0;

  for (const row of rows) {
    // ─── فحص نسبة الطلاب ───────────────────────────────────────
    if (row.max_students > 0) {
      const pct = (row.current_students / row.max_students) * 100;

      for (const level of ['95', '80'] as AlertLevel[]) {
        const threshold = parseInt(level, 10);
        if (pct >= threshold) {
          // هل أرسلنا هذا التنبيه اليوم؟
          const { rowCount } = await pool.query(
            `SELECT 1 FROM quota_alert_log
             WHERE tenant_id=$1 AND alert_level=$2 AND metric='students' AND sent_at=CURRENT_DATE`,
            [row.tenant_id, level]
          );
          if ((rowCount ?? 0) === 0) {
            const { subject, html } = buildAlertHtml({
              ownerName: row.owner_name,
              level,
              metric: 'students',
              current: row.current_students,
              limit: row.max_students,
              unit: 'طالب',
              percentage: pct,
            });
            await sendAlert({ to: row.owner_email, subject, html });
            await pool.query(
              `INSERT INTO quota_alert_log (tenant_id, alert_level, metric) VALUES ($1,$2,'students')
               ON CONFLICT DO NOTHING`,
              [row.tenant_id, level]
            );
            alertsSent++;
            break; // أرسل أعلى مستوى فقط
          }
          break;
        }
      }
    }

    // ─── فحص نسبة التخزين ─────────────────────────────────────
    if (row.max_storage_bytes > 0) {
      const pct =
        (row.current_storage_bytes / row.max_storage_bytes) * 100;

      for (const level of ['95', '80'] as AlertLevel[]) {
        const threshold = parseInt(level, 10);
        if (pct >= threshold) {
          const { rowCount } = await pool.query(
            `SELECT 1 FROM quota_alert_log
             WHERE tenant_id=$1 AND alert_level=$2 AND metric='storage' AND sent_at=CURRENT_DATE`,
            [row.tenant_id, level]
          );
          if ((rowCount ?? 0) === 0) {
            const currentGB =
              row.current_storage_bytes / (1024 * 1024 * 1024);
            const limitGB =
              row.max_storage_bytes / (1024 * 1024 * 1024);
            const { subject, html } = buildAlertHtml({
              ownerName: row.owner_name,
              level,
              metric: 'storage',
              current: parseFloat(currentGB.toFixed(2)),
              limit: parseFloat(limitGB.toFixed(2)),
              unit: 'GB',
              percentage: pct,
            });
            await sendAlert({ to: row.owner_email, subject, html });
            await pool.query(
              `INSERT INTO quota_alert_log (tenant_id, alert_level, metric) VALUES ($1,$2,'storage')
               ON CONFLICT DO NOTHING`,
              [row.tenant_id, level]
            );
            alertsSent++;
            break;
          }
          break;
        }
      }
    }
  }

  return { checked: rows.length, alertsSent };
}
