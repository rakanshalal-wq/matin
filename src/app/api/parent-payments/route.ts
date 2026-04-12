import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'invoices';
    const school_id = searchParams.get('school_id') || user.school_id;

    if (user.role === 'parent' && type === 'invoices') {
      const result = await pool.query(`
        SELECT ui.*, s.name_ar as student_name, sc.name_ar as school_name, sc.logo_url as school_logo,
          json_agg(json_build_object('id',uii.id,'description',uii.description,'quantity',uii.quantity,'unit_price',uii.unit_price,'total',uii.total,'period',uii.period) ORDER BY uii.sort_order) FILTER (WHERE uii.id IS NOT NULL) as items
        FROM unified_invoices ui
        LEFT JOIN students s ON s.id = ui.student_id
        LEFT JOIN schools sc ON sc.id = ui.school_id
        LEFT JOIN unified_invoice_items uii ON uii.invoice_id = ui.id
        WHERE ui.parent_id = $1
        GROUP BY ui.id, s.name_ar, sc.name_ar, sc.logo_url
        ORDER BY CASE ui.status WHEN 'pending' THEN 1 WHEN 'overdue' THEN 2 WHEN 'partial' THEN 3 ELSE 4 END, ui.due_date ASC
      `, [user.id]);
      await pool.query('UPDATE unified_invoices SET viewed_at = NOW() WHERE parent_id = $1 AND viewed_at IS NULL', [user.id]);
      const summary = await pool.query(`
        SELECT COUNT(*) FILTER (WHERE status IN ('pending','overdue','partial')) as pending_count,
          COALESCE(SUM(total) FILTER (WHERE status IN ('pending','overdue','partial')), 0) as total_due,
          COALESCE(SUM(total) FILTER (WHERE status = 'paid'), 0) as total_paid,
          COUNT(*) FILTER (WHERE status = 'overdue') as overdue_count
        FROM unified_invoices WHERE parent_id = $1
      `, [user.id]);
      return NextResponse.json({ invoices: result.rows, summary: summary.rows[0] });
    }

    if (user.role === 'parent' && type === 'history') {
      const result = await pool.query(`
        SELECT up.*, ui.invoice_number, ui.title as invoice_title, s.name_ar as student_name
        FROM unified_payments up
        JOIN unified_invoices ui ON ui.id = up.invoice_id
        LEFT JOIN students s ON s.id = ui.student_id
        WHERE ui.parent_id = $1 ORDER BY up.created_at DESC LIMIT 50
      `, [user.id]);
      return NextResponse.json(result.rows);
    }

    if (['owner', 'admin'].includes(user.role) && type === 'school_invoices') {
      const status = searchParams.get('status');
      const student_id = searchParams.get('student_id');
      let query = `SELECT ui.*, s.name_ar as student_name, p.name as parent_name, p.phone as parent_phone
        FROM unified_invoices ui LEFT JOIN students s ON s.id = ui.student_id LEFT JOIN parents p ON p.id = ui.parent_id
        WHERE ui.school_id = $1`;
      const params: any[] = [user.school_id];
      if (status) { query += ` AND ui.status = $${params.length + 1}`; params.push(status); }
      if (student_id) { query += ` AND ui.student_id = $${params.length + 1}`; params.push(student_id); }
      query += ' ORDER BY ui.created_at DESC LIMIT 100';
      const result = await pool.query(query, params);
      const stats = await pool.query(`
        SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status='paid') as paid,
          COUNT(*) FILTER (WHERE status IN ('pending','overdue')) as pending,
          COALESCE(SUM(total) FILTER (WHERE status='paid'),0) as collected,
          COALESCE(SUM(total) FILTER (WHERE status IN ('pending','overdue')),0) as outstanding
        FROM unified_invoices WHERE school_id = $1
      `, [user.school_id]);
      return NextResponse.json({ invoices: result.rows, stats: stats.rows[0] });
    }

    if (user.role === 'super_admin' && type === 'platform_stats') {
      const result = await pool.query(`
        SELECT sc.id as school_id, sc.name_ar as school_name, COUNT(ui.id) as total_invoices,
          COALESCE(SUM(ui.total) FILTER (WHERE ui.status='paid'),0) as collected,
          COALESCE(SUM(ui.platform_fee_amt) FILTER (WHERE ui.status='paid'),0) as platform_revenue,
          COUNT(ui.id) FILTER (WHERE ui.status IN ('pending','overdue')) as pending_invoices
        FROM schools sc LEFT JOIN unified_invoices ui ON ui.school_id = sc.id
        GROUP BY sc.id, sc.name_ar ORDER BY collected DESC LIMIT 50
      `);
      const totals = await pool.query(`
        SELECT COALESCE(SUM(total) FILTER (WHERE status='paid'),0) as total_collected,
          COALESCE(SUM(platform_fee_amt) FILTER (WHERE status='paid'),0) as total_platform_revenue,
          COUNT(*) FILTER (WHERE status IN ('pending','overdue')) as total_pending
        FROM unified_invoices
      `);
      return NextResponse.json({ schools: result.rows, totals: totals.rows[0] });
    }

    if (type === 'gateways') {
      const sid = school_id || user.school_id;
      const settings = await pool.query('SELECT * FROM school_payment_settings WHERE school_id = $1', [sid]);
      const gateways = settings.rows[0]?.enabled_gateways || ['cash'];
      return NextResponse.json({ gateways, default: settings.rows[0]?.default_gateway || 'cash' });
    }

    return NextResponse.json({ error: 'نوع غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('Parent payments GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { action } = body;

    if (action === 'create_invoice') {
      if (!['owner', 'admin', 'super_admin'].includes(user.role)) {
        return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
      }
      const { student_id, parent_id, title, items, due_date, notes } = body;
      if (!student_id || !items?.length) {
        return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
      }
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);
      const settings = await pool.query('SELECT * FROM school_payment_settings WHERE school_id = $1', [user.school_id]);
      const cfg = settings.rows[0] || {};
      const vatPct = cfg.vat_enabled ? (cfg.vat_pct || 15) : 0;
      const tax = subtotal * (vatPct / 100);
      const platformFeePct = cfg.platform_fee_pct || 0;
      const platformFeeAmt = subtotal * (platformFeePct / 100);
      const total = subtotal + tax;
      const invNum = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const inv = await client.query(`
          INSERT INTO unified_invoices (id, invoice_number, school_id, owner_id, student_id, parent_id, title, description, subtotal, tax, total, platform_fee_pct, platform_fee_amt, status, due_date)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'pending',$14) RETURNING *
        `, [invNum, invNum, user.school_id, user.owner_id || user.id, student_id, parent_id, title || 'فاتورة رسوم', notes || null, subtotal, tax, total, platformFeePct, platformFeeAmt, due_date || null]);
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          await client.query(
            `INSERT INTO unified_invoice_items (invoice_id, fee_type_id, description, quantity, unit_price, total, period, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [inv.rows[0].id, item.fee_type_id || null, item.description, item.quantity || 1, item.unit_price, item.quantity * item.unit_price, item.period || null, i]
          );
        }
        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'تم إنشاء الفاتورة بنجاح', invoice: inv.rows[0] }, { status: 201 });
      } catch (e) { await client.query('ROLLBACK'); throw e; }
      finally { client.release(); }
    }

    if (action === 'confirm_cash_payment') {
      if (!['owner', 'admin'].includes(user.role)) {
        return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
      }
      const { invoice_id, amount } = body;
      const inv = await pool.query('SELECT * FROM unified_invoices WHERE id = $1 AND school_id = $2', [invoice_id, user.school_id]);
      if (!inv.rows[0]) return NextResponse.json({ error: 'الفاتورة غير موجودة' }, { status: 404 });
      const paidAmount = amount || inv.rows[0].total;
      const newStatus = paidAmount >= inv.rows[0].total ? 'paid' : 'partial';
      await pool.query('UPDATE unified_invoices SET status=$1, paid_at=NOW(), payment_method=\'cash\' WHERE id=$2', [newStatus, invoice_id]);
      await pool.query(
        `INSERT INTO unified_payments (id, invoice_id, school_id, owner_id, amount, payment_method, provider, provider_status, status, paid_by) VALUES ($1,$2,$3,$4,$5,'cash','cash','paid','completed',$6)`,
        [`PAY-${Date.now()}`, invoice_id, user.school_id, user.owner_id || user.id, paidAmount, user.id]
      );
      return NextResponse.json({ success: true, message: 'تم تأكيد الدفع النقدي' });
    }

    if (action === 'initiate_payment') {
      if (user.role !== 'parent') return NextResponse.json({ error: 'هذه العملية لأولياء الأمور فقط' }, { status: 403 });
      const { invoice_id, payment_method } = body;
      if (!invoice_id || !payment_method) return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
      const inv = await pool.query('SELECT ui.*, sc.name_ar as school_name FROM unified_invoices ui JOIN schools sc ON sc.id=ui.school_id WHERE ui.id=$1 AND ui.parent_id=$2', [invoice_id, user.id]);
      if (!inv.rows[0]) return NextResponse.json({ error: 'الفاتورة غير موجودة' }, { status: 404 });
      if (inv.rows[0].status === 'paid') return NextResponse.json({ error: 'الفاتورة مدفوعة مسبقاً' }, { status: 400 });
      if (['cash', 'bank_transfer'].includes(payment_method)) {
        await pool.query('UPDATE unified_invoices SET payment_method=$1 WHERE id=$2', [payment_method, invoice_id]);
        return NextResponse.json({ success: true, message: 'تم تسجيل طلبك، سيتم تأكيده من المدرسة', requires_confirmation: true });
      }
      return NextResponse.json({ error: 'طريقة الدفع غير مدعومة حالياً — تواصل مع المدرسة' }, { status: 400 });
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('Parent payments POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
