import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { createZoomMeeting } from '@/lib/integrations-advanced';

// POST /api/lectures/[id]/start — بدء المحاضرة وإنشاء اجتماع Zoom
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    // التحقق من وجود المحاضرة
    const lecture = await pool.query('SELECT * FROM lectures WHERE id = $1', [id]);
    if (!lecture.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });

    const lec = lecture.rows[0];

    // إذا لم يكن لها zoom_meeting_id بعد، أنشئ اجتماعاً جديداً
    let zoom_meeting_id = lec.zoom_meeting_id;
    let zoom_url = lec.zoom_url;

    if (!zoom_meeting_id) {
      const zoomResult = await createZoomMeeting({
        title: lec.title,
        startTime: lec.scheduled_at ? new Date(lec.scheduled_at) : new Date(),
        duration: lec.duration_minutes || 60,
      });

      if (!zoomResult.error) {
        zoom_meeting_id = zoomResult.meeting_id;
        zoom_url = zoomResult.join_url;
      }
    }

    // تحديث حالة المحاضرة إلى live
    const result = await pool.query(
      `UPDATE lectures
       SET status = 'live', zoom_meeting_id = COALESCE($1, zoom_meeting_id), zoom_url = COALESCE($2, zoom_url)
       WHERE id = $3
       RETURNING *`,
      [zoom_meeting_id, zoom_url, id]
    );

    return NextResponse.json({ lecture: result.rows[0], zoom_url });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
