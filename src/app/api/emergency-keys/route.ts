import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// نظام الطوارئ: فتح اختبار مشفّر يحتاج موافقة شخصين
// مثل خزنة البنك — لا أحد يفتح لحاله

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const result = await pool.query(`
      SELECT ek.*, u1.name as requester_name, u2.name as approver_name, e.title as exam_title
      FROM emergency_keys ek
      LEFT JOIN users u1 ON u1.id::text = ek.requester_id
      LEFT JOIN users u2 ON u2.id::text = ek.approver_id
      LEFT JOIN exams e ON e.id = ek.exam_id
      ORDER BY ek.created_at DESC LIMIT 50
    `);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'فقط المالك أو المدير يقدر يطلب فتح طوارئ' }, { status: 403 });
    }
    const { exam_id, reason } = await request.json();
    if (!exam_id || !reason) {
      return NextResponse.json({ error: 'معرّف الاختبار والسبب مطلوبين' }, { status: 400 });
    }
    const result = await pool.query(
      `INSERT INTO emergency_keys (exam_id, requester_id, reason, status, created_at)
       VALUES ($1, $2, $3, 'pending', NOW()) RETURNING *`,
      [exam_id, String(user.id), reason]
    );
    return NextResponse.json({ success: true, message: 'تم إرسال طلب الطوارئ. بانتظار الموافقة من شخص معتمد ثاني.', data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const { id, action } = await request.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }
    // تأكد إن المعتمد مو نفس الطالب
    const req = await pool.query('SELECT requester_id FROM emergency_keys WHERE id = $1', [id]);
    if (req.rows[0]?.requester_id === String(user.id)) {
      return NextResponse.json({ error: 'لا يمكن الموافقة على طلبك بنفسك — يحتاج شخص ثاني' }, { status: 403 });
    }
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await pool.query(
      'UPDATE emergency_keys SET status = $1, approver_id = $2, approved_at = NOW() WHERE id = $3',
      [newStatus, String(user.id), id]
    );
    // سجّل في audit
    await pool.query(
      `INSERT INTO activity_log (action, details, user_id, created_at) VALUES ($1, $2, $3, NOW())`,
      ['emergency_key_' + action, JSON.stringify({ emergency_key_id: id, action }), String(user.id)]
    ).catch(() => {});
    return NextResponse.json({ success: true, message: action === 'approve' ? 'تمت الموافقة — الاختبار مفتوح' : 'تم رفض الطلب' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
