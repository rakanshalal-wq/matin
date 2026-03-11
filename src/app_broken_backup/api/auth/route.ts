import { NextResponse } from 'next/server';
import { pool, generateToken, getUserFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { sendOTP } from '@/lib/integrations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, school_name, city, package_type, national_id } = body;

    if (action === 'send_otp') {
      if (!email) return NextResponse.json({ error: 'الإيميل مطلوب' }, { status: 400 });
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) return NextResponse.json({ error: 'الإيميل غير مسجل' }, { status: 401 });
      const u = user.rows[0];
      if (!password) return NextResponse.json({ error: 'الباسورد مطلوب' }, { status: 400 });
      let validPassword = false;
      if (u.password.startsWith('$2')) {
        validPassword = await bcrypt.compare(password, u.password);
      } else {
        validPassword = (password === u.password);
        if (validPassword) {
          const hashed = await bcrypt.hash(password, 10);
          await pool.query('UPDATE users SET password = $1 WHERE id::text = $2::text', [hashed, u.id]);
        }
      }
      if (!validPassword) return NextResponse.json({ error: 'الباسورد غلط' }, { status: 401 });
      if (u.status === 'pending') return NextResponse.json({ error: 'حسابك قيد المراجعة' }, { status: 403 });
      if (u.status === 'rejected') return NextResponse.json({ error: 'تم رفض طلبك' }, { status: 403 });
      if (u.status === 'suspended') return NextResponse.json({ error: 'حسابك موقوف' }, { status: 403 });
      // super_admin: تسجيل دخول مباشر بدون OTP
      if (u.role === 'super_admin') {
        const token = generateToken(u);
        const response = NextResponse.json({
          success: true, token, directLogin: true,
          user: { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, school_id: u.school_id, owner_id: u.owner_id, package: u.package, status: u.status, dashboardPath: '/owner' }
        });
        response.cookies.set('matin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
        return response;
      }
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000);
      await pool.query('DELETE FROM email_otps WHERE email = $1', [email]);
      await pool.query('INSERT INTO email_otps (email, otp, expires_at) VALUES ($1, $2, $3)', [email, code, expires]);
      await sendOTP(u.phone || '', email, u.name, code, u.owner_id || u.id);
      return NextResponse.json({ success: true, message: 'تم إرسال رمز التحقق' });
    }

    if (action === 'verify_otp') {
      const { code } = body;
      if (!email || !code) return NextResponse.json({ error: 'الإيميل والرمز مطلوبين' }, { status: 400 });
      const otpRow = await pool.query(
        'SELECT * FROM email_otps WHERE email = $1 AND otp = $2 AND used = false AND expires_at > NOW()',
        [email, code]
      );
      if (otpRow.rows.length === 0) return NextResponse.json({ error: 'الرمز غلط أو منتهي الصلاحية' }, { status: 401 });
      await pool.query('UPDATE email_otps SET used = true WHERE email = $1', [email]);
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const u = user.rows[0];
      const DASHBOARD_PATHS: Record<string, string> = {
        super_admin: "/owner",
        owner: "/dashboard/owner",
        admin: "/dashboard/admin",
        teacher: "/dashboard/teacher",
        parent: "/dashboard/parent",
        student: "/dashboard/student",
      };
      const dashboardPath = DASHBOARD_PATHS[u.role] || "/dashboard";
      const token = generateToken(u);
      const response = NextResponse.json({
        success: true, token,
        user: { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, school_id: u.school_id, owner_id: u.owner_id, package: u.package, status: u.status, dashboardPath }
      });
      response.cookies.set('matin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
      return response;
    }

    if (action === 'login') {
      if (!email || !password) return NextResponse.json({ error: 'الإيميل والباسورد مطلوبين' }, { status: 400 });
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) return NextResponse.json({ error: 'الإيميل غير مسجل' }, { status: 401 });
      const u = user.rows[0];
      let validPassword = false;
      if (u.password.startsWith('$2')) { validPassword = await bcrypt.compare(password, u.password); }
      else { validPassword = (password === u.password); }
      if (!validPassword) return NextResponse.json({ error: 'الباسورد غلط' }, { status: 401 });
      if (u.status === 'pending') return NextResponse.json({ error: 'حسابك قيد المراجعة' }, { status: 403 });
      if (u.status === 'rejected') return NextResponse.json({ error: 'تم رفض طلبك' }, { status: 403 });
      if (u.status === 'suspended') return NextResponse.json({ error: 'حسابك موقوف' }, { status: 403 });
      const DASHBOARD_PATHS: Record<string, string> = {
        super_admin: "/owner",
        owner: "/dashboard/owner",
        admin: "/dashboard/admin",
        teacher: "/dashboard/teacher",
        parent: "/dashboard/parent",
        student: "/dashboard/student",
      };
      const dashboardPath = DASHBOARD_PATHS[u.role] || "/dashboard";
      const token = generateToken(u);
      const response = NextResponse.json({ success: true, token, user: { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, school_id: u.school_id, owner_id: u.owner_id, package: u.package, status: u.status, dashboardPath } });
      response.cookies.set('matin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
      return response;
    }

    if (action === 'register_owner') {
      if (!name || !email || !password || !phone || !school_name) return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (exists.rows.length > 0) return NextResponse.json({ error: 'الإيميل مسجل مسبقاً' }, { status: 400 });
      const hashed = await bcrypt.hash(password, 10);
      let max_schools = 1, max_students = 100, max_teachers = 5;
      if (package_type === 'advanced') { max_schools = 5; max_students = 500; max_teachers = 20; }
      if (package_type === 'enterprise') { max_schools = 999; max_students = 99999; max_teachers = 9999; }
      await pool.query(
        `INSERT INTO users (name, email, password, phone, role, status, package, city, national_id, max_schools, max_students, max_teachers, created_at) VALUES ($1,$2,$3,$4,'owner','pending',$5,$6,$7,$8,$9,$10,NOW()`,
        [name, email, hashed, phone, package_type || 'basic', city || null, national_id || null, max_schools, max_students, max_teachers]
      );
      await pool.query(
        `INSERT INTO school_registrations (school_name, contact_name, contact_phone, contact_email, city, plan, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,'pending',NOW()`,
        [school_name, name, phone, email, city || null, package_type || 'basic']
      );
      return NextResponse.json({ success: true, message: 'تم إرسال طلبك بنجاح!' }, { status: 201 });
    }

    if (action === 'register_student') {
      if (!name || !email || !password) return NextResponse.json({ error: 'الاسم والإيميل والباسورد مطلوبين' }, { status: 400 });
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (exists.rows.length > 0) return NextResponse.json({ error: 'الإيميل مسجل مسبقاً' }, { status: 400 });
      const hashed = await bcrypt.hash(password, 10);
      let owner_id = null;
      if (body.school_id) {
        const school = await pool.query('SELECT owner_id FROM schools WHERE id::text = $1::text', [body.school_id]);
        if (school.rows.length > 0) owner_id = school.rows[0].owner_id;
      }
      await pool.query(
        `INSERT INTO users (name, email, password, phone, role, status, school_id, owner_id, national_id, created_at) VALUES ($1,$2,$3,$4,'student','pending',$5,$6,$7,NOW()`,
        [name, email, hashed, phone || null, body.school_id || null, owner_id, national_id || null]
      );
      return NextResponse.json({ success: true, message: 'تم إرسال طلبك!' }, { status: 201 });
    }

    // ===== العمليات الإدارية — تحتاج مصادقة وصلاحيات =====
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) return NextResponse.json({ error: 'غير مصرح — يجب تسجيل الدخول' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'غير مصرح — صلاحيات غير كافية' }, { status: 403 });
    }

    if (action === 'approve' || action === 'reject') {
      const { user_id } = body;
      if (!user_id) return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 });
      const newStatus = action === 'approve' ? 'active' : 'rejected';
      await pool.query('UPDATE users SET status = $1 WHERE id::text = $2::text', [newStatus, user_id]);
      const u = await pool.query('SELECT email FROM users WHERE id::text = $1::text', [user_id]);
      if (u.rows.length > 0) await pool.query('UPDATE school_registrations SET status = $1 WHERE contact_email = $2', [newStatus === 'active' ? 'approved' : 'rejected', u.rows[0].email]);
      return NextResponse.json({ success: true });
    }

    if (action === 'toggle_status') {
      const { user_id, new_status } = body;
      if (!user_id) return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 });
      await pool.query('UPDATE users SET status = $1 WHERE id::text = $2::text', [new_status || 'suspended', user_id]);
      return NextResponse.json({ success: true });
    }


    if (action === 'delete_user') {
      const { user_id } = body;
      if (!user_id) return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 });
      if (!['super_admin', 'owner', 'admin'].includes(currentUser.role)) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
      }
      const target = await pool.query('SELECT role FROM users WHERE id::text = $1::text', [user_id]);
      if (target.rows[0]?.role === 'super_admin') {
        return NextResponse.json({ error: 'لا يمكن حذف مالك المنصة' }, { status: 403 });
      }
      await pool.query('DELETE FROM users WHERE id::text = $1::text', [user_id]);
      return NextResponse.json({ success: true, message: 'تم حذف المستخدم' });
    }

    if (action === 'get_users') {
      const { role_filter, status_filter } = body;
      let query = 'SELECT id, name, email, phone, role, status, package, city, school_id, owner_id, max_schools, max_students, max_teachers, created_at FROM users WHERE 1=1';
      const params: any[] = [];
      if (currentUser.role !== 'super_admin') {
        params.push(currentUser.id);
        query += ` AND owner_id = $${params.length}`;
      }
      if (role_filter && role_filter !== 'all') { params.push(role_filter); query += ` AND role = $${params.length}`; }
      if (status_filter && status_filter !== 'all') { params.push(status_filter); query += ` AND status = $${params.length}`; }
      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      return NextResponse.json(result.rows);
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });

  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ error: 'حدث خطأ بالسيرفر' }, { status: 500 });
  }
}
