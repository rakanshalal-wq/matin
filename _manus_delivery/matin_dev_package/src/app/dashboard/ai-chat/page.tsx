'use client';
export const dynamic = 'force-dynamic';
import { Bot, ChevronRight, Settings, User, X } from "lucide-react";
import { useState, useRef, useEffect } from 'react';
import { Modal } from '../_components';

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: messageText, context: messages.slice(-6).map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || data.message || 'عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      }]);
    } catch (error: any) {
      setErrMsg(error.message || 'حدث خطأ في الاتصال');
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', timestamp: new Date() }]);
    }
    setLoading(false);
  };

  return (
    <div dir="rtl" className="ai-chat-wrap">
      {/* Header */}
      <div className="ai-chat-header">
        <div className="ai-avatar-bot"><Bot size={22} /></div>
        <div>
          <h1 className="ai-chat-title">المساعد الذكي</h1>
          <p className="ai-chat-sub">مدعوم بالذكاء الاصطناعي - متين AI</p>
        </div>
        <div className="ai-status">
          <span className="ai-status-dot" />
          <span>متصل</span>
        </div>
        <button className="btn-icon btn-icon-ghost" style={{ marginRight: 'auto' }} onClick={() => setShowModal(true)}>
          <Settings size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="ai-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`ai-msg-row ${msg.role === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}>
            {msg.role === 'user' && <div className="ai-avatar-user"><User size={16} /></div>}
            <div className={`ai-bubble ${msg.role === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`}>
              {msg.content}
              <div className="ai-time">
                {msg.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {msg.role === 'assistant' && <div className="ai-avatar-bot ai-avatar-sm"><Bot size={16} /></div>}
          </div>
        ))}
        {loading && (
          <div className="ai-msg-row ai-msg-bot">
            <div className="ai-bubble ai-bubble-bot">
              <div className="ai-typing">
                <span /><span /><span />
              </div>
            </div>
            <div className="ai-avatar-bot ai-avatar-sm"><Bot size={16} /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="ai-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="ai-suggestion-btn" onClick={() => sendMessage(s)}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="ai-input-bar">
        <input
          type="text"
          className="ai-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="اكتب رسالتك هنا..."
          disabled={loading}
        />
        <button
          className={`ai-send-btn ${input.trim() ? 'ai-send-active' : ''}`}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
        .ai-chat-wrap { display:flex; flex-direction:column; height:calc(100vh - 80px); direction:rtl; }
        .ai-chat-header { background:linear-gradient(135deg,#1e3a5f,#2d5a8e); color:white; padding:16px 20px; display:flex; align-items:center; gap:12px; }
        .ai-avatar-bot { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,#4caf50,#2e7d32); display:flex; align-items:center; justify-content:center; color:white; flex-shrink:0; }
        .ai-avatar-user { width:36px; height:36px; border-radius:50%; background:#1e3a5f; display:flex; align-items:center; justify-content:center; color:white; flex-shrink:0; }
        .ai-avatar-sm { width:32px; height:32px; }
        .ai-chat-title { margin:0; font-size:18px; font-weight:800; }
        .ai-chat-sub { margin:0; font-size:12px; opacity:0.8; }
        .ai-status { display:flex; align-items:center; gap:6px; font-size:12px; margin-right:auto; }
        .ai-status-dot { width:8px; height:8px; border-radius:50%; background:#4caf50; }
        .ai-messages { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:16px; background:#f8f9fa; }
        .ai-msg-row { display:flex; gap:10px; align-items:flex-end; }
        .ai-msg-user { justify-content:flex-start; }
        .ai-msg-bot { justify-content:flex-end; }
        .ai-bubble { max-width:75%; padding:14px 18px; line-height:1.7; font-size:14px; white-space:pre-wrap; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
        .ai-bubble-user { background:#1e3a5f; color:white; border-radius:4px 18px 18px 18px; }
        .ai-bubble-bot { background:white; color:#333; border-radius:18px 4px 18px 18px; }
        .ai-time { font-size:11px; opacity:0.6; margin-top:6px; text-align:left; }
        .ai-typing { display:flex; gap:4px; align-items:center; padding:4px 0; }
        .ai-typing span { width:8px; height:8px; border-radius:50%; background:#ccc; animation:bounce 1.4s infinite ease-in-out both; }
        .ai-typing span:nth-child(1){animation-delay:-0.32s} .ai-typing span:nth-child(2){animation-delay:-0.16s}
        .ai-suggestions { padding:0 20px 10px; display:flex; flex-wrap:wrap; gap:8px; background:#f8f9fa; }
        .ai-suggestion-btn { padding:8px 16px; background:white; border:1px solid #e0e0e0; border-radius:20px; font-size:13px; color:#555; cursor:pointer; transition:all 0.2s; font-family:inherit; }
        .ai-suggestion-btn:hover { background:#e3f2fd; border-color:#1e3a5f; }
        .ai-input-bar { padding:16px 20px; background:white; border-top:1px solid #e0e0e0; display:flex; gap:10px; align-items:center; }
        .ai-input { flex:1; padding:12px 18px; border:2px solid #e0e0e0; border-radius:25px; font-size:14px; outline:none; direction:rtl; font-family:inherit; }
        .ai-input:focus { border-color:#1e3a5f; }
        .ai-send-btn { width:48px; height:48px; border-radius:50%; background:#e0e0e0; color:white; border:none; cursor:default; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .ai-send-active { background:#1e3a5f; cursor:pointer; }
      `}</style>

      {showModal && (
        <Modal
          title="إعدادات المساعد الذكي"
          icon={<Settings size={18} />}
          onClose={() => setShowModal(false)}
        >
          <div className="form-row">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">النموذج</label>
              <select className="input-field" value={settingsForm.model} onChange={e => setSettingsForm({ ...settingsForm, model: e.target.value })}>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">الحد الأقصى للرموز</label>
              <input type="number" className="input-field" value={settingsForm.max_tokens} onChange={e => setSettingsForm({ ...settingsForm, max_tokens: e.target.value })} />
            </div>
          </div>
          {errMsg && <div className="error-msg">{errMsg}</div>}
          <div className="modal-footer">
            <button className="btn-gold" onClick={handleSaveSettings} disabled={saving}>
              {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
            <button className="btn-ghost" onClick={() => setShowModal(false)}><X size={15} /> إلغاء</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
