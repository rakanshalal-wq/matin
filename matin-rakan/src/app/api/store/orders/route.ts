import { NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const offset = (page - 1) * limit;
    let where = "WHERE 1=1";
    const params: any[] = [];
    let idx = 1;
    if (user.role !== "super_admin") { where += ` AND o.owner_id = $${idx}`; params.push(user.id); idx++; }
    if (status) { where += ` AND o.status = $${idx}`; params.push(status); idx++; }
    const result = await pool.query(
      `SELECT o.* FROM store_orders o ${where} ORDER BY o.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );
    const count = await pool.query(`SELECT COUNT(*) FROM store_orders o ${where}`, params);
    return NextResponse.json({ orders: result.rows, total: parseInt(count.rows[0].count) });
  } catch (e) { return NextResponse.json({ error: "فشل" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_email, items, total, payment_method, address, notes, shipping_company, shipping_cost } = body;
    if (!customer_name || !items || !total) return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
    const orderNumber = "ORD-" + Date.now();
    const result = await pool.query(
      `INSERT INTO store_orders (order_number, customer_name, customer_phone, customer_email, items, total, payment_method, address, notes, shipping_company, shipping_cost, status, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending','unpaid') RETURNING *`,
      [orderNumber, customer_name, customer_phone, customer_email, JSON.stringify(items), total, payment_method, address, notes, shipping_company, shipping_cost || 0]
    );
    return NextResponse.json(result.rows[0]);
  } catch (e) { return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 }); }
}
