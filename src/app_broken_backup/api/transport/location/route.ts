import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';




// GET - Get latest location for a bus
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const busId = searchParams.get('bus_id');

    if (!busId) {
      return NextResponse.json({ error: 'bus_id مطلوب' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT * FROM bus_live_location WHERE bus_id = $1 ORDER BY recorded_at DESC LIMIT 1',
      [busId]
    );

    return NextResponse.json({ data: result.rows[0] || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Update bus location (from driver app)
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await req.json();
    const { bus_id, latitude, longitude, speed, heading } = body;

    if (!bus_id || !latitude || !longitude) {
      return NextResponse.json({ error: 'بيانات الموقع ناقصة' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO bus_live_location (bus_id, latitude, longitude, speed, heading, recorded_at) 
       VALUES ($1, $2, $3, $4, $5, NOW() RETURNING *`,
      [bus_id, latitude, longitude, speed || 0, heading || 0]
    );

    return NextResponse.json({ data: result.rows[0], success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
