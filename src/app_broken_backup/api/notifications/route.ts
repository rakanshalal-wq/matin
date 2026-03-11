import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import { sendSMS, sendWhatsApp, sendEmail } from '@/lib/integrations';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const result = await pool.query(
      `SELECT * FROM notifications WHERE 1=1 ${filter.sql} ORDER BY created_at DESC LIMIT 200`,
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
    const { title, content, type, target, target_id, channels } = body;
    if (!title) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });

    // حفظ الإشعار في DB
    const result = await pool.query(
      `INSERT INTO notifications (title, content, type, target, is_read, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,false,$5,$6,NOW() RETURNING *`,
      [title, content || null, type || 'info', target || 'all', ids.school_id, ids.owner_id]
    );

    // إرسال عبر القنوات المفعلة
    const owner_id = ids.owner_id;
    const sendResults: any = {};

    if (channels?.includes('sms') || channels?.includes('all') ) {
      // جلب أرقام المستهدفين
      let phoneQuery = 'SELECT phone FROM users WHERE phone IS NOT NULL';
      if (target === 'teachers') phoneQuery += ` AND role = 'teacher'`;
      else if (target === 'students') phoneQuery += ` AND role = 'student'`;
      else if (target === 'parents') phoneQuery += ` AND role = 'parent'`;
      if (ids.school_id) phoneQuery += ` AND school_id = ${ids.school_id}`;
      else if (ids.owner_id) phoneQuery += ` AND owner_id = ${ids.owner_id}`;

      const phones = await pool.query(phoneQuery);
      let smsSent = 0;
      for (const row of phones.rows) {
        if (row.phone) {
          const r = await sendSMS(row.phone, `${title}\n${content || ''}`, owner_id ?? undefined);
          if (r.success) smsSent++;
        }
      }
      sendResults.sms = smsSent;
    }

    if (channels?.includes('whatsapp') || channels?.includes('all') ) {
      let phoneQuery = 'SELECT phone FROM users WHERE phone IS NOT NULL';
      if (target === 'teachers') phoneQuery += ` AND role = 'teacher'`;
      else if (target === 'students') phoneQuery += ` AND role = 'student'`;
      if (ids.school_id) phoneQuery += ` AND school_id = ${ids.school_id}`;
      else if (ids.owner_id) phoneQuery += ` AND owner_id = ${ids.owner_id}`;

      const phones = await pool.query(phoneQuery);
      let waSent = 0;
      for (const row of phones.rows) {
        if (row.phone) {
          const r = await sendWhatsApp(row.phone, `*${title}*\n${content || ''}`, owner_id ?? undefined);
          if (r.success) waSent++;
        }
      }
      sendResults.whatsapp = waSent;
    }

    if (channels?.includes('email') || channels?.includes('all') ) {
      let emailQuery = 'SELECT email, name FROM users WHERE email IS NOT NULL';
      if (target === 'teachers') emailQuery += ` AND role = 'teacher'`;
      else if (target === 'students') emailQuery += ` AND role = 'student'`;
      if (ids.school_id) emailQuery += ` AND school_id = ${ids.school_id}`;
      else if (ids.owner_id) emailQuery += ` AND owner_id = ${ids.owner_id}`;

      const emails = await pool.query(emailQuery);
      let emailSent = 0;
      for (const row of emails.rows) {
        const html = `<div dir="rtl" style="font-family:Arial;padding:20px;background:#0D1B2A;color:white;border-radius:12px"><h2 style="color:#C9A227">${title}</h2><p>${content || ''}</p><p style="color:rgba(255,255,255,0.4);font-size:12px">متين - نظام إدارة التعليم</p></div>`;
        const r = await sendEmail(row.email, title, html, owner_id ?? undefined);
        if (r.success) emailSent++;
      }
      sendResults.email = emailSent;
    }

    return NextResponse.json({ ...result.rows[0], sendResults }, { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, title, content, type, is_read } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE notifications SET title=$1, content=$2, type=$3, is_read=$4 WHERE id::text = $5::text RETURNING *',
      [title, content, type, is_read, id]
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
    await pool.query('DELETE FROM notifications WHERE id::text = $1::text', [id]);
    return NextResponse.json({ success: true });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
