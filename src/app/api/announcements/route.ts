import { NextResponse } from 'next/server';
import { z } from 'zod';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPaginationParams(searchParams);
    const filterSQL = filter.sql.replace(/school_id/g, 'a.school_id');
    const [countResult, dataResult] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM announcements a WHERE 1=1 ${filterSQL}`, filter.params),
      pool.query(`
        SELECT a.*, u.name as author_name
        FROM announcements a
        LEFT JOIN users u ON u.id = a.author_id
        WHERE 1=1 ${filterSQL}
        ORDER BY a.created_at DESC
        LIMIT $1 OFFSET $2
      `, [...filter.params, limit, offset])
    ]);
    const total = parseInt(countResult.rows[0]?.count || '0', 10);
    return NextResponse.json(buildPaginatedResponse(dataResult.rows, total, page, limit));
  } catch (error: any) {
    // If table doesn't exist, return empty array
    if (error.message.includes('does not exist')) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const body = await request.json();

    // التحقق من صحة البيانات بـ Zod
    const AnnouncementPostSchema = z.object({
      title: z.string({ error: 'عنوان الإعلان مطلوب' }).min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل').max(200).trim(),
      content: z.string({ error: 'محتوى الإعلان مطلوب' }).min(5, 'المحتوى يجب أن يكون 5 أحرف على الأقل').max(5000),
      type: z.string().max(50).optional().nullable(),
      target_audience: z.string().max(50).optional().default('all'),
      priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().default('normal'),
    });
    const parsed = AnnouncementPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map(e => e.message).join(' | ') },
        { status: 400 }
      );
    }
    const { title, content, target_audience, priority } = parsed.data;
    
    const result = await pool.query(
      `INSERT INTO announcements (id, title, content, target_audience, priority, author_id, school_id, is_active, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW()) RETURNING *`,
      ['ann_' + Date.now(), title, content, target_audience || 'all', priority || 'normal', user.id, user.school_id]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, title, content, target_audience, priority, is_active } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE announcements SET title = COALESCE($1, title), content = COALESCE($2, content), target_audience = COALESCE($3, target_audience), priority = COALESCE($4, priority), is_active = COALESCE($5, is_active), updated_at = NOW() WHERE id = $6 RETURNING *`,
      [title, content, target_audience, priority, is_active, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT announcements error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

