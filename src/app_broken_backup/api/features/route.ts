import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM features WHERE is_active = true ORDER BY sort_order'
    );
    return NextResponse.json({ success: true, features: result.rows });
  } catch (error) {
    console.error('Features error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, icon, image_url, link } = await request.json();

    const result = await pool.query(
      'INSERT INTO features (title, description, icon, image_url, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, icon, image_url, link]
    );

    return NextResponse.json({ success: true, feature: result.rows[0] });
  } catch (error) {
    console.error('Add feature error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, description, icon, image_url, link, is_active } = await request.json();

    await pool.query(
      'UPDATE features SET title = $1, description = $2, icon = $3, image_url = $4, link = $5, is_active = $6 WHERE id::text = $7::text',
      [title, description, icon, image_url, link, is_active, id]
    );

    return NextResponse.json({ success: true, message: 'تم التحديث بنجاح' });
  } catch (error) {
    console.error('Update feature error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await pool.query('DELETE FROM features WHERE id::text = $1::text', [id]);

    return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    console.error('Delete feature error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
