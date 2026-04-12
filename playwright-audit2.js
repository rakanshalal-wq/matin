const { chromium } = require('./node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3001';
const SS_DIR = '/tmp/matin-screenshots';
if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });

const LAUNCH_OPTS = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] };

let sc = 0;
async function ss(page, name) {
  const f = path.join(SS_DIR, `${String(++sc).padStart(3,'0')}-${name.replace(/[\/\s:]/g,'-')}.png`);
  try { await page.screenshot({ path: f, fullPage: false }); } catch(e) {}
  return f;
}

// تسجيل دخول مع حفظ الكوكي
async function loginAndGetCookies(browser, email, password) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  await pg.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await pg.waitForTimeout(500);
  await pg.fill('input[type="email"]', email);
  await pg.fill('input[type="password"]', password);
  await pg.click('button[type="submit"]');
  await pg.waitForTimeout(3000);
  const finalUrl = pg.url();
  const cookies = await ctx.cookies();
  const content = await pg.content();
  await ctx.close();
  return { finalUrl, cookies, content };
}

// إنشاء context مع cookies محفوظة
async function newAuthContext(browser, cookies, viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  if (cookies && cookies.length > 0) await ctx.addCookies(cookies);
  return ctx;
}

const report = {
  timestamp: new Date().toISOString(),
  environment: { server: BASE, db: 'local PostgreSQL' },
  loginTests: [], pageTests: [], buttonTests: [],
  securityTests: [], designTests: [], sidebarLinks: [],
  consoleErrors: [], formTests: [],
  summary: {}
};

