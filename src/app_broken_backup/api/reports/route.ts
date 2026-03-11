import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    // === نظرة عامة شاملة ===
    if (type === 'overview' || type === 'school_overview') {
      const [students, teachers, classes, exams, lectures, homework, attendance, grades, certificates, orders, posts] = await Promise.all([
        pool.query(`SELECT COUNT(*) as count FROM students WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count FROM teachers WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count FROM classes WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count FROM exams WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count FROM lectures WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count FROM homework WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'present') as present, COUNT(*) FILTER (WHERE status = 'absent') as absent FROM attendance WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count, AVG(percentage) as avg_percentage FROM grades WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count FROM certificates WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count, COALESCE(SUM(total::numeric), 0) as total_revenue FROM store_orders WHERE 1=1 ${filter.sql}`, filter.params),
        pool.query(`SELECT COUNT(*) as count FROM posts WHERE 1=1 ${filter.sql}`, filter.params),
      ]);

      return NextResponse.json({
        students: parseInt(students.rows[0].count),
        teachers: parseInt(teachers.rows[0].count),
        classes: parseInt(classes.rows[0].count),
        exams: parseInt(exams.rows[0].count),
        lectures: parseInt(lectures.rows[0].count),
        homework: parseInt(homework.rows[0].count),
        attendance: {
          total: parseInt(attendance.rows[0].total),
          present: parseInt(attendance.rows[0].present),
          absent: parseInt(attendance.rows[0].absent),
          rate: attendance.rows[0].total > 0 ? Math.round((attendance.rows[0].present / attendance.rows[0].total) * 100) : 0
        },
        grades: {
          count: parseInt(grades.rows[0].count),
          average: Math.round(parseFloat(grades.rows[0].avg_percentage) || 0)
        },
        certificates: parseInt(certificates.rows[0].count),
        store: {
          orders: parseInt(orders.rows[0].count),
          revenue: parseFloat(orders.rows[0].total_revenue) || 0
        },
        posts: parseInt(posts.rows[0].count)
      });
    }

    // === تقرير الاختبارات ===
    if (type === 'exams') {
      const result = await pool.query(`
        SELECT e.id, e.title_ar, e.status,
          (SELECT COUNT(*) FROM exam_sessions WHERE exam_id = e.id) as sessions_count,
          (SELECT COUNT(*) FROM exam_sessions WHERE exam_id = e.id AND status = 'completed') as completed_count,
          (SELECT AVG(percentage) FROM exam_sessions WHERE exam_id = e.id AND status = 'completed') as avg_score
        FROM exams e WHERE 1=1 ${filter.sql}
        ORDER BY e.created_at DESC
      `, filter.params);
      return NextResponse.json(result.rows);
    }

    // === تقرير الحضور ===
    if (type === 'attendance') {
      const from_date = searchParams.get('from') || new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
      const to_date = searchParams.get('to') || new Date().toISOString().split('T')[0];
      
      const daily = await pool.query(`
        SELECT date, 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'present') as present,
          COUNT(*) FILTER (WHERE status = 'absent') as absent,
          COUNT(*) FILTER (WHERE status = 'late') as late
        FROM attendance 
        WHERE date BETWEEN $1 AND $2 ${filter.sql.replace(/\$(\d+)/g, (m: string, n: string) => `$${parseInt(n)+2}`)}
        GROUP BY date ORDER BY date
      `, [from_date, to_date, ...filter.params]);
      
      return NextResponse.json({ daily: daily.rows, from: from_date, to: to_date });
    }

    // === تقرير الدرجات ===
    if (type === 'grades') {
      const distribution = await pool.query(`
        SELECT grade, COUNT(*) as count
        FROM grades WHERE 1=1 ${filter.sql}
        GROUP BY grade ORDER BY grade
      `, filter.params);
      
      const topStudents = await pool.query(`
        SELECT g.student_id, u.name as student_name, AVG(g.percentage) as avg_pct, COUNT(*) as exams_count
        FROM grades g
        LEFT JOIN students s ON s.id::text = g.student_id::text
        LEFT JOIN users u ON u.id::text = s.user_id
        WHERE 1=1 ${filter.sql}
        GROUP BY g.student_id, u.name
        ORDER BY avg_pct DESC LIMIT 20
      `, filter.params);
      
      return NextResponse.json({ distribution: distribution.rows, top_students: topStudents.rows });
    }

    // === تقرير المتجر ===
    if (type === 'store') {
      const orders = await pool.query(`
        SELECT status, payment_method, COUNT(*) as count, COALESCE(SUM(total::numeric), 0) as total
        FROM store_orders WHERE 1=1 ${filter.sql}
        GROUP BY status, payment_method
      `, filter.params);
      
      const topProducts = await pool.query(`
        SELECT sp.name, sp.price, sp.stock,
          (SELECT COUNT(*) FROM store_orders WHERE items::text LIKE '%' || sp.id || '%') as orders_count
        FROM store_products sp WHERE 1=1 ${filter.sql}
        ORDER BY orders_count DESC LIMIT 10
      `, filter.params);
      
      return NextResponse.json({ orders: orders.rows, top_products: topProducts.rows });
    }

    // === تقرير طالب محدد ===
    if (type === 'student') {
      const student_id = searchParams.get('student_id');
      if (!student_id) return NextResponse.json({ error: 'معرف الطالب مطلوب' }, { status: 400 });
      
      const [info, grades, attendance, exams, certificates] = await Promise.all([
        pool.query(`SELECT s.*, u.name, u.email FROM students s LEFT JOIN users u ON u.id::text = s.user_id WHERE s.id::text = $1::text`, [student_id]),
        pool.query(`SELECT * FROM grades WHERE student_id::text = $1::text ORDER BY created_at DESC`, [student_id]),
        pool.query(`SELECT status, COUNT(*) as count FROM attendance WHERE student_id::text = $1::text GROUP BY status`, [student_id]),
        pool.query(`SELECT es.*, e.title_ar FROM exam_sessions es LEFT JOIN exams e ON e.id::text = es.exam_id::text WHERE es.student_id = $1 ORDER BY es.started_at DESC`, [student_id]),
        pool.query(`SELECT * FROM certificates WHERE student_id::text = $1::text`, [student_id]),
      ]);
      
      return NextResponse.json({
        student: info.rows[0],
        grades: grades.rows,
        attendance: attendance.rows,
        exams: exams.rows,
        certificates: certificates.rows
      });
    }

    return NextResponse.json({ error: 'نوع التقرير غير معروف' }, { status: 400 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
