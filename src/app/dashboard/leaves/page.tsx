'use client';
import { useState, useEffect } from 'react';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0] || localStorage.getItem('token') || localStorage.getItem('matin_token');
      const res = await fetch('/api/leaves', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setLeaves(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
    };
    const labels: Record<string, string> = {
      approved: 'موافق عليها', pending: 'قيد المراجعة', rejected: 'مرفوضة'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{labels[status] || status}</span>;
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      sick: 'مرضية', annual: 'سنوية', emergency: 'طارئة', maternity: 'أمومة', unpaid: 'بدون راتب'
    };
    return labels[type] || type;
  };

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏖️ إدارة الإجازات</h1>
          <p className="text-gray-600 mt-1">طلبات الإجازات والموافقات</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">+ طلب إجازة</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-blue-500">
          <p className="text-gray-500 text-sm">إجمالي الطلبات</p>
          <p className="text-2xl font-bold text-blue-600">{leaves.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-yellow-500">
          <p className="text-gray-500 text-sm">قيد المراجعة</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-green-500">
          <p className="text-gray-500 text-sm">موافق عليها</p>
          <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الموظف</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">النوع</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">من</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">إلى</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">السبب</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaves.length > 0 ? leaves.map(leave => (
              <tr key={leave.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{leave.employee_name || `موظف #${leave.teacher_id}`}</td>
                <td className="px-6 py-4">{getTypeBadge(leave.type)}</td>
                <td className="px-6 py-4">{leave.start_date ? new Date(leave.start_date).toLocaleDateString('ar-SA') : '-'}</td>
                <td className="px-6 py-4">{leave.end_date ? new Date(leave.end_date).toLocaleDateString('ar-SA') : '-'}</td>
                <td className="px-6 py-4 text-gray-600">{leave.reason || '-'}</td>
                <td className="px-6 py-4">{getStatusBadge(leave.status)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                  <p className="text-4xl mb-4">🏖️</p>
                  <p className="text-lg">لا توجد طلبات إجازات</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
