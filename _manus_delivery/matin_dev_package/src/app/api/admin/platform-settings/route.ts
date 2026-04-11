import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'مفاتيح الإعدادات مفقودة' }, { status: 400 });
    }

    // تحديث أو إدراج الإعداد في قاعدة البيانات
    await pool.query(
      `INSERT INTO platform_settings (key, value) 
       VALUES ($1, $2) 
       ON CONFLICT (key) DO UPDATE SET value = $2`,
      [key, value]
    );

    return NextResponse.json({ success: true, message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error) {
    console.error('[ADMIN PLATFORM SETTINGS POST ERROR]', error);
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
