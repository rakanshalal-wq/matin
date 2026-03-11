import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM advertisements WHERE is_active = true ORDER BY sort_order'
    );
    return NextResponse.json({ success: true, advertisements: result.rows });
  } catch (error) {
    console.error('Advertisements error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, image_url, link, bg_color } = await request.json();

    const result = await pool.query(
      'INSERT INTO advertisements (title, image_url, link, bg_color) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, image_url, link, bg_color]
    );

    return NextResponse.json({ success: true, advertisement: result.rows[0] });
  } catch (error) {
    console.error('Add advertisement error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, image_url, link, bg_color, is_active } = await request.json();

    await pool.query(
      'UPDATE advertisements SET title = $1, image_url = $2, link = $3, bg_color = $4, is_active = $5 WHERE id::text = $6::text',
      [title, image_url, link, bg_color, is_active, id]
    );

    return NextResponse.json({ success: true, message: 'تم التحديث بنجاح' });
  } catch (error) {
    console.error('Update advertisement error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await pool.query('DELETE FROM advertisements WHERE id::text = $1::text', [id]);

    return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    console.error('Delete advertisement error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
