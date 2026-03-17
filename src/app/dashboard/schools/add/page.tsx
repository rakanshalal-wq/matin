'use client';
import { AlertTriangle, CheckCircle, File, FileText, MapPin, Phone, Plus, School, User } from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddSchoolPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    type: 'private',
    level: 'general',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    region: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    license_number: '',
    commercial_reg: '',
    subscription_plan: 'basic',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('فشل في إضافة المدرسة');
      }

      router.push('/dashboard/schools');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '12px 16px',
    color: 'white',
    fontSize: 14,
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 500 as const,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><Plus className="w-5 h-5 inline-block" /> إضافة مدرسة جديدة</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>أضف مدرسة أو جامعة أو معهد جديد للمنصة</p>
        </div>
        <Link href="/dashboard/schools" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 10,
          textDecoration: 'none',
          fontWeight: 600,
        }}>
          ← رجوع
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10,
          padding: 16,
          marginBottom: 24,
          color: '#EF4444',
        }}>
          <AlertTriangle className="w-5 h-5 inline-block" />️ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* معلومات المدرسة الأساسية */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <School className="w-5 h-5 inline-block" /> معلومات المدرسة الأساسية
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <label style={labelStyle}>اسم المدرسة بالعربي *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="مثال: مدارس النور الأهلية" />
            </div>
            <div>
              <label style={labelStyle}>اسم المدرسة بالإنجليزي</label>
              <input type="text" name="name_en" value={formData.name_en} onChange={handleChange} style={inputStyle} placeholder="Example: Al-Noor Private Schools" />
            </div>
            <div>
              <label style={labelStyle}>نوع المؤسسة *</label>
              <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                <option value="private">أهلي</option>
                <option value="public">حكومي</option>
                <option value="international">عالمي</option>
                <option value="university">جامعة</option>
                <option value="institute">معهد</option>
                <option value="training">مركز تدريب</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>المرحلة التعليمية *</label>
              <select name="level" value={formData.level} onChange={handleChange} style={inputStyle}>
                <option value="general">عام (كل المراحل)</option>
                <option value="kindergarten">روضة</option>
                <option value="elementary">ابتدائي</option>
                <option value="middle">متوسط</option>
                <option value="high">ثانوي</option>
                <option value="university">جامعي</option>
              </select>
            </div>
          </div>
        </div>

        {/* معلومات التواصل */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone className="w-5 h-5 inline-block" /> معلومات التواصل
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <label style={labelStyle}>البريد الإلكتروني</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="info@school.com" />
            </div>
            <div>
              <label style={labelStyle}>رقم الهاتف</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="05XXXXXXXX" />
            </div>
            <div>
              <label style={labelStyle}>الموقع الإلكتروني</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} style={inputStyle} placeholder="https://www.school.com" />
            </div>
          </div>
        </div>

        {/* العنوان */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin className="w-5 h-5 inline-block" /> العنوان
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <label style={labelStyle}>المدينة *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required style={inputStyle} placeholder="مثال: الرياض" />
            </div>
            <div>
              <label style={labelStyle}>المنطقة</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} style={inputStyle} placeholder="مثال: منطقة الرياض" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>العنوان التفصيلي</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} placeholder="الحي، الشارع، رقم المبنى" />
            </div>
          </div>
        </div>

        {/* معلومات المالك */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User className="w-5 h-5 inline-block" /> معلومات المالك / المدير
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <label style={labelStyle}>اسم المالك / المدير *</label>
              <input type="text" name="owner_name" value={formData.owner_name} onChange={handleChange} required style={inputStyle} placeholder="الاسم الكامل" />
            </div>
            <div>
              <label style={labelStyle}>البريد الإلكتروني *</label>
              <input type="email" name="owner_email" value={formData.owner_email} onChange={handleChange} required style={inputStyle} placeholder="owner@email.com" />
            </div>
            <div>
              <label style={labelStyle}>رقم الجوال *</label>
              <input type="tel" name="owner_phone" value={formData.owner_phone} onChange={handleChange} required style={inputStyle} placeholder="05XXXXXXXX" />
            </div>
          </div>
        </div>

        {/* معلومات الترخيص */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <File className="w-5 h-5 inline-block" /> معلومات الترخيص
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <label style={labelStyle}>رقم الترخيص</label>
              <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} style={inputStyle} placeholder="رقم ترخيص وزارة التعليم" />
            </div>
            <div>
              <label style={labelStyle}>السجل التجاري</label>
              <input type="text" name="commercial_reg" value={formData.commercial_reg} onChange={handleChange} style={inputStyle} placeholder="رقم السجل التجاري" />
            </div>
            <div>
              <label style={labelStyle}>الباقة</label>
              <select name="subscription_plan" value={formData.subscription_plan} onChange={handleChange} style={inputStyle}>
                <option value="basic">أساسي - مجاني</option>
                <option value="advanced">متقدم - 299 ر.س/شهر</option>
                <option value="enterprise">مؤسسي - 599 ر.س/شهر</option>
              </select>
            </div>
          </div>
        </div>

        {/* ملاحظات */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText className="w-5 h-5 inline-block" /> ملاحظات
          </h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="أي ملاحظات إضافية..."
          />
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
          <Link href="/dashboard/schools" style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            padding: '14px 32px',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            إلغاء
          </Link>
          <button type="submit" disabled={loading} style={{
            background: loading ? 'rgba(201,162,39,0.5)' : 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
            border: 'none',
            color: '#06060E',
            padding: '14px 32px',
            borderRadius: 10,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16,
          }}>
            {loading ? '⏳ جاري الحفظ...' : '<CheckCircle className="w-5 h-5 inline-block" /> حفظ المدرسة'}
          </button>
        </div>
      </form>
    </div>
  );
}
