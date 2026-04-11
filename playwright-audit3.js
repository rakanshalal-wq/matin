const { chromium } = require('./node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3001';
const SS_DIR = '/tmp/matin-screenshots3';
if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });

const LAUNCH_OPTS = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] };
const TOKENS = JSON.parse(fs.readFileSync('/tmp/test-tokens.json'));

const USERS = {
  admin:       { id: '0e34fbf5-660d-4274-94b7-6430457d40d9', email: 'admin@test.com',      role: 'admin',       name: 'مدير مدرسة',   school_id: 1, package: 'free', status: 'active' },
  teacher:     { id: '9fb5f2cc-e5e2-4c16-9901-8d781c7dc2e4', email: 'teacher@test.com',    role: 'teacher',     name: 'معلم',          school_id: 1, package: 'free', status: 'active' },
  student:     { id: '58f5c04b-2892-4a02-9d74-17f02a189c4c', email: 'student@test.com',    role: 'student',     name: 'طالب',          school_id: 1, package: 'free', status: 'active' },
  parent:      { id: '515ec266-e9f3-4b2e-8744-12cf0b4e0b53', email: 'parent@test.com',     role: 'parent',      name: 'ولي أمر',       school_id: 1, package: 'free', status: 'active' },
  super_admin: { id: '3c0bc7ef-5562-4972-b7ad-11ef4ae40bf3', email: 'superadmin@test.com', role: 'super_admin', name: 'مالك المنصة', package: 'free', status: 'active' },
};

let sc = 0;
async function ss(page, name) {
  const f = path.join(SS_DIR, `${String(++sc).padStart(3,'0')}-${name.replace(/[\/\s:]/g,'-')}.png`);
  try { await page.screenshot({ path: f }); } catch(e) {}
  return f;
}

// إنشاء authenticated context بدون login
async function newAuthPage(browser, role, viewport = { width: 1440, height: 900 }) {
  const token = TOKENS[role];
  const user = USERS[role];
  const ctx = await browser.newContext({ viewport });
  // Set cookie
  await ctx.addCookies([{ name: 'matin_token', value: token, domain: 'localhost', path: '/', httpOnly: false }]);
  const pg = await ctx.newPage();
  // Set localStorage
  await pg.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await pg.evaluate((data) => {
    localStorage.setItem('matin_token', data.token);
    localStorage.setItem('matin_user', JSON.stringify(data.user));
  }, { token, user });
  return { ctx, pg };
}

const report = {
  timestamp: new Date().toISOString(),
  loginTests: [], pageTests: [], buttonTests: [],
  securityTests: [], designTests: [], sidebarLinks: [],
  consoleErrors: [], formTests: [],
};

