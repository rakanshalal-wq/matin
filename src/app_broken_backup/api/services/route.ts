import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || (user.role === 'super_admin' ? 'platform' : 'all');
    const school_id = searchParams.get('school_id') || user.school_id;

    if (user.role === 'super_admin' && type === 'platform') {
      const result = await pool.query(`
        SELECT ps.*, COUNT(DISTINCT ist.school_id) FILTER (WHERE ist.is_enabled = true) as enabled_count
        FROM platform_services ps
        LEFT JOIN institution_services ist ON ist.service_key::text = ps.key::text
        WHERE ps.is_active = true GROUP BY ps.id ORDER BY ps.sort_order
      `);
      return NextResponse.json(result.rows);
    }

    if (user.role === 'super_admin' && type === 'school' && school_id) {
      const result = await pool.query(`
        SELECT ps.id, ps.key, ps.name_ar, ps.name_en, ps.category, ps.icon,
          ps.is_core, ps.requires_plan, ps.description,
          COALESCE(ist.is_enabled, false) as is_enabled,
          ist.enabled_at, ist.disabled_at, ist.notes, ist.config, ist.enabled_by, ist.disabled_by
        FROM platform_services ps
        LEFT JOIN institution_services ist ON ist.service_key::text = ps.key::text AND ist.school_id::text = $1::text
        WHERE ps.is_active = true ORDER BY ps.sort_order
      `, [school_id]);
      return NextResponse.json(result.rows);
    }

    if (['owner', 'admin'].includes(user.role)) {
      const result = await pool.query(`
        SELECT ps.key, ps.name_ar, ps.name_en, ps.category, ps.icon, ps.description,
          COALESCE(ist.is_enabled, false) as is_enabled, ist.config
        FROM platform_services ps
        LEFT JOIN institution_services ist ON ist.service_key::text = ps.key::text AND ist.school_id::text = $1::text
        WHERE ps.is_active = true ORDER BY ps.sort_order
      `, [user.school_id]);
      return NextResponse.json(result.rows);
    }

    if (type === 'check') {
      const key = searchParams.get('key');
      if (!key) return NextResponse.json({ enabled: false });
      const sid = school_id || user.school_id;
      const result = await pool.query(
        'SELECT is_enabled FROM institution_services WHERE school_id::text = $1::text AND service_key = $2',
        [sid, key]
      );
      return NextResponse.json({ enabled: result.rows[0]?.is_enabled ?? false });
    }

    if (user.role === 'super_admin' && type === 'schools') {
      const result = await pool.query('SELECT id, name_ar, name_en, plan, subscription_status FROM schools ORDER BY name_ar');
      return NextResponse.json(result.rows);
    }

    return NextResponse.json({ error: 'نوع غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }

    const body = await request.json();
    const { service_key, school_id, is_enabled, notes, config } = body;
    if (!service_key) return NextResponse.json({ error: 'مفتاح الخدمة مطلوب' }, { status: 400 });

    const target_school = user.role === 'super_admin' ? school_id : user.school_id;
    if (!target_school) return NextResponse.json({ error: 'معرف المؤسسة مطلوب' }, { status: 400 });

    const svcCheck = await pool.query('SELECT * FROM platform_services WHERE key = $1 AND is_active = true', [service_key]);
    if (!svcCheck.rows[0]) return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });

    if (user.role === 'owner' && is_enabled) {
      const school = await pool.query('SELECT plan FROM schools WHERE id::text = $1::text', [target_school]);
      const schoolPlan = school.rows[0]?.plan || 'basic';
      const planOrder: Record<string, number> = { basic: 1, professional: 2, enterprise: 3 };
      const requiredPlan = svcCheck.rows[0].requires_plan || 'basic';
      if ((planOrder[requiredPlan] || 1) > (planOrder[schoolPlan] || 1) ) {
        return NextResponse.json({
          error: `هذه الخدمة تتطلب باقة "${requiredPlan}". باقتك الحالية: "${schoolPlan}"`,
          upgrade_required: true, required_plan: requiredPlan
        }, { status: 403 });
      }
    }

    const oldState = await pool.query(
      'SELECT * FROM institution_services WHERE school_id::text = $1::text AND service_key = $2',
      [target_school, service_key]
    );

    const result = await pool.query(`
      INSERT INTO institution_services (school_id, service_key, is_enabled, enabled_by, enabled_at, disabled_at, disabled_by, notes, config)
      VALUES ($1, $2, $3, $4,
        CASE WHEN $3 THEN NOW() ELSE NULL END,
        CASE WHEN NOT $3 THEN NOW() ELSE NULL END,
        CASE WHEN NOT $3 THEN $4 ELSE NULL END,
        $5, $6)
      ON CONFLICT (school_id, service_key) DO UPDATE SET
        is_enabled = EXCLUDED.is_enabled,
        enabled_by = CASE WHEN EXCLUDED.is_enabled THEN $4 ELSE institution_services.enabled_by END,
        enabled_at = CASE WHEN EXCLUDED.is_enabled THEN NOW() ELSE institution_services.enabled_at END,
        disabled_by = CASE WHEN NOT EXCLUDED.is_enabled THEN $4 ELSE NULL END,
        disabled_at = CASE WHEN NOT EXCLUDED.is_enabled THEN NOW() ELSE NULL END,
        notes = COALESCE($5, institution_services.notes),
        config = COALESCE($6, institution_services.config),
        updated_at = NOW()
      RETURNING *
    `, [target_school, service_key, is_enabled, user.id, notes || null, config ? JSON.stringify(config) : null]);

    await pool.query(`
      INSERT INTO service_audit_log (school_id, service_key, action, changed_by, changed_by_role, old_value, new_value, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      target_school, service_key,
      is_enabled ? 'enable' : 'disable',
      user.id, user.role,
      oldState.rows[0] ? JSON.stringify(oldState.rows[0]) : null,
      JSON.stringify(result.rows[0]),
      notes || null
    ]);

    return NextResponse.json({
      success: true,
      message: is_enabled ? `✅ تم تفعيل "${svcCheck.rows[0].name_ar}"` : `⛔ تم تعطيل "${svcCheck.rows[0].name_ar}"`,
      service: result.rows[0]
    });
  } catch (error: any) {
    console.error('Services POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'مالك المنصة فقط' }, { status: 403 });
    }
    const body = await request.json();
    const { school_id, services } = body;
    if (!school_id || !Array.isArray(services) ) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }
    for (const svc of services) {
      await pool.query(`
        INSERT INTO institution_services (school_id, service_key, is_enabled, enabled_by, enabled_at)
        VALUES ($1, $2, $3, $4, NOW()
        ON CONFLICT (school_id, service_key) DO UPDATE SET
          is_enabled = EXCLUDED.is_enabled, enabled_by = $4,
          enabled_at = CASE WHEN EXCLUDED.is_enabled THEN NOW() ELSE institution_services.enabled_at END,
          disabled_at = CASE WHEN NOT EXCLUDED.is_enabled THEN NOW() ELSE NULL END,
          updated_at = NOW()
      `, [school_id, svc.key, svc.enabled, String(user.id)]);
    }
    await pool.query(
      `INSERT INTO service_audit_log (school_id, action, changed_by, changed_by_role, new_value)
       VALUES ($1, 'bulk_update', $2, $3, $4)`,
      [school_id, user.id, user.role, JSON.stringify(services)]
    );
    return NextResponse.json({ success: true, message: `✅ تم تحديث ${services.length} خدمة` });
  } catch (error: any) {
    console.error('Services PUT error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