(async () => {
  const browser = await chromium.launch(LAUNCH_OPTS);
  
  // ═══════════════════════════════════════
  // ١. تسجيل الدخول
  // ═══════════════════════════════════════
  console.log('=== ١. فحص تسجيل الدخول ===');
  
  // اختبار كلمة مرور خاطئة
  {
    const r = await loginAndGetCookies(browser, 'admin@test.com', 'WrongPass999');
    const rejected = r.finalUrl.includes('/login');
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await pg.fill('input[type="email"]', 'admin@test.com');
    await pg.fill('input[type="password"]', 'WrongPass999');
    await pg.click('button[type="submit"]');
    await pg.waitForTimeout(2000);
    const errText = await pg.$eval('body', el => el.innerText).catch(() => '');
    const hasErrMsg = errText.includes('خاطئ') || errText.includes('غير صحيح') || errText.includes('incorrect');
    await ss(pg, 'login-wrong-password');
    report.loginTests.push({ test: 'كلمة مرور خاطئة ترفض', pass: rejected && hasErrMsg, detail: hasErrMsg ? 'رسالة خطأ ظهرت' : 'بقي على login بدون رسالة واضحة' });
    console.log(`  كلمة مرور خاطئة: ${rejected ? '✅ رُفض' : '❌ قُبل!'} | رسالة: ${hasErrMsg ? '✅' : '❌'}`);
    await ctx.close();
  }
  
  // حفظ كوكيز كل دور
  const roleTokens = {};
  const ROLES = [
    { email: 'admin@test.com',   pass: 'Test@1234', role: 'admin',       expectedPath: '/dashboard/admin' },
    { email: 'teacher@test.com', pass: 'Test@1234', role: 'teacher',     expectedPath: '/dashboard/teacher' },
    { email: 'student@test.com', pass: 'Test@1234', role: 'student',     expectedPath: '/dashboard/student' },
    { email: 'parent@test.com',  pass: 'Test@1234', role: 'parent',      expectedPath: '/dashboard/parent' },
    { email: 'superadmin@test.com', pass: 'Test@1234', role: 'super_admin', expectedPath: '/owner' },
  ];
  
  for (const cred of ROLES) {
    const r = await loginAndGetCookies(browser, cred.email, cred.pass);
    const passed = r.finalUrl.includes(cred.expectedPath);
    roleTokens[cred.role] = { cookies: r.cookies, redirectedTo: r.finalUrl };
    
    // Screenshot post-login
    const ctx2 = await newAuthContext(browser, r.cookies);
    const pg2 = await ctx2.newPage();
    await pg2.goto(BASE + cred.expectedPath, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await pg2.waitForTimeout(2000);
    const actualUrl = pg2.url();
    const isLogin = actualUrl.includes('/login');
    await ss(pg2, `login-success-${cred.role}`);
    await ctx2.close();
    
    report.loginTests.push({ 
      role: cred.role, email: cred.email, 
      expectedPath: cred.expectedPath, redirectedTo: r.finalUrl,
      withCookieDashboard: actualUrl,
      pass: passed && !isLogin,
      detail: passed ? (isLogin ? 'Login OK ولكن Cookie لا تعمل' : 'OK') : `يذهب لـ ${r.finalUrl} بدلاً من ${cred.expectedPath}`
    });
    console.log(`  ${cred.role}: ${passed && !isLogin ? '✅' : '❌'} → ${r.finalUrl} (cookie: ${isLogin ? '❌' : '✅'})`);
  }
  
  // فحص logout
  {
    const { cookies } = roleTokens['admin'] || {};
    if (cookies) {
      const ctx = await newAuthContext(browser, cookies);
      const pg = await ctx.newPage();
      await pg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 12000 });
      await pg.waitForTimeout(2000);
      const logoutBtn = await pg.$('button:has-text("خروج"), a:has-text("خروج"), [title*="خروج"], button:has-text("تسجيل الخروج")').catch(() => null);
      if (logoutBtn) {
        await logoutBtn.click().catch(() => {});
        await pg.waitForTimeout(2000);
        const afterUrl = pg.url();
        const loggedOut = afterUrl.includes('/login');
        await ss(pg, 'logout-test');
        report.loginTests.push({ test: 'logout', pass: loggedOut, url: afterUrl });
        console.log(`  Logout: ${loggedOut ? '✅' : '❌'} → ${afterUrl}`);
      } else {
        report.loginTests.push({ test: 'logout', pass: null, note: 'زر الخروج غير موجود' });
        console.log('  Logout: ⚠️ زر الخروج غير موجود');
      }
      await ctx.close();
    }
  }
  
  // ═══════════════════════════════════════
  // ٢. فحص الصفحات
  // ═══════════════════════════════════════
  console.log('\n=== ٢. فحص الصفحات ===');
  
  const { cookies: adminCookies } = roleTokens['admin'] || {};
  const { cookies: teacherCookies } = roleTokens['teacher'] || {};
  const { cookies: studentCookies } = roleTokens['student'] || {};
  const { cookies: parentCookies } = roleTokens['parent'] || {};
  
  const PAGES = [
    // Admin pages
    { path: '/dashboard/admin',        cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/settings',     cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/users',        cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/classes',      cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/announcements', cookies: adminCookies,  role: 'admin' },
    { path: '/dashboard/notifications', cookies: adminCookies,  role: 'admin' },
    { path: '/dashboard/reports',      cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/finance',      cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/salaries',     cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/students',     cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/schedule',     cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/admissions',   cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/certificates', cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/activities',   cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/complaints',   cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/calendar',     cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/health',       cookies: adminCookies,   role: 'admin' },
    { path: '/dashboard/library',      cookies: adminCookies,   role: 'admin' },
    // Teacher pages
    { path: '/dashboard/teacher',      cookies: teacherCookies, role: 'teacher' },
    { path: '/dashboard/grades',       cookies: teacherCookies, role: 'teacher' },
    { path: '/dashboard/attendance',   cookies: teacherCookies, role: 'teacher' },
    { path: '/dashboard/exams',        cookies: teacherCookies, role: 'teacher' },
    { path: '/dashboard/homework',     cookies: teacherCookies, role: 'teacher' },
    // Student pages
    { path: '/dashboard/student',      cookies: studentCookies, role: 'student' },
    // Parent pages
    { path: '/dashboard/parent',       cookies: parentCookies,  role: 'parent' },
  ];
  
  const consoleErrors = [];
  
  for (const { path: p, cookies, role } of PAGES) {
    if (!cookies) { 
      report.pageTests.push({ path: p, role, pass: false, note: 'لا يوجد cookie للدور' }); 
      console.log(`  ⚠️ ${p}: لا يوجد cookie`);
      continue; 
    }
    const ctx = await newAuthContext(browser, cookies);
    const pg = await ctx.newPage();
    const pageErrors = [];
    pg.on('console', m => { if (m.type() === 'error') { pageErrors.push(m.text().substring(0,100)); consoleErrors.push({ page: p, msg: m.text().substring(0,100) }); }});
    pg.on('response', resp => { if (resp.status() >= 500) pageErrors.push(`HTTP ${resp.status()}: ${resp.url()}`); });
    
    try {
      const resp = await pg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 12000 });
      await pg.waitForTimeout(2000);
      const status = resp?.status() || 0;
      const finalUrl = pg.url();
      const bodyText = await pg.$eval('body', el => el.innerText.trim()).catch(() => '');
      
      const is404 = status === 404 || (bodyText.includes('404') && bodyText.length < 200);
      const is500 = status >= 500;
      const isBlank = bodyText.length < 50;
      const redirectedToLogin = finalUrl.includes('/login');
      
      let btnCount = 0, tableCount = 0;
      try {
        btnCount = (await pg.$$('button:visible')).length;
        tableCount = (await pg.$$('table')).length;
      } catch(e) {}
      
      const ssFile = await ss(pg, `page${p.replace(/\//g,'-')}`);
      
      const ok = !is404 && !is500 && !isBlank && !redirectedToLogin;
      const note = redirectedToLogin ? 'Cookie لا تعمل - redirect لـ login' : is404 ? '404 Not Found' : is500 ? '500 Server Error' : isBlank ? 'صفحة فارغة' : 'OK';
      
      report.pageTests.push({ path: p, role, status, finalUrl, is404, is500, isBlank, redirectedToLogin, buttons: btnCount, tables: tableCount, consoleErrors: pageErrors, pass: ok, note, screenshot: ssFile });
      console.log(`  ${ok ? '✅' : '❌'} [${role}] ${p}: ${note} (${btnCount} btns, ${tableCount} tables)`);
    } catch(e) {
      report.pageTests.push({ path: p, role, pass: false, error: e.message.substring(0,100) });
      console.log(`  ❌ ${p}: ${e.message.substring(0,80)}`);
    }
    await ctx.close();
  }
  report.consoleErrors = consoleErrors.slice(0, 30);
  
  // ═══════════════════════════════════════
  // ٣. فحص الأزرار
  // ═══════════════════════════════════════
  console.log('\n=== ٣. فحص الأزرار ===');
  
  const BTN_PAGES = [
    { path: '/dashboard/admin',   cookies: adminCookies },
    { path: '/dashboard/teacher', cookies: teacherCookies },
    { path: '/dashboard/student', cookies: studentCookies },
  ];
  
  for (const { path: p, cookies } of BTN_PAGES) {
    if (!cookies) continue;
    const ctx = await newAuthContext(browser, cookies);
    const pg = await ctx.newPage();
    await pg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await pg.waitForTimeout(2000);
    
    const allBtns = await pg.$$('button:visible');
    const results = [];
    
    for (let i = 0; i < Math.min(allBtns.length, 12); i++) {
      try {
        const btn = allBtns[i];
        const text = (await btn.innerText().catch(() => '')).trim();
        const disabled = await btn.isDisabled().catch(() => false);
        if (disabled) { results.push({ text: text.substring(0,25), status: 'disabled' }); continue; }
        if (text.includes('حذف') || text.includes('delete')) { results.push({ text: text.substring(0,25), status: 'skip-destructive' }); continue; }
        
        const beforeUrl = pg.url();
        await btn.click({ timeout: 2000 }).catch(() => {});
        await pg.waitForTimeout(700);
        const afterUrl = pg.url();
        const modal = await pg.$('[role="dialog"],[role="alertdialog"],.modal,[class*="modal"],[class*="dialog"]').catch(() => null);
        const toast = await pg.$('.toast,[class*="toast"],[class*="notification"],.sonner').catch(() => null);
        
        const navigated = beforeUrl !== afterUrl;
        const openedModal = !!modal;
        const showedToast = !!toast;
        const active = navigated || openedModal || showedToast;
        
        results.push({ text: text.substring(0,25), status: active ? 'working' : 'dead', navigated, openedModal, showedToast });
        
        if (openedModal) await pg.keyboard.press('Escape').catch(() => {});
        if (navigated) await pg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
        await pg.waitForTimeout(400);
      } catch(e) { results.push({ text: '?', status: 'error', error: e.message.substring(0,50) }); }
    }
    
    await ss(pg, `buttons${p.replace(/\//g,'-')}`);
    
    const working = results.filter(r => r.status === 'working').length;
    const dead = results.filter(r => r.status === 'dead').length;
    const total = allBtns.length;
    report.buttonTests.push({ page: p, totalVisible: total, tested: results.length, working, dead, details: results });
    console.log(`  ${p}: ${total} أزرار | ${working} شغال | ${dead} لا يستجيب`);
    if (dead > 0) {
      const deadNames = results.filter(r => r.status === 'dead').map(r => r.text).join(', ');
      console.log(`    ⚠️ معطلة: ${deadNames}`);
    }
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // ٤. فحص النماذج
  // ═══════════════════════════════════════
  console.log('\n=== ٤. فحص النماذج ===');
  
  const FORM_PAGES = [
    { path: '/dashboard/announcements', role: 'admin', cookies: adminCookies },
    { path: '/dashboard/grades', role: 'teacher', cookies: teacherCookies },
  ];
  
  for (const { path: p, cookies } of FORM_PAGES) {
    if (!cookies) continue;
    const ctx = await newAuthContext(browser, cookies);
    const pg = await ctx.newPage();
    await pg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await pg.waitForTimeout(2000);
    
    // ابحث عن فورم أو زر "إضافة"
    const addBtn = await pg.$('button:has-text("إضافة"), button:has-text("جديد"), button:has-text("new"), button:has-text("Add")').catch(() => null);
    if (addBtn) {
      await addBtn.click().catch(() => {});
      await pg.waitForTimeout(1000);
      
      const form = await pg.$('form, [role="dialog"] input').catch(() => null);
      if (form) {
        // ارسل فورم فاضي
        const submitBtn = await pg.$('button[type="submit"], form button').catch(() => null);
        if (submitBtn) {
          await submitBtn.click().catch(() => {});
          await pg.waitForTimeout(1000);
          const bodyText = await pg.$eval('body', el => el.innerText).catch(() => '');
          const hasValidation = bodyText.includes('مطلوب') || bodyText.includes('يجب') || bodyText.includes('required') || bodyText.includes('حقل');
          report.formTests = report.formTests || [];
          report.formTests.push({ page: p, emptyFormValidation: hasValidation });
          console.log(`  ${p}: validation فارغة: ${hasValidation ? '✅' : '⚠️ غير واضح'}`);
        }
        await pg.keyboard.press('Escape').catch(() => {});
      }
    } else {
      console.log(`  ${p}: لا يوجد زر "إضافة" واضح`);
    }
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // ٥. فحص الأمان
  // ═══════════════════════════════════════
  console.log('\n=== ٥. فحص الأمان ===');
  
  // 5a: API بدون auth
  const noAuthCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const noAuthPg = await noAuthCtx.newPage();
  
  const API_ROUTES = ['/api/users', '/api/classes', '/api/grades', '/api/announcements', '/api/students', '/api/attendance'];
  for (const route of API_ROUTES) {
    try {
      const resp = await noAuthPg.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 8000 });
      const status = resp?.status();
      const body = await noAuthPg.content();
      const isProtected = status === 401 || 
        (body.includes('"error"') && (body.includes('401') || body.includes('Unauthorized') || body.includes('غير مصرح') || body.includes('مطلوب')));
      const is404 = status === 404;
      report.securityTests.push({ test: `API no-auth: ${route}`, pass: isProtected, status, note: isProtected ? `✅ محمي (${status})` : is404 ? `⚠️ 404 (Route غير موجود)` : `❌ مكشوف (HTTP ${status})` });
      console.log(`  ${route}: ${isProtected ? `✅ محمي` : is404 ? `⚠️ 404` : `❌ مكشوف (${status})`}`);
    } catch(e) {
      report.securityTests.push({ test: `API no-auth: ${route}`, pass: null, error: e.message });
    }
  }
  
  // 5b: Teacher يحاول admin
  if (teacherCookies) {
    const ctx = await newAuthContext(browser, teacherCookies);
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await pg.waitForTimeout(2000);
    const url = pg.url();
    const blocked = url.includes('/login') || url.includes('/teacher') || url.includes('/403');
    await ss(pg, 'security-teacher-admin-attempt');
    report.securityTests.push({ test: 'Teacher يحاول /dashboard/admin', pass: blocked, url, note: blocked ? '✅ محجوب' : '❌ وصل للصفحة!' });
    console.log(`  Teacher→Admin: ${blocked ? '✅ محجوب' : `❌ وصل (${url})`}`);
    await ctx.close();
  }
  
  // 5c: Student يحاول teacher
  if (studentCookies) {
    const ctx = await newAuthContext(browser, studentCookies);
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/dashboard/teacher', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await pg.waitForTimeout(2000);
    const url = pg.url();
    const blocked = url.includes('/login') || url.includes('/student') || url.includes('/403');
    await ss(pg, 'security-student-teacher-attempt');
    report.securityTests.push({ test: 'Student يحاول /dashboard/teacher', pass: blocked, url, note: blocked ? '✅ محجوب' : '❌ وصل!' });
    console.log(`  Student→Teacher: ${blocked ? '✅ محجوب' : `❌ وصل (${url})`}`);
    await ctx.close();
  }
  
  // 5d: بدون auth → dashboard
  {
    await noAuthPg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await noAuthPg.waitForTimeout(2000);
    const url = noAuthPg.url();
    const blocked = url.includes('/login');
    await ss(noAuthPg, 'security-no-auth-dashboard');
    report.securityTests.push({ test: 'بدون auth → /dashboard/admin', pass: blocked, url, note: blocked ? '✅ محوّل لـ login' : '❌ دخل!' });
    console.log(`  No auth→Dashboard: ${blocked ? '✅' : '❌'} → ${url}`);
  }
  await noAuthCtx.close();
  
  // ═══════════════════════════════════════
  // ٦. التصميم
  // ═══════════════════════════════════════
  console.log('\n=== ٦. فحص التصميم ===');
  
  const DESIGN_PAGES = [
    { path: '/login',              cookies: null },
    { path: '/dashboard/admin',    cookies: adminCookies },
    { path: '/dashboard/teacher',  cookies: teacherCookies },
    { path: '/dashboard/student',  cookies: studentCookies },
  ];
  
  for (const { path: dp, cookies } of DESIGN_PAGES) {
    // Desktop
    const dCtx = await newAuthContext(browser, cookies, { width: 1440, height: 900 });
    const dPg = await dCtx.newPage();
    await dPg.goto(BASE + dp, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await dPg.waitForTimeout(1500);
    const dss = await ss(dPg, `desktop-1440${dp.replace(/\//g,'-')}`);
    const dBodyH = await dPg.evaluate(() => document.body.scrollHeight);
    const dContentLen = await dPg.$eval('body', el => el.innerText.length).catch(() => 0);
    await dCtx.close();
    
    // Mobile
    const mCtx = await newAuthContext(browser, cookies, { width: 375, height: 812 });
    const mPg = await mCtx.newPage();
    await mPg.goto(BASE + dp, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await mPg.waitForTimeout(1500);
    const overflow = await mPg.evaluate(() => document.body.scrollWidth > window.innerWidth + 5);
    const horizScroll = await mPg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 5);
    const mss = await ss(mPg, `mobile-375${dp.replace(/\//g,'-')}`);
    await mCtx.close();
    
    const hasOverflow = overflow || horizScroll;
    report.designTests.push({ page: dp, mobileOverflow: hasOverflow, desktopContentLen: dContentLen, desktopSS: dss, mobileSS: mss });
    console.log(`  ${dp}: mobile overflow: ${hasOverflow ? '❌ نعم' : '✅ لا'}, desktop content: ${dContentLen} chars`);
  }
  
  // ═══════════════════════════════════════
  // ٧. روابط Sidebar
  // ═══════════════════════════════════════
  console.log('\n=== ٧. فحص Sidebar ===');
  
  if (adminCookies) {
    const ctx = await newAuthContext(browser, adminCookies);
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 12000 });
    await pg.waitForTimeout(2000);
    await ss(pg, 'sidebar-full');
    
    // Get all links from sidebar-like elements
    const links = await pg.evaluate(() => {
      const els = document.querySelectorAll('a');
      return Array.from(els)
        .map(a => ({ href: a.href, text: a.innerText.trim().substring(0, 40), visible: a.offsetParent !== null }))
        .filter(l => l.href && l.href.startsWith('http') && l.href.includes('localhost') && !l.href.includes('#'))
        .slice(0, 50);
    });
    
    console.log(`  وجدت ${links.length} رابط`);
    
    let ok = 0, broken = 0;
    for (const link of links.slice(0, 20)) {
      const resp = await pg.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => null);
      const status = resp?.status() || 0;
      const finalUrl = pg.url();
      const isRedirectToLogin = finalUrl.includes('/login');
      const is404 = status === 404;
      
      if (is404 || isRedirectToLogin) {
        broken++;
        report.sidebarLinks.push({ href: link.href, text: link.text, status, broken: true, note: is404 ? '404' : 'redirect to login' });
      } else {
        ok++;
      }
      
      await pg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
      await pg.waitForTimeout(300);
    }
    
    console.log(`  ✅ يعمل: ${ok} | ❌ مكسور: ${broken}`);
    report.sidebarLinks.push({ totalFound: links.length, tested: Math.min(links.length, 20), working: ok, broken });
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // تقرير نهائي
  // ═══════════════════════════════════════
  const loginPass = report.loginTests.filter(t => t.pass).length;
  const loginTotal = report.loginTests.filter(t => t.pass !== null).length;
  const pagesPass = report.pageTests.filter(t => t.pass).length;
  const pagesTotal = report.pageTests.length;
  const secPass = report.securityTests.filter(t => t.pass).length;
  const secTotal = report.securityTests.length;
  const mobileOk = report.designTests.filter(t => !t.mobileOverflow).length;
  
  report.summary = {
    login: `${loginPass}/${loginTotal}`,
    pages: `${pagesPass}/${pagesTotal}`,
    security: `${secPass}/${secTotal}`,
    mobileDesign: `${mobileOk}/${report.designTests.length}`,
    totalScreenshots: sc,
    screenshotDir: SS_DIR,
    reportFile: '/tmp/matin-report.json',
    consoleErrorsCount: report.consoleErrors.length,
    readyForLaunch: (pagesPass >= pagesTotal * 0.8 && secPass >= secTotal * 0.9)
  };
  
  fs.writeFileSync('/tmp/matin-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n═══════════ الملخص ═══════════');
  console.log(`🔐 Login:     ${report.summary.login}`);
  console.log(`📄 Pages:     ${report.summary.pages}`);
  console.log(`🔒 Security:  ${report.summary.security}`);
  console.log(`📱 Mobile:    ${report.summary.mobileDesign}`);
  console.log(`🖥️  Screenshots: ${sc}`);
  console.log(`⚡ Console errors: ${report.consoleErrors.length}`);
  
  await browser.close();
})().catch(e => {
  console.error('FATAL:', e.message, e.stack?.substring(0,500));
  process.exit(1);
});
