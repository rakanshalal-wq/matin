import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

// GET /api/academic-structure?type=stages|grades|tracks|subjects|catalog|periods
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const stage_id = searchParams.get('stage_id');
    const track_id = searchParams.get('track_id');

    const filter = getFilterSQL(user);

    if (type === 'stages' || type === 'all') {
      const stages = await pool.query(
        `SELECT * FROM academic_stages WHERE is_active=true ORDER BY order_num`
      );
      if (type === 'stages') return NextResponse.json(stages.rows);

      const grades = await pool.query(
        `SELECT ag.*, ast.name_ar as stage_name 
         FROM academic_grades ag 
         JOIN academic_stages ast ON ast.id = ag.stage_id
         WHERE ag.is_active=true ORDER BY ag.order_num`
      );

      const tracks = await pool.query(
        `SELECT * FROM academic_tracks WHERE is_active=true ORDER BY id`
      );

      let catalogQuery = `
        SELECT sc.*, ast.name_ar as stage_name, at.name_ar as track_name
        FROM subject_catalog sc
        LEFT JOIN academic_stages ast ON ast.id = sc.stage_id
        LEFT JOIN academic_tracks at ON at.id = sc.track_id
        WHERE sc.is_active=true
      `;
      const catalogParams: any[] = [];
      if (stage_id) { catalogParams.push(stage_id); catalogQuery += ` AND sc.stage_id=$${catalogParams.length}`; }
      if (track_id) { catalogParams.push(track_id); catalogQuery += ` AND sc.track_id=$${catalogParams.length}`; }
      catalogQuery += ' ORDER BY sc.stage_id, sc.track_id, sc.name_ar';
      const catalog = await pool.query(catalogQuery, catalogParams);

      return NextResponse.json({
        stages: stages.rows,
        grades: grades.rows,
        tracks: tracks.rows,
        catalog: catalog.rows,
      });
    }

    if (type === 'grades') {
      let q = `SELECT ag.*, ast.name_ar as stage_name FROM academic_grades ag JOIN academic_stages ast ON ast.id=ag.stage_id WHERE ag.is_active=true`;
      const params: any[] = [];
      if (stage_id) { params.push(stage_id); q += ` AND ag.stage_id=$${params.length}`; }
      q += ' ORDER BY ag.order_num';
      const result = await pool.query(q, params);
      return NextResponse.json(result.rows);
    }

    if (type === 'tracks') {
      const result = await pool.query(`SELECT * FROM academic_tracks WHERE is_active=true ORDER BY id`);
      return NextResponse.json(result.rows);
    }

    if (type === 'catalog') {
      let q = `
        SELECT sc.*, ast.name_ar as stage_name, at.name_ar as track_name
        FROM subject_catalog sc
        LEFT JOIN academic_stages ast ON ast.id=sc.stage_id
        LEFT JOIN academic_tracks at ON at.id=sc.track_id
        WHERE sc.is_active=true
      `;
      const params: any[] = [];
      if (stage_id) { params.push(stage_id); q += ` AND sc.stage_id=$${params.length}`; }
      if (track_id) { params.push(track_id); q += ` AND sc.track_id=$${params.length}`; }
      q += ' ORDER BY sc.stage_id, sc.track_id, sc.name_ar';
      const result = await pool.query(q, params);
      return NextResponse.json(result.rows);
    }

    if (type === 'periods') {
      const ids = getInsertIds(user);
      const result = await pool.query(
        `SELECT * FROM school_periods WHERE school_id=$1 ORDER BY period_num`,
        [ids.school_id]
      );
      // إذا لم تكن هناك أوقات محفوظة، أرجع الأوقات الافتراضية
      if (result.rows.length === 0) {
        return NextResponse.json(getDefaultPeriods());
      }
      return NextResponse.json(result.rows);
    }

    return NextResponse.json({ error: 'نوع غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('academic-structure GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/academic-structure — إضافة مادة أو فصل أو تعديل أوقات
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body;
    const ids = getInsertIds(user);

    // إضافة مادة جديدة للكتالوج
    if (action === 'add_subject_catalog') {
      const { name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core } = body;
      if (!name_ar) return NextResponse.json({ error: 'اسم المادة مطلوب' }, { status: 400 });
      const result = await pool.query(
        `INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [name_ar, name_en || null, code || null, stage_id || null, track_id || null,
         weekly_hours || 2, is_core !== false]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // تعديل مادة في الكتالوج
    if (action === 'update_subject_catalog') {
      const { id, name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core } = body;
      if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
      const result = await pool.query(
        `UPDATE subject_catalog SET name_ar=$1, name_en=$2, code=$3, stage_id=$4, track_id=$5,
         weekly_hours=$6, is_core=$7 WHERE id=$8 RETURNING *`,
        [name_ar, name_en || null, code || null, stage_id || null, track_id || null,
         weekly_hours || 2, is_core !== false, id]
      );
      return NextResponse.json(result.rows[0]);
    }

    // حذف مادة من الكتالوج (soft delete)
    if (action === 'delete_subject_catalog') {
      const { id } = body;
      await pool.query(`UPDATE subject_catalog SET is_active=false WHERE id=$1`, [id]);
      return NextResponse.json({ success: true });
    }

    // حفظ أوقات الحصص للمدرسة
    if (action === 'save_periods') {
      const { periods } = body;
      if (!Array.isArray(periods)) return NextResponse.json({ error: 'البيانات غير صحيحة' }, { status: 400 });
      // حذف القديمة وإدراج الجديدة
      await pool.query(`DELETE FROM school_periods WHERE school_id=$1`, [ids.school_id]);
      for (const p of periods) {
        await pool.query(
          `INSERT INTO school_periods (school_id, owner_id, period_num, name_ar, start_time, end_time, is_break)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [ids.school_id, ids.owner_id, p.period_num, p.name_ar, p.start_time, p.end_time, p.is_break || false]
        );
      }
      return NextResponse.json({ success: true, count: periods.length });
    }

    // إضافة مرحلة جديدة
    if (action === 'add_stage') {
      const { name_ar, name_en, order_num, years_count, description } = body;
      if (!name_ar) return NextResponse.json({ error: 'اسم المرحلة مطلوب' }, { status: 400 });
      const result = await pool.query(
        `INSERT INTO academic_stages (name_ar, name_en, order_num, years_count, description)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [name_ar, name_en || null, order_num || 99, years_count || 1, description || null]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // إضافة صف دراسي
    if (action === 'add_grade') {
      const { stage_id, name_ar, name_en, grade_num, order_num } = body;
      if (!stage_id || !name_ar) return NextResponse.json({ error: 'المرحلة والاسم مطلوبان' }, { status: 400 });
      const result = await pool.query(
        `INSERT INTO academic_grades (stage_id, name_ar, name_en, grade_num, order_num)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [stage_id, name_ar, name_en || null, grade_num || 99, order_num || 99]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // إضافة مسار
    if (action === 'add_track') {
      const { name_ar, name_en, applies_to, description } = body;
      if (!name_ar) return NextResponse.json({ error: 'اسم المسار مطلوب' }, { status: 400 });
      const result = await pool.query(
        `INSERT INTO academic_tracks (name_ar, name_en, applies_to, description)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [name_ar, name_en || null, applies_to || 'الثانوية', description || null]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('academic-structure POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/academic-structure — تعديل مرحلة أو صف أو مسار
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { action, id } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    if (action === 'update_stage') {
      const { name_ar, name_en, order_num, years_count, description, is_active } = body;
      const result = await pool.query(
        `UPDATE academic_stages SET name_ar=$1, name_en=$2, order_num=$3, years_count=$4,
         description=$5, is_active=$6 WHERE id=$7 RETURNING *`,
        [name_ar, name_en || null, order_num, years_count, description || null, is_active !== false, id]
      );
      return NextResponse.json(result.rows[0]);
    }

    if (action === 'update_grade') {
      const { name_ar, name_en, grade_num, order_num, is_active } = body;
      const result = await pool.query(
        `UPDATE academic_grades SET name_ar=$1, name_en=$2, grade_num=$3, order_num=$4,
         is_active=$5 WHERE id=$6 RETURNING *`,
        [name_ar, name_en || null, grade_num, order_num, is_active !== false, id]
      );
      return NextResponse.json(result.rows[0]);
    }

    if (action === 'update_track') {
      const { name_ar, name_en, applies_to, description, is_active } = body;
      const result = await pool.query(
        `UPDATE academic_tracks SET name_ar=$1, name_en=$2, applies_to=$3,
         description=$4, is_active=$5 WHERE id=$6 RETURNING *`,
        [name_ar, name_en || null, applies_to, description || null, is_active !== false, id]
      );
      return NextResponse.json(result.rows[0]);
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('academic-structure PUT error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/academic-structure?type=stage|grade|track&id=X
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const tableMap: Record<string, string> = {
      stage: 'academic_stages',
      grade: 'academic_grades',
      track: 'academic_tracks',
      catalog: 'subject_catalog',
    };

    const table = tableMap[type || ''];
    if (!table) return NextResponse.json({ error: 'نوع غير معروف' }, { status: 400 });

    // soft delete
    await pool.query(`UPDATE ${table} SET is_active=false WHERE id=$1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('academic-structure DELETE error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────
// الأوقات الافتراضية للحصص
// ─────────────────────────────────────────────────────────────────
function getDefaultPeriods() {
  return [
    { period_num: 1,  name_ar: 'الحصة الأولى',   start_time: '07:30', end_time: '08:15', is_break: false },
    { period_num: 2,  name_ar: 'الحصة الثانية',  start_time: '08:15', end_time: '09:00', is_break: false },
    { period_num: 3,  name_ar: 'الحصة الثالثة',  start_time: '09:00', end_time: '09:45', is_break: false },
    { period_num: 4,  name_ar: 'استراحة',         start_time: '09:45', end_time: '10:00', is_break: true  },
    { period_num: 5,  name_ar: 'الحصة الرابعة',  start_time: '10:00', end_time: '10:45', is_break: false },
    { period_num: 6,  name_ar: 'الحصة الخامسة',  start_time: '10:45', end_time: '11:30', is_break: false },
    { period_num: 7,  name_ar: 'استراحة',         start_time: '11:30', end_time: '11:45', is_break: true  },
    { period_num: 8,  name_ar: 'الحصة السادسة',  start_time: '11:45', end_time: '12:30', is_break: false },
    { period_num: 9,  name_ar: 'الحصة السابعة',  start_time: '12:30', end_time: '13:15', is_break: false },
    { period_num: 10, name_ar: 'الحصة الثامنة',  start_time: '13:15', end_time: '14:00', is_break: false },
  ];
}
