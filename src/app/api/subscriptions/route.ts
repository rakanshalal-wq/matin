import { NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";
import { getPaymentCredentials } from "@/lib/integrations";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    // Super Admin يرى جميع الاشتراكات مع بيانات المدرسة والمالك
    if (user.role === "super_admin") {
      const result = await pool.query(
        `SELECT s.*, 
                sc.name as school_name, sc.name_ar as school_name_ar,
                u.name as owner_name, u.email as owner_email,
                p.name_ar as plan_name
         FROM subscriptions s
         LEFT JOIN schools sc ON sc.id = s.school_id
         LEFT JOIN users u ON u.id::text = s.owner_id::text
         LEFT JOIN plans p ON p.id = s.plan_id
         ORDER BY s.created_at DESC LIMIT 500`
      );
      return NextResponse.json(result.rows);
    }

    // مالك المدرسة يرى اشتراكات مدرسته فقط
    const result = await pool.query(
      `SELECT s.*, sc.name as school_name, p.name_ar as plan_name
       FROM subscriptions s
       LEFT JOIN schools sc ON sc.id = s.school_id
       LEFT JOIN plans p ON p.id = s.plan_id
       WHERE s.owner_id = $1::text
       ORDER BY s.created_at DESC LIMIT 200`,
      [String(user.id)]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Subscriptions GET error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const body = await request.json();
    const { plan, plan_id, amount, payment_method, school_id } = body;
    if (!plan || !amount) return NextResponse.json({ error: "الخطة والمبلغ مطلوبان" }, { status: 400 });
    const owner_id = user.id;
    let paymentProvider = null;
    let paymentCredentials = null;
    const moyasar = await getPaymentCredentials("moyasar", owner_id);
    const hyperpay = await getPaymentCredentials("hyperpay", owner_id);
    const tap = await getPaymentCredentials("tap", owner_id);
    if (moyasar) { paymentProvider = "moyasar"; paymentCredentials = moyasar; }
    else if (hyperpay) { paymentProvider = "hyperpay"; paymentCredentials = hyperpay; }
    else if (tap) { paymentProvider = "tap"; paymentCredentials = tap; }
    const result = await pool.query(
      `INSERT INTO subscriptions (plan, plan_id, amount, payment_method, payment_provider, status, school_id, owner_id, start_date, end_date, created_at)
       VALUES ($1,$2,$3,$4,$5,"pending",$6,$7,NOW(), NOW() + INTERVAL "1 year", NOW()) RETURNING *`,
      [plan, plan_id || null, amount, payment_method || "online", paymentProvider || "manual", school_id || user.school_id, String(owner_id)]
    );
    if (payment_method === "online" && paymentProvider && paymentCredentials) {
      return NextResponse.json({
        ...result.rows[0],
        payment: { provider: paymentProvider, publishable_key: paymentCredentials.api_key, amount, currency: "SAR" }
      }, { status: 201 });
    }
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Subscriptions POST error:", error);
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const body = await request.json();
    const { id, status, plan, amount, end_date } = body;
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
    // super_admin يقدر يعدل أي اشتراك
    if (user.role !== "super_admin") {
      const check = await pool.query("SELECT id FROM subscriptions WHERE id = $1 AND owner_id = $2::text", [id, String(user.id)]);
      if (check.rows.length === 0) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const updates: string[] = [];
    const params: any[] = [];
    if (status !== undefined) { params.push(status); updates.push(`status = $${params.length}`); }
    if (plan !== undefined) { params.push(plan); updates.push(`plan = $${params.length}`); }
    if (amount !== undefined) { params.push(amount); updates.push(`amount = $${params.length}`); }
    if (end_date !== undefined) { params.push(end_date); updates.push(`end_date = $${params.length}`); }
    if (updates.length === 0) return NextResponse.json({ error: "لا شيء للتعديل" }, { status: 400 });
    params.push(id);
    const result = await pool.query(
      `UPDATE subscriptions SET ${updates.join(", ")} WHERE id = $${params.length} RETURNING *`,
      params
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Subscriptions PUT error:", error);
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
    await pool.query("DELETE FROM subscriptions WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscriptions DELETE error:", error);
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}
