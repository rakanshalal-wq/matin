import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const certificate_id = searchParams.get('id');

    // جلب شهادة واحدة
    if (certificate_id) {
      const result = await pool.query(`
        SELECT c.*, u.name as student_name, s.student_id as student_number
        FROM certificates c
        LEFT JOIN students s ON s.id = c.student_id
        LEFT JOIN users u ON u.id::text = s.user_id
        WHERE c.id = $1
      `, [certificate_id]);
      return NextResponse.json(result.rows[0] || null);
    }

    // جلب شهادات طالب
    if (student_id) {
      const result = await pool.query(`
        SELECT c.*, u.name as student_name
        FROM certificates c
        LEFT JOIN students s ON s.id = c.student_id
        LEFT JOIN users u ON u.id::text = s.user_id
        WHERE c.student_id = $1
        ORDER BY c.issued_at DESC
      `, [student_id]);
      return NextResponse.json(result.rows);
    }

    // كل الشهادات
    const result = await pool.query(`
      SELECT c.*, u.name as student_name, s.student_id as student_number
      FROM certificates c
      LEFT JOIN students s ON s.id = c.student_id
      LEFT JOIN users u ON u.id::text = s.user_id
      WHERE 1=1 ${filter.sql}
      ORDER BY c.issued_at DESC LIMIT 200
    `, filter.params);
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    const { action } = body;

    // === إصدار شهادة تلقائية بناءً على الدرجات ===
    if (action === 'auto_issue') {
      const { student_id, course_id, min_percentage } = body;
      if (!student_id) return NextResponse.json({ error: 'معرف الطالب مطلوب' }, { status: 400 });

      // جلب درجات الطالب
      const grades = await pool.query(
        `SELECT * FROM grades WHERE student_id = $1 ${course_id ? 'AND course_id = $2' : ''}`,
        course_id ? [student_id, course_id] : [student_id]
      );

      if (grades.rows.length === 0) {
        return NextResponse.json({ error: 'لا توجد درجات لهذا الطالب' }, { status: 400 });
      }

      const avgPct = Math.round(grades.rows.reduce((sum: number, g: any) => sum + (parseFloat(g.percentage) || 0), 0) / grades.rows.length);
      const threshold = min_percentage || 60;

      if (avgPct < threshold) {
        return NextResponse.json({ error: `المعدل ${avgPct}% أقل من الحد المطلوب ${threshold}%` }, { status: 400 });
      }

      const overallGrade = avgPct >= 90 ? 'A+' : avgPct >= 80 ? 'A' : avgPct >= 70 ? 'B' : avgPct >= 60 ? 'C' : avgPct >= 50 ? 'D' : 'F';
      
      // جلب اسم الطالب
      const studentInfo = await pool.query(`
        SELECT u.name FROM students s LEFT JOIN users u ON u.id::text = s.user_id WHERE s.id = $1
      `, [student_id]);
      const studentName = studentInfo.rows[0]?.name || 'طالب';

      const certId = crypto.randomUUID();
      const certNumber = `CERT-${Date.now().toString(36).toUpperCase()}`;
      
      const result = await pool.query(
        `INSERT INTO certificates (id, student_id, title, description, certificate_number, grade, percentage, type, status, issued_at, school_id, owner_id, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active',NOW(),$9,$10,NOW()) RETURNING *`,
        [certId, student_id, `شهادة إتمام - ${studentName}`, `حصل الطالب/ة ${studentName} على معدل ${avgPct}% بتقدير ${overallGrade}`, certNumber, overallGrade, avgPct, 'completion', ids.school_id, ids.owner_id]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // === إصدار شهادة يدوية ===
    const { student_id, title, description, type, grade, percentage } = body;
    if (!student_id || !title) return NextResponse.json({ error: 'الطالب والعنوان مطلوبان' }, { status: 400 });
    
    const certId = crypto.randomUUID();
    const certNumber = `CERT-${Date.now().toString(36).toUpperCase()}`;
    
    const result = await pool.query(
      `INSERT INTO certificates (id, student_id, title, description, certificate_number, grade, percentage, type, status, issued_at, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active',NOW(),$9,$10,NOW()) RETURNING *`,
      [certId, student_id, title, description || null, certNumber, grade || null, percentage || null, type || 'achievement', ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM certificates WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
