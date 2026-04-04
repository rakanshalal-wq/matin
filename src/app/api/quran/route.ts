import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';
    const schoolId = user.school_id;

    if (type === 'stats') {
      const [studentsR, teachersR, halaqatR] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM quran_students WHERE school_id=$1', [schoolId]),
        pool.query('SELECT COUNT(*) FROM quran_teachers WHERE school_id=$1', [schoolId]),
        pool.query('SELECT COUNT(*) FROM quran_halaqat WHERE school_id=$1 AND status=$2', [schoolId,'active']),
      ]);
      const halaqatList = await pool.query(
        'SELECT h.name, h.status, h.time, u.name as teacher, COUNT(qs.id) as students_count FROM quran_halaqat h LEFT JOIN users u ON h.teacher_id=u.id LEFT JOIN quran_students qs ON qs.halaqa_id=h.id WHERE h.school_id=$1 GROUP BY h.id, h.name, h.status, h.time, u.name ORDER BY h.created_at DESC LIMIT 10',
        [schoolId]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({
        stats: {
          students: parseInt(studentsR.rows[0].count) || 0,
          teachers: parseInt(teachersR.rows[0].count) || 0,
          halaqat: parseInt(halaqatR.rows[0].count) || 0,
          graduates: 0, ijazat: 0,
        },
        halaqat: halaqatList.rows,
      });
    }

    if (type === 'teacher-halaqat') {
      const rows = await pool.query(
        'SELECT h.id, h.name, h.status, h.time, COUNT(qs.id) as students_count FROM quran_halaqat h LEFT JOIN quran_students qs ON qs.halaqa_id=h.id WHERE h.teacher_id=$1 GROUP BY h.id ORDER BY h.name',
        [user.id]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ halaqat: rows.rows });
    }

    if (type === 'teacher-students') {
      const rows = await pool.query(
        'SELECT qs.id, u.name, qs.parts_memorized, qs.points FROM quran_students qs JOIN users u ON qs.user_id=u.id JOIN quran_halaqat h ON qs.halaqa_id=h.id WHERE h.teacher_id=$1 ORDER BY qs.points DESC',
        [user.id]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ students: rows.rows });
    }

    if (type === 'supervisor') {
      const teachers = await pool.query(
        'SELECT u.name, COUNT(qs.id) as students_count FROM quran_teachers qt JOIN users u ON qt.user_id=u.id LEFT JOIN quran_halaqat h ON h.teacher_id=u.id LEFT JOIN quran_students qs ON qs.halaqa_id=h.id WHERE qt.school_id=$1 GROUP BY u.id, u.name ORDER BY students_count DESC',
        [schoolId]
      ).catch(() => ({ rows: [] }));
      const topStudents = await pool.query(
        'SELECT u.name, qs.parts_memorized FROM quran_students qs JOIN users u ON qs.user_id=u.id WHERE qs.school_id=$1 ORDER BY qs.parts_memorized DESC LIMIT 10',
        [schoolId]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ teachers: teachers.rows, topStudents: topStudents.rows, stats: {} });
    }

    if (type === 'student-parent') {
      const children = await pool.query(
        'SELECT qs.id, u.name, qs.parts_memorized, qs.points, qs.attendance_rate, h.name as halaqa_name FROM quran_students qs JOIN users u ON qs.user_id=u.id LEFT JOIN quran_halaqat h ON qs.halaqa_id=h.id WHERE qs.parent_id=$1',
        [user.id]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ children: children.rows, achievements: [] });
    }

    if (type === 'session-students') {
      const rows = await pool.query(
        'SELECT qs.id, u.name FROM quran_students qs JOIN users u ON qs.user_id=u.id JOIN quran_halaqat h ON qs.halaqa_id=h.id WHERE h.teacher_id=$1 ORDER BY u.name',
        [user.id]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ students: rows.rows.map((r: any) => ({ ...r, status: 'waiting' })) });
    }

    return NextResponse.json({ error: 'نوع غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('quran API error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();

    if (body.type === 'grade') {
      await pool.query(
        'INSERT INTO quran_recitations (student_id, teacher_id, grade, notes, created_at) VALUES ($1,$2,$3,$4,NOW())',
        [body.studentId, user.id, body.grade, body.notes || '']
      ).catch(() => {});
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'نوع غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('quran POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
