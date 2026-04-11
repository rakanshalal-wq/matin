"use client";

import React from 'react';
import { Book, Download, Lock, FileText, Globe } from "lucide-react";

interface LibraryItem {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'doc';
  is_global: boolean;
  link: string;
}

interface LibrarySectionProps {
  items: LibraryItem[];
  primaryColor: string;
  institutionName: string;
}

const LibrarySection: React.FC<LibrarySectionProps> = ({ items, primaryColor, institutionName }) => {
  return (
    <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${primaryColor}15`, padding: '6px 14px', borderRadius: '20px', color: primaryColor, fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
              <Book size={14} /> المكتبة الرقمية
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff' }}>المصادر التعليمية</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', marginTop: '8px' }}>محتوى تعليمي حصري لطلاب {institutionName}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {items && items.length > 0 ? items.map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}>
              {item.is_global && (
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(212,168,67,0.1)', color: '#D4A843', fontSize: '10px', fontWeight: 900, padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(212,168,67,0.2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={10} /> محتوى متين المركزي
                </div>
              )}
              
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${primaryColor}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <FileText size={24} color={primaryColor} />
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>نوع الملف: {item.type.toUpperCase()}</p>

              <button style={{ width: '100%', padding: '12px', borderRadius: '12px', background: item.is_global ? 'rgba(212,168,67,0.1)' : 'rgba(255,255,255,0.05)', color: item.is_global ? '#D4A843' : '#fff', border: `1px solid ${item.is_global ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.1)'}`, fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Download size={16} /> تحميل المحتوى
              </button>
            </div>
          )) : (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Lock size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: '16px' }} />
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>المكتبة الرقمية قيد التجهيز حالياً</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LibrarySection;
