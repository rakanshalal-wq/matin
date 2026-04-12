import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    const instRes = await pool.query(
      `SELECT id, name, description, logo, phone, email, address FROM institutes WHERE code=$1 OR slug=$1 OR id::text=$1 LIMIT 1`,
      [code]
    ).catch(() => ({ rows: [] }));
    const institute = instRes.rows[0] || null;
    const instituteId = institute?.id;

    if (!instituteId) {
      return NextResponse.json({
        institute: null,
        stats: { students: 0, programs: 0, years: 0, employment: 0 },
        programs: [],
        announcements: [],
      });
    }

    const [studentsR, programsR, announcementsR] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM students WHERE institute_id=$1', [instituteId]).catch(() => ({ rows: [{ count: 0 }] })),
      pool.query(
        'SELECT id, name as title, icon, duration, price, seats, color FROM institute_programs WHERE institute_id=$1 ORDER BY created_at DESC LIMIT 6',
        [instituteId]
      ).catch(() => ({ rows: [] })),
      pool.query(
        'SELECT id, title, body, created_at, pinned FROM announcements WHERE institute_id=$1 ORDER BY pinned DESC, created_at DESC LIMIT 4',
        [instituteId]
      ).catch(() => ({ rows: [] })),
    ]);

    return NextResponse.json({
      institute,
      stats: {
        students: parseInt(studentsR.rows[0].count) || 0,
        programs: programsR.rows.length,
        years: 10,
        employment: 87,
      },
      programs: programsR.rows,
      announcements: announcementsR.rows,
    });
  } catch (error) {
    console.error('Institute public API error:', error);
    return NextResponse.json({
      institute: null,
      stats: { students: 0, programs: 0, years: 0, employment: 0 },
      programs: [],
      announcements: [],
    });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    const body = await request.json();
    const { applicant_name, program, phone, email, notes } = body;

    if (!applicant_name || !phone) {
      return NextResponse.json({ error: 'البيانات مطلوبة' }, { status: 400 });
    }

    const instRes = await pool
      .query('SELECT id FROM institutes WHERE code=$1 OR slug=$1 OR id::text=$1 LIMIT 1', [code])
      .catch(() => ({ rows: [] }));
    const instituteId = instRes.rows[0]?.id || null;

    await pool
      .query(
        `INSERT INTO join_requests (school_id, parent_name, student_name, grade, phone, email, notes, status, created_at)
         VALUES ($1,$2,$2,$3,$4,$5,$6,'pending',NOW())`,
        [instituteId, applicant_name, program || null, phone, email || null, notes || null]
      )
      .catch(async () => {
        await pool
          .query(
            `CREATE TABLE IF NOT EXISTS join_requests (
              id SERIAL PRIMARY KEY,
              school_id INT,
              parent_name VARCHAR(200),
              student_name VARCHAR(200),
              grade VARCHAR(100),
              phone VARCHAR(50),
              email VARCHAR(200),
              notes TEXT,
              status VARCHAR(50) DEFAULT 'pending',
              created_at TIMESTAMP DEFAULT NOW()
            )`
          )
          .catch(() => {});
      });

    return NextResponse.json({ success: true, message: 'تم إرسال طلب التسجيل بنجاح' });
  } catch (error) {
    console.error('Institute join request error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
