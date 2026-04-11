import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET - جلب كل الإعلانات للمدير
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    let query = 'SELECT * FROM ads';
    const params: any[] = [];
    
    if (user.role === 'super_admin') {
      // المالك يرى كل الإعلانات
      query += ' ORDER BY created_at DESC';
    } else if (user.role === 'owner') {
      // المالك يرى إعلاناته فقط + إعلانات المنصة
      query += ' WHERE owner_id = $1 OR is_platform_ad = true ORDER BY created_at DESC';
      params.push(user.id);
    } else {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    
    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
