import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/store/products/[id] — جلب منتج واحد
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query('SELECT * FROM store_products WHERE id = $1', [id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    return NextResponse.json({ product: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/store/products/[id] — تعديل منتج
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, description, price, quantity_available, category, image_url } = body;

  try {
    const updates: string[] = [];
    const queryParams: any[] = [];

    if (name !== undefined)               { updates.push(`name=$${queryParams.length + 1}`);               queryParams.push(name); }
    if (description !== undefined)        { updates.push(`description=$${queryParams.length + 1}`);        queryParams.push(description); }
    if (price !== undefined)              { updates.push(`price=$${queryParams.length + 1}`);              queryParams.push(price); }
    if (quantity_available !== undefined) { updates.push(`quantity_available=$${queryParams.length + 1}`); queryParams.push(quantity_available); }
    if (category !== undefined)           { updates.push(`category=$${queryParams.length + 1}`);           queryParams.push(category); }
    if (image_url !== undefined)          { updates.push(`image_url=$${queryParams.length + 1}`);          queryParams.push(image_url); }

    if (!updates.length) return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });

    queryParams.push(id);
    const result = await pool.query(
      `UPDATE store_products SET ${updates.join(', ')} WHERE id=$${queryParams.length} RETURNING *`,
      queryParams
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    return NextResponse.json({ product: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/store/products/[id] — حذف منتج
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await pool.query('DELETE FROM store_products WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
