<script>
// Mobile nav
function openMobNav(){ document.getElementById('mobNav').classList.add('open'); }
function closeMobNav(){ document.getElementById('mobNav').classList.remove('open'); }

// Smooth scroll
function scrollTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth'});
  closeMobNav();
}

// Login placeholder
function openLogin(){
  toast('📱 جارٍ فتح صفحة تسجيل الدخول...','var(--school-primary)');
}

// Register
function submitReg(){
  toast('✅ تم إرسال طلب التسجيل — ستصلك رسالة خلال 24 ساعة','var(--gr)');
}

// AI Assistant
const aiResponses = [
  'سؤال ممتاز! دعني أشرح لك بالتفصيل...',
  'بكل سرور 😊 الإجابة هي...',
  'هذا موضوع مهم في المنهج. الجواب هو...',
  'سؤالك ذكي! في الحقيقة...',
  'يسعدني مساعدتك. الحل خطوة بخطوة...',
];
function sendAI(){
  const inp = document.getElementById('ai-inp');
  const chat = document.getElementById('ai-chat');
  if(!inp.value.trim()) return;
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-msg';
  userMsg.style.flexDirection = 'row-reverse';
  userMsg.innerHTML = `<div class="ai-av" style="background:rgba(30,136,229,.12);border:1px solid rgba(30,136,229,.22);">👦</div><div class="ai-bubble">${inp.value}</div>`;
  chat.appendChild(userMsg);
  const q = inp.value; inp.value = '';
  chat.scrollTop = chat.scrollHeight;
  setTimeout(()=>{
    const botMsg = document.createElement('div');
    botMsg.className = 'ai-msg';
    botMsg.innerHTML = `<div class="ai-av" style="background:rgba(255,179,0,.12);border:1px solid rgba(255,179,0,.22);">🤖</div><div class="ai-bubble bot">${aiResponses[Math.floor(Math.random()*aiResponses.length)]} <br><br><em style="color:var(--tm);font-size:11px;">(هذا عرض توضيحي — المساعد الحقيقي مدرّب على منهج المدرسة)</em></div>`;
    chat.appendChild(botMsg);
    chat.scrollTop = chat.scrollHeight;
  }, 900);
}
document.getElementById('ai-inp').addEventListener('keydown', e => { if(e.key==='Enter') sendAI(); });

