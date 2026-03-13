'use client';
import { useState, useEffect } from 'react';

export default function EmergencyKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
      setUser(u);
    } catch {}
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/emergency-keys');
      const data = await res.json();
      setKeys(data.keys || []);
    } catch {}
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.name || !form.email) return;
    await fetch('/api/emergency-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', email: '', phone: '', role: '' });
    setShowAdd(false);
    fetchKeys();
  };

  const handleRevoke = async (id: number) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا المفتاح؟')) return;
    await fetch('/api/emergency-keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchKeys();
  };

  return (
    <div style={{ padding: 24, background: '#06060E', minHeight: '100vh', fontFamily: 'Arial' }} dir="rtl">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#C9A227', fontSize: 24, fontWeight: 800, margin: 0 }}>🗝️ مفاتيح الطوارئ</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>فتح الاختبارات المشفرة يتطلب أمرك + شخص معتمد — مثل خزنة البنك</p>
      </div>

      {/* تنبيه مهم */}
      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ color: '#EF4444', fontWeight: 700, marginBottom: 8 }}>⚠️ قواعد مفاتيح الطوارئ</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.8 }}>
          • الشخصان المعتمدان لا يقدرون يفتحون الاختبار لحالهم<br />
          • يلزم: أمرك أنت + واحد من الشخصين = يفتح<br />
          • كل عملية فتح تتسجل في سجل المراقبة<br />
          • تُستخدم فقط عند اختفاء الأستاذ أو حالة طارئة
        </div>
      </div>

      {/* الإحصاءات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'الأشخاص المعتمدون', value: keys.filter(k => k.status === 'active').length + ' / 2', color: '#C9A227' },
          { label: 'عمليات الطوارئ', value: '0', color: '#F59E0B' },
          { label: 'آخر استخدام', value: '—', color: '#10B981' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: stat.color, fontSize: 28, fontWeight: 800 }}>{stat.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* الأشخاص المعتمدون */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700 }}>الأشخاص المعتمدون</span>
          {keys.filter(k => k.status === 'active').length < 2 && (
            <button onClick={() => setShowAdd(true)}
              style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              + إضافة شخص معتمد
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
        ) : keys.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗝️</div>
            <div>لم يتم تعيين أشخاص معتمدين بعد</div>
            <div style={{ fontSize: 13, marginTop: 8, color: 'rgba(255,255,255,0.3)' }}>أضف شخصين موثوقين لحالات الطوارئ</div>
          </div>
        ) : (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {keys.map((key, i) => (
              <div key={key.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {i === 0 ? '🗝️' : '🔑'}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{key.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>{key.role || 'شخص معتمد'} • {key.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: key.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: key.status === 'active' ? '#10B981' : '#EF4444', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {key.status === 'active' ? '✅ معتمد' : '❌ ملغي'}
                  </span>
                  {key.status === 'active' && (
                    <button onClick={() => handleRevoke(key.id)}
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>
                      إلغاء
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نموذج الإضافة */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#06060E', borderRadius: 16, padding: 24, border: '1px solid rgba(201,162,39,0.3)', width: 420 }}>
            <h3 style={{ color: '#C9A227', margin: '0 0 20px 0' }}>إضافة شخص معتمد</h3>
            {[
              { label: 'الاسم الكامل', key: 'name', type: 'text' },
              { label: 'البريد الإلكتروني', key: 'email', type: 'email' },
              { label: 'رقم الجوال', key: 'phone', type: 'text' },
              { label: 'المنصب', key: 'role', type: 'text' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>{field.label}</label>
                <input
                  type={field.type}
                  value={(form as any)[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: 'white', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={handleAdd}
                style={{ flex: 1, background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 10, padding: '12px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                ✅ تأكيد
              </button>
              <button onClick={() => setShowAdd(false)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px', cursor: 'pointer', fontSize: 14 }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
