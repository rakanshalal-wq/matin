import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// API عام موحّد لجميع المؤسسات — بدون توثيق
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // البحث في جدول schools (يشمل جميع أنواع المؤسسات)
    const institutionRes = await pool.query(
      `SELECT id, name, description, logo, primary_color, secondary_color, accent_color,
              phone, email, address, city, website, established_year, type,
              institution_type, code, slug
       FROM schools
       WHERE code = $1 OR slug = $1 OR id::text = $1
       LIMIT 1`,
      [slug]
    ).catch(() => ({ rows: [] }));

    // البحث أيضاً في جدول institutes إذا لم نجد في schools
    let institution = institutionRes.rows[0] || null;
    let sourceTable = 'schools';

    if (!institution) {
      const instituteRes = await pool.query(
        `SELECT id, name, description, logo, phone, email, address, code, slug,
                'institute' as institution_type
         FROM institutes
         WHERE code = $1 OR slug = $1 OR id::text = $1
         LIMIT 1`,
        [slug]
      ).catch(() => ({ rows: [] }));
      institution = instituteRes.rows[0] || null;
      if (institution) sourceTable = 'institutes';
    }

    if (!institution) {
      return NextResponse.json({
        institution: null,
        type: null,
        stats: {},
        announcements: [],
        activities: [],
        programs: [],
        services: [],
      });
    }

    const instId = institution.id;
    const instType = institution.institution_type || 'school';

    // جلب البيانات حسب نوع المؤسسة
    let stats: any = {};
    let announcements: any[] = [];
    let activities: any[] = [];
    let programs: any[] = [];

    if (sourceTable === 'schools') {
      const idCol = 'school_id';

      const [studentsR, teachersR, announcementsR, activitiesR] = await Promise.all([
        pool.query(`SELECT COUNT(*) FROM students WHERE ${idCol} = $1`, [instId]).catch(() => ({ rows: [{ count: 0 }] })),
        pool.query(`SELECT COUNT(*) FROM users WHERE school_id = $1 AND role IN ('teacher','professor','trainer','quran_teacher')`, [instId]).catch(() => ({ rows: [{ count: 0 }] })),
        pool.query(
          `SELECT id, title, body, created_at, pinned FROM announcements
           WHERE school_id = $1 AND (is_public = true OR is_public IS NULL)
           ORDER BY pinned DESC, created_at DESC LIMIT 5`,
          [instId]
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT id, title, description, icon, event_date FROM activities
           WHERE school_id = $1
           ORDER BY event_date DESC LIMIT 6`,
          [instId]
        ).catch(() => ({ rows: [] })),
      ]);

      stats = {
        students: parseInt(studentsR.rows[0].count) || 0,
        teachers: parseInt(teachersR.rows[0].count) || 0,
        years: institution.established_year
          ? new Date().getFullYear() - parseInt(institution.established_year)
          : 0,
        satisfaction: 98,
      };
      announcements = announcementsR.rows;
      activities = activitiesR.rows;
    } else {
      // institutes table
      const [studentsR, programsR, announcementsR] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM students WHERE institute_id = $1', [instId]).catch(() => ({ rows: [{ count: 0 }] })),
        pool.query(
          `SELECT id, name, icon, duration, price, seats, color FROM institute_programs
           WHERE institute_id = $1 ORDER BY created_at DESC`,
          [instId]
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT id, title, body, created_at, pinned FROM announcements
           WHERE institute_id = $1 AND (is_public = true OR is_public IS NULL)
           ORDER BY pinned DESC, created_at DESC LIMIT 5`,
          [instId]
        ).catch(() => ({ rows: [] })),
      ]);

      stats = {
        students: parseInt(studentsR.rows[0].count) || 0,
        programs: programsR.rows.length,
        years: institution.established_year
          ? new Date().getFullYear() - parseInt(institution.established_year)
          : 0,
        employment: 95,
      };
      programs = programsR.rows;
      announcements = announcementsR.rows;
    }

    return NextResponse.json({
      institution,
      type: instType,
      stats,
      announcements,
      activities,
      programs,
      services: [],
    });
  } catch (error) {
    console.error('Public institution API error:', error);
    return NextResponse.json(
      { institution: null, type: null, stats: {}, announcements: [], activities: [], programs: [], services: [] },
      { status: 200 }
    );
  }
}

// إرسال طلب انضمام
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const { parent_name, student_name, full_name, grade, phone, email, notes, program } = body;

    if (!phone || (!parent_name && !full_name)) {
      return NextResponse.json({ error: 'البيانات الأساسية مطلوبة' }, { status: 400 });
    }

    // البحث عن المؤسسة
    let institutionId: number | null = null;
    const schoolRes = await pool.query(
      'SELECT id FROM schools WHERE code = $1 OR slug = $1 OR id::text = $1 LIMIT 1',
      [slug]
    ).catch(() => ({ rows: [] }));
    institutionId = schoolRes.rows[0]?.id || null;

    if (!institutionId) {
      const instRes = await pool.query(
        'SELECT id FROM institutes WHERE code = $1 OR slug = $1 OR id::text = $1 LIMIT 1',
        [slug]
      ).catch(() => ({ rows: [] }));
      institutionId = instRes.rows[0]?.id || null;
    }

    // حفظ طلب الانضمام
    await pool.query(
      `INSERT INTO join_requests (school_id, parent_name, student_name, grade, phone, email, notes, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())`,
      [
        institutionId,
        parent_name || full_name,
        student_name || full_name,
        grade || program || null,
        phone,
        email || null,
        notes || null,
      ]
    ).catch(async () => {
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
      await pool.query(
        `INSERT INTO join_requests (school_id, parent_name, student_name, grade, phone, email, notes, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())`,
        [institutionId, parent_name || full_name, student_name || full_name, grade || program || null, phone, email || null, notes || null]
      ).catch(() => {});
    });

    return NextResponse.json({ success: true, message: 'تم إرسال الطلب بنجاح' });
  } catch (error) {
    console.error('Join request error:', error);
    return NextResponse.json({ error: 'حدث خطأ، يرجى المحاولة مجدداً' }, { status: 500 });
  }
}
