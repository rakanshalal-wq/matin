import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// GET - جلب المميزات العامة بدون مصادقة
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, title, description, category, icon_name, color, sort_order, is_active
      FROM features
      WHERE is_active = true
      ORDER BY COALESCE(sort_order, 0) ASC
    `);
    return NextResponse.json({
      success: true,
      features: result.rows,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=120' },
    });
  } catch {
    // fallback بيانات افتراضية
    return NextResponse.json({
      success: true,
      features: [
        { id: 1, title: 'الإدارة الأكاديمية', description: 'جداول دراسية ذكية، إدارة درجات، حضور وغياب تلقائي', category: 'أكاديمي', icon_name: 'GraduationCap', color: '#D4A843' },
        { id: 2, title: 'الأمان السيبراني', description: 'تشفير AES-256، TLS 1.3، عزل كامل للبيانات بين المؤسسات', category: 'أمان', icon_name: 'Shield', color: '#22C55E' },
        { id: 3, title: 'التحليلات والتقارير', description: 'لوحات تحكم تفاعلية، تقارير مفصلة، وتحليلات بيانات متقدمة', category: 'تحليل', icon_name: 'BarChart3', color: '#60A5FA' },
        { id: 4, title: 'الإشعارات الشاملة', description: 'إشعارات واتساب وSMS وPush Notifications لأولياء الأمور والطلاب', category: 'تواصل', icon_name: 'Bell', color: '#F97316' },
        { id: 5, title: 'الذكاء الاصطناعي', description: 'توجيه مهني ذكي، مراقبة الصحة النفسية، وجواز سفر المهارات الرقمي', category: 'ذكاء اصطناعي', icon_name: 'Brain', color: '#A78BFA' },
        { id: 6, title: 'النقل المدرسي', description: 'تتبع حي آمن للحافلات بـ GPS، إشعارات الركوب والنزول، وخرائط تفاعلية', category: 'نقل', icon_name: 'Bus', color: '#34D399' },
      ],
    });
  }
}
