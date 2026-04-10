'use client';
import React, { useState } from 'react';
import '../../../styles/uni-faculty.css';

/* ─── بيانات الأدوار ─── */
const roles = [
  {
    id: 'hr', label: 'الموارد البشرية', icon: '👩‍💼', color: '#10B981',
    cd: 'rgba(16,185,129,0.1)', cb: 'rgba(16,185,129,0.22)',
    emp: { name: 'سارة المطيري', role: 'مديرة الموارد البشرية', av: '👩‍💼' },
    stats: [
      { val: '186', lbl: 'إجمالي الموظفين', sub: 'هيئة تدريس + إداريين + خدمات', c: '#10B981', ic: '👥' },
      { val: '12', lbl: 'طلبات إجازة معلقة', sub: 'تحتاج موافقة', c: '#FB923C', ic: '📋' },
      { val: '8', lbl: 'عقود تنتهي قريباً', sub: 'خلال 30 يوم', c: '#EF4444', ic: '📄' },
      { val: '96%', lbl: 'نسبة الحضور', sub: 'هذا الأسبوع', c: '#60A5FA', ic: '✅' },
    ],
    nav: [
      { g: 'الرئيسية', items: [{ ic: '🏠', l: 'لوحتي', on: true }, { ic: '📅', l: 'التقويم' }] },
      { g: 'إدارة الموظفين', items: [{ ic: '👥', l: 'جميع الموظفين', b: '186', bc: 'nb-a' }, { ic: '🔐', l: 'إدارة الصلاحيات' }, { ic: '📄', l: 'العقود والملفات', b: '8', bc: 'nb-r' }, { ic: '⭐', l: 'تقييم الأداء' }] },
      { g: 'خدمات الأمن والنظافة', items: [{ ic: '🛡️', l: 'حراس الأمن', b: '24', bc: 'nb-a' }, { ic: '🧹', l: 'فراشو النظافة', b: '18', bc: 'nb-a' }, { ic: '🚌', l: 'السائقون', b: '8', bc: 'nb-a' }] },
      { g: 'الإجازات والحضور', items: [{ ic: '🏖️', l: 'طلبات الإجازة', b: '12', bc: 'nb-r' }, { ic: '✅', l: 'سجل الحضور والغياب' }, { ic: '📊', l: 'إحصائيات الحضور' }] },
      { g: 'الرواتب', items: [{ ic: '💰', l: 'مسير الرواتب' }, { ic: '📈', l: 'الزيادات والعلاوات' }, { ic: '📑', l: 'قسائم الرواتب' }] },
    ],
  },
  {
    id: 'fin', label: 'المالية والحسابات', icon: '💰', color: '#F59E0B',
    cd: 'rgba(245,158,11,0.1)', cb: 'rgba(245,158,11,0.22)',
    emp: { name: 'خالد الرشيد', role: 'مدير المالية', av: '👨‍💼' },
    stats: [
      { val: '4.2M', lbl: 'الإيرادات (SAR)', sub: 'هذا الفصل', c: '#10B981', ic: '💵' },
      { val: '380K', lbl: 'رسوم معلقة', sub: 'من 42 طالب', c: '#EF4444', ic: '⏳' },
      { val: '23', lbl: 'فواتير مستحقة', sub: 'بانتظار الدفع', c: '#FB923C', ic: '📃' },
      { val: '15%', lbl: 'نسبة ضريبة VAT', sub: 'مكتملة الإعداد', c: '#60A5FA', ic: '🧾' },
    ],
    nav: [
      { g: 'الرئيسية', items: [{ ic: '🏠', l: 'لوحتي', on: true }, { ic: '📊', l: 'التقارير المالية' }] },
      { g: 'الرسوم الدراسية', items: [{ ic: '💰', l: 'رسوم الطلاب', b: '42', bc: 'nb-r' }, { ic: '🏷️', l: 'المنح والإعفاءات' }, { ic: '⚡', l: 'تذكير بالمتأخرين' }] },
      { g: 'المصروفات', items: [{ ic: '📋', l: 'الفواتير والمدفوعات', b: '23', bc: 'nb-r' }, { ic: '🏛️', l: 'ميزانية الكليات' }, { ic: '💼', l: 'رواتب الموظفين' }] },
      { g: 'الضرائب والتقارير', items: [{ ic: '🧾', l: 'ضريبة القيمة المضافة' }, { ic: '📈', l: 'التقرير السنوي' }, { ic: '🔍', l: 'المراجعة الداخلية' }] },
    ],
  },
  {
    id: 'adm', label: 'القبول والتسجيل', icon: '🎓', color: '#60A5FA',
    cd: 'rgba(96,165,250,0.1)', cb: 'rgba(96,165,250,0.22)',
    emp: { name: 'نورة الحربي', role: 'مديرة القبول والتسجيل', av: '👩‍💼' },
    stats: [
      { val: '3842', lbl: 'طلاب مقيّدون', sub: 'هذا الفصل', c: '#60A5FA', ic: '🎓' },
      { val: '12', lbl: 'طلبات قبول معلقة', sub: 'بانتظار المراجعة', c: '#FB923C', ic: '📝' },
      { val: '1240', lbl: 'مسجّلون حتى الآن', sub: '32% من الإجمالي', c: '#10B981', ic: '✅' },
      { val: '312', lbl: 'متأهلون للتخرج', sub: 'هذا الفصل', c: '#A78BFA', ic: '🏆' },
    ],
    nav: [
      { g: 'الرئيسية', items: [{ ic: '🏠', l: 'لوحتي', on: true }, { ic: '📅', l: 'التقويم الأكاديمي' }] },
      { g: 'القبول', items: [{ ic: '📝', l: 'طلبات القبول', b: '12', bc: 'nb-r' }, { ic: '📋', l: 'معايير القبول' }, { ic: '🔗', l: 'بوابة القبول الموحد' }] },
      { g: 'التسجيل الفصلي', items: [{ ic: '✅', l: 'التسجيل الحالي', b: 'مفتوح', bc: 'nb-a' }, { ic: '📚', l: 'المقررات المتاحة' }, { ic: '⏰', l: 'الجداول الدراسية' }] },
      { g: 'الشهادات', items: [{ ic: '🏆', l: 'طلبات التخرج', b: '312', bc: 'nb-a' }, { ic: '📜', l: 'إصدار الشهادات' }] },
    ],
  },
  {
    id: 'it', label: 'تقنية المعلومات', icon: '💻', color: '#A78BFA',
    cd: 'rgba(167,139,250,0.1)', cb: 'rgba(167,139,250,0.22)',
    emp: { name: 'عمر القحطاني', role: 'مدير تقنية المعلومات', av: '👨‍💻' },
    stats: [
      { val: '98.7%', lbl: 'وقت تشغيل الأنظمة', sub: 'هذا الشهر', c: '#10B981', ic: '🖥️' },
      { val: '14', lbl: 'تذاكر دعم مفتوحة', sub: 'بانتظار الحل', c: '#FB923C', ic: '🎫' },
      { val: '4028', lbl: 'مستخدم نشط', sub: 'أكاديميون وطلاب', c: '#A78BFA', ic: '👥' },
      { val: '3', lbl: 'تحديثات مجدولة', sub: 'هذا الأسبوع', c: '#60A5FA', ic: '🔄' },
    ],
    nav: [
      { g: 'الرئيسية', items: [{ ic: '🏠', l: 'لوحتي', on: true }, { ic: '📊', l: 'مراقبة الأنظمة' }] },
      { g: 'الدعم التقني', items: [{ ic: '🎫', l: 'تذاكر الدعم', b: '14', bc: 'nb-r' }, { ic: '📋', l: 'سجل الحوادث' }] },
      { g: 'إدارة المستخدمين', items: [{ ic: '👤', l: 'الحسابات والصلاحيات' }, { ic: '🔑', l: 'كلمات المرور' }, { ic: '🛡️', l: 'الأمن والحماية' }] },
      { g: 'الأنظمة', items: [{ ic: '☁️', l: 'الخوادم' }, { ic: '🔄', l: 'النسخ الاحتياطي' }, { ic: '🔧', l: 'الصيانة', b: '3', bc: 'nb-a' }] },
    ],
  },
  {
    id: 'std', label: 'شؤون الطلاب', icon: '🎒', color: '#FB923C',
    cd: 'rgba(251,146,60,0.1)', cb: 'rgba(251,146,60,0.22)',
    emp: { name: 'فهد العتيبي', role: 'مدير شؤون الطلاب', av: '👨‍💼' },
    stats: [
      { val: '47', lbl: 'شكاوى مفتوحة', sub: 'بانتظار المعالجة', c: '#EF4444', ic: '📢' },
      { val: '28', lbl: 'طلبات منح معلقة', sub: 'بانتظار الموافقة', c: '#FB923C', ic: '🏅' },
      { val: '3842', lbl: 'طلاب نشطون', sub: 'مقيّدون هذا الفصل', c: '#10B981', ic: '👥' },
      { val: '18', lbl: 'فعاليات هذا الشهر', sub: 'أنشطة وفعاليات', c: '#60A5FA', ic: '🎉' },
    ],
    nav: [
      { g: 'الرئيسية', items: [{ ic: '🏠', l: 'لوحتي', on: true }, { ic: '📅', l: 'الفعاليات' }] },
      { g: 'الطلاب', items: [{ ic: '📢', l: 'الشكاوى', b: '47', bc: 'nb-r' }, { ic: '🏅', l: 'طلبات المنح', b: '28', bc: 'nb-r' }, { ic: '🚌', l: 'النقل الجامعي' }] },
      { g: 'الأنشطة', items: [{ ic: '🎉', l: 'الفعاليات' }, { ic: '⚽', l: 'الأنشطة الرياضية' }, { ic: '🎨', l: 'الأندية الطلابية' }] },
    ],
  },
  {
    id: 'sec', label: 'السكرتارية والإدارة', icon: '📋', color: '#22D3EE',
    cd: 'rgba(34,211,238,0.1)', cb: 'rgba(34,211,238,0.22)',
    emp: { name: 'ريم الشمري', role: 'المديرة الإدارية', av: '👩‍💼' },
    stats: [
      { val: '34', lbl: 'مراسلات اليوم', sub: 'واردة وصادرة', c: '#22D3EE', ic: '📧' },
      { val: '6', lbl: 'اجتماعات هذا الأسبوع', sub: 'مجدولة', c: '#A78BFA', ic: '📅' },
      { val: '128', lbl: 'وثيقة في الأرشيف', sub: 'هذا الشهر', c: '#10B981', ic: '🗃️' },
      { val: '9', lbl: 'قرارات معلقة', sub: 'بانتظار التوقيع', c: '#FB923C', ic: '✍️' },
    ],
    nav: [
      { g: 'الرئيسية', items: [{ ic: '🏠', l: 'لوحتي', on: true }, { ic: '📅', l: 'التقويم' }] },
      { g: 'المراسلات', items: [{ ic: '📧', l: 'البريد الوارد', b: '34', bc: 'nb-a' }, { ic: '📤', l: 'البريد الصادر' }, { ic: '📋', l: 'الخطابات الرسمية' }] },
      { g: 'الوثائق', items: [{ ic: '🗃️', l: 'الأرشيف' }, { ic: '📝', l: 'القرارات', b: '9', bc: 'nb-r' }, { ic: '📄', l: 'النماذج' }] },
      { g: 'الاجتماعات', items: [{ ic: '🤝', l: 'جدول الاجتماعات', b: '6', bc: 'nb-a' }, { ic: '📋', l: 'المحاضر' }] },
    ],
  },
];

