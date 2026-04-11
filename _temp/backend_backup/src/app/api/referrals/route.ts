import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const result = await pool.query(`
      SELECT r.*, 
        s1.name as referrer_school_name,
        s2.name as referred_school_name
      FROM referrals r
      LEFT JOIN schools s1 ON r.referrer_school_id = s1.id::text
      LEFT JOIN schools s2 ON r.referred_school_id = s2.id::text
      WHERE r.referrer_school_id = $1 OR $2 = 'super_admin'
      ORDER BY r.created_at DESC
    `, [user.school_id, user.role]);

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

    // Generate unique referral code
    const referral_code = `MTN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const result = await pool.query(`
      INSERT INTO referrals (referrer_school_id, referral_code, status, reward_amount, created_at)
      VALUES ($1, $2, 'active', 0, NOW())
      RETURNING *
    `, [user.school_id, referral_code]);

    return NextResponse.json({ data: result.rows[0], message: 'تم إنشاء رابط الإحالة بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
