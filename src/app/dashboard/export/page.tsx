'use client';
import { BarChart3, BookOpen, Bus, Calendar, ClipboardList, Coins, Download, FileText, GraduationCap, Save, School, Settings, Upload, User } from "lucide-react";
import { useState } from 'react';
import IconRenderer from "@/components/IconRenderer";

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  formats: string[];
}

export default function ExportPage() {
  const [selectedExport, setSelectedExport] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const exportOptions: ExportOption[] = [
    { id: 'students', title: 'بيانات الطلاب', description: 'تصدير قائمة الطلاب مع معلوماتهم الكاملة', icon: 'User‍GraduationCap', formats: ['csv', 'xlsx', 'pdf'] },
    { id: 'teachers', title: 'بيانات المعلمين', description: 'تصدير قائمة المعلمين والموظفين', icon: 'User‍School', formats: ['csv', 'xlsx', 'pdf'] },
    { id: 'attendance', title: 'سجلات الحضور', description: 'تصدير سجلات الحضور والغياب', icon: "ICON_ClipboardList", formats: ['csv', 'xlsx', 'pdf'] },
    { id: 'grades', title: 'الدرجات والنتائج', description: 'تصدير درجات الطلاب والتقارير الأكاديمية', icon: "ICON_BarChart3", formats: ['csv', 'xlsx', 'pdf'] },
    { id: 'exams', title: 'الاختبارات', description: 'تصدير بيانات الاختبارات والنتائج', icon: "ICON_FileText", formats: ['csv', 'xlsx', 'pdf'] },
    { id: 'finance', title: 'التقارير المالية', description: 'تصدير المدفوعات والفواتير والإيرادات', icon: "ICON_Coins", formats: ['csv', 'xlsx', 'pdf'] },
    { id: 'schedules', title: 'الجداول الدراسية', description: 'تصدير الجداول والحصص', icon: "ICON_Calendar", formats: ['csv', 'xlsx', 'pdf'] },
    { id: 'transport', title: 'بيانات النقل', description: 'تصدير مسارات الباصات والركاب', icon: "ICON_Bus", formats: ['csv', 'xlsx'] },
    { id: 'library', title: 'المكتبة', description: 'تصدير قائمة الكتب والاستعارات', icon: "ICON_BookOpen", formats: ['csv', 'xlsx'] },
    { id: 'behavior', title: 'السلوك والانضباط', description: 'تصدير سجلات السلوك والملاحظات', icon: '⭐', formats: ['csv', 'xlsx', 'pdf'] },
    { id: 'full_backup', title: 'نسخة احتياطية كاملة', description: 'تصدير جميع بيانات المدرسة', icon: "ICON_Save", formats: ['json'] },
  ];

  const handleExport = async () => {
    if (!selectedExport) return;
    setLoading(true);
    setSuccess('');

    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1]
        || localStorage.getItem('token') || '';

      const params = new URLSearchParams({
        type: selectedExport,
        format: selectedFormat,
        ...(dateRange.from && { from: dateRange.from }),
        ...(dateRange.to && { to: dateRange.to })
      });

      const res = await fetch(`/api/export?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedExport}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setSuccess(`تم تصدير ${exportOptions.find(o => o.id === selectedExport)?.title} بنجاح!`);
      } else {
        const data = await res.json();
        setSuccess(`خطأ: ${data.error || 'فشل التصدير'}`);
      }
    } catch (error) {
      setSuccess('حدث خطأ أثناء التصدير');
    }
    setLoading(false);
  };

  return (
    <div dir="rtl" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', margin: '0 0 8px' }}>Upload تصدير البيانات</h1>
        <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>تصدير بيانات المدرسة بصيغ متعددة (CSV, Excel, PDF, JSON)</p>
      </div>

      {success && (
        <div style={{ padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', background: success.startsWith('خطأ') ? '#fee' : '#e8f5e9', color: success.startsWith('خطأ') ? '#c00' : '#2e7d32', fontSize: '14px' }}>
          {success}
        </div>
      )}

      {/* Export Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        {exportOptions.map(option => (
          <div
            key={option.id}
            onClick={() => { setSelectedExport(option.id); setSelectedFormat(option.formats[0]); }}
            style={{
              background: selectedExport === option.id ? '#e3f2fd' : 'white',
              border: selectedExport === option.id ? '2px solid #1e3a5f' : '2px solid #e0e0e0',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedExport === option.id ? '0 4px 12px rgba(30,58,95,0.15)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}><IconRenderer name={option.icon} /></div>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#1e3a5f' }}>{option.title}</h3>
            <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#888' }}>{option.description}</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {option.formats.map(f => (
                <span key={f} style={{ padding: '3px 10px', borderRadius: '12px', background: '#f0f0f0', fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Export Settings */}
      {selectedExport && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: '#1e3a5f' }}>Settings️ إعدادات التصدير</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Format */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>صيغة الملف</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', background: 'white' }}
              >
                {exportOptions.find(o => o.id === selectedExport)?.formats.map(f => (
                  <option key={f} value={f}>{f.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>من تاريخ</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Date To */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>إلى تاريخ</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            style={{
              padding: '14px 40px',
              background: loading ? '#ccc' : '#1e3a5f',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? '⏳ جاري التصدير...' : 'Download تصدير الآن'}
          </button>
        </div>
      )}
    </div>
  );
}
