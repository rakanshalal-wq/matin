import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    let result;
    if (user.role === 'super_admin') {
      result = await pool.query(`
        SELECT r.*,
          s1.name as referrer_school_name,
          s2.name as referred_school_name
        FROM referrals r
        LEFT JOIN schools s1 ON r.referrer_school_id::text = s1.id
        LEFT JOIN schools s2 ON r.referred_school_id::text = s2.id
        ORDER BY r.created_at DESC
      `);
    } else {
      result = await pool.query(`
        SELECT r.*,
          s1.name as referrer_school_name,
          s2.name as referred_school_name
        FROM referrals r
        LEFT JOIN schools s1 ON r.referrer_school_id::text = s1.id
        LEFT JOIN schools s2 ON r.referred_school_id::text = s2.id
        WHERE r.referrer_school_id::text = $1::text
        ORDER BY r.created_at DESC
      `, [String(user.school_id)]);
    }

    return NextResponse.json({ data: result.rows, total: result.rowCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !['super_admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const referral_code = `MTN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const result = await pool.query(`
      INSERT INTO referrals (referrer_school_id, referral_code, status, reward_amount, created_at)
      VALUES ($1, $2, 'active', 0, NOW()
      RETURNING *
    `, [String(user.school_id), referral_code]);
    return NextResponse.json({ data: result.rows[0], message: 'تم إنشاء رابط الإحالة بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
