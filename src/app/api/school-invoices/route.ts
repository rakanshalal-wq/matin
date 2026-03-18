import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';

// =====================================================
// API فواتير المدارس - منصة متين
// =====================================================

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const { limit, offset, page } = getPaginationParams(searchParams);
    const filter = getFilterSQL(user);
    const status = searchParams.get('status');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let extraSQL = filter.sql;
    const params = [...filter.params];

    if (status) {
      params.push(status);
      extraSQL += ` AND si.status = $${params.length}`;
    }
    if (month) {
      params.push(month);
      extraSQL += ` AND EXTRACT(MONTH FROM si.due_date) = $${params.length}`;
    }
    if (year) {
      params.push(year);
      extraSQL += ` AND EXTRACT(YEAR FROM si.due_date) = $${params.length}`;
    }

    const [countResult, dataResult] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) FROM school_invoices si WHERE 1=1 ${extraSQL}`,
        params
      ),
      pool.query(
        `SELECT si.*, s.name as school_name
         FROM school_invoices si
         LEFT JOIN schools s ON si.school_id = s.id
         WHERE 1=1 ${extraSQL}
         ORDER BY si.created_at DESC
         LIMIT $1 OFFSET $2`,
        params
      ),
    ]);

    return NextResponse.json(
      buildPaginatedResponse(dataResult.rows, Number(countResult.rows[0].count), page, limit)
    );
  } catch (error) {
    console.error('GET school-invoices error:', error);
    return NextResponse.json({ error: 'خطأ في جلب الفواتير' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();

    // ✅ التحقق من صحة البيانات بـ Zod
    const { z } = await import('zod');
    const InvoicePostSchema = z.object({
      school_id: z.union([z.string(), z.number()], { required_error: 'معرف المدرسة مطلوب' }),
      title: z.string({ required_error: 'عنوان الفاتورة مطلوب' }).min(2, 'العنوان يجب أن يكون حرفين على الأقل').max(200).trim(),
      description: z.string().max(1000).optional().nullable(),
      amount: z.union([
        z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
        z.string().transform(v => { const n = parseFloat(v); if (isNaN(n) || n <= 0) throw new Error('المبلغ غير صحيح'); return n; })
      ], { required_error: 'المبلغ مطلوب' }),
      tax_rate: z.number().min(0).max(100).optional().default(0),
      due_date: z.string({ required_error: 'تاريخ الاستحقاق مطلوب' }).min(1, 'تاريخ الاستحقاق مطلوب'),
      status: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional().default('pending'),
      notes: z.string().max(1000).optional().nullable(),
      invoice_number: z.string().max(50).optional().nullable(),
    });
    const parsed = InvoicePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors.map(e => e.message).join(' | ') },
        { status: 400 }
      );
    }
    const { school_id, title, description, amount, tax_rate, due_date, status, notes, invoice_number } = parsed.data;

    const taxAmount = (Number(amount) * (Number(tax_rate) || 0)) / 100;
    const totalAmount = Number(amount) + taxAmount;
    const invNum = invoice_number || `INV-${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO school_invoices
         (school_id, title, description, amount, tax_rate, tax_amount, total_amount,
          due_date, status, notes, invoice_number, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
       RETURNING *`,
      [
        school_id, title.trim(), description || null,
        Number(amount), Number(tax_rate) || 0, taxAmount, totalAmount,
        due_date, status || 'pending', notes || null,
        invNum, user.id
      ]
    );

    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST school-invoices error:', error);
    return NextResponse.json({ error: 'خطأ في إنشاء الفاتورة' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, description, amount, tax_rate, due_date, status, notes, paid_at } = body;

    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });

    // إعادة حساب الضريبة إذا تغيّر المبلغ
    let taxAmount = undefined;
    let totalAmount = undefined;
    if (amount !== undefined && tax_rate !== undefined) {
      taxAmount = (Number(amount) * Number(tax_rate)) / 100;
      totalAmount = Number(amount) + taxAmount;
    }

    const result = await pool.query(
      `UPDATE school_invoices SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         amount = COALESCE($3, amount),
         tax_rate = COALESCE($4, tax_rate),
         tax_amount = COALESCE($5, tax_amount),
         total_amount = COALESCE($6, total_amount),
         due_date = COALESCE($7, due_date),
         status = COALESCE($8, status),
         notes = COALESCE($9, notes),
         paid_at = COALESCE($10, paid_at),
         updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [title, description, amount, tax_rate, taxAmount, totalAmount, due_date, status, notes, paid_at, id]
    );

    if (result.rows.length === 0) return NextResponse.json({ error: 'الفاتورة غير موجودة' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT school-invoices error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث الفاتورة' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'الحذف متاح لمدير المنصة فقط' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });

    const result = await pool.query(
      'DELETE FROM school_invoices WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'الفاتورة غير موجودة' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE school-invoices error:', error);
    return NextResponse.json({ error: 'خطأ في حذف الفاتورة' }, { status: 500 });
  }
}
