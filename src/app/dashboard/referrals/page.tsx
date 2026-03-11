'use client';
import { useState, useEffect } from 'react';

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => { fetchReferrals(); }, []);

  const fetchReferrals = async () => {
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0] || localStorage.getItem('token') || localStorage.getItem('matin_token');
      const res = await fetch('/api/referrals', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.referral_code) setReferralCode(data.referral_code);
      setReferrals(Array.isArray(data.referrals) ? data.referrals : Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const totalEarnings = referrals.reduce((sum, r) => sum + (r.reward_amount || 0), 0);
  const completedCount = referrals.filter(r => r.status === 'completed').length;

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎁 برنامج الإحالات</h1>
          <p className="text-gray-600 mt-1">شارك رابط الإحالة واحصل على مكافآت</p>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <h2 className="text-xl font-bold mb-2">رابط الإحالة الخاص بك</h2>
        <div className="bg-white/20 rounded-lg p-4 flex items-center justify-between mt-4">
          <code className="text-lg font-mono">{referralCode || 'matin.ink/ref/YOUR_CODE'}</code>
          <button onClick={() => navigator.clipboard.writeText(`https://matin.ink/ref/${referralCode}`)} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50">📋 نسخ</button>
        </div>
        <p className="mt-4 text-blue-100">احصل على خصم 10% لكل مدرسة تسجل عبر رابطك!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-blue-500">
          <p className="text-gray-500 text-sm">إجمالي الإحالات</p>
          <p className="text-2xl font-bold text-blue-600">{referrals.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-green-500">
          <p className="text-gray-500 text-sm">مكتملة</p>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-yellow-500">
          <p className="text-gray-500 text-sm">قيد الانتظار</p>
          <p className="text-2xl font-bold text-yellow-600">{referrals.length - completedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-purple-500">
          <p className="text-gray-500 text-sm">إجمالي المكافآت</p>
          <p className="text-2xl font-bold text-purple-600">{totalEarnings} ر.س</p>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">سجل الإحالات</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">المُحال</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">البريد</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">التاريخ</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">المكافأة</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {referrals.length > 0 ? referrals.map(ref => (
              <tr key={ref.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{ref.referred_name || 'مستخدم جديد'}</td>
                <td className="px-6 py-4 text-gray-600">{ref.referred_email || '-'}</td>
                <td className="px-6 py-4">{ref.created_at ? new Date(ref.created_at).toLocaleDateString('ar-SA') : '-'}</td>
                <td className="px-6 py-4 font-bold text-green-600">{ref.reward_amount || 0} ر.س</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${ref.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {ref.status === 'completed' ? 'مكتملة' : 'قيد الانتظار'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                  <p className="text-4xl mb-4">🎁</p>
                  <p className="text-lg">لا توجد إحالات بعد</p>
                  <p className="text-sm mt-2">شارك رابط الإحالة مع أصدقائك!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
