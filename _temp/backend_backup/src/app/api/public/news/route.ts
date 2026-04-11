import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// GET - جلب الأخبار العامة بدون مصادقة
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, title, description, category, image_url, created_at, status
      FROM news_articles
      WHERE status = 'active' OR status IS NULL
      ORDER BY created_at DESC
      LIMIT 20
    `);
    return NextResponse.json({
      success: true,
      news: result.rows,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60' },
    });
  } catch {
    // fallback بيانات افتراضية
    return NextResponse.json({
      success: true,
      news: [
        { id: 1, title: 'إطلاق الإصدار 3.0 من منصة متين', description: 'أعلنت منصة متين عن إطلاق الإصدار 3.0، الذي يتضمن ركائز الابتكار الخمس وتكاملات حكومية جديدة.', category: 'إطلاق', created_at: '2026-03-01', color: '#D4A843' },
        { id: 2, title: 'شراكة استراتيجية مع STC Pay', description: 'أعلنت متين عن شراكة استراتيجية مع STC Pay لتوفير حلول دفع متكاملة لجميع المؤسسات التعليمية.', category: 'شراكة', created_at: '2026-02-01', color: '#22C55E' },
        { id: 3, title: 'تكامل متين مع Apple Pay ومدى', description: 'أتمت متين تكامل بوابة الدفع مع Apple Pay ومدى، لتوفير خيارات دفع متكاملة.', category: 'تكامل', created_at: '2026-01-01', color: '#60A5FA' },
        { id: 4, title: 'إطلاق نظام AI Auditor للمراقبة الذكية', description: 'أطلقت متين نظام المراقبة الذكي AI Auditor الذي يكتشف التهديدات الأمنية ويتدخل تلقائياً.', category: 'تقنية', created_at: '2025-12-01', color: '#F97316' },
      ],
    });
  }
}
