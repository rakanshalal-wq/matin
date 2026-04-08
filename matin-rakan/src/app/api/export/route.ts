import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin','supervisor'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بالتصدير' }, { status: 403 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'students';
    const format = url.searchParams.get('format') || 'json';

    const schoolFilter = user.role === 'super_admin' ? '' : 'WHERE school_id = $1';
    const params = user.role === 'super_admin' ? [] : [user.school_id];

    let data: any[] = [];
    let columns: { key: string; label: string }[] = [];

    switch (type) {
      case 'students': {
        const r = await pool.query(
          `SELECT id, name, email, phone, status, created_at FROM users ${schoolFilter ? schoolFilter + " AND role IN ('student','trainee')" : "WHERE role IN ('student','trainee')"}
           ORDER BY name`, params
        );
        data = r.rows;
        columns = [
          { key: 'id', label: 'المعرف' },
          { key: 'name', label: 'الاسم' },
          { key: 'email', label: 'البريد' },
          { key: 'phone', label: 'الجوال' },
          { key: 'status', label: 'الحالة' },
          { key: 'created_at', label: 'تاريخ التسجيل' },
        ];
        break;
      }

      case 'teachers': {
        const r = await pool.query(
          `SELECT id, name, email, phone, role, status, created_at FROM users ${schoolFilter ? schoolFilter + " AND role IN ('teacher','trainer','muhaffiz')" : "WHERE role IN ('teacher','trainer','muhaffiz')"}
           ORDER BY name`, params
        );
        data = r.rows;
        columns = [
          { key: 'id', label: 'المعرف' },
          { key: 'name', label: 'الاسم' },
          { key: 'email', label: 'البريد' },
          { key: 'phone', label: 'الجوال' },
          { key: 'role', label: 'الدور' },
          { key: 'status', label: 'الحالة' },
          { key: 'created_at', label: 'تاريخ التسجيل' },
        ];
        break;
      }

      case 'attendance': {
        const r = await pool.query(
          `SELECT a.id, a.student_id, (SELECT name FROM users WHERE id = a.student_id::text) as student_name,
            a.status, a.date, a.class_id
           FROM attendance a ${schoolFilter ? 'WHERE a.school_id = $1' : ''}
           ORDER BY a.date DESC LIMIT 1000`, params
        );
        data = r.rows;
        columns = [
          { key: 'id', label: 'المعرف' },
          { key: 'student_name', label: 'الطالب' },
          { key: 'status', label: 'الحالة' },
          { key: 'date', label: 'التاريخ' },
          { key: 'class_id', label: 'الفصل' },
        ];
        break;
      }

      case 'grades': {
        const r = await pool.query(
          `SELECT g.id, (SELECT name FROM users WHERE id = g.student_id::text) as student_name,
            g.subject, g.grade, g.max_grade, g.exam_type, g.created_at
           FROM grades g ${schoolFilter ? 'WHERE g.school_id = $1' : ''}
           ORDER BY g.created_at DESC LIMIT 1000`, params
        );
        data = r.rows;
        columns = [
          { key: 'id', label: 'المعرف' },
          { key: 'student_name', label: 'الطالب' },
          { key: 'subject', label: 'المادة' },
          { key: 'grade', label: 'الدرجة' },
          { key: 'max_grade', label: 'من' },
          { key: 'exam_type', label: 'نوع الاختبار' },
          { key: 'created_at', label: 'التاريخ' },
        ];
        break;
      }

      case 'classes': {
        const r = await pool.query(
          `SELECT id, name, subject, teacher_id,
            (SELECT name FROM users WHERE id = c.teacher_id::text) as teacher_name,
            status, created_at
           FROM classes c ${schoolFilter}
           ORDER BY name`, params
        );
        data = r.rows;
        columns = [
          { key: 'id', label: 'المعرف' },
          { key: 'name', label: 'الفصل' },
          { key: 'subject', label: 'المادة' },
          { key: 'teacher_name', label: 'المعلم' },
          { key: 'status', label: 'الحالة' },
          { key: 'created_at', label: 'تاريخ الإنشاء' },
        ];
        break;
      }

      case 'payments': {
        const r = await pool.query(
          `SELECT p.id, (SELECT name FROM users WHERE id = p.user_id) as user_name,
            p.plan_id, p.amount, p.currency, p.status, p.created_at
           FROM payment_history p
           ORDER BY p.created_at DESC LIMIT 500`
        );
        data = r.rows;
        columns = [
          { key: 'id', label: 'المعرف' },
          { key: 'user_name', label: 'المستخدم' },
          { key: 'plan_id', label: 'الباقة' },
          { key: 'amount', label: 'المبلغ' },
          { key: 'currency', label: 'العملة' },
          { key: 'status', label: 'الحالة' },
          { key: 'created_at', label: 'التاريخ' },
        ];
        break;
      }

      default:
        return NextResponse.json({ error: 'نوع تصدير غير صحيح' }, { status: 400 });
    }

    // تنسيق التواريخ
    data = data.map(row => {
      const newRow = { ...row };
      if (newRow.created_at) newRow.created_at = new Date(newRow.created_at).toLocaleDateString('ar-SA');
      if (newRow.date) newRow.date = new Date(newRow.date).toLocaleDateString('ar-SA');
      return newRow;
    });

    return NextResponse.json({
      data,
      columns,
      total: data.length,
      type,
      exported_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'خطأ في التصدير: ' + (error.message || '') }, { status: 500 });
  }
}
