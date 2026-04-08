import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';

// 3 نماذج متجر: products (منتجات فعلية), digital (منتجات رقمية), services (خدمات)
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const result = await pool.query(
      'SELECT * FROM store_settings WHERE school_id = $1',
      [user.school_id]
    );

    if (result.rows.length === 0) {
      // إرجاع إعدادات افتراضية
      return NextResponse.json({
        store_enabled: true,
        store_model: 'products', // products | digital | services
        store_name: 'متجر المدرسة',
        currency: 'SAR',
        tax_rate: 15,
        shipping_enabled: false,
        payment_methods: ['cash', 'bank_transfer'],
        models_available: [
          { id: 'products', name: 'منتجات فعلية', description: 'بيع الزي المدرسي والقرطاسية والكتب', icon: '📦' },
          { id: 'digital', name: 'منتجات رقمية', description: 'بيع الكتب الإلكترونية والدورات والملفات', icon: '💻' },
          { id: 'services', name: 'خدمات', description: 'حجز خدمات مثل النقل والكافتيريا والأنشطة', icon: '🎯' }
        ]
      });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !['owner', 'admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { store_model, store_name, currency, tax_rate, shipping_enabled, payment_methods } = body;

    // التحقق من صحة النموذج
    if (store_model && !['products', 'digital', 'services'].includes(store_model)) {
      return NextResponse.json({ error: 'نموذج المتجر غير صحيح. الخيارات: products, digital, services' }, { status: 400 });
    }

    const existing = await pool.query('SELECT id FROM store_settings WHERE school_id = $1', [user.school_id]);

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE store_settings SET store_model = COALESCE($1, store_model), store_name = COALESCE($2, store_name),
         currency = COALESCE($3, currency), tax_rate = COALESCE($4, tax_rate),
         shipping_enabled = COALESCE($5, shipping_enabled), updated_at = NOW()
         WHERE school_id = $6`,
        [store_model, store_name, currency, tax_rate, shipping_enabled, user.school_id]
      );
    } else {
      await pool.query(
        `INSERT INTO store_settings (school_id, store_model, store_name, currency, tax_rate, shipping_enabled, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [user.school_id, store_model || 'products', store_name || 'متجر المدرسة', currency || 'SAR', tax_rate || 15, shipping_enabled || false]
      );
    }

    return NextResponse.json({ success: true, message: 'تم حفظ إعدادات المتجر' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
