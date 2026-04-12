import { NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM shipping_companies WHERE is_active = true ORDER BY base_cost");
    return NextResponse.json(result.rows);
  } catch (e) { return NextResponse.json({ error: "فشل" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const body = await request.json();
    const result = await pool.query(
      "INSERT INTO shipping_companies (name, name_ar, api_key, is_active, base_cost, owner_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [body.name, body.name_ar, body.api_key, body.is_active ?? true, body.base_cost || 0, user.id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (e) { return NextResponse.json({ error: "فشل" }, { status: 500 }); }
}
