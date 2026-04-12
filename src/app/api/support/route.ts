import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let query = '';
    const params: any[] = [];
    let idx = 1;

    if (['super_admin','owner','admin'].includes(user.role)) {
      query = `SELECT t.*, (SELECT name FROM users WHERE id = t.user_id) as user_name,
               (SELECT name FROM users WHERE id = t.admin_id) as admin_name
               FROM support_tickets t WHERE 1=1`;
      if (user.role !== 'super_admin') {
        query += ` AND t.school_id = $${idx}`;
        params.push(user.school_id);
        idx++;
      }
    } else {
      query = `SELECT t.*, (SELECT name FROM users WHERE id = t.admin_id) as admin_name
               FROM support_tickets t WHERE t.user_id = $${idx}`;
      params.push(user.id);
      idx++;
    }

    if (status) {
      query += ` AND t.status = $${idx}`;
      params.push(status);
      idx++;
    }

    query += ' ORDER BY t.created_at DESC LIMIT 100';
    const result = await pool.query(query, params);

    return NextResponse.json({ tickets: result.rows });
  } catch (error) {
    console.error('Support GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { subject, message, category, priority } = body;

    if (!subject?.trim()) return NextResponse.json({ error: 'الموضوع مطلوب' }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO support_tickets (user_id, school_id, subject, message, category, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'open') RETURNING *`,
      [user.id, user.school_id || null, subject.trim(), message.trim(), category || 'general', priority || 'medium']
    );

    return NextResponse.json({ ticket: result.rows[0], message: 'تم إرسال التذكرة بنجاح' });
  } catch (error) {
    console.error('Support POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, admin_reply, status } = body;

    if (!id) return NextResponse.json({ error: 'معرف التذكرة مطلوب' }, { status: 400 });

    if (admin_reply && ['super_admin','owner','admin'].includes(user.role)) {
      await pool.query(
        `UPDATE support_tickets SET admin_reply = $1, admin_id = $2, replied_at = NOW(), status = $3, updated_at = NOW() WHERE id = $4`,
        [admin_reply, user.id, status || 'answered', id]
      );
    } else if (status) {
      if (['super_admin','owner','admin'].includes(user.role)) {
        await pool.query('UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
      } else {
        await pool.query('UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3', [status, id, user.id]);
      }
    }

    return NextResponse.json({ message: 'تم التحديث بنجاح' });
  } catch (error) {
    console.error('Support PUT error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
