import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';


export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPaginationParams(searchParams);
    const [countResult, dataResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM courses'),
      pool.query(`SELECT * FROM courses ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset])
    ]);
    const total = parseInt(countResult.rows[0]?.count || '0', 10);
    return NextResponse.json(buildPaginatedResponse(dataResult.rows, total, page, limit));
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();

    // التحقق من صحة البيانات بـ Zod
    const CoursePostSchema = z.object({
      name: z.string({ error: 'اسم الدورة مطلوب' }).min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(200).trim(),
      description: z.string().max(2000).optional().nullable(),
      duration: z.union([z.string(), z.number()]).optional().nullable(),
      price: z.union([z.string(), z.number()]).optional().nullable(),
      instructor: z.string().max(100).optional().nullable(),
      school_id: z.union([z.string(), z.number()]).optional().nullable(),
      status: z.string().max(50).optional().nullable(),
    });
    const parsed = CoursePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map(e => e.message).join(' | ') },
        { status: 400 }
      );
    }
    const { name, description, duration, price, school_id } = parsed.data;
    const id = require('crypto').randomUUID();
    const now = new Date().toISOString();
    const result = await pool.query(
      `INSERT INTO courses (id, name, description, duration, price, school_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$7) RETURNING *`,
      [id, name, description || null, duration || null, price ? parseFloat(String(price)) : null, school_id || '', now]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في الإضافة' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, name, description, duration, price } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE courses SET name = COALESCE($1, name), description = COALESCE($2, description), duration = COALESCE($3, duration), price = COALESCE($4, price), updated_at = NOW() WHERE id = $5 RETURNING *`,
      [name, description, duration, price, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT courses error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

