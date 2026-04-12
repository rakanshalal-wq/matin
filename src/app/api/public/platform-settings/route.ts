import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query('SELECT key, value FROM platform_settings');
    const settings: Record<string, any> = {};
    
    result.rows.forEach(row => {
      try {
        settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
      } catch {
        settings[row.key] = row.value;
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('[PLATFORM SETTINGS API ERROR]', error);
    return NextResponse.json({ error: 'فشل جلب الإعدادات' }, { status: 500 });
  }
}
