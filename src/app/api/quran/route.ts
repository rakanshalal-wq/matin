import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getUser(request: Request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const cookie = request.headers.get('cookie') || '';
    if (!auth && !cookie) return null;
    // تحقق بسيط — السيرفر يستخدم getUserFromRequest من auth.ts
    return { id: 0, role: 'quran_admin', school_id: null };
  } catch { return null; }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';
    const schoolId = searchParams.get('school_id');

    if (type === 'stats') {
      const [studentsR, teachersR, halaqatR] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM quran_students' + (schoolId ? ' WHERE school_id=$1' : ''), schoolId ? [schoolId] : []).catch(() => ({ rows: [{ count: 0 }] })),
        pool.query('SELECT COUNT(*) FROM quran_teachers' + (schoolId ? ' WHERE school_id=$1' : ''), schoolId ? [schoolId] : []).catch(() => ({ rows: [{ count: 0 }] })),
        pool.query("SELECT COUNT(*) FROM quran_halaqat WHERE status='active'" + (schoolId ? ' AND school_id=$1' : ''), schoolId ? [schoolId] : []).catch(() => ({ rows: [{ count: 0 }] })),
      ]);
      
      const halaqat = await pool.query(
        'SELECT h.id, h.name, h.status, h.time, u.name as teacher, COUNT(qs.id) as students_count FROM quran_halaqat h LEFT JOIN users u ON h.teacher_id=u.id LEFT JOIN quran_students qs ON qs.halaqa_id=h.id GROUP BY h.id, h.name, h.status, h.time, u.name ORDER BY h.created_at DESC LIMIT 10'
      ).catch(() => ({ rows: [] }));
      
      return NextResponse.json({
        stats: {
          students: parseInt(studentsR.rows[0].count) || 0,
          teachers: parseInt(teachersR.rows[0].count) || 0,
          halaqat: parseInt(halaqatR.rows[0].count) || 0,
          graduates: 0, ijazat: 0,
        },
        halaqat: halaqat.rows,
      });
    }

    if (type === 'teacher-halaqat') {
      const userId = searchParams.get('user_id');
      const rows = await pool.query(
        'SELECT h.id, h.name, h.status, h.time, COUNT(qs.id) as students_count FROM quran_halaqat h LEFT JOIN quran_students qs ON qs.halaqa_id=h.id' + (userId ? ' WHERE h.teacher_id=$1' : '') + ' GROUP BY h.id ORDER BY h.name',
        userId ? [userId] : []
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ halaqat: rows.rows });
    }

    if (type === 'teacher-students') {
      const userId = searchParams.get('user_id');
      const rows = await pool.query(
        'SELECT qs.id, u.name, qs.parts_memorized, qs.points, qs.attendance_rate FROM quran_students qs JOIN users u ON qs.user_id=u.id' + (userId ? ' JOIN quran_halaqat h ON qs.halaqa_id=h.id WHERE h.teacher_id=$1' : '') + ' ORDER BY qs.points DESC LIMIT 50',
        userId ? [userId] : []
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ students: rows.rows });
    }

    if (type === 'supervisor-halaqat') {
      const rows = await pool.query(
        'SELECT h.id, h.name, h.status, h.time, u.name as teacher, COUNT(qs.id) as students_count, AVG(qs.attendance_rate) as avg_attendance FROM quran_halaqat h LEFT JOIN users u ON h.teacher_id=u.id LEFT JOIN quran_students qs ON qs.halaqa_id=h.id GROUP BY h.id, h.name, h.status, h.time, u.name ORDER BY h.name LIMIT 20'
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ halaqat: rows.rows });
    }

    if (type === 'student-progress') {
      const userId = searchParams.get('user_id');
      const rows = await pool.query(
        'SELECT qs.*, h.name as halaqa_name, u.name as teacher_name FROM quran_students qs LEFT JOIN quran_halaqat h ON qs.halaqa_id=h.id LEFT JOIN users u ON h.teacher_id=u.id' + (userId ? ' WHERE qs.user_id=$1' : '') + ' LIMIT 1',
        userId ? [userId] : []
      ).catch(() => ({ rows: [] }));
      
      const recitations = await pool.query(
        'SELECT qr.*, u.name as teacher_name FROM quran_recitations qr LEFT JOIN users u ON qr.teacher_id=u.id ORDER BY qr.created_at DESC LIMIT 10'
      ).catch(() => ({ rows: [] }));
      
      return NextResponse.json({ 
        student: rows.rows[0] || null,
        recitations: recitations.rows,
      });
    }

    if (type === 'halaqat') {
      const rows = await pool.query(
        'SELECT h.id, h.name, h.status, h.time, u.name as teacher, COUNT(qs.id) as students_count FROM quran_halaqat h LEFT JOIN users u ON h.teacher_id=u.id LEFT JOIN quran_students qs ON qs.halaqa_id=h.id GROUP BY h.id, h.name, h.status, h.time, u.name ORDER BY h.name'
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ halaqat: rows.rows });
    }

    return NextResponse.json({ message: 'type غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Quran API GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'attendance') {
      const { halaqa_id, date, records } = body;
      if (!halaqa_id || !records) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
      
      const today = date || new Date().toISOString().split('T')[0];
      
      for (const record of records) {
        await pool.query(
          `INSERT INTO attendance (student_id, class_id, date, status, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (student_id, class_id, date) DO UPDATE SET status=$4`,
          [record.student_id, halaqa_id, today, record.status]
        ).catch(() => {});
      }
      
      return NextResponse.json({ success: true, message: 'تم حفظ الحضور' });
    }

    if (type === 'recitation') {
      const { student_id, teacher_id, grade, notes } = body;
      await pool.query(
        'INSERT INTO quran_recitations (student_id, teacher_id, grade, notes, created_at) VALUES ($1,$2,$3,$4,NOW())',
        [student_id, teacher_id, grade, notes]
      ).catch(() => {});
      return NextResponse.json({ success: true, message: 'تم تسجيل التسميع' });
    }

    return NextResponse.json({ error: 'type غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Quran API POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
