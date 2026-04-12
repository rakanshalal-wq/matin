import { NextResponse } from "next/server";
import { pool } from "@/lib/auth";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    if (!code) return NextResponse.json({ error: "الكود مطلوب" }, { status: 400 });
    const result = await pool.query(
      `SELECT s.id, s.name, s.code, s.institution_type, s.city, s.address, s.phone, s.email,
              s.website_url as website, s.description, s.logo, s.cover_image, s.template, s.status,
              s.license_number, s.founded_year,
              (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role = 'student')::int as students_count,
              (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role = 'teacher')::int as teachers_count,
              (SELECT COUNT(*) FROM classes WHERE school_id = s.id)::int as classes_count
       FROM schools s
       WHERE (s.code = $1 OR s.id IN (SELECT school_id FROM school_pages WHERE slug = $1))
             AND s.status IN ('ACTIVE', 'TRIAL')`,
      [code]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: "المؤسسة غير موجودة" }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}
