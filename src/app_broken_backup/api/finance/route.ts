import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

const PACKAGES: any = {
  basic: { name: 'أساسي', name_en: 'Basic', price: 0, max_schools: 1, max_teachers: 5, max_students: 50 },
  advanced: { name: 'متقدم', name_en: 'Advanced', price: 299, max_schools: 5, max_teachers: 20, max_students: 500 },
  enterprise: { name: 'مؤسسي', name_en: 'Enterprise', price: 599, max_schools: 999, max_teachers: 9999, max_students: 99999 },
};

// Moyasar API Key — غيّره لما يجي الحساب
const MOYASAR_API_KEY = process.env.MOYASAR_API_KEY || 'sk_test_XXXXXXXXXXXXXXXX';
const MOYASAR_URL = 'https://api.moyasar.com/v1';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // جلب الباقات المتاحة
    if (type === 'packages') {
      return NextResponse.json(PACKAGES);
    }

    // جلب اشتراك المستخدم الحالي
    if (type === 'my_subscription') {
      const sub = await pool.query(
        `SELECT * FROM subscriptions WHERE user_id::text = $1::text ORDER BY created_at DESC LIMIT 1`,
        [user.id]
      );
      return NextResponse.json(sub.rows[0] || { package: user.package || 'basic', status: 'active' });
    }

    // جلب فواتير المستخدم
    if (type === 'my_payments') {
      const payments = await pool.query(
        `SELECT * FROM payments WHERE user_id::text = $1::text ORDER BY created_at DESC`,
        [user.id]
      );
      return NextResponse.json(payments.rows);
}
    // جلب كل المدفوعات (للسوبر أدمن)
    if (type === 'all_payments') {
      if (user.role !== 'super_admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
      const allPay = await pool.query(`SELECT p.*, u.name as user_name FROM payments p LEFT JOIN users u ON u.id::text = p.user_id::text ORDER BY p.created_at DESC LIMIT 200`);
      return NextResponse.json(allPay.rows);
    }

    // لوحة مالية (للمالك أو super_admin)
    if (type === 'dashboard') {
      if (!['super_admin', 'owner'].includes(user.role) ) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
      }

      const filter = getFilterSQL(user);

      const totalRevenue = await pool.query(`SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'paid' ${user.role === 'super_admin' ? '' : 'AND owner_id = ' + user.id}`);
      const totalSubs = await pool.query(`SELECT package, COUNT(*) as count FROM subscriptions WHERE status = 'active' GROUP BY package`);
      const recentPayments = await pool.query(`SELECT p.*, u.name as user_name FROM payments p LEFT JOIN users u ON u.id::text = p.user_id::text WHERE p.status = 'paid' ORDER BY p.paid_at DESC LIMIT 10`);
      const monthlyRevenue = await pool.query(`SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'paid' AND paid_at >= date_trunc('month', CURRENT_DATE)`);

      return NextResponse.json({
        total_revenue: totalRevenue.rows[0].total,
        monthly_revenue: monthlyRevenue.rows[0].total,
        subscriptions_by_package: totalSubs.rows,
        recent_payments: recentPayments.rows,
      });
    }

    // default: إرجاع dashboard للـ super_admin أو owner
    // redirect to dashboard
    if (["super_admin", "owner"].includes(user.role)) {
      const totalRevenue2 = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'paid'");
      const totalSubs2 = await pool.query("SELECT package, COUNT(*) as count FROM subscriptions WHERE status = 'active' GROUP BY package");
      return NextResponse.json({ total_revenue: totalRevenue2.rows[0].total, subscriptions_by_package: totalSubs2.rows, recent_payments: [] });
    }
    const defResult = await pool.query(`SELECT * FROM transactions WHERE 1=1 ${filter.sql} ORDER BY created_at DESC LIMIT 100`, filter.params).catch(() => ({ rows: [] });
    return NextResponse.json(defResult.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { action } = body;

    // === ترقية الباقة ===
    if (action === 'upgrade') {
      const { package: pkg } = body;
      if (!PACKAGES[pkg]) return NextResponse.json({ error: 'باقة غير صالحة' }, { status: 400 });
      if (pkg === 'basic') return NextResponse.json({ error: 'الباقة الأساسية مجانية' }, { status: 400 });

      const price = PACKAGES[pkg].price;
      const ids = getInsertIds(user);

      // إنشاء فاتورة
      const paymentId = crypto.randomUUID();
      const invoiceNum = 'INV-' + Date.now().toString(36).toUpperCase();

      await pool.query(
        `INSERT INTO payments (id, user_id, amount, currency, status, type, description, school_id, owner_id, created_at)
         VALUES ($1,$2,$3,'SAR','pending','subscription',$4,$5,$6,NOW()`,
        [paymentId, user.id, price, `ترقية للباقة ${PACKAGES[pkg].name} — ${price} ريال/شهر`, ids.school_id, ids.owner_id]
      );

      // هنا يتم إنشاء رابط الدفع من Moyasar
      // لما يجي الـ API Key، نفعّل هذا الجزء:
      /*
      const moyasarRes = await fetch(MOYASAR_URL + '/payments', {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + Buffer.from(MOYASAR_API_KEY + ':').toString('base64'), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price * 100, // بالهللات
          currency: 'SAR',
          description: `اشتراك متين — ${PACKAGES[pkg].name}`,
          callback_url: `https://your-domain.com/api/finance/callback?payment_id=${paymentId}`,
          source: { type: 'creditcard' }
        })
      });
      const moyasarData = await moyasarRes.json();
      */

      return NextResponse.json({
        payment_id: paymentId,
        package: pkg,
        amount: price,
        currency: 'SAR',
        // payment_url: moyasarData.source.transaction_url, // رابط الدفع من Moyasar
        message: `فاتورة ${price} ريال جاهزة — بانتظار ربط Moyasar`,
        status: 'pending'
      });
    }

    // === تأكيد الدفع (يدوي أو من callback) ===
    if (action === 'confirm_payment') {
      const { payment_id } = body;
      if (!payment_id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

      // فقط super_admin يقدر يأكد يدوي
      if (user.role !== 'super_admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

      const payment = await pool.query(`SELECT * FROM payments WHERE id::text = $1::text`, [payment_id]);
      if (payment.rows.length === 0) return NextResponse.json({ error: 'فاتورة غير موجودة' }, { status: 404 });

      const p = payment.rows[0];

      // تحديث الفاتورة
      await pool.query(`UPDATE payments SET status = 'paid', paid_at = NOW() WHERE id::text = $1::text`, [payment_id]);

      // إنشاء/تحديث الاشتراك
      const subId = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      // تحديد الباقة من المبلغ
      const pkg = p.amount >= 599 ? 'enterprise' : p.amount >= 299 ? 'advanced' : 'basic';

      await pool.query(
        `INSERT INTO subscriptions (id, user_id, package, status, amount, started_at, expires_at, payment_method)
         VALUES ($1,$2,$3,'active',$4,NOW(),$5,'manual')`,
        [subId, p.user_id, pkg, p.amount, expiresAt]
      );

      // تحديث باقة المستخدم
      await pool.query(`UPDATE users SET package = $1 WHERE id::text = $2::text`, [pkg, p.user_id]);

      // سجل مالي
      const logId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO financial_log (id, payment_id, action, details) VALUES ($1,$2,'payment_confirmed',$3)`,
        [logId, payment_id, `تأكيد دفع ${p.amount} ريال — ترقية لباقة ${pkg}`]
      );

      return NextResponse.json({ success: true, package: pkg, expires_at: expiresAt, message: `تم التأكيد — الباقة الآن: ${PACKAGES[pkg].name}` });
    }

    return NextResponse.json({ error: 'action مطلوب' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
