import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    let schoolFilter = '';
    let params: any[] = [];
    if (user.role === 'owner') {
      schoolFilter = 'AND ta.school_id IN (SELECT id FROM schools WHERE owner_id = $1)';
      params = [String(user.id)];
    } else if (user.role === 'teacher') {
      schoolFilter = 'AND t.user_id = $1';
      params = [String(user.id)];
    } else if (user.role !== 'super_admin') {
      schoolFilter = 'AND ta.school_id = $1';
      params = [String(user.school_id)];
    }
    const result = await pool.query(`
      SELECT ta.*, u.name as teacher_name, s.name_ar as subject_name, c.name_ar as class_name, c.grade
      FROM teacher_assignments ta
      LEFT JOIN teachers t ON t.id = ta.teacher_id
      LEFT JOIN users u ON u.id::text = t.user_id
      LEFT JOIN subjects s ON s.id = ta.subject_id
      LEFT JOIN classes c ON c.id = ta.class_id
      WHERE 1=1 ${schoolFilter}
      ORDER BY ta.created_at DESC
    `, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Teacher assignments GET:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const { teacher_id, subject_id, class_id } = await request.json();
    if (!teacher_id || !subject_id || !class_id) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }
    let schoolId = '';
    if (user.role === 'owner') {
      const s = await pool.query('SELECT id FROM schools WHERE owner_id = $1 LIMIT 1', [String(user.id)]);
      schoolId = s.rows[0]?.id || '';
    } else {
      schoolId = String(user.school_id);
    }
    const result = await pool.query(
      `INSERT INTO teacher_assignments (teacher_id, subject_id, class_id, school_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [teacher_id, subject_id, class_id, schoolId]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'هذا التعيين موجود مسبقاً' }, { status: 409 });
    }
    console.error('Teacher assignments POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM teacher_assignments WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
