import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const school_id = searchParams.get('school_id');

    if (slug) {
      const result = await pool.query('SELECT * FROM school_pages WHERE slug = $1 AND is_published = true', [slug]);
      if (result.rows.length === 0) return NextResponse.json({ error: 'الصفحة غير موجودة' }, { status: 404 });
      return NextResponse.json(result.rows[0]);
    }

    if (school_id) {
      const result = await pool.query('SELECT * FROM school_pages WHERE school_id::text = $1::text', [school_id]);
      return NextResponse.json(result.rows[0] || null);
    }

    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const result = await pool.query('SELECT * FROM school_pages WHERE owner_id::text = $1::text ORDER BY created_at DESC', [String(user.owner_id || user.id)]);
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    const { school_id, slug, school_name, logo, cover_image, description, vision, mission, phone, email, address, social_twitter, social_instagram, social_snapchat, is_published } = body;

    if (!slug || !school_name) return NextResponse.json({ error: 'الاسم والرابط مطلوبان' }, { status: 400 });

    // تحقق من عدم تكرار الـ slug
    const existing = await pool.query('SELECT id FROM school_pages WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) return NextResponse.json({ error: 'الرابط مستخدم مسبقاً' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO school_pages (school_id, owner_id, slug, school_name, logo, cover_image, description, vision, mission, phone, email, address, social_twitter, social_instagram, social_snapchat, is_published, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW(),NOW() RETURNING *`,
      [school_id || ids.school_id, ids.owner_id, slug, school_name, logo || null, cover_image || null, description || null, vision || null, mission || null, phone || null, email || null, address || null, social_twitter || null, social_instagram || null, social_snapchat || null, is_published ?? false]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, school_name, logo, cover_image, description, vision, mission, phone, email, address, social_twitter, social_instagram, social_snapchat, is_published } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const result = await pool.query(
      `UPDATE school_pages SET school_name=$1, logo=$2, cover_image=$3, description=$4, vision=$5, mission=$6, phone=$7, email=$8, address=$9, social_twitter=$10, social_instagram=$11, social_snapchat=$12, is_published=$13, updated_at=NOW() WHERE id::text = $14::text RETURNING *`,
      [school_name, logo, cover_image, description, vision, mission, phone, email, address, social_twitter, social_instagram, social_snapchat, is_published, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
