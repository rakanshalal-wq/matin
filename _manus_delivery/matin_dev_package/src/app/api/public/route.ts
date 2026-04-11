import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// API عام لا يحتاج تسجيل دخول - يُستخدم في الصفحات العامة
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // ══ إعدادات المنصة ══
    if (type === 'settings' || type === 'all') {
      const settingsResult = await pool.query(
        `SELECT setting_key, setting_value FROM site_settings`
      );
      const settings: Record<string, string> = {};
      settingsResult.rows.forEach((row: any) => {
        settings[row.setting_key] = row.setting_value;
      });

      if (type === 'settings') {
        return NextResponse.json({ success: true, settings });
      }
    }

    // ══ الباقات ══
    if (type === 'plans' || type === 'all') {
      const plansResult = await pool.query(
        `SELECT id, name_ar, name, description, price_monthly, price_yearly,
                max_students, max_teachers, features, is_active, is_featured,
                color, badge_text, sort_order
         FROM plans 
         WHERE is_active = true 
         ORDER BY COALESCE(sort_order, price_monthly) ASC`
      );

      if (type === 'plans') {
        return NextResponse.json({ success: true, plans: plansResult.rows });
      }
    }

    // ══ الإعلانات العامة ══
    if (type === 'ads' || type === 'all') {
      const adsResult = await pool.query(
        `SELECT id, title, content, image_url, link_url, advertiser, ad_type,
                video_url, audio_url, click_url, priority
         FROM ads 
         WHERE is_active = true 
           AND (start_date IS NULL OR start_date <= NOW())
           AND (end_date IS NULL OR end_date >= NOW())
         ORDER BY COALESCE(priority, 0) DESC, created_at DESC
         LIMIT 20`
      );

      if (type === 'ads') {
        return NextResponse.json({ success: true, ads: adsResult.rows });
      }
    }

    // ══ منتجات المتجر العامة ══
    if (type === 'store' || type === 'all') {
      const storeResult = await pool.query(
        `SELECT id, name, description, price, image_url, category, stock
         FROM store_products 
         WHERE COALESCE(is_active, true) = true
         ORDER BY created_at DESC
         LIMIT 12`
      );

      if (type === 'store') {
        return NextResponse.json({ success: true, products: storeResult.rows });
      }
    }

    // ══ إحصائيات المنصة ══
    if (type === 'stats' || type === 'all') {
      const statsResult = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM schools WHERE status != 'SUSPENDED') as schools_count,
          (SELECT COUNT(*) FROM users WHERE role = 'student') as students_count,
          (SELECT COUNT(*) FROM users WHERE role = 'teacher') as teachers_count,
          (SELECT COUNT(*) FROM users) as total_users
      `);

      if (type === 'stats') {
        return NextResponse.json({ success: true, stats: statsResult.rows[0] });
      }
    }

    // ══ جلب الكل ══
    if (type === 'all') {
      const [settingsRes, plansRes, adsRes, storeRes, statsRes] = await Promise.all([
        pool.query(`SELECT setting_key, setting_value FROM site_settings`),
        pool.query(`SELECT id, name_ar, name, description, price_monthly, price_yearly, max_students, max_teachers, features, is_active, is_featured, color, badge_text, sort_order FROM plans WHERE is_active = true ORDER BY COALESCE(sort_order, price_monthly) ASC`),
        pool.query(`SELECT id, title, content, image_url, link_url, advertiser, ad_type, video_url, audio_url, click_url, priority FROM ads WHERE is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()) ORDER BY COALESCE(priority, 0) DESC LIMIT 20`),
        pool.query(`SELECT id, name, description, price, image_url, category, stock FROM store_products WHERE COALESCE(is_active, true) = true ORDER BY created_at DESC LIMIT 12`),
        pool.query(`SELECT (SELECT COUNT(*) FROM schools WHERE status != 'SUSPENDED') as schools_count, (SELECT COUNT(*) FROM users WHERE role = 'student') as students_count, (SELECT COUNT(*) FROM users WHERE role = 'teacher') as teachers_count`),
      ]);

      const settings: Record<string, string> = {};
      settingsRes.rows.forEach((row: any) => { settings[row.setting_key] = row.setting_value; });

      return NextResponse.json({
        success: true,
        settings,
        plans: plansRes.rows,
        ads: adsRes.rows,
        products: storeRes.rows,
        stats: statsRes.rows[0],
      });
    }

    return NextResponse.json({ error: 'نوع غير معروف' }, { status: 400 });

  } catch (error) {
    console.error('Public API error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
