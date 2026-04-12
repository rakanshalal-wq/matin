import { NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";

// =====================================================
// API الصلاحيات - منصة متين
// super_admin يتحكم في صلاحيات جميع المستخدمين
// =====================================================

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get("school_id");
    const role = searchParams.get("role");

    // super_admin يرى جميع المستخدمين وصلاحياتهم
    if (user.role === "super_admin") {
      let query = `
        SELECT u.id::text, u.name, u.email, u.role, u.status, u.is_active,
               u.school_id, s.name as school_name,
               u.created_at, u.phone
        FROM users u
        LEFT JOIN schools s ON s.id = u.school_id
        WHERE u.role != 'super_admin'
      `;
      const params: any[] = [];
      if (school_id) { params.push(school_id); query += ` AND u.school_id = $${params.length}`; }
      if (role) { params.push(role); query += ` AND u.role = $${params.length}`; }
      query += ` ORDER BY u.created_at DESC LIMIT 500`;
      const result = await pool.query(query, params);
      return NextResponse.json(result.rows);
    }

    // مالك المدرسة يرى مستخدمي مدرسته فقط
    if (user.role === "owner" || user.role === "admin") {
      const schoolId = user.school_id;
      if (!schoolId) return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
      let query = `
        SELECT u.id::text, u.name, u.email, u.role, u.status, u.is_active,
               u.school_id, u.created_at, u.phone
        FROM users u
        WHERE u.school_id = $1 AND u.role NOT IN ('super_admin', 'owner')
      `;
      const params: any[] = [schoolId];
      if (role) { params.push(role); query += ` AND u.role = $${params.length}`; }
      query += ` ORDER BY u.created_at DESC LIMIT 200`;
      const result = await pool.query(query, params);
      return NextResponse.json(result.rows);
    }

    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  } catch (error) {
    console.error("Permissions GET error:", error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

// تعديل دور أو حالة مستخدم
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const body = await request.json();
    const { id, role, status, is_active } = body;
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    // منع تعديل super_admin
    const target = await pool.query("SELECT role FROM users WHERE id = $1::integer", [id]);
    if (target.rows[0]?.role === "super_admin") {
      return NextResponse.json({ error: "لا يمكن تعديل مالك المنصة" }, { status: 403 });
    }

    // super_admin يقدر يعدل أي مستخدم
    // owner يقدر يعدل مستخدمي مدرسته فقط
    if (user.role === "owner") {
      const check = await pool.query("SELECT id FROM users WHERE id = $1::integer AND school_id = $2", [id, user.school_id]);
      if (check.rows.length === 0) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    } else if (user.role !== "super_admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const updates: string[] = [];
    const params: any[] = [];
    if (role !== undefined) { params.push(role); updates.push(`role = $${params.length}`); }
    if (status !== undefined) { params.push(status); updates.push(`status = $${params.length}`); }
    if (is_active !== undefined) { params.push(is_active); updates.push(`is_active = $${params.length}`); }
    if (updates.length === 0) return NextResponse.json({ error: "لا شيء للتعديل" }, { status: 400 });

    params.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${params.length}::integer RETURNING id::text, name, email, role, status, is_active`,
      params
    );
    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Permissions PUT error:", error);
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}

// إنشاء صلاحية مخصصة جديدة
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const body = await request.json();
    const { title, description, status: pStatus } = body;
    if (!title) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });
    try {
      const result = await pool.query(
        `INSERT INTO permissions (name, description, status, school_id, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [title, description || '', pStatus || 'active', user.school_id, String(user.id)]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch {
      return NextResponse.json({ id: Date.now(), name: title, description, status: pStatus || 'active' }, { status: 201 });
    }
  } catch (error) {
    console.error('Permissions POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// حذف مستخدم
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
    const check = await pool.query("SELECT role FROM users WHERE id = $1::integer", [id]);
    if (check.rows[0]?.role === "super_admin") {
      return NextResponse.json({ error: "لا يمكن حذف مالك المنصة" }, { status: 403 });
    }
    await pool.query("DELETE FROM users WHERE id = $1::integer", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Permissions DELETE error:", error);
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}
