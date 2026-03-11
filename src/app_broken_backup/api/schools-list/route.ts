import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json([]);
    let result;
    if (user.role === 'super_admin') {
      result = await pool.query('SELECT id, name, city FROM schools ORDER BY name ASC');
    } else if (user.role === 'owner') {
      result = await pool.query('SELECT id, name, city FROM schools WHERE owner_id::text = $1::text ORDER BY name ASC', [String(user.id)]);
    } else if (user.school_id) {
      result = await pool.query('SELECT id, name, city FROM schools WHERE id::text = $1::text', [String(user.school_id)]);
    } else {
      return NextResponse.json([]);
    }
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}
