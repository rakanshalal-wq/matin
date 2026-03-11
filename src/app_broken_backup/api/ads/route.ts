import { NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";

// GET - عام بدون تسجيل دخول
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const schoolId = searchParams.get("school_id");
    
    let where = "WHERE is_active = true AND (start_date IS NULL OR start_date <= CURRENT_DATE) AND (end_date IS NULL OR end_date >= CURRENT_DATE)";
    const params: any[] = [];
    let idx = 1;

    if (schoolId) {
      where += ` AND (is_platform_ad = true OR school_id = $${idx})`;
      params.push(parseInt(schoolId));
      idx++;
    } else {
      where += " AND is_platform_ad = true";
    }

    if (position) {
      where += ` AND (position = $${idx} OR position = 'all')`;
      params.push(position);
      idx++;
    }

    const result = await pool.query(
      `SELECT * FROM ads ${where} ORDER BY priority ASC, created_at DESC LIMIT 10`,
      params
    );

    if (result.rows.length > 0) {
      const ids = result.rows.map((r: any) => r.id);
      await pool.query(`UPDATE ads SET views = views + 1 WHERE id = ANY($1)`, [ids]).catch(() => {});
    }

    return NextResponse.json(result.rows);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

// POST - يتطلب تسجيل دخول
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !["super_admin", "owner"].includes(user.role)) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const body = await request.json();
    const { title, description, image_url, click_url, position, target_type, start_date, end_date, priority } = body;
    if (!title) return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
    const is_platform_ad = user.role === "super_admin";
    const result = await pool.query(
      `INSERT INTO ads (title, description, image_url, click_url, is_platform_ad, position, target_type, start_date, end_date, priority, is_active, owner_id, school_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,$11,$12) RETURNING *`,
      [title, description, image_url, click_url, is_platform_ad, position || "top", target_type || "all", start_date, end_date, priority || 1, user.id, String(user.school_id)]
    );
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}

// PUT - تعديل إعلان
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !["super_admin", "owner"].includes(user.role)) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const body = await request.json();
    const { id, is_active, title, description } = body;
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
    const result = await pool.query(
      "UPDATE ads SET is_active = COALESCE($1, is_active), title = COALESCE($2, title), description = COALESCE($3, description) WHERE id::text = $4::text RETURNING *",
      [is_active !== undefined ? is_active : null, title || null, description || null, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}

// DELETE - حذف إعلان
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !["super_admin", "owner"].includes(user.role)) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
    await pool.query("DELETE FROM ads WHERE id::text = $1::text", [id]);
    return NextResponse.json({ message: "تم الحذف" });
  } catch (e) {
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}
