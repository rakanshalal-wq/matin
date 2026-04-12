import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/location/[student_id] — آخر موقع للطالب
export async function GET(request: Request, { params }: { params: Promise<{ student_id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { student_id } = await params;
  try {
    const result = await pool.query(
      `SELECT * FROM student_locations WHERE student_id = $1
       ORDER BY timestamp DESC LIMIT 1`,
      [student_id]
    );
    return NextResponse.json({ location: result.rows[0] || null });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
