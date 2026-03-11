import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';




export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'students';
    const format = searchParams.get('format') || 'json';
    const filterSQL = getFilterSQL(user);

    let query = '';
    let tableName = '';

    switch (type) {
      case 'students':
        tableName = 'students';
        query = `SELECT s.*, u.name, u.email, u.phone FROM students s LEFT JOIN users u ON s.user_id::text = u.id::text WHERE 1=1 ${filterSQL.replace(/school_id/g, 's.school_id')}`;
        break;
      case 'teachers':
        tableName = 'teachers';
        query = `SELECT t.*, u.name, u.email, u.phone FROM teachers t LEFT JOIN users u ON t.user_id::text = u.id::text WHERE 1=1 ${filterSQL.replace(/school_id/g, 't.school_id')}`;
        break;
      case 'attendance':
        tableName = 'attendance';
        query = `SELECT * FROM attendance WHERE 1=1 ${filterSQL}`;
        break;
      case 'grades':
        tableName = 'grades';
        query = `SELECT * FROM grades WHERE 1=1 ${filterSQL}`;
        break;
      case 'classes':
        tableName = 'classes';
        query = `SELECT * FROM classes WHERE 1=1 ${filterSQL}`;
        break;
      case 'exams':
        tableName = 'exams';
        query = `SELECT * FROM exams WHERE 1=1 ${filterSQL}`;
        break;
      default:
        return NextResponse.json({ error: 'نوع التصدير غير مدعوم' }, { status: 400 });
    }

    const result = await pool.query(query);

    if (format === 'csv') {
      if (result.rows.length === 0) {
        return new NextResponse('No data', { status: 200, headers: { 'Content-Type': 'text/csv' } });
      }
      const headers = Object.keys(result.rows[0]);
      const csvRows = [headers.join(',')];
      for (const row of result.rows) {
        csvRows.push(headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(',');
      }
      return new NextResponse(csvRows.join('\n'), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename=${tableName}_export.csv`,
        },
      });
    }

    return NextResponse.json({ data: result.rows, total: result.rowCount, type });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