// Toast
function toast(msg, color='var(--school-primary)'){
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:${color};color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;z-index:999;font-family:var(--f);box-shadow:0 6px 24px rgba(0,0,0,.4);`;
  t.textContent = msg; document.body.appendChild(t);
  setTimeout(()=>t.remove(), 3000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.querySelector('.nav').style.borderBottomColor = window.scrollY > 50 ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.08)';
});
</script>

<!-- ════ MODAL: المتجر ════ -->
<div class="modal-overlay" id="modal-store" onclick="if(event.target===this)closeModal('modal-store')">
  <div class="modal-box">
    <div class="modal-hdr">
      <div class="modal-title">
        <div class="modal-title-ic" style="background:linear-gradient(135deg,#7a4a1a,#5c3510);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        متجر مدرسة الأمل الإلكتروني
      </div>
      <button class="modal-close" onclick="closeModal('modal-store')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <!-- Search + filter -->
      <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
        <input style="flex:1;min-width:180px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#EEEEF5;font-size:13px;padding:10px 14px;border-radius:10px;font-family:var(--f);outline:none;" placeholder="🔍 ابحث في المتجر...">
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${['الكل','الزي المدرسي','الكتب','الأدوات','الحقائب'].map(cat => `<button onclick="filterStore(this)" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 14px;color:rgba(238,238,245,.6);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--f);transition:all .15s;" class="store-filter">${cat}</button>`).join('')}
        </div>
      </div>
      <!-- Products grid -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
        ${[
          ['linear-gradient(135deg,#1a4a7a,#0f3566)','<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H5v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10h1.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>','الزي المدرسي الرسمي','الصف الأول — السادس','69 SAR','85 SAR','الزي المدرسي'],
          ['linear-gradient(135deg,#5a1a7a,#3d0f5c)','<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>','حقيبة مدرسة الأمل','مرحلة ابتدائي','249 SAR','','الحقائب'],
          ['linear-gradient(135deg,#1a7a4a,#0f5c35)','<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>','طقم الأدوات المدرسية','قلم + مسطرة + مقص','42 SAR','55 SAR','الأدوات'],
          ['linear-gradient(135deg,#7a4a1a,#5c3510)','<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>','كراسات حزمة سنوية','12 كراسة بجميع الأحجام','35 SAR','','الكتب'],
          ['linear-gradient(135deg,#7a6a1a,#5c500f)','<path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/>','كتاب الرياضيات الصف 4','المنهج الوطني 1445','28 SAR','','الكتب'],
          ['linear-gradient(135deg,#1a4a7a,#0f3566)','<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H5v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10h1.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>','الزي الرياضي','تيشيرت + سروال رسمي','45 SAR','60 SAR','الزي المدرسي'],
        ].map(([bg,svg,name,desc,price,oldPrice,cat]) => `
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden;transition:all .2s;" onmouseover="this.style.borderColor='rgba(255,255,255,.15)'" onmouseout="this.style.borderColor='rgba(255,255,255,.08)'">
          <div style="height:100px;background:${bg};display:flex;align-items:center;justify-content:center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>
          </div>
          <div style="padding:12px;">
            <div style="font-size:13px;font-weight:700;color:#EEEEF5;margin-bottom:3px;">${name}</div>
            <div style="font-size:11px;color:rgba(238,238,245,.4);margin-bottom:8px;">${desc}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div>${oldPrice?`<span style="font-size:11px;color:rgba(238,238,245,.3);text-decoration:line-through;margin-left:6px;">${oldPrice}</span>`:''}<span style="font-size:16px;font-weight:800;color:#FFB300;">${price}</span></div>
              <button onclick="addToCart('${name}')" style="background:rgba(255,179,0,.15);border:1px solid rgba(255,179,0,.3);border-radius:7px;padding:5px 12px;color:#FFB300;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--f);">أضف +</button>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <div style="flex:1;display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(238,238,245,.5);">🛒 <span id="cart-count">0</span> منتج في السلة</div>
      <button onclick="closeModal('modal-store')" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 20px;color:rgba(238,238,245,.6);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--f);">إغلاق</button>
      <button onclick="toast('✅ تم إرسال طلبك — سيصل خلال يومين','#FFB300')" style="background:linear-gradient(135deg,#7a4a1a,#5c3510);border:none;border-radius:10px;padding:10px 24px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--f);">إتمام الطلب ←</button>
    </div>
  </div>
</div>

<!-- ════ MODAL: المكتبة الرقمية ════ -->
<div class="modal-overlay" id="modal-library" onclick="if(event.target===this)closeModal('modal-library')">
  <div class="modal-box">
    <div class="modal-hdr">
      <div class="modal-title">
        <div class="modal-title-ic" style="background:linear-gradient(135deg,#1a5a7a,#0f3d56);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        المكتبة الرقمية — مدرسة الأمل
      </div>
      <button class="modal-close" onclick="closeModal('modal-library')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <!-- Categories -->
      <div style="display:flex;gap:8px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px;">
        ${['الكل','كتب مدرسية','مقاطع فيديو','أوراق عمل','مراجع ومذكرات','قصص وروايات'].map((c,i) => `<button style="background:${i===0?'rgba(30,136,229,.2)':'rgba(255,255,255,.05)'};border:${i===0?'1px solid rgba(30,136,229,.4)':'1px solid rgba(255,255,255,.1)'};border-radius:8px;padding:7px 14px;color:${i===0?'#60A5FA':'rgba(238,238,245,.5)'};font-size:12px;font-weight:600;cursor:pointer;font-family:var(--f);white-space:nowrap;">${c}</button>`).join('')}
      </div>
      <!-- Library items -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${[
          ['linear-gradient(135deg,#1a4a7a,#0f3566)','<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>','كتاب الرياضيات — الصف الرابع','المنهج الوطني المطور 1445 · PDF','📥 تحميل مجاني','كتب مدرسية','2.4 MB'],
          ['linear-gradient(135deg,#1a7a4a,#0f5c35)','<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5m4 0h10m0-11v11m0 0h-4m4 0v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m16 0H5"/>','مقاطع تجارب العلوم العملية','12 مقطع فيديو · جميع المراحل','▶️ مشاهدة','مقاطع فيديو','HD'],
          ['linear-gradient(135deg,#5a1a7a,#3d0f5c)','<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>','قصص اللغة العربية — مكتبة القراءة','80 قصة · مستويات متعددة','📖 قراءة','قصص وروايات','PDF'],
          ['linear-gradient(135deg,#7a4a1a,#5c3510)','<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>','بنك مسائل الرياضيات المحلولة','+500 مسألة بالحل التفصيلي','📥 تحميل','أوراق عمل','18 MB'],
          ['linear-gradient(135deg,#7a6a1a,#5c500f)','<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>','دروس اللغة الإنجليزية الكاملة','مستويات متعددة · صوت وصورة','▶️ مشاهدة','مقاطع فيديو','HD'],
          ['linear-gradient(135deg,#1a5a7a,#0f3d56)','<path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/>','مراجع التربية الإسلامية','قرآن + أحاديث + فقه · مختصر','📥 تحميل','مراجع ومذكرات','5.1 MB'],
        ].map(([bg,svg,title,desc,action,cat,size]) => `
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px;display:flex;align-items:center;gap:14px;transition:all .15s;" onmouseover="this.style.borderColor='rgba(255,255,255,.15)'" onmouseout="this.style.borderColor='rgba(255,255,255,.08)'">
          <div style="width:48px;height:48px;border-radius:12px;background:${bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:700;color:#EEEEF5;margin-bottom:3px;">${title}</div>
            <div style="font-size:11.5px;color:rgba(238,238,245,.45);">${desc}</div>
            <div style="display:flex;gap:8px;margin-top:6px;align-items:center;">
              <span style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:2px 8px;font-size:10px;color:rgba(238,238,245,.5);">${cat}</span>
              <span style="font-size:10px;color:rgba(238,238,245,.3);">${size}</span>
            </div>
          </div>
          <button onclick="toast('✅ جارٍ الفتح...','#22D3EE')" style="background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.25);border-radius:8px;padding:7px 14px;color:#22D3EE;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--f);white-space:nowrap;">${action}</button>
        </div>`).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <div style="flex:1;font-size:12px;color:rgba(238,238,245,.4);">📚 +200 مصدر تعليمي — مجاني لجميع طلاب المدرسة</div>
      <button onclick="closeModal('modal-library')" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 20px;color:rgba(238,238,245,.6);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--f);">إغلاق</button>
    </div>
  </div>
</div>

<!-- ════ MODAL: الإعلانات ════ -->
<div class="modal-overlay" id="modal-announcements" onclick="if(event.target===this)closeModal('modal-announcements')">
  <div class="modal-box" style="max-width:700px;">
    <div class="modal-hdr">
      <div class="modal-title">
        <div class="modal-title-ic" style="background:linear-gradient(135deg,#7a1a1a,#5c0f0f);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
        إعلانات مدرسة الأمل
      </div>
      <button class="modal-close" onclick="closeModal('modal-announcements')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${[
          ['مثبّت','#ef4444','بداية التسجيل للفصل الثالث','يسعد إدارة مدرسة الأمل الإعلان عن فتح باب التسجيل للفصل الدراسي الثالث. التسجيل متاح إلكترونياً عبر البوابة دون الحاجة لزيارة المدرسة.','25 مارس 2026','إدارة المدرسة'],
          ['جديد','#1E88E5','الاختبارات النهائية — جدول مؤقت','سيبدأ الاختبار النهائي للفصل الثاني في 15 أبريل. الجدول التفصيلي لكل صف متاح على البوابة الإلكترونية.','22 مارس 2026','شؤون الطلاب'],
          ['فعالية','#10B981','يوم التقدير والتكريم السنوي','دعوة لأولياء الأمور لحفل التكريم السنوي لطلاب التفوق يوم الأربعاء 8 أبريل الساعة 10 صباحاً في القاعة الرئيسية.','18 مارس 2026','الإدارة'],
          ['تقني','#FB923C','تحديث تطبيق متين — ميزات جديدة','تم تحديث التطبيق وإضافة ميزة تتبع GPS المحسّنة وبنك الأسئلة الجديد. يُرجى تحديث التطبيق من المتجر.','15 مارس 2026','تقنية المعلومات'],
          ['تنبيه','#A78BFA','موعد سداد رسوم الفصل القادم','يُذكّر أولياء الأمور بضرورة سداد رسوم الفصل الثالث قبل 10 أبريل. يمكن الدفع إلكترونياً بشكل مريح.','12 مارس 2026','الشؤون المالية'],
        ].map(([tag,tagColor,title,body,date,author]) => `
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px 18px;">
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
            <span style="background:${tagColor}22;border:1px solid ${tagColor}44;color:${tagColor};font-size:10px;font-weight:700;padding:2px 9px;border-radius:8px;flex-shrink:0;margin-top:2px;">${tag}</span>
            <div style="font-size:14px;font-weight:700;color:#EEEEF5;">${title}</div>
          </div>
          <div style="font-size:12.5px;color:rgba(238,238,245,.6);line-height:1.65;margin-bottom:10px;">${body}</div>
          <div style="font-size:11px;color:rgba(238,238,245,.3);display:flex;gap:10px;">
            <span>📅 ${date}</span><span>✍️ ${author}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button onclick="closeModal('modal-announcements')" style="margin-right:auto;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 20px;color:rgba(238,238,245,.6);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--f);">إغلاق</button>
    </div>
  </div>
</div>

<!-- ════ MODAL: الملتقى المجتمعي ════ -->
<div class="modal-overlay" id="modal-community" onclick="if(event.target===this)closeModal('modal-community')">
  <div class="modal-box">
    <div class="modal-hdr">
      <div class="modal-title">
        <div class="modal-title-ic" style="background:linear-gradient(135deg,#1a7a4a,#0f5c35);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        ملتقى أسرة الأمل المجتمعي
      </div>
      <button class="modal-close" onclick="closeModal('modal-community')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <!-- post input -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:14px;margin-bottom:16px;">
        <textarea style="width:100%;background:none;border:none;color:#EEEEF5;font-size:13px;font-family:var(--f);outline:none;resize:none;min-height:70px;" placeholder="شارك رأيك أو سؤالك مع أسرة مدرسة الأمل..."></textarea>
        <div style="display:flex;justify-content:flex-start;margin-top:8px;border-top:1px solid rgba(255,255,255,.07);padding-top:10px;">
          <button onclick="toast('✅ تم نشر مشاركتك','#10B981')" style="background:linear-gradient(135deg,#1a7a4a,#0f5c35);border:none;border-radius:9px;padding:8px 20px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--f);">نشر</button>
        </div>
      </div>
      <!-- posts -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${[
          ['#1E88E5','🏫','إدارة المدرسة','إدارة رسمية ✓','منذ 3 ساعات','تذكير: موعد سداد رسوم الفصل الثالث قبل 10 أبريل. يمكن الدفع إلكترونياً من البوابة مباشرة.',15,3],
          ['#FB923C','👩‍👦','أم عبدالله المطيري','ولي أمر','منذ ساعتين','ماشاءالله التطبيق ممتاز، أقدر أتابع ابني من البيت وأشوف درجاته فوراً. شكراً للإدارة 🌟',24,8],
          ['#A78BFA','👨‍👦','أبو سارة الشمري','ولي أمر','أمس','سؤال: هل الرحلة العلمية تتطلب موافقة مكتوبة؟ وأين أسجّل البنت؟',4,6],
          ['#10B981','👨‍🏫','أ. محمد الغامدي','معلم رياضيات','قبل يومين','نبّه أولياء الأمور: الواجب النهائي لمادة الرياضيات موعد تسليمه الأسبوع القادم. التفاصيل على التطبيق.',11,2],
        ].map(([color,av,name,role,time,body,likes,comments]) => `
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:36px;height:36px;border-radius:9px;background:${color}22;border:1px solid ${color}44;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">${av}</div>
            <div style="flex:1;"><div style="font-size:13px;font-weight:700;color:#EEEEF5;">${name}</div><div style="font-size:10.5px;color:rgba(238,238,245,.4);">${role} · ${time}</div></div>
          </div>
          <div style="font-size:13px;color:rgba(238,238,245,.75);line-height:1.65;margin-bottom:12px;">${body}</div>
          <div style="display:flex;gap:12px;border-top:1px solid rgba(255,255,255,.06);padding-top:10px;">
            <button onclick="this.textContent='👍 '+(parseInt(this.textContent.split(' ')[1])+1)" style="background:none;border:none;color:rgba(238,238,245,.4);font-size:12px;cursor:pointer;font-family:var(--f);display:flex;align-items:center;gap:4px;">👍 ${likes}</button>
            <button style="background:none;border:none;color:rgba(238,238,245,.4);font-size:12px;cursor:pointer;font-family:var(--f);">💬 ${comments} تعليق</button>
            <button style="background:none;border:none;color:rgba(238,238,245,.4);font-size:12px;cursor:pointer;font-family:var(--f);">↗️ مشاركة</button>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <div style="flex:1;font-size:12px;color:rgba(238,238,245,.35);">👥 290 عضو في الملتقى — أولياء أمور + معلمون + الإدارة</div>
      <button onclick="closeModal('modal-community')" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 20px;color:rgba(238,238,245,.6);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--f);">إغلاق</button>
    </div>
  </div>
</div>


<script>
let cartCount = 0;
function addToCart(name){
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;
  toast('✅ تم إضافة ' + name + ' للسلة','#FFB300');
}
function filterStore(btn){
  document.querySelectorAll('.store-filter').forEach(b=>{
    b.style.background='rgba(255,255,255,.06)';
    b.style.borderColor='rgba(255,255,255,.1)';
    b.style.color='rgba(238,238,245,.6)';
  });
  btn.style.background='rgba(255,179,0,.2)';
  btn.style.borderColor='rgba(255,179,0,.4)';
  btn.style.color='#FFB300';
}
function openModal(id){ document.getElementById(id).classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id){ document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }
</script>
