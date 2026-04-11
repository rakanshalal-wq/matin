'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, FileSpreadsheet, FileText, ChevronLeft, Users, BookOpen, ClipboardCheck, BarChart3, CreditCard, Loader2 } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';

const TYPES = [
  { id: 'students', label: 'الطلاب', Ic: Users, color: '#3B82F6' },
  { id: 'teachers', label: 'المعلمين', Ic: Users, color: '#059669' },
  { id: 'classes', label: 'الفصول', Ic: BookOpen, color: '#F59E0B' },
  { id: 'attendance', label: 'الحضور', Ic: ClipboardCheck, color: '#8B5CF6' },
  { id: 'grades', label: 'الدرجات', Ic: BarChart3, color: '#EC4899' },
  { id: 'payments', label: 'المدفوعات', Ic: CreditCard, color: '#10B981' },
];

export default function ExportPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedType, setSelectedType] = useState('students');
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
  }, []);

  const loadData = async (type: string) => {
    setSelectedType(type);
    setLoading(true);
    setMsg('');
    try {
      const r = await fetch(`/api/export?type=${type}`, { headers: getHeaders() });
      if (r.ok) {
        const d = await r.json();
        setData(d.data || []);
        setColumns(d.columns || []);
        setMsg(`تم تحميل ${d.total} سجل`);
      } else {
        const d = await r.json();
        setMsg(d.error || 'خطأ في التحميل');
      }
    } catch { setMsg('خطأ في الاتصال'); }
    setLoading(false);
  };

  const exportCSV = () => {
    if (!data.length) return;
    setExporting('csv');
    try {
      const header = columns.map((c: any) => c.label).join(',');
      const rows = data.map(row => columns.map((c: any) => `"${(row[c.key] || '').toString().replace(/"/g, '""')}"`).join(','));
      const csv = '\uFEFF' + header + '\n' + rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `matin_${selectedType}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click(); URL.revokeObjectURL(url);
      setMsg('تم تصدير CSV بنجاح');
    } catch { setMsg('خطأ في التصدير'); }
    setExporting('');
  };

  const exportExcel = async () => {
    if (!data.length) return;
    setExporting('excel');
    try {
      const XLSX = await import('xlsx');
      const wsData = [columns.map((c: any) => c.label), ...data.map(row => columns.map((c: any) => row[c.key] || ''))];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!cols'] = columns.map(() => ({ wch: 20 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, TYPES.find(t => t.id === selectedType)?.label || 'بيانات');
      XLSX.writeFile(wb, `matin_${selectedType}_${new Date().toISOString().split('T')[0]}.xlsx`);
      setMsg('تم تصدير Excel بنجاح');
    } catch { setMsg('خطأ في تصدير Excel'); }
    setExporting('');
  };

  const exportPDF = async () => {
    if (!data.length) return;
    setExporting('pdf');
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const title = `تقرير ${TYPES.find(t => t.id === selectedType)?.label || ''} - متين`;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`التاريخ: ${new Date().toLocaleDateString('ar-SA')}  |  العدد: ${data.length}`, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

      autoTable(doc, {
        startY: 28,
        head: [columns.map((c: any) => c.label).reverse()],
        body: data.map(row => columns.map((c: any) => String(row[c.key] || '')).reverse()),
        styles: { font: 'Helvetica', fontSize: 8, cellPadding: 3, halign: 'center' },
        headStyles: { fillColor: [201, 168, 76], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 28 },
      });

      doc.save(`matin_${selectedType}_${new Date().toISOString().split('T')[0]}.pdf`);
      setMsg('تم تصدير PDF بنجاح');
    } catch (e) { console.error(e); setMsg('خطأ في تصدير PDF'); }
    setExporting('');
  };

  return (
    <div dir="rtl" style={{minHeight:'100vh',background:DARK,color:'#EEEEF5',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}>
      <div style={{padding:'20px 24px',borderBottom:`1px solid ${BD}`,display:'flex',alignItems:'center',gap:12}}>
        <Link href="/dashboard" style={{color:DIM,textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
          <ChevronLeft size={18} /> الرئيسية
        </Link>
        <div style={{flex:1}} />
        <Download size={20} color={G} />
        <span style={{color:G,fontWeight:700}}>تصدير البيانات</span>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'30px 24px'}}>
        {/* Data Type Selection */}
        <div style={{marginBottom:30}}>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:16}}>اختر نوع البيانات</h2>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            {TYPES.map(t => (
              <button key={t.id} onClick={() => loadData(t.id)} style={{
                display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:10,border:`1px solid ${selectedType===t.id?t.color:BD}`,
                background:selectedType===t.id?`${t.color}15`:CARD,color:selectedType===t.id?t.color:DIM,
                cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:selectedType===t.id?700:400,
              }}>
                <t.Ic size={18} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {msg && (
          <div style={{padding:'10px 16px',borderRadius:8,background:msg.includes('نجاح')||msg.includes('سجل')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:msg.includes('نجاح')||msg.includes('سجل')?'#10B981':'#EF4444',fontSize:13,marginBottom:20}}>
            {msg}
          </div>
        )}

        {/* Export Buttons */}
        {data.length > 0 && (
          <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
            <button onClick={exportCSV} disabled={!!exporting} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:10,border:'none',background:'rgba(16,185,129,0.15)',color:'#10B981',cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:600}}>
              {exporting==='csv'?<Loader2 size={16} />:<FileText size={16} />} تصدير CSV
            </button>
            <button onClick={exportExcel} disabled={!!exporting} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:10,border:'none',background:'rgba(59,130,246,0.15)',color:'#3B82F6',cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:600}}>
              {exporting==='excel'?<Loader2 size={16} />:<FileSpreadsheet size={16} />} تصدير Excel
            </button>
            <button onClick={exportPDF} disabled={!!exporting} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:10,border:'none',background:'rgba(239,68,68,0.15)',color:'#EF4444',cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:600}}>
              {exporting==='pdf'?<Loader2 size={16} />:<FileText size={16} />} تصدير PDF
            </button>
          </div>
        )}

        {/* Data Preview Table */}
        {loading ? (
          <div style={{textAlign:'center',padding:40,color:DIM}}>
            <Loader2 size={32} color={G} /><div style={{marginTop:12}}>جارٍ التحميل...</div>
          </div>
        ) : data.length > 0 ? (
          <div style={{overflowX:'auto',borderRadius:12,border:`1px solid ${BD}`}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr>
                  {columns.map((c: any) => (
                    <th key={c.key} style={{padding:'12px 14px',borderBottom:`1px solid ${BD}`,background:'rgba(201,168,76,0.08)',color:G,fontWeight:700,whiteSpace:'nowrap',textAlign:'right'}}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 50).map((row, i) => (
                  <tr key={i} style={{borderBottom:`1px solid ${BD}`}}>
                    {columns.map((c: any) => (
                      <td key={c.key} style={{padding:'10px 14px',color:DIM,whiteSpace:'nowrap'}}>
                        {row[c.key] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 50 && (
              <div style={{textAlign:'center',padding:12,color:MUT,fontSize:12}}>
                عرض أول 50 سجل من {data.length} — قم بالتصدير للحصول على الكل
              </div>
            )}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:60,color:MUT}}>
            <Download size={48} strokeWidth={1} /><div style={{marginTop:12}}>اختر نوع البيانات لبدء التصدير</div>
          </div>
        )}
      </div>
    </div>
  );
}
