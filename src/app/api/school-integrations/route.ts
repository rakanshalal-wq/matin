import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// بوابات الدفع المتاحة للمؤسسات
const PAYMENT_GATEWAYS = [
  {
    key: 'payment_gateway_1',
    label: 'بوابة الدفع الرئيسية',
    desc: 'قبول مدى، فيزا، ماستركارد',
    fields: [
      { key: 'publishable_key', label: 'Publishable Key', required: true, secret: false },
      { key: 'secret_key', label: 'Secret Key', required: true, secret: true },
    ],
  },
  {
    key: 'payment_gateway_2',
    label: 'بوابة الدفع البديلة',
    desc: 'بوابة دفع احتياطية متكاملة',
    fields: [
      { key: 'api_key', label: 'API Key', required: true, secret: true },
      { key: 'entity_id', label: 'Entity ID', required: true, secret: false },
    ],
  },
  {
    key: 'payment_wallet',
    label: 'المحفظة الإلكترونية',
    desc: 'الدفع عبر المحفظة الإلكترونية',
    fields: [
      { key: 'api_key', label: 'API Key', required: true, secret: true },
      { key: 'merchant_id', label: 'Merchant ID', required: true, secret: false },
    ],
  },
  {
    key: 'payment_bnpl_1',
    label: 'الدفع على أقساط',
    desc: 'اشتري الآن وادفع لاحقاً',
    fields: [
      { key: 'public_key', label: 'Public Key', required: true, secret: false },
      { key: 'secret_key', label: 'Secret Key', required: true, secret: true },
      { key: 'merchant_code', label: 'Merchant Code', required: true, secret: false },
    ],
  },
  {
    key: 'payment_bnpl_2',
    label: 'التقسيط بدون فوائد',
    desc: 'تقسيط ميسّر بدون فوائد',
    fields: [
      { key: 'api_token', label: 'API Token', required: true, secret: true },
    ],
  },
];

// ══════════════════════════════════════════════
// GET - جلب تكاملات الدفع للمؤسسة
// ══════════════════════════════════════════════
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const allowedRoles = ['admin', 'owner', 'super_admin'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const schoolId = user.role === 'super_admin'
      ? new URL(request.url).searchParams.get('school_id')
      : user.school_id;

    if (!schoolId) return NextResponse.json({ error: 'school_id مطلوب' }, { status: 400 });

    const result = await pool.query(
      `SELECT integration_type, config, is_active, connected_at, updated_at
       FROM school_integrations
       WHERE school_id = $1 AND integration_type LIKE 'payment_%'`,
      [schoolId]
    );

    // دمج البيانات المحفوظة مع قائمة البوابات المتاحة
    const savedMap: Record<string, any> = {};
    result.rows.forEach((row: any) => {
      savedMap[row.integration_type] = row;
    });

    const gateways = PAYMENT_GATEWAYS.map(gw => {
      const saved = savedMap[gw.key];
      const config = saved?.config || {};
      // إخفاء القيم السرية جزئياً
      const maskedConfig: Record<string, string> = {};
      gw.fields.forEach(f => {
        if (config[f.key]) {
          maskedConfig[f.key] = f.secret
            ? config[f.key].slice(0, 6) + '••••••••'
            : config[f.key];
        }
      });
      return {
        ...gw,
        is_active: saved?.is_active || false,
        connected_at: saved?.connected_at || null,
        config: maskedConfig,
        has_config: gw.fields.filter(f => f.required).every(f => !!config[f.key]),
      };
    });

    return NextResponse.json({ data: gateways, school_id: schoolId });
  } catch (error: any) {
    console.error('school-integrations GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ══════════════════════════════════════════════
// POST - حفظ إعدادات بوابة دفع للمؤسسة
// ══════════════════════════════════════════════
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const allowedRoles = ['admin', 'owner', 'super_admin'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { gateway_key, config, is_active } = body;

    if (!gateway_key) return NextResponse.json({ error: 'gateway_key مطلوب' }, { status: 400 });

    const gateway = PAYMENT_GATEWAYS.find(g => g.key === gateway_key);
    if (!gateway) return NextResponse.json({ error: 'بوابة الدفع غير معروفة' }, { status: 400 });

    const schoolId = user.role === 'super_admin' ? body.school_id : user.school_id;
    if (!schoolId) return NextResponse.json({ error: 'school_id مطلوب' }, { status: 400 });

    // التحقق من الحقول المطلوبة
    const missingFields = gateway.fields
      .filter(f => f.required && (!config || !config[f.key]))
      .map(f => f.label);

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `الحقول التالية مطلوبة: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    // جلب الإعدادات الحالية لدمج القيم (لا نحذف القيم المخفية)
    const existing = await pool.query(
      `SELECT config FROM school_integrations WHERE school_id = $1 AND integration_type = $2`,
      [schoolId, gateway_key]
    );

    const existingConfig = existing.rows[0]?.config || {};
    const mergedConfig: Record<string, string> = { ...existingConfig };

    // تحديث فقط الحقول التي أُرسلت (لا تحذف القيم القديمة إذا أُرسل ••••)
    if (config) {
      for (const [key, value] of Object.entries(config)) {
        if (value && typeof value === 'string' && !value.includes('••••')) {
          mergedConfig[key] = value as string;
        }
      }
    }

    await pool.query(
      `INSERT INTO school_integrations (school_id, integration_type, config, is_active, connected_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (school_id, integration_type) DO UPDATE SET
         config = $3,
         is_active = $4,
         connected_at = CASE WHEN school_integrations.is_active = false AND $4 = true THEN NOW() ELSE school_integrations.connected_at END,
         updated_at = NOW()`,
      [schoolId, gateway_key, JSON.stringify(mergedConfig), is_active !== false]
    );

    return NextResponse.json({
      success: true,
      message: `تم حفظ إعدادات ${gateway.label} وتفعيلها بنجاح`,
    });
  } catch (error: any) {
    console.error('school-integrations POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ══════════════════════════════════════════════
// DELETE - إلغاء تفعيل بوابة دفع للمؤسسة
// ══════════════════════════════════════════════
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const allowedRoles = ['admin', 'owner', 'super_admin'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const gatewayKey = searchParams.get('gateway_key');
    const schoolId = user.role === 'super_admin'
      ? searchParams.get('school_id')
      : user.school_id;

    if (!gatewayKey) return NextResponse.json({ error: 'gateway_key مطلوب' }, { status: 400 });
    if (!schoolId) return NextResponse.json({ error: 'school_id مطلوب' }, { status: 400 });

    await pool.query(
      `UPDATE school_integrations SET is_active = false, updated_at = NOW()
       WHERE school_id = $1 AND integration_type = $2`,
      [schoolId, gatewayKey]
    );

    return NextResponse.json({ success: true, message: 'تم إلغاء تفعيل بوابة الدفع' });
  } catch (error: any) {
    console.error('school-integrations DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
