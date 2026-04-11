/**
 * payment.ts — طبقة الدفع الموحّدة (Moyasar + Tamara)
 *
 * الاستخدام:
 *   import { createPayment, verifyPayment, verifyWebhookSignature } from '@/lib/payment';
 *
 * المتغيرات البيئية المطلوبة:
 *   MOYASAR_API_KEY           — Secret Key (backend only)
 *   MOYASAR_PUBLISHABLE_KEY   — Publishable Key (frontend)
 *   MOYASAR_WEBHOOK_SECRET    — سر التحقق من Webhook
 *   TAMARA_API_KEY            — (اختياري) للدفع بالتقسيط
 *   TAMARA_MERCHANT_URL       — (اختياري) رابط موقعك
 */

import crypto from 'crypto';

// ── أنواع مشتركة ──────────────────────────────────────────────────

export type PaymentStatus =
  | 'initiated'
  | 'paid'
  | 'failed'
  | 'authorized'
  | 'captured'
  | 'refunded'
  | 'voided';

export interface PaymentResult {
  success: boolean;
  payment_id?: string;
  payment_url?: string;
  status?: PaymentStatus;
  amount?: number;
  currency?: string;
  error?: string;
  raw?: unknown;
}

export interface CreatePaymentParams {
  amount: number;          // بالهللات (1 ريال = 100 هللة)
  currency?: string;       // افتراضي: SAR
  description: string;
  callback_url: string;
  metadata?: Record<string, string>;
  source?: {
    type: 'creditcard' | 'stcpay' | 'applepay' | 'token';
    token?: string;
  };
}

// ══════════════════════════════════════════════════════════════════
// 💳 MOYASAR
// ══════════════════════════════════════════════════════════════════

function getMoyasarAuth(): string | null {
  const key = process.env.MOYASAR_API_KEY;
  if (!key) {
    console.warn('[Payment] MOYASAR_API_KEY غير محدد — الدفع معطّل');
    return null;
  }
  return 'Basic ' + Buffer.from(key + ':').toString('base64');
}

/**
 * إنشاء دفعة جديدة عبر Moyasar
 * يرجع payment_url لتوجيه المستخدم إليه
 */
export async function createMoyasarPayment(
  params: CreatePaymentParams
): Promise<PaymentResult> {
  const auth = getMoyasarAuth();
  if (!auth) return { success: false, error: 'MOYASAR_API_KEY غير محدد' };

  try {
    const res = await fetch('https://api.moyasar.com/v1/payments', {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency ?? 'SAR',
        description: params.description,
        callback_url: params.callback_url,
        source: params.source ?? { type: 'creditcard' },
        metadata: params.metadata ?? {},
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Moyasar] خطأ في إنشاء الدفعة:', data);
      return { success: false, error: data?.message ?? 'فشل إنشاء الدفعة', raw: data };
    }

    return {
      success: true,
      payment_id: data.id,
      payment_url: data.source?.transaction_url,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      raw: data,
    };
  } catch (e: any) {
    console.error('[Moyasar] استثناء:', e.message);
    return { success: false, error: e.message };
  }
}

/**
 * التحقق من حالة دفعة موجودة
 */
export async function verifyMoyasarPayment(paymentId: string): Promise<PaymentResult> {
  const auth = getMoyasarAuth();
  if (!auth) return { success: false, error: 'MOYASAR_API_KEY غير محدد' };

  try {
    const res = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      headers: { Authorization: auth },
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data?.message ?? 'فشل جلب الدفعة', raw: data };
    }

    return {
      success: data.status === 'paid' || data.status === 'captured',
      payment_id: data.id,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      raw: data,
    };
  } catch (e: any) {
    console.error('[Moyasar] استثناء التحقق:', e.message);
    return { success: false, error: e.message };
  }
}

/**
 * التحقق من صحة توقيع Webhook القادم من Moyasar
 * يمنع استقبال طلبات مزيّفة
 */
export function verifyMoyasarWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.MOYASAR_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[Payment] MOYASAR_WEBHOOK_SECRET غير محدد — التحقق من Webhook معطّل');
    return true; // نسمح بالمرور في بيئة التطوير
  }
  if (!signatureHeader) return false;

  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    // مقارنة ثابتة الوقت لمنع Timing Attacks
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

// ══════════════════════════════════════════════════════════════════
// 🛍️ TAMARA (تقسيط)
// ══════════════════════════════════════════════════════════════════

export interface TamaraPaymentParams {
  amount: number;
  currency?: string;
  description: string;
  order_id: string;
  buyer: { name: string; email: string; phone: string };
  success_url: string;
  failure_url: string;
  cancel_url: string;
  items?: Array<{ name: string; quantity: number; unit_price: number }>;
}

/**
 * إنشاء جلسة دفع بالتقسيط عبر Tamara
 */
export async function createTamaraSession(
  params: TamaraPaymentParams
): Promise<PaymentResult> {
  const apiKey = process.env.TAMARA_API_KEY;
  const merchantUrl = process.env.TAMARA_MERCHANT_URL ?? 'https://matin.ink';

  if (!apiKey) {
    console.warn('[Payment] TAMARA_API_KEY غير محدد — تقسيط Tamara معطّل');
    return { success: false, error: 'TAMARA_API_KEY غير محدد' };
  }

  try {
    const res = await fetch('https://api.tamara.co/checkout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_reference_id: params.order_id,
        total_amount: { amount: (params.amount / 100).toFixed(2), currency: params.currency ?? 'SAR' },
        description: params.description,
        country_code: 'SA',
        payment_type: 'PAY_BY_INSTALMENTS',
        instalments: 3,
        buyer: {
          name: params.buyer.name,
          email: params.buyer.email,
          phone: params.buyer.phone,
        },
        merchant_url: {
          success: params.success_url,
          failure: params.failure_url,
          cancel: params.cancel_url,
          notification: `${merchantUrl}/api/payment/webhook`,
        },
        items: (params.items ?? []).map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: { amount: (item.unit_price / 100).toFixed(2), currency: params.currency ?? 'SAR' },
          total_amount: { amount: ((item.unit_price * item.quantity) / 100).toFixed(2), currency: params.currency ?? 'SAR' },
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Tamara] خطأ:', data);
      return { success: false, error: data?.message ?? 'فشل إنشاء جلسة Tamara', raw: data };
    }

    return {
      success: true,
      payment_id: data.checkout_id,
      payment_url: data.checkout_url,
      raw: data,
    };
  } catch (e: any) {
    console.error('[Tamara] استثناء:', e.message);
    return { success: false, error: e.message };
  }
}

// ══════════════════════════════════════════════════════════════════
// 🔧 واجهة موحّدة
// ══════════════════════════════════════════════════════════════════

export type PaymentProvider = 'moyasar' | 'tamara';

/**
 * إنشاء دفعة بأيّ مزوّد — الافتراضي Moyasar
 */
export async function createPayment(
  params: CreatePaymentParams & { provider?: PaymentProvider }
): Promise<PaymentResult> {
  const { provider = 'moyasar', ...rest } = params;
  if (provider === 'moyasar') return createMoyasarPayment(rest);
  return { success: false, error: `المزوّد "${provider}" غير مدعوم عبر createPayment — استخدم createTamaraSession` };
}

/**
 * التحقق من دفعة بأيّ مزوّد
 */
export async function verifyPayment(
  paymentId: string,
  provider: PaymentProvider = 'moyasar'
): Promise<PaymentResult> {
  if (provider === 'moyasar') return verifyMoyasarPayment(paymentId);
  return { success: false, error: `التحقق غير مدعوم لـ "${provider}"` };
}
