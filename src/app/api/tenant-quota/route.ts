import { NextResponse } from 'next/server';
import { getUserFromRequest, pool } from '@/lib/auth';

/**
 * GET /api/tenant-quota
 * يُرجع بيانات الاستهلاك الحالي للمؤسسة مقارنة بحدود الباقة.
 * يستخدمه Dashboard لعرض أشرطة التقدم.
 */
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    // تحديد school_id
    let schoolId: string | null = null;
    if (user.role === 'owner') {
      const s = await pool.query('SELECT id FROM schools WHERE owner_id = $1 LIMIT 1', [String(user.id)]);
      schoolId = s.rows[0]?.id ? String(s.rows[0].id) : null;
    } else if (user.school_id) {
      schoolId = String(user.school_id);
    }

    if (!schoolId) {
      return NextResponse.json({
        current_students: 0,
        max_students: 100,
        current_storage_bytes: 0,
        max_storage_bytes: 2 * 1024 * 1024 * 1024,
        plan_name: 'مجانية',
        usage_percent_students: 0,
        usage_percent_storage: 0,
      });
    }

    const result = await pool.query(
      `SELECT
         tq.current_students,
         tq.current_storage_bytes,
         sp.max_students,
         sp.max_storage_gb,
         sp.name   AS plan_name,
         sub.end_date
       FROM tenants t
       JOIN tenant_quotas tq   ON tq.tenant_id = t.id
       JOIN schools sc         ON sc.id = t.school_id
       LEFT JOIN subscriptions sub
         ON sub.school_id = sc.id AND sub.status = 'active'
       LEFT JOIN subscription_plans sp ON sp.id = sub.plan_id
       WHERE t.school_id = $1
       ORDER BY sub.created_at DESC NULLS LAST
       LIMIT 1`,
      [schoolId]
    );

    if (!result.rows[0]) {
      // بيانات افتراضية إذا لم يُنشأ tenant بعد
      return NextResponse.json({
        current_students: 0,
        max_students: 100,
        current_storage_bytes: 0,
        max_storage_bytes: 2 * 1024 * 1024 * 1024,
        plan_name: 'مجانية',
        usage_percent_students: 0,
        usage_percent_storage: 0,
      });
    }

    const row = result.rows[0];
    const currentStudents = parseInt(row.current_students, 10);
    const maxStudents = parseInt(row.max_students, 10) || 100;
    const currentStorageBytes = parseInt(row.current_storage_bytes, 10);
    const maxStorageBytes = (parseInt(row.max_storage_gb, 10) || 2) * 1024 * 1024 * 1024;

    return NextResponse.json({
      current_students: currentStudents,
      max_students: maxStudents,
      current_storage_bytes: currentStorageBytes,
      max_storage_bytes: maxStorageBytes,
      plan_name: row.plan_name || 'مجانية',
      end_date: row.end_date,
      usage_percent_students: Math.round((currentStudents / maxStudents) * 100),
      usage_percent_storage: Math.round((currentStorageBytes / maxStorageBytes) * 100),
    });
  } catch (error) {
    console.error('tenant-quota GET error:', error);
    return NextResponse.json({ error: 'فشل جلب بيانات الحصة' }, { status: 500 });
  }
}
