import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    // تحديث الاستعلام ليشمل حقول التحكم المركزي والألوان من جدول school_pages المرتبط
    const institutionRes = await pool.query(
      `SELECT s.id, s.name, s.description, s.logo, s.cover_image, s.phone, s.email, s.address, s.city, 
              s.website_url as website, s.institution_type, s.code, s.slug,
              sp.primary_color, sp.secondary_color, sp.accent_color, sp.font_family,
              sp.has_custom_store, sp.has_custom_library, sp.has_custom_community, sp.show_global_ads
       FROM schools s
       LEFT JOIN school_pages sp ON s.id = sp.school_id
       WHERE s.code = $1 OR s.slug = $1 OR s.id::text = $1 LIMIT 1`,
      [slug]
    ).catch(() => ({ rows: [] }));

    const institution = institutionRes.rows[0] || null;
    if (!institution) {
      return NextResponse.json({ institution: null, type: null, stats: {}, announcements: [], activities: [], programs: [], services: [] });
    }

    const instId = institution.id;
    const instType = institution.institution_type || 'school';

    const [studentsR, teachersR, announcementsR, activitiesR] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE school_id = $1 AND role = \'student\'', [instId]).catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM users WHERE school_id = $1 AND role IN ('teacher','professor','trainer','muhaffiz')", [instId]).catch(() => ({ rows: [{ count: 0 }] })),
      pool.query('SELECT id, title, body, created_at FROM announcements WHERE school_id = $1 ORDER BY created_at DESC LIMIT 5', [instId]).catch(() => ({ rows: [] })),
      pool.query('SELECT id, title, description, event_date FROM activities WHERE school_id = $1 ORDER BY event_date DESC LIMIT 6', [instId]).catch(() => ({ rows: [] })),
    ]);

    return NextResponse.json({
      ...institution,
      institution, 
      type: instType,
      stats: { 
        students: parseInt(studentsR.rows[0].count) || 0, 
        teachers: parseInt(teachersR.rows[0].count) || 0, 
        satisfaction: 98 
      },
      announcements: announcementsR.rows, 
      activities: activitiesR.rows, 
      programs: [], 
      services: [],
    });
  } catch (error) {
    console.error('Public institution API error:', error);
    return NextResponse.json({ institution: null, type: null, stats: {}, announcements: [], activities: [], programs: [], services: [] }, { status: 200 });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const body = await request.json();
    const { parent_name, student_name, full_name, grade, phone, email, notes, program } = body;
    
    if (!phone || (!parent_name && !full_name)) {
      return NextResponse.json({ error: 'missing required fields' }, { status: 400 });
    }

    const schoolRes = await pool.query(
      'SELECT id FROM schools WHERE code = $1 OR slug = $1 OR id::text = $1 LIMIT 1',
      [slug]
    ).catch(() => ({ rows: [] }));

    const institutionId = schoolRes.rows[0]?.id || null;

    await pool.query(
      "INSERT INTO join_requests (school_id, parent_name, student_name, grade, phone, email, notes, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())",
      [institutionId, parent_name || full_name, student_name || full_name, grade || program || null, phone, email || null, notes || null]
    ).catch(() => {});

    return NextResponse.json({ success: true, message: 'done' });
  } catch (error) {
    console.error('Join request error:', error);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
