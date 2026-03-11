import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET - جلب الباقات المفعّلة للعرض العام (بدون مصادقة)
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id, name, name_ar, description,
        price_monthly, price_yearly,
        max_students, max_teachers, max_admins,
        features, is_active, is_featured,
        color, badge_text
      FROM plans
      WHERE is_active = true
      ORDER BY price_monthly ASC
    `);

    return NextResponse.json({
      success: true,
      plans: result.rows,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error: any) {
    // fallback بيانات افتراضية لو قاعدة البيانات فاضية
    return NextResponse.json({
      success: true,
      plans: [
        {
          id: 1, name: 'basic', name_ar: 'أساسي', price_monthly: 0, price_yearly: 0,
          max_students: 100, max_teachers: 5,
          features: ['100 طالب', '5 معلمين', 'دعم بالإيميل'],
          is_active: true, is_featured: false,
        },
        {
          id: 2, name: 'advanced', name_ar: 'متقدم', price_monthly: 299, price_yearly: 2990,
          max_students: 500, max_teachers: 20,
          features: ['500 طالب', '20 معلم', 'دعم فوري', 'تقارير متقدمة'],
          is_active: true, is_featured: true,
        },
        {
          id: 3, name: 'enterprise', name_ar: 'مؤسسي', price_monthly: 599, price_yearly: 5990,
          max_students: -1, max_teachers: -1,
          features: ['طلاب غير محدود', 'معلمين غير محدود', 'دعم 24/7', 'تخصيص كامل'],
          is_active: true, is_featured: false,
        },
      ],
    });
  }
}
