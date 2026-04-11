import { NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let where = "WHERE p.is_active = true";
    const params: any[] = [];
    let paramIdx = 1;

    // المتجر مركزي - يعرض منتجات المالك فقط (is_platform_product = true)
    // أو منتجات المدرسة إذا كان school_code محدد
    const schoolCode = searchParams.get("school_code");
    if (schoolCode) {
      where += ` AND (p.is_platform_product = true OR s.code = $${paramIdx})`;
      params.push(schoolCode);
      paramIdx++;
    } else {
      where += " AND p.is_platform_product = true";
    }

    if (category) { where += ` AND p.category = $${paramIdx}`; params.push(category); paramIdx++; }
    if (search) { where += ` AND p.name ILIKE $${paramIdx}`; params.push(`%${search}%`); paramIdx++; }

    const result = await pool.query(
      `SELECT p.*, sc.name as school_name
       FROM store_products p
       LEFT JOIN schools sc ON sc.id::text = p.school_id::text
       ${where}
       ORDER BY p.created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM store_products p LEFT JOIN schools sc ON sc.id::text = p.school_id::text ${where}`,
      params
    );

    return NextResponse.json({ products: result.rows, total: parseInt(countResult.rows[0].count), page, limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !["super_admin", "owner"].includes(user.role)) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, sale_price, image, images, category, stock, sku, weight, tags } = body;

    if (!name || !price) return NextResponse.json({ error: "الاسم والسعر مطلوبان" }, { status: 400 });

    const is_platform_product = user.role === "super_admin";

    const result = await pool.query(
      `INSERT INTO store_products (name, description, price, sale_price, image, images, category, stock, sku, weight, tags, is_platform_product, owner_id, school_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [name, description, price, sale_price, image, JSON.stringify(images || []), category, stock || 0, sku, weight, tags, is_platform_product, user.id, user.school_id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "فشل إضافة المنتج" }, { status: 500 });
  }
}
