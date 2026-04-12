import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import { getPaymentCredentials } from '@/lib/integrations';
import { studentFeeSchema } from '@/lib/validations';
import { sendPaymentNoticeEmail } from '@/lib/email';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const result = await pool.query(
      `SELECT * FROM student_fees WHERE 1=1 ${filter.sql} ORDER BY created_at DESC LIMIT 200`,
      filter.params
    );
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    
    // التحقق من صحة المدخلات باستخدام Zod
    const validation = studentFeeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { student_id, student_name, amount, fee_type, description, due_date, status, payment_method } = validation.data as any;

    // لو الدفع أونلاين، جيب credentials من الداشبورد
    if (payment_method === 'online') {
      const owner_id = ids.owner_id;
      // جرب Moyasar أولاً
      const moyasar = await getPaymentCredentials('moyasar');
      const hyperpay = await getPaymentCredentials('hyperpay');
      const tap = await getPaymentCredentials('tap');

      const paymentProvider = moyasar ? 'moyasar' : hyperpay ? 'hyperpay' : tap ? 'tap' : null;
      if (!paymentProvider) return NextResponse.json({ error: 'لا يوجد بوابة دفع مفعّلة، فعّل إحداها من مركز التكاملات' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO student_fees (student_id, student_name, amount, fee_type, description, due_date, status, payment_method, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
      [student_id || null, student_name, amount, fee_type || 'tuition', description || null, due_date || null, status || 'pending', payment_method || 'cash', ids.school_id, ids.owner_id]
    );

    // إرسال إشعار بالبريد الإلكتروني إذا كان الطالب مسجلاً ولديه بريد
    if (student_id) {
      try {
        const studentResult = await pool.query('SELECT email FROM students WHERE id = $1', [student_id]);
        if (studentResult.rows[0]?.email) {
          await sendPaymentNoticeEmail(studentResult.rows[0].email, student_name, amount.toString());
        }
      } catch (emailError) {
        console.error('Failed to send payment notice email:', emailError);
      }
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, student_name, amount, fee_type, description, due_date, status, payment_method } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE student_fees SET student_name=$1, amount=$2, fee_type=$3, description=$4, due_date=$5, status=$6, payment_method=$7 WHERE id=$8 RETURNING *`,
      [student_name, amount, fee_type, description, due_date, status, payment_method, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM student_fees WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
