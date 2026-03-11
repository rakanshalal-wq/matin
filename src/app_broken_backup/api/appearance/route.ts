import { NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const result = await pool.query(
      "SELECT * FROM school_appearance WHERE school_id::text = $1::text",
      [user.school_id]
    );
    return NextResponse.json(result.rows[0] || {});
  } catch (e) { return NextResponse.json({ error: "فشل" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !["super_admin", "owner"].includes(user.role)) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const body = await request.json();
    const { primary_color, secondary_color, background_color, logo_url, hero_image_url, school_name, school_slogan, template, font, show_ads, show_store_button } = body;
    
    await pool.query(
      `INSERT INTO school_appearance (school_id, primary_color, secondary_color, background_color, logo_url, hero_image_url, school_name, school_slogan, template, font, show_ads, show_store_button, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW()
       ON CONFLICT (school_id) DO UPDATE SET
         primary_color=$2, secondary_color=$3, background_color=$4, logo_url=$5, hero_image_url=$6,
         school_name=$7, school_slogan=$8, template=$9, font=$10, show_ads=$11, show_store_button=$12, updated_at=NOW()`,
      [String(user.school_id), primary_color, secondary_color, background_color, logo_url, hero_image_url, school_name, school_slogan, template, font, show_ads, show_store_button]
    );
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 }); }
}
