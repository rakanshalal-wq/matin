import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const bus_id = searchParams.get('bus_id');
    const filter = getFilterSQL(user);

    // جلب الباصات
    if (type === 'buses') {
      const result = await pool.query(`
        SELECT b.*, (SELECT COUNT(*) FROM bus_riders WHERE bus_id = b.id AND status = 'active') as rider_count
        FROM buses b WHERE 1=1 ${filter.sql} ORDER BY b.created_at DESC LIMIT 200
      `, filter.params);
      return NextResponse.json(result.rows);
    }

    // ركاب باص محدد
    if (type === 'riders' && bus_id) {
      const result = await pool.query(`
        SELECT br.*, u.name as student_name, s.student_id as student_number
        FROM bus_riders br
        LEFT JOIN students s ON s.id = br.student_id
        LEFT JOIN users u ON u.id::text = s.user_id
        WHERE br.bus_id = $1 AND br.status = 'active'
        ORDER BY br.stop_order
      `, [bus_id]);
      return NextResponse.json(result.rows);
    }

    // رحلات اليوم
    if (type === 'trips') {
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
      const result = await pool.query(`
        SELECT bt.*, b.bus_number, b.driver_name, b.driver_phone, b.route_name,
          (SELECT COUNT(*) FROM bus_events WHERE trip_id = bt.id AND event_type = 'board') as boarded_count
        FROM bus_trips bt
        JOIN buses b ON b.id = bt.bus_id
        WHERE bt.date = $1 ${filter.sql}
        ORDER BY bt.started_at DESC
      `, [date, ...filter.params]);
      return NextResponse.json(result.rows);
    }

    // أحداث رحلة (ركوب/نزول)
    if (type === 'events') {
      const trip_id = searchParams.get('trip_id');
      const result = await pool.query(`
        SELECT be.*, u.name as student_name
        FROM bus_events be
        LEFT JOIN students s ON s.id = be.student_id
        LEFT JOIN users u ON u.id::text = s.user_id
        WHERE be.trip_id = $1 ORDER BY be.timestamp
      `, [trip_id]);
      return NextResponse.json(result.rows);
    }

    // موقع GPS للباص
    if (type === 'gps' && bus_id) {
      const result = await pool.query(`SELECT gps_lat, gps_lng, last_gps_update FROM buses WHERE id = $1`, [bus_id]);
      return NextResponse.json(result.rows[0] || {});
    }

    return NextResponse.json({ error: 'type مطلوب' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { action } = body;
    const ids = getInsertIds(user);

    // === إضافة باص ===
    if (action === 'add_bus') {
      const { bus_number, plate_number, capacity, driver_name, driver_phone, route_name } = body;
      if (!bus_number) return NextResponse.json({ error: 'رقم الباص مطلوب' }, { status: 400 });
      const id = crypto.randomUUID();
      const result = await pool.query(
        `INSERT INTO buses (id,bus_number,plate_number,capacity,driver_name,driver_phone,route_name,school_id,owner_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [id, bus_number, plate_number||null, capacity||40, driver_name||null, driver_phone||null, route_name||null, ids.school_id, ids.owner_id]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // === تسجيل طالب بالباص ===
    if (action === 'add_rider') {
      const { bus_id, student_id, pickup_address, stop_order } = body;
      if (!bus_id || !student_id) return NextResponse.json({ error: 'الباص والطالب مطلوبين' }, { status: 400 });
      const id = crypto.randomUUID();
      const result = await pool.query(
        `INSERT INTO bus_riders (id,bus_id,student_id,pickup_address,stop_order,school_id,owner_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [id, bus_id, student_id, pickup_address||null, stop_order||0, ids.school_id, ids.owner_id]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // === بدء رحلة ===
    if (action === 'start_trip') {
      const { bus_id, trip_type } = body;
      if (!bus_id) return NextResponse.json({ error: 'الباص مطلوب' }, { status: 400 });
      const id = crypto.randomUUID();
      const result = await pool.query(
        `INSERT INTO bus_trips (id,bus_id,trip_type,started_at,status,school_id,owner_id)
         VALUES ($1,$2,$3,NOW(),'active',$4,$5) RETURNING *`,
        [id, bus_id, trip_type||'morning', ids.school_id, ids.owner_id]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // === إنهاء رحلة ===
    if (action === 'end_trip') {
      const { trip_id } = body;
      await pool.query(`UPDATE bus_trips SET status='completed', ended_at=NOW() WHERE id=$1`, [trip_id]);
      return NextResponse.json({ message: 'تم إنهاء الرحلة' });
    }

    // === تسجيل ركوب/نزول طالب ===
    if (action === 'student_event') {
      const { trip_id, student_id, event_type, gps_lat, gps_lng } = body;
      if (!trip_id || !student_id || !event_type) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });

      const id = crypto.randomUUID();
      await pool.query(
        `INSERT INTO bus_events (id,trip_id,student_id,event_type,gps_lat,gps_lng)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [id, trip_id, student_id, event_type, gps_lat||null, gps_lng||null]
      );

      // إشعار ولي الأمر
      const studentInfo = await pool.query(`
        SELECT s.parent_id, u.name as student_name FROM students s
        LEFT JOIN users u ON u.id::text = s.user_id WHERE s.id = $1
      `, [student_id]);

      if (studentInfo.rows[0]?.parent_id) {
        const sName = studentInfo.rows[0].student_name || 'ابنك';
        const eventMsg = event_type === 'board' ? `${sName} ركب الباص` : `${sName} وصل ونزل من الباص`;
        const nId = crypto.randomUUID();
        await pool.query(
          `INSERT INTO notifications (id,title,message,type,user_id,channel,priority,school_id,owner_id,created_at)
           VALUES ($1,$2,$3,'INFO'::\"NotificationType\",$4,'system','high',$5,$6,NOW())`,
          [nId, 'النقل المدرسي', eventMsg, studentInfo.rows[0].parent_id, ids.school_id, ids.owner_id]
        );
        await pool.query(`UPDATE bus_events SET notified_parent = true WHERE id = $1`, [id]);
      }

      return NextResponse.json({ success: true, message: event_type === 'board' ? 'تم تسجيل الركوب' : 'تم تسجيل النزول' });
    }

    // === تحديث GPS ===
    if (action === 'update_gps') {
      const { bus_id, lat, lng } = body;
      await pool.query(`UPDATE buses SET gps_lat=$1, gps_lng=$2, last_gps_update=NOW() WHERE id=$3`, [lat, lng, bus_id]);
      return NextResponse.json({ updated: true });
    }

    // === صيانة ===
    if (action === 'maintenance') {
      const { bus_id, next_date } = body;
      await pool.query(`UPDATE buses SET last_maintenance=NOW(), next_maintenance=$1, status='maintenance' WHERE id=$2`, [next_date||null, bus_id]);
      return NextResponse.json({ message: 'تم تسجيل الصيانة' });
    }

    return NextResponse.json({ error: 'action مطلوب' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    if (type === 'rider') await pool.query('DELETE FROM bus_riders WHERE id=$1', [id]);
    else { await pool.query('DELETE FROM bus_riders WHERE bus_id=$1', [id]); await pool.query('DELETE FROM buses WHERE id=$1', [id]); }
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, type, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    if (type === 'bus') {
      const { bus_number, plate_number, capacity, driver_name, driver_phone, route_name, status } = rest;
      const result = await pool.query(
        `UPDATE buses SET bus_number=COALESCE($1,bus_number), plate_number=COALESCE($2,plate_number), capacity=COALESCE($3,capacity), driver_name=COALESCE($4,driver_name), driver_phone=COALESCE($5,driver_phone), route_name=COALESCE($6,route_name), status=COALESCE($7,status) WHERE id=$8 RETURNING *`,
        [bus_number, plate_number, capacity, driver_name, driver_phone, route_name, status, id]
      );
      if (result.rows.length === 0) return NextResponse.json({ error: 'الحافلة غير موجودة' }, { status: 404 });
      return NextResponse.json({ data: result.rows[0] });
    }
    if (type === 'rider') {
      const { pickup_address, stop_order, status } = rest;
      const result = await pool.query(
        `UPDATE bus_riders SET pickup_address=COALESCE($1,pickup_address), stop_order=COALESCE($2,stop_order), status=COALESCE($3,status) WHERE id=$4 RETURNING *`,
        [pickup_address, stop_order, status, id]
      );
      if (result.rows.length === 0) return NextResponse.json({ error: 'الراكب غير موجود' }, { status: 404 });
      return NextResponse.json({ data: result.rows[0] });
    }
    return NextResponse.json({ error: 'نوع غير معروف، استخدم: bus أو rider' }, { status: 400 });
  } catch (error) {
    console.error('PUT transport error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث بيانات النقل' }, { status: 500 });
  }
}

