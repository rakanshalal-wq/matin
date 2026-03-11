import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';




// POST - Record student boarding
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await req.json();
    const { student_id, bus_id, trip_type, action } = body;

    if (!student_id || !bus_id) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    // Record the boarding event
    const result = await pool.query(
      `INSERT INTO bus_riders (bus_id, student_id, school_id, boarded_at, trip_type, status) 
       VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *`,
      [bus_id, student_id, user.school_id, trip_type || 'morning', action || 'boarded']
    );

    // Send notification to parent (if notification system is set up)
    try {
      const parentResult = await pool.query(
        `SELECT pcm.parent_id, u.name as parent_name, u.phone 
         FROM parent_child_mapping pcm 
         JOIN users u ON pcm.parent_id::text = u.id::text 
         WHERE pcm.child_id = $1`,
        [student_id]
      );
      
      if (parentResult.rows.length > 0) {
        const studentResult = await pool.query('SELECT name FROM users WHERE id::text = $1::text', [student_id]);
        const studentName = studentResult.rows[0]?.name || 'الطالب';
        
        for (const parent of parentResult.rows) {
          await pool.query(
            `INSERT INTO notifications (user_id, title, message, type, school_id, created_at) 
             VALUES ($1, $2, $3, 'transport', $4, NOW()`,
            [parent.parent_id, 'إشعار النقل', `${studentName} ${action === 'boarded' ? 'ركب الباص' : 'نزل من الباص'}`, String(user.school_id)]
          );
        }
      }
    } catch (notifError) {
      console.log('Could not send parent notification:', notifError);
    }

    return NextResponse.json({ data: result.rows[0], success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
