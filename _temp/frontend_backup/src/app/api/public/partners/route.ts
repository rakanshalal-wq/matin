import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// GET - جلب الشركاء العامة بدون مصادقة
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name, logo_url, website_url, category, sort_order
      FROM partners
      WHERE is_active = true
      ORDER BY COALESCE(sort_order, 0) ASC
      LIMIT 30
    `);
    return NextResponse.json({
      success: true,
      partners: result.rows,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json({
      success: true,
      partners: [
        { id: 1, name: 'STC Pay', category: 'دفع إلكتروني' },
        { id: 2, name: 'Apple Pay', category: 'دفع إلكتروني' },
        { id: 3, name: 'مدى', category: 'دفع إلكتروني' },
        { id: 4, name: 'وزارة التعليم', category: 'حكومي' },
      ],
    });
  }
}
