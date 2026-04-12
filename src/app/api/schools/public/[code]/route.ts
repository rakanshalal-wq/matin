import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// API عام للمدرسة — بدون توثيق (صفحة landing عامة)
export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  try {
    // جلب بيانات المدرسة عبر code أو slug
    const schoolRes = await pool.query(
      `SELECT id, name, description, logo, primary_color, secondary_color, accent_color,
              phone, email, address, city, website, established_year, type
       FROM schools
       WHERE code = $1 OR slug = $1 OR id::text = $1
       LIMIT 1`,
      [code]
    ).catch(() => ({ rows: [] }));

    const school = schoolRes.rows[0] || null;
    const schoolId = school?.id;

    if (!schoolId) {
      // إرجاع بيانات افتراضية إذا لم توجد المدرسة
      return NextResponse.json({
        school: null,
        stats: { students: 0, teachers: 0, years: 0, satisfaction: 0 },
        announcements: [],
        activities: [],
        services: [],
      });
    }

    // إحصائيات المدرسة
    const [studentsR, teachersR, announcementsR, activitiesR] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM students WHERE school_id = $1', [schoolId]).catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM users WHERE school_id = $1 AND role = 'teacher'", [schoolId]).catch(() => ({ rows: [{ count: 0 }] })),
      pool.query(
        `SELECT id, title, body, created_at, pinned FROM announcements
         WHERE school_id = $1 AND (is_public = true OR is_public IS NULL)
         ORDER BY pinned DESC, created_at DESC LIMIT 5`,
        [schoolId]
      ).catch(() => ({ rows: [] })),
      pool.query(
        `SELECT id, title, description, icon, event_date FROM activities
         WHERE school_id = $1
         ORDER BY event_date DESC LIMIT 6`,
        [schoolId]
      ).catch(() => ({ rows: [] })),
    ]);

    return NextResponse.json({
      school,
      stats: {
        students: parseInt(studentsR.rows[0].count) || 0,
        teachers: parseInt(teachersR.rows[0].count) || 0,
        years: school?.established_year ? new Date().getFullYear() - parseInt(school.established_year) : 0,
        satisfaction: 98,
      },
      announcements: announcementsR.rows,
      activities: activitiesR.rows,
      services: [],
    });
  } catch (error) {
    console.error('Public school API error:', error);
    return NextResponse.json(
      { school: null, stats: { students: 0, teachers: 0, years: 0, satisfaction: 0 }, announcements: [], activities: [], services: [] },
      { status: 200 }
    );
  }
}

// إرسال طلب الانضمام (تسجيل طالب)
export async function POST(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  try {
    const body = await request.json();
    const { type, parent_name, student_name, grade, phone, email, reason } = body;

    if (type !== 'join-request') {
      return NextResponse.json({ error: 'نوع الطلب غير صحيح' }, { status: 400 });
    }

    if (!parent_name || !student_name || !phone) {
      return NextResponse.json({ error: 'البيانات الأساسية مطلوبة' }, { status: 400 });
    }

    // جلب معرّف المدرسة
    const schoolRes = await pool.query(
      'SELECT id FROM schools WHERE code = $1 OR slug = $1 OR id::text = $1 LIMIT 1',
      [code]
    ).catch(() => ({ rows: [] }));

    const schoolId = schoolRes.rows[0]?.id || null;

    // حفظ طلب الانضمام
    await pool.query(
      `INSERT INTO join_requests (school_id, parent_name, student_name, grade, phone, email, notes, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())`,
      [schoolId, parent_name, student_name, grade || null, phone, email || null, reason || null]
    ).catch(async () => {
      // إنشاء الجدول إذا لم يكن موجوداً
      await pool.query(`
        CREATE TABLE IF NOT EXISTS join_requests (
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
        )
      `).catch(() => {});
      // إعادة المحاولة
      await pool.query(
        `INSERT INTO join_requests (school_id, parent_name, student_name, grade, phone, email, notes, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())`,
        [schoolId, parent_name, student_name, grade || null, phone, email || null, reason || null]
      ).catch(() => {});
    });

    return NextResponse.json({ success: true, message: 'تم إرسال طلب التسجيل بنجاح' });
  } catch (error) {
    console.error('Join request error:', error);
    return NextResponse.json({ error: 'حدث خطأ، يرجى المحاولة مجدداً' }, { status: 500 });
  }
}