/* ─── بيانات الموظفين ─── */
const employees = [
  { name: 'د. محمد العتيبي', role: 'أستاذ مساعد', dept: 'هندسة الحاسب', type: 'هيئة تدريس', status: 'نشط', hrOnly: false },
  { name: 'سارة الزهراني', role: 'معيدة', dept: 'هندسة الحاسب', type: 'هيئة تدريس', status: 'نشط', hrOnly: false },
  { name: 'خالد المطيري', role: 'موظف إداري', dept: 'شؤون الطلاب', type: 'إداري', status: 'إجازة', hrOnly: true },
  { name: 'نورة الحربي', role: 'موظفة استقبال', dept: 'القبول', type: 'إداري', status: 'نشط', hrOnly: true },
  { name: 'فيصل الشمري', role: 'حارس أمن', dept: 'الأمن والسلامة', type: 'أمن', status: 'نشط', hrOnly: true },
  { name: 'أحمد القحطاني', role: 'حارس أمن', dept: 'الأمن والسلامة', type: 'أمن', status: 'نشط', hrOnly: true },
  { name: 'ريم السلمي', role: 'فراشة', dept: 'خدمات النظافة', type: 'نظافة', status: 'نشط', hrOnly: true },
  { name: 'محمد الغامدي', role: 'فراش', dept: 'خدمات النظافة', type: 'نظافة', status: 'نشط', hrOnly: true },
  { name: 'عبدالله الدوسري', role: 'سائق', dept: 'النقل الجامعي', type: 'نقل', status: 'نشط', hrOnly: true },
];

