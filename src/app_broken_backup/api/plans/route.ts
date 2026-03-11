import { NextRequest, NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";

// GET - جلب الباقات (يرجع array مباشر)
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const school_id = searchParams.get("school_id");
    // لو طلب باقة مدرسة معينة
    if (school_id && user.role === "super_admin") {
      const result = await pool.query(
        `SELECT p.*, ss.school_id, ss.status as sub_status, ss.end_date
         FROM plans p
         LEFT JOIN subscriptions ss ON ss.plan_id::text = p.id::text AND ss.school_id::text = $1::text AND ss.status = "active"
         ORDER BY p.price_monthly ASC`,
        [school_id]
      );
      return NextResponse.json(result.rows);
    }
    const result = await pool.query("SELECT * FROM plans ORDER BY price_monthly ASC");
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - إنشاء باقة جديدة (super_admin فقط)
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    const body = await req.json();
    const { name, name_ar, price_monthly, price_yearly, max_students, max_teachers, features, is_active } = body;
    if (!name_ar) return NextResponse.json({ error: "اسم الباقة مطلوب" }, { status: 400 });
    const result = await pool.query(
      `INSERT INTO plans (name, name_ar, price_monthly, price_yearly, max_students, max_teachers, features, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() RETURNING *`,
      [name || name_ar, name_ar, price_monthly || 0, price_yearly || 0, max_students || 100, max_teachers || 10, JSON.stringify(features || []), is_active !== false]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - تعديل باقة أو تعيين باقة لمدرسة
export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    const body = await req.json();

    // تعيين باقة لمدرسة
    if (body.action === "assign_to_school") {
      const { plan_id, school_id, duration_months } = body;
      if (!plan_id || !school_id) return NextResponse.json({ error: "plan_id و school_id مطلوبان" }, { status: 400 });
      const months = parseInt(duration_months) || 12;
      // إلغاء الاشتراك القديم
      await pool.query(
        "UPDATE subscriptions SET status = \"expired\" WHERE school_id::text = $1::text AND status = \"active\"",
        [school_id]
      );
      // جلب بيانات الباقة
      const planRes = await pool.query("SELECT * FROM plans WHERE id::text = $1::text", [plan_id]);
      if (planRes.rows.length === 0) return NextResponse.json({ error: "الباقة غير موجودة" }, { status: 404 });
      const plan = planRes.rows[0];
      // جلب مالك المدرسة
      const schoolRes = await pool.query("SELECT owner_id FROM schools WHERE id::text = $1::text", [school_id]);
      const owner_id = schoolRes.rows[0]?.owner_id || null;
      // إنشاء اشتراك جديد
      const sub = await pool.query(
        `INSERT INTO subscriptions (plan, plan_id, amount, payment_method, payment_provider, status, school_id, owner_id, start_date, end_date, created_at)
         VALUES ($1, $2, $3, "manual", "admin", "active", $4, $5, NOW(), NOW() + ($6 || " months")::interval, NOW() RETURNING *`,
        [plan.name_ar || plan.name, plan_id, plan.price_monthly * months, school_id, owner_id, months]
      );
      // تحديث باقة المدرسة
      await pool.query(
        "UPDATE schools SET plan_id = $1, plan = $2 WHERE id::text = $3::text",
        [plan_id, plan.name_ar || plan.name, school_id]
      );
      return NextResponse.json({ success: true, subscription: sub.rows[0] });
    }

    // تعديل بيانات الباقة
    const { id, name, name_ar, price_monthly, price_yearly, max_students, max_teachers, features, is_active } = body;
    if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
    const result = await pool.query(
      `UPDATE plans SET name=$1, name_ar=$2, price_monthly=$3, price_yearly=$4, max_students=$5, max_teachers=$6, features=$7, is_active=$8
       WHERE id::text = $9::text RETURNING *`,
      [name, name_ar, price_monthly, price_yearly, max_students, max_teachers, JSON.stringify(features || []), is_active !== false, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - حذف باقة
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
    // تحقق لو في مدارس تستخدم هذه الباقة
    const check = await pool.query("SELECT COUNT(*) FROM subscriptions WHERE plan_id = $1 AND status = \"active\"", [id]);
    if (parseInt(check.rows[0].count) > 0) {
      return NextResponse.json({ error: "لا يمكن حذف باقة مستخدمة حالياً" }, { status: 400 });
    }
    await pool.query("DELETE FROM plans WHERE id::text = $1::text", [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
