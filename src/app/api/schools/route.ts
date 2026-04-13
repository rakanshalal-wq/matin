import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

// GET - جلب المدارس
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    let result;
    if (user.role === 'super_admin') {
      result = await pool.query(
        `SELECT s.*, u.name as owner_name, u.email as owner_email 
         FROM schools s LEFT JOIN users u ON u.id::text = s.owner_id::text 
         ORDER BY s.created_at DESC`
      );
    } else if (user.role === 'owner') {
      result = await pool.query(
        `SELECT s.*, u.name as owner_name, u.email as owner_email 
         FROM schools s LEFT JOIN users u ON u.id::text = s.owner_id::text 
         WHERE s.owner_id::text = $1::text ORDER BY s.created_at DESC`,
        [user.id]
      );
    } else if (user.school_id) {
      result = await pool.query(
        `SELECT s.*, u.name as owner_name, u.email as owner_email 
         FROM schools s LEFT JOIN users u ON u.id::text = s.owner_id::text 
         WHERE s.id = $1`,
        [String(user.school_id)]
      );
    } else {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

// POST - إنشاء مدرسة
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (user.role !== 'owner' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'فقط مالك المدارس يقدر ينشئ مدرسة' }, { status: 403 });
    }

    // تحقق من حدود الباقة
    if (user.role === 'owner') {
      const schoolCount = await pool.query('SELECT COUNT(*) FROM schools WHERE owner_id = $1', [user.id]);
      const current = parseInt(schoolCount.rows[0].count);
      const max = user.max_schools || 1;
      if (current >= max) {
        return NextResponse.json({ 
          error: `وصلت الحد الأقصى (${max} مدارس). رقّي باقتك لإضافة المزيد` 
        }, { status: 403 });
      }
    }

    const body = await request.json();
    const { name, name_ar, email, phone, address, city } = body;
    
    if (!name && !name_ar) {
      return NextResponse.json({ error: 'اسم المدرسة مطلوب' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const code = 'SCH-' + Date.now().toString(36).toUpperCase();
    const ownerId = user.role === 'owner' ? user.id : null;

    const result = await pool.query(
      `INSERT INTO schools (id, name, name_ar, code, email, phone, address, city, status, owner_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE', $9, NOW(), NOW()) RETURNING *`,
      [id, name || name_ar, name_ar || name, code, email || null, phone || null, address || null, city || null, ownerId]
    );

    // ربط المالك بالمدرسة لو ما عنده school_id
    if (user.role === 'owner' && !user.school_id) {
      await pool.query('UPDATE users SET school_id = $1 WHERE id = $2', [id, user.id]);
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء المدرسة' }, { status: 500 });
  }
}

// PUT - تعديل مدرسة
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, name, name_ar, email, phone, address, city, status } = body;
    if (!id) return NextResponse.json({ error: 'معرف المدرسة مطلوب' }, { status: 400 });

    // تحقق من الملكية
    if (user.role === 'owner') {
      const check = await pool.query('SELECT id FROM schools WHERE id = $1 AND owner_id = $2', [id, user.id]);
      if (check.rows.length === 0) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const result = await pool.query(
      `UPDATE schools SET name=$1, name_ar=$2, email=$3, phone=$4, address=$5, city=$6, status=COALESCE($7, status), updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, name_ar, email, phone, address, city, status, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في التعديل' }, { status: 500 });
  }
}

// DELETE - حذف مدرسة
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (user.role !== 'owner' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف المدرسة مطلوب' }, { status: 400 });

    if (user.role === 'owner') {
      const check = await pool.query('SELECT id FROM schools WHERE id = $1 AND owner_id = $2', [id, user.id]);
      if (check.rows.length === 0) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    await pool.query('DELETE FROM schools WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم حذف المدرسة' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في الحذف' }, { status: 500 });
  }
}
