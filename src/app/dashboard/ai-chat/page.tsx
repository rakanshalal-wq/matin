'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'مرحباً! أنا المساعد الذكي لمنصة متين. كيف يمكنني مساعدتك اليوم؟\n\nيمكنني مساعدتك في:\n- إدارة الطلاب والمعلمين\n- تحليل الدرجات والأداء\n- إنشاء التقارير\n- الإجابة على أسئلتك التعليمية\n- تقييم الأسئلة الامتحانية',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ model: 'gpt-4', language: 'ar', max_tokens: '2000' });
  const [errMsg, setErrMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions] = useState([
    'أعطني ملخص أداء الطلاب هذا الشهر',
    'كيف أضيف اختبار جديد؟',
    'ما هي نسبة الحضور اليوم؟',
    'ساعدني في إنشاء سؤال امتحاني',
    'أريد تقرير مالي للمدرسة',
    'كيف أفعّل نظام النقل؟'
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateMessage = async (messageId: string, content: string) => {
    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] 
        || localStorage.getItem('token') || '';
      const res = await fetch(`/api/ai/chat?id=${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content })
      });
      if (!res.ok) { const d = await res.json(); setErrMsg(d.error || 'فشل التحديث'); }
      else setEditItem(null);
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); }
  };
  const handleSaveSettings = async () => {
    setSaving(true); setErrMsg('');
    try {
      const token = localStorage.getItem('matin_token') || '';
      const res = await fetch('/api/ai/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(settingsForm) });
      if (res.ok) { setShowModal(false); }
      else { const d = await res.json(); setErrMsg(d.error || 'فشل حفظ الإعدادات'); }
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };
  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] 
        || localStorage.getItem('token') || '';
      
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: messageText,
          context: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || data.message || 'عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      setErrMsg(error.message || 'حدث خطأ في الاتصال');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      }]);
    }
    setLoading(false);
  };

  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d5a8e)', color: 'white', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
          🤖
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>المساعد الذكي</h1>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>مدعوم بالذكاء الاصطناعي - متين AI</p>
        </div>
        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></span>
          <span style={{ fontSize: '12px' }}>متصل</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end', gap: '10px' }}>
            {msg.role === 'user' && (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', flexShrink: 0 }}>
                👤
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
              background: msg.role === 'user' ? '#1e3a5f' : 'white',
              color: msg.role === 'user' ? 'white' : '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              lineHeight: '1.7',
              fontSize: '14px',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
              <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '6px', textAlign: 'left' }}>
                {msg.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {msg.role === 'assistant' && (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4caf50, #2e7d32)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', flexShrink: 0 }}>
                🤖
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <div style={{ padding: '14px 18px', borderRadius: '18px 4px 18px 18px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ccc', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ccc', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ccc', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 20px 10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              style={{ padding: '8px 16px', background: 'white', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '13px', color: '#555', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { (e.target as HTMLElement).style.background = '#e3f2fd'; (e.target as HTMLElement).style.borderColor = '#1e3a5f'; }}
              onMouseOut={(e) => { (e.target as HTMLElement).style.background = 'white'; (e.target as HTMLElement).style.borderColor = '#e0e0e0'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '16px 20px', background: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="اكتب رسالتك هنا..."
          disabled={loading}
          style={{ flex: 1, padding: '12px 18px', border: '2px solid #e0e0e0', borderRadius: '25px', fontSize: '14px', outline: 'none', direction: 'rtl' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{ width: '48px', height: '48px', borderRadius: '50%', background: input.trim() ? '#1e3a5f' : '#e0e0e0', color: 'white', border: 'none', fontSize: '20px', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
        >
          ➤
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>

      {/* Settings Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#8B5CF6', fontSize: 18, fontWeight: 700, margin: 0 }}>⚙️ إعدادات المساعد الذكي</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            {errMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13 }}>{errMsg}</div>}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>النموذج</label>
              <select value={settingsForm.model} onChange={e => setSettingsForm({ ...settingsForm, model: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13 }}>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>الحد الأقصى للرموز</label>
              <input type="number" value={settingsForm.max_tokens} onChange={e => setSettingsForm({ ...settingsForm, max_tokens: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSaveSettings} disabled={saving} style={{ flex: 1, background: saving ? 'rgba(139,92,246,0.5)' : 'linear-gradient(135deg,#8B5CF6,#A78BFA)', border: 'none', borderRadius: 10, padding: '12px 0', color: '#fff', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14 }}>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
