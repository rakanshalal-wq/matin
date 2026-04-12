import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT section, key, value, type FROM homepage_settings ORDER BY section, key'
    );
    const settings: Record<string, Record<string, string>> = {};
    for (const row of result.rows) {
      if (!settings[row.section]) settings[row.section] = {};
      settings[row.section][row.key] = row.value || '';
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: Request) {
  try {
    const { section, key, value } = await request.json();
    await pool.query(
      `INSERT INTO homepage_settings (section, key, value, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (section, key) DO UPDATE SET value = $3, updated_at = NOW()`,
      [section, key, value]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
