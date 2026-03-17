'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const STATUS_CFG: Record<string, any> = {
  pending: { label: 'معلّقة', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: '⏳' },
  overdue: { label: 'متأخرة', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: '🔴' },
  partial: { label: 'جزئية', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', icon: '⚡' },
  paid:    { label: 'مدفوعة', color: '#10B981', bg: 'rgba(16,185,129,0.1)', icon: '✅' },
};

const METHODS = [
  { key: 'moyasar', label: 'بطاقة بنكية', icon: '💳', desc: 'Visa / Mastercard / Mada' },
  { key: 'tabby', label: 'تابي (4 أقساط)', icon: '🟢', desc: 'اشتري الآن وادفع لاحقاً' },
  { key: 'tamara', label: 'تمارا', icon: '🟡', desc: 'قسّم على 3 أشهر' },
  { key: 'stc_pay', label: 'STC Pay', icon: '📱', desc: 'محفظتك الرقمية' },
  { key: 'bank_transfer', label: 'تحويل بنكي', icon: '🏦', desc: 'تحويل مباشر' },
  { key: 'cash', label: 'نقداً', icon: '💵', desc: 'الدفع في المدرسة' },
];

export default function ParentPaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'invoices' | 'history'>('invoices');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [gateways, setGateways] = useState<string[]>(['cash']);
  const [paying, setPaying] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [msg, setMsg] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const getH = () => ({ 'Authorization': 'Bearer ' + localStorage.getItem('matin_token'), 'Content-Type': 'application/json' });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (u.role !== 'parent') { router.push('/login'); return; }
    fetchData();
    const s = searchParams.get('status');
    if (s === 'success') setMsg({ text: '✅ تم الدفع بنجاح!', type: 'success' });
    else if (s === 'failed') setMsg({ text: '❌ فشل الدفع، حاول مجدداً', type: 'error' });
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [i, h] = await Promise.all([
        fetch('/api/parent-payments?type=invoices', { headers: getH() }).then(r => r.json()),
        fetch('/api/parent-payments?type=history', { headers: getH() }).then(r => r.json()),
      ]);
      setData(i); setHistory(Array.isArray(h) ? h : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openPayment = async (inv: any) => {
    setSelectedInvoice(inv); setMsg(null);
    const res = await fetch(`/api/parent-payments?type=gateways&school_id=${inv.school_id}`, { headers: getH() });
    const d = await res.json();
    setGateways(d.gateways || ['cash']);
    setPaymentMethod(d.default || 'cash');
  };

  const processPayment = async () => {
    if (!selectedInvoice || !paymentMethod) { setErrMsg && setErrMsg('اختر طريقة الدفع'); return; }
    setPaying(true); setErrMsg && setErrMsg('');
    try {
      const res = await fetch('/api/parent-payments', { method: 'POST', headers: getH(), body: JSON.stringify({ action: 'initiate_payment', invoice_id: selectedInvoice.id, payment_method: paymentMethod }) });
      const result = await res.json();
      if (res.ok) {
        if (result.payment_url) window.location.href = result.payment_url;
        else { setMsg({ text: result.message, type: 'success' }); setSelectedInvoice(null); fetchData(); }
      } else { setMsg({ text: result.error || 'فشل الدفع', type: 'error' }); setErrMsg && setErrMsg(result.error || 'فشل الدفع'); }
    } catch (e: any) { setMsg({ text: e.message || 'حدث خطأ', type: 'error' }); setErrMsg && setErrMsg(e.message || 'حدث خطأ'); }
    setPaying(false);
  };
  const updateInvoice = async (invoiceId: number, updates: any) => {
    try {
      const res = await fetch(`/api/parent-payments?id=${invoiceId}`, { method: 'PUT', headers: getH(), body: JSON.stringify(updates) });
      const data = await res.json();
      if (res.ok) fetchData();
      else setMsg({ text: data.error || 'فشل التحديث', type: 'error' });
    } catch (e: any) { setMsg({ text: e.message || 'حدث خطأ', type: 'error' }); }
  };

  const filtered = (data?.invoices || []).filter((i: any) => filterStatus === 'all' || i.status === filterStatus);

  if (loading) return <div style={{ padding: 24, direction: 'rtl', background: '#06060E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', fontSize: 18 }}>💳 جاري التحميل...</div>;

  return (
    <div style={{ padding: 24, direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic,Arial,sans-serif', background: '#06060E', minHeight: '100vh' }}>
      <h1 style={{ color: '#8B5CF6', fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>💳 الفواتير والدفع</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>جميع رسوم أبنائك في مكان واحد</p>

      {msg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14, background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.type === 'success' ? '#10B981' : '#EF4444', display: 'flex', justifyContent: 'space-between' }}><span>{msg.text}</span><button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button></div>}

      {data?.summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12, marginBottom: 24 }}>
          {[{ l: 'المستحق', v: `${Number(data.summary.total_due || 0).toLocaleString()} ر`, c: '#EF4444', i: '📋' }, { l: 'فواتير معلّقة', v: data.summary.pending_count || 0, c: '#F59E0B', i: '⏳' }, { l: 'المدفوع', v: `${Number(data.summary.total_paid || 0).toLocaleString()} ر`, c: '#10B981', i: '✅' }].map(st => (
            <div key={st.l} style={{ background: `${st.c}10`, border: `1px solid ${st.c}25`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22 }}>{st.i}</div>
              <div style={{ color: st.c, fontSize: 18, fontWeight: 800 }}>{st.v}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{st.l}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 6 }}>
        {[{ k: 'invoices', l: '📋 الفواتير' }, { k: 'history', l: '🕐 سجل المدفوعات' }].map(t => (
          <button key={t.k} onClick={() => setActiveTab(t.k as any)} style={{ flex: 1, padding: 10, borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, textAlign: 'center', background: activeTab === t.k ? 'rgba(139,92,246,0.15)' : 'transparent', color: activeTab === t.k ? '#8B5CF6' : 'rgba(255,255,255,0.5)', border: activeTab === t.k ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent' }}>{t.l}</button>
        ))}
      </div>

      {activeTab === 'invoices' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[{ k: 'all', l: 'الكل' }, ...Object.entries(STATUS_CFG).map(([k, v]) => ({ k, l: v.label }))].map(f => (
              <button key={f.k} onClick={() => setFilterStatus(f.k)} style={{ padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600, background: filterStatus === f.k ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', color: filterStatus === f.k ? '#8B5CF6' : 'rgba(255,255,255,0.5)', border: filterStatus === f.k ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.1)' }}>{f.l}</button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ color: '#10B981', fontSize: 16, fontWeight: 700 }}>لا توجد فواتير معلّقة</div>
            </div>
          ) : filtered.map((inv: any) => {
            const cfg = STATUS_CFG[inv.status] || STATUS_CFG.pending;
            const canPay = ['pending', 'overdue', 'partial'].includes(inv.status);
            return (
              <div key={inv.id} onClick={() => canPay && openPayment(inv)} style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 14, padding: 18, marginBottom: 12, cursor: canPay ? 'pointer' : 'default' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      {inv.school_logo && <img src={inv.school_logo} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />}
                      <div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{inv.school_name}</div>
                        <div style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>{inv.title || `فاتورة ${inv.invoice_number}`}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {inv.student_name && <div><div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>الطالب</div><div style={{ color: 'white', fontSize: 14 }}>{inv.student_name}</div></div>}
                      <div><div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>رقم الفاتورة</div><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{inv.invoice_number}</div></div>
                      {inv.due_date && <div><div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>الاستحقاق</div><div style={{ color: inv.status === 'overdue' ? '#EF4444' : 'rgba(255,255,255,0.7)', fontSize: 13 }}>{new Date(inv.due_date).toLocaleDateString('ar-SA')}</div></div>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 120 }}>
                    <div style={{ color: cfg.color, fontSize: 28, fontWeight: 900 }}>{Number(inv.total).toLocaleString()}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>ريال</div>
                    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}>{cfg.icon} {cfg.label}</span>
                    {canPay && <div style={{ marginTop: 10 }}><button style={{ padding: '8px 20px', borderRadius: 8, cursor: 'pointer', background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, width: '100%' }}>💳 ادفع الآن</button></div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {history.length === 0 ? <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>📭 لا توجد مدفوعات سابقة</div>
          : history.map((p: any) => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>{p.invoice_title || p.invoice_number}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>{p.student_name && `👨‍🎓 ${p.student_name} — `}📅 {new Date(p.created_at).toLocaleDateString('ar-SA')}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#10B981', fontSize: 22, fontWeight: 800 }}>{Number(p.amount).toLocaleString()} ريال</div>
                <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: p.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: p.status === 'completed' ? '#10B981' : '#EF4444' }}>{p.status === 'completed' ? '✅ مكتمل' : '❌ فشل'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#06060E', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: '#8B5CF6', fontSize: 18, fontWeight: 800, margin: 0 }}>💳 إتمام الدفع</h3>
              <button onClick={() => setSelectedInvoice(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ color: 'white', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{selectedInvoice.title || `فاتورة ${selectedInvoice.invoice_number}`}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{selectedInvoice.school_name}</span>
                <span style={{ color: '#8B5CF6', fontSize: 26, fontWeight: 900 }}>{Number(selectedInvoice.total).toLocaleString()} <span style={{ fontSize: 14 }}>ريال</span></span>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>اختر طريقة الدفع:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {METHODS.filter(m => gateways.includes(m.key)).map(m => (
                  <button key={m.key} onClick={() => setPaymentMethod(m.key)} style={{ padding: 12, borderRadius: 12, cursor: 'pointer', textAlign: 'right', background: paymentMethod === m.key ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${paymentMethod === m.key ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}` }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                    <div style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSelectedInvoice(null)} style={{ flex: 1, padding: 13, borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>إلغاء</button>
              <button onClick={processPayment} disabled={!paymentMethod || paying} style={{ flex: 2, padding: 13, borderRadius: 10, cursor: 'pointer', background: paymentMethod ? 'linear-gradient(135deg,#8B5CF6,#6D28D9)' : 'rgba(255,255,255,0.1)', border: 'none', color: paymentMethod ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 700, opacity: paying ? 0.7 : 1 }}>
                {paying ? '⏳ جاري المعالجة...' : `💳 ادفع ${Number(selectedInvoice.total).toLocaleString()} ريال`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>💳 تفاصيل الفاتورة</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{selectedInvoice.title || selectedInvoice.description || 'فاتورة'}</div>
              <div style={{ color: '#C9A227', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selectedInvoice.amount} ر.س</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>الحالة: {selectedInvoice.status === 'paid' ? '✅ مدفوعة' : selectedInvoice.status === 'pending' ? '⏳ معلقة' : '🔴 متأخرة'}</div>
              {selectedInvoice.due_date && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>تاريخ الاستحقاق: {new Date(selectedInvoice.due_date).toLocaleDateString('ar-SA')}</div>}
            </div>
            {selectedInvoice.status !== 'paid' && (
              <button onClick={async () => {
                setSaving(true);
                try {
                  const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') || '' : '';
                  const res = await fetch('/api/parent-payments?id=' + selectedInvoice.id, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ status: 'paid', paid_at: new Date().toISOString() }) });
                  if (res.ok) { setShowModal(false); }
                } catch {} finally { setSaving(false); }
              }} disabled={saving} style={{ width: '100%', background: saving ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '12px 0', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{saving ? 'جاري...' : '✅ تأكيد الدفع'}</button>
            )}
            <button onClick={() => setShowModal(false)} style={{ width: '100%', padding: '12px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}