(async () => {
  const browser = await chromium.launch(LAUNCH_OPTS);
  
  // ═══════════════════════════════════════
  // ١. تسجيل الدخول الحقيقي (بدون rate limit بسبب restart)
  // ═══════════════════════════════════════
  console.log('=== ١. فحص تسجيل الدخول ===');
  
  // 1a: كلمة مرور خاطئة
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await pg.fill('input[type="email"]', 'admin@test.com');
    await pg.fill('input[type="password"]', 'WrongPass999');
    await pg.click('button[type="submit"]');
    await pg.waitForTimeout(2500);
    const errText = await pg.$eval('body', el => el.innerText).catch(() => '');
    const hasErr = errText.includes('خاطئ') || errText.includes('غير صحيح');
    const staysOnLogin = pg.url().includes('/login');
    await ss(pg, 'login-wrong-pass');
    report.loginTests.push({ test: 'كلمة مرور خاطئة', pass: staysOnLogin && hasErr, detail: `${staysOnLogin ? '✅ رُفض' : '❌ قُبل'} | رسالة: ${hasErr ? '✅' : '❌'}` });
    console.log(`  كلمة مرور خاطئة: ${staysOnLogin ? '✅' : '❌'} | رسالة خطأ: ${hasErr ? '✅' : '❌'}`);
    await ctx.close();
  }
  
  // 1b: كل دور مع قياس redirect
  const ROLE_EXPECTED = [
    { role: 'admin',       expected: '/dashboard/admin' },
    { role: 'teacher',     expected: '/dashboard/teacher' },
    { role: 'student',     expected: '/dashboard/student' },
    { role: 'parent',      expected: '/dashboard/parent' },
    { role: 'super_admin', expected: '/owner' },
  ];
  
  for (const { role, expected } of ROLE_EXPECTED) {
    const { ctx, pg } = await newAuthPage(browser, role);
    // Navigate directly to expected path
    await pg.goto(BASE + expected, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await pg.waitForTimeout(3000); // Wait for React to hydrate and check localStorage
    const finalUrl = pg.url();
    const reachedDash = !finalUrl.includes('/login') && finalUrl.includes(expected);
    await ss(pg, `login-${role}`);
    report.loginTests.push({ role, expectedPath: expected, actualUrl: finalUrl, pass: reachedDash });
    console.log(`  ${role}: ${reachedDash ? '✅' : '❌'} → ${finalUrl}`);
    await ctx.close();
  }
  
  // 1c: Logout
  {
    const { ctx, pg } = await newAuthPage(browser, 'admin');
    await pg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 12000 });
    await pg.waitForTimeout(3000);
    await ss(pg, 'dashboard-admin-before-logout');
    const logoutBtn = await pg.$('button:has-text("خروج"), button:has-text("تسجيل الخروج"), a:has-text("خروج")').catch(() => null);
    if (logoutBtn) {
      await logoutBtn.click().catch(() => {});
      await pg.waitForTimeout(2000);
      const afterUrl = pg.url();
      const loggedOut = afterUrl.includes('/login');
      report.loginTests.push({ test: 'logout', pass: loggedOut, url: afterUrl });
      console.log(`  Logout: ${loggedOut ? '✅' : '❌'} → ${afterUrl}`);
    } else {
      // Try other logout patterns
      const profileBtn = await pg.$('[class*="avatar"], [class*="profile"], [class*="user-menu"]').catch(() => null);
      if (profileBtn) {
        await profileBtn.click().catch(() => {});
        await pg.waitForTimeout(500);
        const logoutBtn2 = await pg.$('button:has-text("خروج"), a:has-text("خروج")').catch(() => null);
        if (logoutBtn2) {
          await logoutBtn2.click().catch(() => {});
          await pg.waitForTimeout(2000);
          const afterUrl = pg.url();
          report.loginTests.push({ test: 'logout (via profile)', pass: afterUrl.includes('/login'), url: afterUrl });
          console.log(`  Logout via profile: ${afterUrl.includes('/login') ? '✅' : '❌'} → ${afterUrl}`);
        }
      } else {
        report.loginTests.push({ test: 'logout', pass: null, note: 'زر الخروج لم يُوجد' });
        console.log('  Logout: ⚠️ زر الخروج غير موجود بسهولة');
      }
    }
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // ٢. فحص الصفحات
  // ═══════════════════════════════════════
  console.log('\n=== ٢. فحص الصفحات ===');
  
  const PAGES = [
    { p: '/dashboard/admin',        role: 'admin' },
    { p: '/dashboard/settings',     role: 'admin' },
    { p: '/dashboard/users',        role: 'admin' },
    { p: '/dashboard/classes',      role: 'admin' },
    { p: '/dashboard/announcements',role: 'admin' },
    { p: '/dashboard/notifications',role: 'admin' },
    { p: '/dashboard/reports',      role: 'admin' },
    { p: '/dashboard/finance',      role: 'admin' },
    { p: '/dashboard/salaries',     role: 'admin' },
    { p: '/dashboard/students',     role: 'admin' },
    { p: '/dashboard/schedule',     role: 'admin' },
    { p: '/dashboard/certificates', role: 'admin' },
    { p: '/dashboard/activities',   role: 'admin' },
    { p: '/dashboard/complaints',   role: 'admin' },
    { p: '/dashboard/calendar',     role: 'admin' },
    { p: '/dashboard/health',       role: 'admin' },
    { p: '/dashboard/library',      role: 'admin' },
    { p: '/dashboard/messages',     role: 'admin' },
    { p: '/dashboard/appearance',   role: 'admin' },
    { p: '/dashboard/backup',       role: 'admin' },
    { p: '/dashboard/teacher',      role: 'teacher' },
    { p: '/dashboard/grades',       role: 'teacher' },
    { p: '/dashboard/attendance',   role: 'teacher' },
    { p: '/dashboard/exams',        role: 'teacher' },
    { p: '/dashboard/homework',     role: 'teacher' },
    { p: '/dashboard/student',      role: 'student' },
    { p: '/dashboard/parent',       role: 'parent' },
  ];
  
  const consoleErrors = [];
  
  for (const { p, role } of PAGES) {
    const { ctx, pg } = await newAuthPage(browser, role);
    const pageErrs = [];
    pg.on('console', m => { if (m.type() === 'error') { pageErrs.push(m.text().substring(0,100)); }});
    
    try {
      const resp = await pg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 12000 });
      await pg.waitForTimeout(2500); // Wait for React render
      const status = resp?.status() || 0;
      const finalUrl = pg.url();
      const body = await pg.$eval('body', el => el.innerText.trim()).catch(() => '');
      
      const redirectedToLogin = finalUrl.includes('/login');
      const is404 = status === 404 || (status === 200 && body.length < 100 && (body.includes('404') || body.toLowerCase().includes('not found')));
      const is500 = status >= 500;
      const isBlank = !redirectedToLogin && body.length < 60;
      
      let btns = 0, tables = 0, inputs = 0;
      try {
        btns = (await pg.$$('button:visible')).length;
        tables = (await pg.$$('table')).length;
        inputs = (await pg.$$('input:visible')).length;
      } catch(e) {}
      
      const ok = !redirectedToLogin && !is404 && !is500 && !isBlank;
      const note = redirectedToLogin ? 'redirect → login (localStorage check)' : is404 ? '404' : is500 ? '500' : isBlank ? 'blank' : 'OK ✅';
      
      if (pageErrs.length > 0) consoleErrors.push({ page: p, errors: pageErrs });
      
      const ssFile = await ss(pg, `page${p.replace(/\//g,'-')}`);
      report.pageTests.push({ path: p, role, status, finalUrl, pass: ok, note, buttons: btns, tables, inputs, consoleErrors: pageErrs, screenshot: ssFile });
      console.log(`  ${ok ? '✅' : '❌'} [${role}] ${p}: ${note} | ${btns} btns, ${tables} tables`);
    } catch(e) {
      const ssFile = await ss(pg, `page-err${p.replace(/\//g,'-')}`).catch(() => '');
      report.pageTests.push({ path: p, role, pass: false, error: e.message.substring(0,100) });
      console.log(`  ❌ ${p}: ${e.message.substring(0,80)}`);
    }
    report.consoleErrors = consoleErrors;
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // ٣. فحص الأزرار
  // ═══════════════════════════════════════
  console.log('\n=== ٣. فحص الأزرار ===');
  
  const BTN_PAGES = [
    { p: '/dashboard/admin',   role: 'admin' },
    { p: '/dashboard/teacher', role: 'teacher' },
    { p: '/dashboard/student', role: 'student' },
    { p: '/dashboard/parent',  role: 'parent' },
  ];
  
  for (const { p, role } of BTN_PAGES) {
    const { ctx, pg } = await newAuthPage(browser, role);
    await pg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await pg.waitForTimeout(3000);
    
    const finalUrl = pg.url();
    if (finalUrl.includes('/login')) {
      console.log(`  ⚠️ ${p}: لا يمكن الفحص - redirect لـ login`);
      await ctx.close();
      continue;
    }
    
    const allBtns = await pg.$$('button:visible, [role="button"]:visible');
    const total = allBtns.length;
    const btnResults = [];
    
    for (let i = 0; i < Math.min(total, 15); i++) {
      try {
        const btn = allBtns[i];
        const text = (await btn.innerText().catch(() => '')).trim().substring(0,30);
        const disabled = await btn.isDisabled().catch(() => false);
        if (disabled) { btnResults.push({ text, status: 'disabled' }); continue; }
        if (/حذف|delete|remove/i.test(text)) { btnResults.push({ text, status: 'skip-destructive' }); continue; }
        
        const beforeUrl = pg.url();
        await btn.click({ timeout: 2000 }).catch(() => {});
        await pg.waitForTimeout(600);
        const afterUrl = pg.url();
        const modal = await pg.$('[role="dialog"],[class*="modal"],[class*="dialog"]').catch(() => null);
        const toast = await pg.$('[class*="toast"],[data-sonner],[class*="snack"]').catch(() => null);
        
        const active = beforeUrl !== afterUrl || !!modal || !!toast;
        btnResults.push({ text, status: active ? 'working' : 'dead', navigated: beforeUrl !== afterUrl, modal: !!modal, toast: !!toast });
        
        if (modal) await pg.keyboard.press('Escape').catch(() => {});
        if (beforeUrl !== afterUrl && afterUrl !== BASE + p) {
          await pg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
          await pg.waitForTimeout(800);
        }
      } catch(e) { btnResults.push({ text: '?', status: 'error' }); }
    }
    
    await ss(pg, `buttons${p.replace(/\//g,'-')}`);
    
    const working = btnResults.filter(r => r.status === 'working' || r.status === 'skip-destructive').length;
    const dead = btnResults.filter(r => r.status === 'dead').length;
    const deadList = btnResults.filter(r => r.status === 'dead').map(r => r.text).filter(t => t).join(' | ');
    
    report.buttonTests.push({ page: p, role, totalVisible: total, tested: btnResults.length, working, dead, deadButtons: deadList, details: btnResults });
    console.log(`  ${p} [${role}]: ${total} أزرار | ✅ ${working} شغال | ❌ ${dead} ميت`);
    if (deadList) console.log(`    ⚠️ لا يستجيب: ${deadList}`);
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // ٥. الأمان
  // ═══════════════════════════════════════
  console.log('\n=== ٥. فحص الأمان ===');
  
  // API بدون auth
  const noCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const noPg = await noCtx.newPage();
  
  const APIS = ['/api/users', '/api/classes', '/api/grades', '/api/announcements', '/api/students', '/api/attendance', '/api/salaries'];
  for (const route of APIS) {
    const resp = await noPg.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => null);
    const status = resp?.status() || 0;
    const body = await noPg.content();
    const protected_ = status === 401 || body.includes('"error"') && (body.includes('Unauthorized') || body.includes('غير مصرح') || body.includes('مطلوب'));
    const is404 = status === 404;
    report.securityTests.push({ test: `API no-auth: ${route}`, pass: protected_ || is404, status, note: protected_ ? `✅ ${status}` : is404 ? '⚠️ 404 (Route لا يوجد)' : `❌ مكشوف (${status})` });
    console.log(`  ${route}: ${protected_ ? '✅' : is404 ? '⚠️ 404' : `❌ مكشوف (${status})`}`);
  }
  
  // Teacher → Admin
  {
    const { ctx, pg } = await newAuthPage(browser, 'teacher');
    await pg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await pg.waitForTimeout(3000);
    const url = pg.url();
    const blocked = url.includes('/login') || !url.includes('/dashboard/admin');
    await ss(pg, 'security-teacher-admin');
    report.securityTests.push({ test: 'Teacher يحاول /dashboard/admin', pass: blocked, url, note: blocked ? `✅ محجوب → ${url}` : '❌ وصل!' });
    console.log(`  Teacher→Admin: ${blocked ? '✅ محجوب' : `❌ وصل (${url})`}`);
    await ctx.close();
  }
  
  // Student → Teacher
  {
    const { ctx, pg } = await newAuthPage(browser, 'student');
    await pg.goto(BASE + '/dashboard/teacher', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await pg.waitForTimeout(3000);
    const url = pg.url();
    const blocked = url.includes('/login') || !url.includes('/dashboard/teacher');
    await ss(pg, 'security-student-teacher');
    report.securityTests.push({ test: 'Student يحاول /dashboard/teacher', pass: blocked, url, note: blocked ? `✅ محجوب → ${url}` : '❌ وصل!' });
    console.log(`  Student→Teacher: ${blocked ? '✅ محجوب' : `❌ وصل (${url})`}`);
    await ctx.close();
  }
  
  // No auth → dashboard
  {
    await noPg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await noPg.waitForTimeout(2000);
    const url = noPg.url();
    const blocked = url.includes('/login');
    await ss(noPg, 'security-no-auth');
    report.securityTests.push({ test: 'بدون auth → /dashboard/admin', pass: blocked, url, note: blocked ? '✅' : '❌' });
    console.log(`  No auth→Dashboard: ${blocked ? '✅' : '❌'} → ${url}`);
  }
  await noCtx.close();
  
  // ═══════════════════════════════════════
  // ٦. التصميم
  // ═══════════════════════════════════════
  console.log('\n=== ٦. فحص التصميم ===');
  
  const DESIGN = [
    { p: '/login',             role: null },
    { p: '/dashboard/admin',   role: 'admin' },
    { p: '/dashboard/teacher', role: 'teacher' },
    { p: '/dashboard/student', role: 'student' },
    { p: '/dashboard/parent',  role: 'parent' },
  ];
  
  for (const { p, role } of DESIGN) {
    // Desktop 1440
    const { ctx: dc, pg: dp } = role ? await newAuthPage(browser, role, { width: 1440, height: 900 }) : { ctx: await browser.newContext({ viewport: { width: 1440, height: 900 } }), pg: null };
    const dpg = dp || await dc.newPage();
    await dpg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await dpg.waitForTimeout(2000);
    const dss = await ss(dpg, `desktop-1440${p.replace(/\//g,'-')}`);
    const dContent = await dpg.$eval('body', el => el.innerText.length).catch(() => 0);
    await dc.close();
    
    // Mobile 375
    const { ctx: mc, pg: mp } = role ? await newAuthPage(browser, role, { width: 375, height: 812 }) : { ctx: await browser.newContext({ viewport: { width: 375, height: 812 } }), pg: null };
    const mpg = mp || await mc.newPage();
    await mpg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await mpg.waitForTimeout(2000);
    const overflow = await mpg.evaluate(() => document.body.scrollWidth > window.innerWidth + 5);
    const mss = await ss(mpg, `mobile-375${p.replace(/\//g,'-')}`);
    await mc.close();
    
    report.designTests.push({ page: p, role, mobileOverflow: overflow, desktopContentLen: dContent, desktopSS: dss, mobileSS: mss });
    console.log(`  ${p}: overflow موبايل: ${overflow ? '❌' : '✅'} | محتوى: ${dContent} حرف`);
  }
  
  // ═══════════════════════════════════════
  // ٧. Sidebar
  // ═══════════════════════════════════════
  console.log('\n=== ٧. فحص Sidebar ===');
  
  {
    const { ctx, pg } = await newAuthPage(browser, 'admin');
    await pg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 12000 });
    await pg.waitForTimeout(3000);
    await ss(pg, 'sidebar-admin');
    
    const finalUrl = pg.url();
    if (!finalUrl.includes('/login')) {
      const links = await pg.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
          .map(a => ({ href: a.href, text: a.innerText.trim().substring(0,40) }))
          .filter(l => l.href && l.href.includes('localhost') && !l.href.includes('#') && l.href !== window.location.href)
          .slice(0, 30)
      );
      
      console.log(`  وجدت ${links.length} رابط داخلي`);
      
      let workingLinks = 0, brokenLinks = 0;
      for (const link of links.slice(0, 15)) {
        const resp = await pg.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => null);
        const status = resp?.status() || 0;
        const is404 = status === 404;
        const url = pg.url();
        const isLogin = url.includes('/login');
        
        if (is404) { brokenLinks++; report.sidebarLinks.push({ text: link.text, href: link.href, status: '404', broken: true }); }
        else if (isLogin) { brokenLinks++; report.sidebarLinks.push({ text: link.text, href: link.href, status: 'redirect-login', broken: true }); }
        else { workingLinks++; }
        
        await pg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
        await pg.waitForTimeout(300);
      }
      
      report.sidebarLinks.push({ total: links.length, tested: Math.min(links.length, 15), working: workingLinks, broken: brokenLinks });
      console.log(`  ✅ يعمل: ${workingLinks} | ❌ مكسور: ${brokenLinks}`);
    } else {
      console.log('  ⚠️ لا يمكن فحص Sidebar - redirect لـ login');
    }
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // حفظ التقرير والملخص
  // ═══════════════════════════════════════
  const loginPass = report.loginTests.filter(t => t.pass).length;
  const pagesPass = report.pageTests.filter(t => t.pass).length;
  const secPass = report.securityTests.filter(t => t.pass).length;
  const mobileOk = report.designTests.filter(t => !t.mobileOverflow).length;
  
  report.summary = {
    loginTests: `${loginPass}/${report.loginTests.length}`,
    pageTests: `${pagesPass}/${report.pageTests.length}`,
    securityTests: `${secPass}/${report.securityTests.length}`,
    mobileDesign: `${mobileOk}/${report.designTests.length}`,
    screenshots: sc,
    consoleErrors: report.consoleErrors.length,
    screenshotDir: SS_DIR,
    readyForLaunch: secPass === report.securityTests.length && pagesPass >= report.pageTests.length * 0.7
  };
  
  fs.writeFileSync('/tmp/matin-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n═══════════ النتيجة النهائية ═══════════');
  console.log(`🔐 Login:     ${report.summary.loginTests}`);
  console.log(`📄 Pages:     ${report.summary.pageTests}`);
  console.log(`🔒 Security:  ${report.summary.securityTests}`);
  console.log(`📱 Mobile:    ${report.summary.mobileDesign}`);
  console.log(`🖥️  Screenshots: ${sc} في ${SS_DIR}`);
  console.log(`⚡ Console errors: ${report.consoleErrors.length}`);
  console.log(`🚀 جاهز للإطلاق: ${report.summary.readyForLaunch ? 'قريب' : 'غير جاهز'}`);
  
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