const typeClass: Record<string, string> = {
  'هيئة تدريس': 'bb', 'إداري': 'bp', 'أمن': 'br', 'نظافة': 'bg', 'نقل': 'bo',
};

/* ─── مكوّن لوحة HR ─── */
function HRContent({ color, cd, cb, onOpenPerm, onOpenAdd }: {
  color: string; cd: string; cb: string;
  onOpenPerm: (name: string) => void;
  onOpenAdd: () => void;
}) {
  return (
    <>
      {/* إشعار صلاحيات HR */}
      <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)', borderRadius: '11px', padding: '11px 14px', marginBottom: '13px', fontSize: '12px', color: 'var(--td)', display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
        <div><strong style={{ color: 'var(--gr)' }}>صلاحيات الموارد البشرية:</strong> تتحكم كامل في حسابات الفراشين، حراس الأمن، السائقين، والإداريين — إضافة وتعديل وتجميد وحذف. أما هيئة التدريس فصلاحياتهم الأكاديمية من العميد، لكن بيانات العقد والراتب تديرها الموارد البشرية فقط.</div>
      </div>

      {/* جدول الموظفين الكامل */}
      <div className="card">
        <div className="ch">
          <div className="ct">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            جميع الموظفين — التحكم الكامل
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <select style={{ background: 'rgba(255,255,255,.04)', border: '1px solid var(--b2)', color: 'var(--td)', fontSize: '11px', padding: '4px 8px', borderRadius: '6px', fontFamily: 'var(--f)', outline: 'none' }}>
              <option>الكل</option><option>هيئة التدريس</option><option>إداريون</option><option>أمن</option><option>نظافة</option><option>نقل</option>
            </select>
            <button onClick={onOpenAdd} style={{ background: `linear-gradient(135deg,${color},${color}aa)`, border: 'none', borderRadius: '7px', padding: '5px 12px', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--f)' }}>+ إضافة موظف</button>
          </div>
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr><th>الموظف</th><th>الوظيفة</th><th>القسم</th><th>النوع</th><th>الحالة</th><th>الصلاحيات</th></tr>
            </thead>
            <tbody>
              {employees.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--t)' }}>{e.name}</td>
                  <td style={{ color: 'var(--tm)', fontSize: '11px' }}>{e.role}</td>
                  <td style={{ color: 'var(--tm)', fontSize: '11px' }}>{e.dept}</td>
                  <td><span className={`badge ${typeClass[e.type] || 'bb'}`}>{e.type}</span></td>
                  <td><span className={`badge ${e.status === 'نشط' ? 'bg' : e.status === 'إجازة' ? 'bo' : 'br'}`}>{e.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-sm" style={{ background: cd, color: color, border: `1px solid ${cb}` }} onClick={() => onOpenPerm(e.name)}>🔐 صلاحيات</button>
                      {e.hrOnly && (
                        <button className="btn-sm" style={{ background: 'rgba(239,68,68,.08)', color: 'var(--rd)', border: '1px solid rgba(239,68,68,.2)' }}>تجميد</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* الصف الثاني: طلبات الإجازة + عقود + توزيع */}
      <div className="g2">
        {/* طلبات الإجازة المعلقة */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="ch">
            <div className="ct">
              📋 طلبات الإجازة المعلقة
              <span style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: 'var(--rd)', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', marginRight: '4px' }}>12</span>
            </div>
          </div>
          {[
            ['فيصل الشمري', 'حارس أمن', 'إجازة اعتيادية أسبوع'],
            ['ريم السلمي', 'فراشة', 'إجازة مرضية 3 أيام'],
            ['عبدالله الدوسري', 'سائق', 'استئذان يوم'],
            ['خالد المطيري', 'إداري', 'إجازة طارئة'],
          ].map(([n, r2, d], i) => (
            <div className="item" key={i}>
              <div className="item-ic" style={{ background: 'rgba(251,146,60,.1)' }}>📋</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>{n}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>{r2} · {d}</div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-sm" style={{ background: 'rgba(16,185,129,.08)', color: 'var(--gr)', border: '1px solid rgba(16,185,129,.2)' }}>قبول</button>
                <button className="btn-sm" style={{ background: 'rgba(239,68,68,.08)', color: 'var(--rd)', border: '1px solid rgba(239,68,68,.2)' }}>رفض</button>
              </div>
            </div>
          ))}
          <div style={{ padding: '8px 13px', textAlign: 'center', fontSize: '11px', color: 'var(--tm)' }}>+ 8 طلبات أخرى</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* عقود تنتهي قريباً */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="ch">
              <div className="ct">
                📄 عقود تنتهي قريباً
                <span style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: 'var(--rd)', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', marginRight: '4px' }}>8</span>
              </div>
            </div>
            {[
              ['فيصل الشمري', 'حارس أمن', 'انتهت', 'br'],
              ['ريم السلمي', 'فراشة', 'بعد 10 أيام', 'bo'],
              ['أحمد القحطاني', 'حارس أمن', 'بعد 20 يوم', 'bo'],
              ['د. عمر النمر', 'دكتور', 'بعد 25 يوم', 'bb'],
            ].map(([n, r2, d], i) => (
              <div className="item" key={i}>
                <div className="item-ic" style={{ background: 'rgba(239,68,68,.1)' }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>{n}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>{r2} · {d}</div>
                </div>
                <button className="btn-sm" style={{ background: cd, color: color, border: `1px solid ${cb}` }}>تجديد</button>
              </div>
            ))}
          </div>

          {/* توزيع الموظفين */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="ch"><div className="ct">📊 توزيع الموظفين</div></div>
            <div style={{ padding: '12px 13px' }}>
              {[
                ['هيئة التدريس', '154', '#60A5FA', 83],
                ['الإداريون', '12', '#A78BFA', 7],
                ['الأمن', '24', '#EF4444', 13],
                ['النظافة', '18', '#10B981', 10],
                ['السائقون', '8', '#FB923C', 4],
              ].map(([lbl, val, col, pct], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--td)', width: '90px', flexShrink: 0 }}>{lbl}</div>
                  <div style={{ flex: 1 }}>
                    <div className="pbar"><div className="pfill" style={{ width: `${pct}%`, background: col as string }}></div></div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: col as string, width: '28px', textAlign: 'left' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* الإجراءات السريعة */}
      <div className="card">
        <div className="ch"><div className="ct">⚡ الإجراءات السريعة</div></div>
        <div style={{ padding: '12px' }}>
          <div className="qg">
            {[
              ['#10B981', '➕', 'إضافة موظف'],
              ['#EF4444', '🔐', 'إدارة الصلاحيات'],
              ['#FB923C', '📋', 'معالجة إجازة'],
              ['#EF4444', '📄', 'تجديد عقد'],
              ['#60A5FA', '⭐', 'تقييم أداء'],
              ['#A78BFA', '💰', 'مسير الرواتب'],
              ['#22D3EE', '🎓', 'برنامج تدريب'],
              ['#D4A843', '📊', 'تقرير HR'],
              ['#10B981', '📑', 'قسيمة راتب'],
              ['#FB923C', '🛡️', 'سجل الأمن'],
              ['#10B981', '🧹', 'سجل النظافة'],
              ['#EF4444', '🔒', 'تجميد حساب'],
            ].map(([c2, ic, lbl], i) => (
              <a className="qi" href="#" key={i}>
                <div className="qic" style={{ background: `${c2}18`, border: `1px solid ${c2}38` }}>{ic}</div>
                <span className="ql">{lbl}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── مكوّن المحتوى العام ─── */
function GenericContent({ r }: { r: typeof roles[0] }) {
  return (
    <>
      <div className="ph">
        <div>
          <div className="pt" style={{ color: r.color }}>{r.icon} لوحة {r.label}</div>
          <div className="ps">جامعة الرياض الأهلية — الفصل الثاني 1445/1446</div>
        </div>
        <button className="btn-p" style={{ background: `linear-gradient(135deg,${r.color},${r.color}aa)` }}>+ إضافة جديد</button>
      </div>
      <div className="sg">
        {r.stats.map((s, i) => (
          <div className="sc" key={i}>
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${s.c}10,transparent 60%)`, pointerEvents: 'none' }}></div>
            <div className="si" style={{ background: `${s.c}18`, border: `1px solid ${s.c}30` }}>{s.ic}</div>
            <div className="sv" style={{ color: s.c }}>{s.val}</div>
            <div className="sl">{s.lbl}</div>
            <div className="ss" style={{ color: `${s.c}80` }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="ch"><div className="ct">📊 محتوى {r.label}</div></div>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--tm)' }}>سيتم عرض محتوى {r.label} هنا</div>
      </div>
    </>
  );
}

/* ─── الصفحة الرئيسية ─── */
export default function FacultyPage() {
  const [activeRoleId, setActiveRoleId] = useState('hr');
  const [sbOpen, setSbOpen] = useState(false);
  const [permModal, setPermModal] = useState(false);
  const [permName, setPermName] = useState('موظف');
  const [addModal, setAddModal] = useState(false);

  const activeRole = roles.find(r => r.id === activeRoleId) || roles[0];

  const openPerm = (name: string) => { setPermName(name); setPermModal(true); };

  /* ─── Sidebar Nav ─── */
  const SidebarNav = () => (
    <nav className="nav">
      {activeRole.nav.map((grp, gi) => (
        <React.Fragment key={gi}>
          <div className="ng">{grp.g}</div>
          {grp.items.map((item, ii) => (
            <a className={`ni${item.on ? ' on' : ''}`} href="#" key={ii}>
              <span style={{ fontSize: '13px' }}>{item.ic}</span>
              {item.l}
              {item.b
                ? <span className={`nb ${item.bc || 'nb-a'}`}>{item.b}</span>
                : item.on ? <span className="dot"></span> : null
              }
            </a>
          ))}
        </React.Fragment>
      ))}
    </nav>
  );

  return (
    <div className="page" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', color: 'var(--t)', fontFamily: 'var(--f)' }}>

      {/* OVERLAY */}
      <div
        className={`ov${sbOpen ? ' show' : ''}`}
        id="ov"
        onClick={() => setSbOpen(false)}
      />

      {/* MODAL: صلاحيات */}
      <div className={`modal-bg${permModal ? ' show' : ''}`} id="perm-modal">
        <div className="modal" style={{ borderColor: activeRole.cb }}>
          <div className="mh">
            <div className="mt">🔐 صلاحيات <span>{permName}</span></div>
            <button className="mx" onClick={() => setPermModal(false)}>×</button>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)', borderRadius: '9px', padding: '10px 13px', marginBottom: '14px', fontSize: '12px', color: 'var(--td)' }}>
              <strong style={{ color: 'var(--gr)' }}>الموارد البشرية</strong> — لديها صلاحية إعطاء وسحب الوصول لجميع موظفي الخدمات والإداريين
            </div>

            <div style={{ fontSize: '10px', color: 'var(--tm)', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>وصول النظام</div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: '9px', overflow: 'hidden', marginBottom: '12px' }}>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>الدخول لنظام متين</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>حساب في النظام وكلمة مرور</div></div>
                <label className="tog"><input type="checkbox" defaultChecked /><span className="tsl"></span></label>
              </div>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>تطبيق الجوال</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>الوصول من الهاتف</div></div>
                <label className="tog"><input type="checkbox" defaultChecked /><span className="tsl"></span></label>
              </div>
            </div>

            <div style={{ fontSize: '10px', color: 'var(--tm)', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>صلاحيات الحضور</div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: '9px', overflow: 'hidden', marginBottom: '12px' }}>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>تسجيل حضوره بنفسه</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>عبر الجوال أو البصمة</div></div>
                <label className="tog"><input type="checkbox" defaultChecked /><span className="tsl"></span></label>
              </div>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>طلب إجازة عبر النظام</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>إجازة اعتيادية أو طارئة</div></div>
                <label className="tog"><input type="checkbox" defaultChecked /><span className="tsl"></span></label>
              </div>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>عرض كشف الراتب</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>قسيمة الراتب الشهرية</div></div>
                <label className="tog"><input type="checkbox" defaultChecked /><span className="tsl"></span></label>
              </div>
            </div>

            <div style={{ fontSize: '10px', color: 'var(--tm)', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>صلاحيات إضافية (حسب الدور)</div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: '9px', overflow: 'hidden', marginBottom: '14px' }}>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>عرض خريطة المبنى</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>لحراس الأمن والفراشين</div></div>
                <label className="tog"><input type="checkbox" defaultChecked /><span className="tsl"></span></label>
              </div>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>تقارير العمل اليومي</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>رفع تقرير إنجاز يومي</div></div>
                <label className="tog"><input type="checkbox" /></label>
              </div>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>إرسال رسائل داخلية</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>مراسلة المشرف المباشر</div></div>
                <label className="tog"><input type="checkbox" defaultChecked /><span className="tsl"></span></label>
              </div>
              <div className="perm-row">
                <div><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>الوصول لملف الطلاب</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>محظور على خدمات الأمن والنظافة</div></div>
                <label className="tog"><input type="checkbox" /></label>
              </div>
            </div>

            <div style={{ background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '9px', padding: '10px 13px', marginBottom: '14px', fontSize: '12px', color: 'var(--td)' }}>
              <strong style={{ color: 'var(--rd)' }}>تجميد الحساب</strong> — عند إنهاء الخدمة، يُجمَّد الحساب فوراً ويُحذف خلال 30 يوم
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <button onClick={() => setPermModal(false)} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: '7px', padding: '6px 14px', color: 'var(--rd)', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--f)' }}>🔒 تجميد الحساب</button>
                <button onClick={() => setPermModal(false)} style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.4)', borderRadius: '7px', padding: '6px 14px', color: 'var(--rd)', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--f)' }}>🗑️ حذف نهائي</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPermModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid var(--b1)', borderRadius: '9px', padding: '11px', color: 'var(--td)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--f)' }}>إلغاء</button>
              <button onClick={() => setPermModal(false)} style={{ flex: 2, background: 'linear-gradient(135deg,var(--ac),#059669)', border: 'none', borderRadius: '9px', padding: '11px', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--f)' }}>حفظ الصلاحيات ✓</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: إضافة موظف */}
      <div className={`modal-bg${addModal ? ' show' : ''}`} id="add-modal">
        <div className="modal" style={{ borderColor: activeRole.cb }}>
          <div className="mh">
            <div className="mt">➕ إضافة موظف جديد</div>
            <button className="mx" onClick={() => setAddModal(false)}>×</button>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2px' }}>
              <div><label className="flbl">الاسم الكامل</label><input className="finp" type="text" placeholder="الاسم الكامل" style={{ marginBottom: 0 }} /></div>
              <div><label className="flbl">رقم الهوية الوطنية</label><input className="finp" type="text" placeholder="10XXXXXXXX" style={{ marginBottom: 0 }} /></div>
            </div>
            <div style={{ height: '10px' }} />
            <label className="flbl">المسمى الوظيفي</label>
            <select className="finp">
              <option>-- اختر الوظيفة --</option>
              <optgroup label="خدمات الأمن">
                <option>حارس أمن</option><option>مشرف أمن</option>
              </optgroup>
              <optgroup label="خدمات النظافة">
                <option>فراش / عامل نظافة</option><option>مشرف نظافة</option>
              </optgroup>
              <optgroup label="خدمات النقل">
                <option>سائق</option><option>مشرف نقل</option>
              </optgroup>
              <optgroup label="الإداريون">
                <option>موظف إداري</option><option>سكرتير/ة</option><option>موظف استقبال</option>
              </optgroup>
              <optgroup label="هيئة التدريس (للتسجيل فقط)">
                <option>دكتور / أستاذ</option><option>معيد / محاضر</option>
              </optgroup>
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2px' }}>
              <div>
                <label className="flbl">القسم / الإدارة</label>
                <select className="finp" style={{ marginBottom: 0 }}>
                  <option>الأمن والسلامة</option><option>خدمات النظافة</option><option>النقل الجامعي</option><option>الإدارة العامة</option><option>هيئة التدريس</option>
                </select>
              </div>
              <div><label className="flbl">الراتب الأساسي (SAR)</label><input className="finp" type="number" placeholder="0.00" style={{ marginBottom: 0 }} /></div>
            </div>
            <div style={{ height: '10px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div><label className="flbl">تاريخ بداية العقد</label><input className="finp" type="date" style={{ marginBottom: 0 }} /></div>
              <div><label className="flbl">تاريخ نهاية العقد</label><input className="finp" type="date" style={{ marginBottom: 0 }} /></div>
            </div>
            <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)', borderRadius: '9px', padding: '10px 13px', marginBottom: '14px', fontSize: '12px', color: 'var(--td)' }}>
              ✅ سيتم إنشاء حساب تلقائياً في النظام وإرسال بيانات الدخول للموظف عبر رسالة نصية
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setAddModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid var(--b1)', borderRadius: '9px', padding: '11px', color: 'var(--td)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--f)' }}>إلغاء</button>
              <button onClick={() => setAddModal(false)} style={{ flex: 2, background: 'linear-gradient(135deg,var(--ac),#059669)', border: 'none', borderRadius: '9px', padding: '11px', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--f)' }}>إضافة وإنشاء حساب ←</button>
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`sb${sbOpen ? ' open' : ''}`} id="sb">
        <div className="sb-top">
          <a className="logo-r" href="#">
            <div className="li">م</div>
            <div><div className="lt">متين</div><div className="ls">نظام إدارة التعليم</div></div>
          </a>
          <div className="emp-card" style={{ background: activeRole.cd, border: `1px solid ${activeRole.cb}` }}>
            <div className="emp-av">{activeRole.emp.av}</div>
            <div style={{ minWidth: 0 }}>
              <div className="emp-n">{activeRole.emp.name}</div>
              <div className="emp-r" style={{ color: activeRole.color }}>{activeRole.emp.role}</div>
              <div className="emp-d">{activeRole.label}</div>
            </div>
          </div>
        </div>

        <SidebarNav />

        <div className="sb-ft">
          <button className="lo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            تسجيل الخروج
          </button>
          <div style={{ marginTop: '6px', color: 'rgba(238,238,245,.14)', fontSize: '10px', textAlign: 'center' }}>متين v6 — {activeRole.label}</div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* HEADER */}
        <header className="hdr">
          <div className="hl">
            <button className="mb" onClick={() => { setSbOpen(!sbOpen); }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div>
              <div className="ht">لوحة {activeRole.label}</div>
              <div className="hs">جامعة الرياض الأهلية — الفصل الثاني 1445/1446</div>
            </div>
          </div>
          <div className="hr2">
            <div className="hb">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              <span className="nd"></span>
            </div>
            <div className="ub">
              <div className="ua">{activeRole.emp.av}</div>
              <div className="ui">
                <div className="un">{activeRole.emp.name}</div>
                <div className="ur" style={{ color: activeRole.color }}>{activeRole.label}</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </header>

        {/* ROLE TABS */}
        <div className="role-tabs">
          {roles.map(r => (
            <button
              key={r.id}
              className={`rtab${activeRoleId === r.id ? ' active' : ''}`}
              onClick={() => setActiveRoleId(r.id)}
              style={{
                color: activeRoleId === r.id ? r.color : '',
                borderBottomColor: activeRoleId === r.id ? r.color : 'transparent',
              }}
            >
              <span style={{ fontSize: '14px' }}>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="con">
          {/* إحصائيات */}
          <div className="sg" style={{ marginBottom: '13px' }}>
            {activeRole.stats.map((s, i) => (
              <div className="sc" key={i}>
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${s.c}10,transparent 60%)`, pointerEvents: 'none' }}></div>
                <div className="si" style={{ background: `${s.c}18`, border: `1px solid ${s.c}30` }}>{s.ic}</div>
                <div className="sv" style={{ color: s.c }}>{s.val}</div>
                <div className="sl">{s.lbl}</div>
                <div className="ss" style={{ color: `${s.c}80` }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* المحتوى حسب الدور */}
          {activeRoleId === 'hr' ? (
            <HRContent
              color={activeRole.color}
              cd={activeRole.cd}
              cb={activeRole.cb}
              onOpenPerm={openPerm}
              onOpenAdd={() => setAddModal(true)}
            />
          ) : (
            <GenericContent r={activeRole} />
          )}
        </div>

        <footer className="ft">
          <p>© 2026 متين — جامعة الرياض الأهلية</p>
          <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
        </footer>
      </div>
    </div>
  );
}
