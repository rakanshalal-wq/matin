'use client';
import { useState, useEffect } from 'react';

interface PayrollRecord {
  id: number;
  employee_name: string;
  employee_id: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  month: string;
  status: string;
  paid_at: string;
}

export default function PayrollPage() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => { fetchPayroll(); }, [selectedMonth]);

  const fetchPayroll = async () => {
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0] || localStorage.getItem('token');
      const res = await fetch(`/api/payroll?month=${selectedMonth}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : data.records || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const totalSalaries = records.reduce((sum, r) => sum + (r.net_salary || 0), 0);
  const totalAllowances = records.reduce((sum, r) => sum + (r.allowances || 0), 0);
  const totalDeductions = records.reduce((sum, r) => sum + (r.deductions || 0), 0);
  const paidCount = records.filter(r => r.status === 'paid').length;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700'
    };
    const labels: Record<string, string> = {
      paid: 'مدفوع', pending: 'معلق', processing: 'قيد المعالجة'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{labels[status] || status}</span>;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💰 إدارة الرواتب</h1>
          <p className="text-gray-600 mt-1">إدارة رواتب الموظفين والمعلمين</p>
        </div>
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + إضافة راتب
          </button>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-blue-500">
          <p className="text-gray-500 text-sm">إجمالي الرواتب</p>
          <p className="text-2xl font-bold text-blue-600">{totalSalaries.toLocaleString()} ر.س</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-green-500">
          <p className="text-gray-500 text-sm">البدلات</p>
          <p className="text-2xl font-bold text-green-600">{totalAllowances.toLocaleString()} ر.س</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-red-500">
          <p className="text-gray-500 text-sm">الخصومات</p>
          <p className="text-2xl font-bold text-red-600">{totalDeductions.toLocaleString()} ر.س</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-purple-500">
          <p className="text-gray-500 text-sm">تم الدفع</p>
          <p className="text-2xl font-bold text-purple-600">{paidCount} / {records.length}</p>
        </div>
      </div>

      {/* جدول الرواتب */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الموظف</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الراتب الأساسي</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">البدلات</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الخصومات</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">صافي الراتب</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الحالة</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.length > 0 ? records.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{record.employee_name || `موظف #${record.employee_id}`}</td>
                <td className="px-6 py-4">{(record.basic_salary || 0).toLocaleString()} ر.س</td>
                <td className="px-6 py-4 text-green-600">+{(record.allowances || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-red-600">-{(record.deductions || 0).toLocaleString()}</td>
                <td className="px-6 py-4 font-bold">{(record.net_salary || 0).toLocaleString()} ر.س</td>
                <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm ml-2">تعديل</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">دفع</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                  <p className="text-4xl mb-4">💰</p>
                  <p className="text-lg">لا توجد سجلات رواتب لهذا الشهر</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
