const { chromium } = require('./node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3001';
const SS_DIR = '/tmp/matin-screenshots';
if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });

const report = {
  timestamp: new Date().toISOString(),
  loginTests: [],
  pageTests: [],
  buttonTests: [],
  securityTests: [],
  designTests: [],
  sidebarLinks: [],
  summary: {}
};

let sc = 0;
async function ss(page, name) {
  const f = path.join(SS_DIR, `${String(++sc).padStart(3,'0')}-${name.replace(/[\/\s]/g,'-')}.png`);
  try { await page.screenshot({ path: f, fullPage: false }); } catch(e) {}
  return f;
}

const LAUNCH_OPTS = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] };

async function doLogin(page, email, password) {
  await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  
  const emailInput = await page.$('input[type="email"]') || await page.$('input[name="email"]');
  const passInput = await page.$('input[type="password"]');
  
  if (!emailInput || !passInput) throw new Error('Login inputs not found');
  
  await emailInput.fill(email);
  await passInput.fill(password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  return page.url();
}

(async () => {
  const browser = await chromium.launch(LAUNCH_OPTS);
  
  // ═══════════════════════════════════════
  // ١. تسجيل الدخول
  // ═══════════════════════════════════════
  console.log('=== ١. فحص تسجيل الدخول ===');
  
  // Test 1a: كلمة مرور خاطئة
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pg = await ctx.newPage();
    await doLogin(pg, 'admin@test.com', 'WrongPassword123').catch(() => {});
    const url = pg.url();
    const content = await pg.content();
    const rejected = url.includes('/login') || content.includes('خاطئ') || content.includes('غير صحيح') || content.includes('incorrect');
    await ss(pg, 'login-wrong-password');
    report.loginTests.push({ test: 'كلمة مرور خاطئة', pass: rejected, url, detail: rejected ? 'رُفض صح' : 'قُبل - خطأ أمني!' });
    console.log(`  كلمة مرور خاطئة: ${rejected ? '✅' : '❌'} → ${url}`);
    await ctx.close();
  }
  
  // Test 1b: كل دور
  const ROLES = [
    { email: 'admin@test.com',   pass: 'Test@1234', role: 'admin',       expectedContains: '/dashboard' },
    { email: 'teacher@test.com', pass: 'Test@1234', role: 'teacher',     expectedContains: '/dashboard' },
    { email: 'student@test.com', pass: 'Test@1234', role: 'student',     expectedContains: '/dashboard' },
    { email: 'parent@test.com',  pass: 'Test@1234', role: 'parent',      expectedContains: '/dashboard' },
    { email: 'superadmin@test.com', pass: 'Test@1234', role: 'super_admin', expectedContains: '/owner' },
  ];
  
  for (const cred of ROLES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pg = await ctx.newPage();
    try {
      const finalUrl = await doLogin(pg, cred.email, cred.pass);
      const passed = finalUrl.includes(cred.expectedContains);
      await ss(pg, `login-${cred.role}`);
      report.loginTests.push({ role: cred.role, email: cred.email, expectedContains: cred.expectedContains, actualUrl: finalUrl, pass: passed });
      console.log(`  ${cred.role}: ${passed ? '✅' : '❌'} → ${finalUrl}`);
      
      // Logout test
      const logoutEl = await pg.$('button:has-text("خروج"), a:has-text("خروج"), button:has-text("تسجيل الخروج"), [title*="خروج"]').catch(() => null);
      if (logoutEl) {
        await logoutEl.click().catch(() => {});
        await pg.waitForTimeout(2000);
        const logoutUrl = pg.url();
        const loggedOut = logoutUrl.includes('/login') || logoutUrl === BASE + '/';
        report.loginTests.push({ test: `logout-${cred.role}`, pass: loggedOut, url: logoutUrl });
        console.log(`  logout-${cred.role}: ${loggedOut ? '✅' : '❌'} → ${logoutUrl}`);
      } else {
        report.loginTests.push({ test: `logout-${cred.role}`, pass: null, note: 'زر الخروج غير موجود في الصفحة الحالية' });
      }
    } catch(e) {
      report.loginTests.push({ role: cred.role, pass: false, error: e.message });
      console.log(`  ${cred.role}: ❌ ${e.message}`);
    }
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // ٢. فحص الصفحات
  // ═══════════════════════════════════════
  console.log('\n=== ٢. فحص الصفحات ===');
  
  const PAGES_TO_TEST = [
    '/dashboard/admin', '/dashboard/teacher', '/dashboard/student', '/dashboard/parent',
    '/dashboard/settings', '/dashboard/users', '/dashboard/classes', '/dashboard/grades',
    '/dashboard/attendance', '/dashboard/exams', '/dashboard/announcements',
    '/dashboard/notifications', '/dashboard/calendar', '/dashboard/reports',
    '/dashboard/finance', '/dashboard/salaries', '/dashboard/students',
    '/dashboard/schedule', '/dashboard/homework', '/dashboard/messages',
    '/dashboard/library', '/dashboard/health', '/dashboard/bus-maintenance',
    '/dashboard/certificates', '/dashboard/activities', '/dashboard/complaints',
    '/dashboard/surveys', '/dashboard/forum', '/dashboard/store',
    '/dashboard/subscription', '/dashboard/admissions',
  ];
  
  const pageCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pagePg = await pageCtx.newPage();
  const pageConsoleErrors = [];
  pagePg.on('console', m => { if (m.type() === 'error') pageConsoleErrors.push({ url: pagePg.url(), msg: m.text().substring(0, 100) }); });
  
  await doLogin(pagePg, 'admin@test.com', 'Test@1234');
  
  for (const p of PAGES_TO_TEST) {
    const errs = [];
    try {
      const resp = await pagePg.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 12000 });
      await pagePg.waitForTimeout(1500); // wait for React render
      const status = resp?.status() || 0;
      const finalUrl = pagePg.url();
      const bodyText = await pagePg.$eval('body', el => el.innerText.trim().substring(0, 200)).catch(() => '');
      
      const is404 = status === 404 || bodyText.includes('404') || bodyText.toLowerCase().includes('not found') || bodyText.includes('الصفحة غير موجودة');
      const is500 = status >= 500 || bodyText.includes('Internal Server Error');
      const isBlank = bodyText.length < 30;
      const redirectedToLogin = finalUrl.includes('/login');
      
      let btnCount = 0;
      try { btnCount = (await pagePg.$$('button:visible')).length; } catch(e) {}
      
      const ssFile = await ss(pagePg, `page${p.replace(/\//g,'-')}`);
      
      const result = {
        path: p, status, finalUrl,
        is404, is500, isBlank, redirectedToLogin,
        buttons: btnCount,
        pass: !is404 && !is500 && !isBlank && !redirectedToLogin,
        note: is404 ? '404' : is500 ? '500' : isBlank ? 'blank' : redirectedToLogin ? 'redirected to login' : 'OK',
        screenshot: ssFile,
      };
      report.pageTests.push(result);
      const icon = result.pass ? '✅' : '❌';
      console.log(`  ${icon} ${p}: ${result.note} (${btnCount} btns)`);
    } catch(e) {
      const ssFile = await ss(pagePg, `page-error${p.replace(/\//g,'-')}`);
      report.pageTests.push({ path: p, pass: false, error: e.message, screenshot: ssFile });
      console.log(`  ❌ ${p}: ${e.message.substring(0,80)}`);
    }
  }
  report.consoleLogs = pageConsoleErrors.slice(0, 20);
  await pageCtx.close();
  
  // ═══════════════════════════════════════
  // ٣. فحص الأزرار
  // ═══════════════════════════════════════
  console.log('\n=== ٣. فحص الأزرار ===');
  
  const btnPagesToTest = [
    { path: '/dashboard/admin', cred: { email: 'admin@test.com', pass: 'Test@1234' } },
    { path: '/dashboard/users', cred: { email: 'admin@test.com', pass: 'Test@1234' } },
    { path: '/dashboard/teacher', cred: { email: 'teacher@test.com', pass: 'Test@1234' } },
    { path: '/dashboard/student', cred: { email: 'student@test.com', pass: 'Test@1234' } },
  ];
  
  for (const { path: bPath, cred } of btnPagesToTest) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pg = await ctx.newPage();
    try {
      await doLogin(pg, cred.email, cred.pass);
      await pg.goto(BASE + bPath, { waitUntil: 'domcontentloaded', timeout: 12000 });
      await pg.waitForTimeout(2000);
      
      const buttons = await pg.$$('button:visible');
      const btnData = [];
      
      for (let i = 0; i < Math.min(buttons.length, 15); i++) {
        const btn = buttons[i];
        const text = await btn.innerText().catch(() => '?');
        const isDestructive = text.includes('حذف') || text.includes('مسح');
        
        if (!isDestructive) {
          const beforeUrl = pg.url();
          const beforeDialogs = await pg.$$('[role="dialog"], .modal').catch(() => []);
          
          try {
            await btn.click({ timeout: 3000 });
            await pg.waitForTimeout(800);
          } catch(e) { /* ignore */ }
          
          const afterUrl = pg.url();
          const afterDialogs = await pg.$$('[role="dialog"], .modal, .toast, [class*="toast"]').catch(() => []);
          
          const didNavigate = beforeUrl !== afterUrl;
          const openedModal = afterDialogs.length > beforeDialogs.length;
          const didSomething = didNavigate || openedModal;
          
          btnData.push({ text: text.trim().substring(0,30), didSomething, didNavigate, openedModal });
          
          // Close modal if opened
          if (openedModal) {
            await pg.keyboard.press('Escape').catch(() => {});
            await pg.waitForTimeout(300);
          }
          // Navigate back if needed
          if (didNavigate && afterUrl !== BASE + bPath) {
            await pg.goto(BASE + bPath, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
            await pg.waitForTimeout(1000);
          }
        } else {
          btnData.push({ text: text.trim().substring(0,30), didSomething: true, note: 'skip-destructive' });
        }
      }
      
      const working = btnData.filter(b => b.didSomething).length;
      const dead = btnData.filter(b => !b.didSomething).length;
      const deadBtns = btnData.filter(b => !b.didSomething).map(b => b.text);
      
      await ss(pg, `buttons${bPath.replace(/\//g, '-')}`);
      
      report.buttonTests.push({ page: bPath, total: buttons.length, tested: btnData.length, working, dead, deadBtns, buttons: btnData });
      console.log(`  ${bPath}: ${buttons.length} أزرار — ${working} شغال، ${dead} لا يستجيب`);
      if (deadBtns.length) console.log(`    ⚠️ معطلة: ${deadBtns.join(', ')}`);
    } catch(e) {
      console.log(`  ❌ ${bPath}: ${e.message.substring(0,80)}`);
    }
    await ctx.close();
  }
  
  // ═══════════════════════════════════════
  // ٥. فحص الأمان
  // ═══════════════════════════════════════
  console.log('\n=== ٥. فحص الأمان ===');
  
  const secCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const secPg = await secCtx.newPage();
  
  // 5a: API routes بدون auth
  const API_ROUTES = ['/api/users', '/api/classes', '/api/grades', '/api/announcements', '/api/students', '/api/schedule'];
  for (const route of API_ROUTES) {
    try {
      const resp = await secPg.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 8000 });
      const status = resp?.status();
      const body = await secPg.content();
      const isProtected = status === 401 || body.includes('"error"') && (body.includes('401') || body.includes('Unauthorized') || body.includes('غير مصرح') || body.includes('مطلوب تسجيل'));
      report.securityTests.push({ test: `API no-auth: ${route}`, pass: isProtected, status, note: isProtected ? '✅ محمي' : `❌ مكشوف (HTTP ${status})` });
      console.log(`  API ${route}: ${isProtected ? '✅ محمي' : `❌ مكشوف (${status})`}`);
    } catch(e) {
      report.securityTests.push({ test: `API no-auth: ${route}`, pass: null, error: e.message });
    }
  }
  
  // 5b: Teacher يحاول admin
  await doLogin(secPg, 'teacher@test.com', 'Test@1234');
  await secPg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await secPg.waitForTimeout(2000);
  const adminAttemptUrl = secPg.url();
  const adminBlocked = !adminAttemptUrl.includes('/dashboard/admin') || adminAttemptUrl.includes('/login');
  await ss(secPg, 'security-teacher-admin');
  report.securityTests.push({ test: 'Teacher يحاول /dashboard/admin', pass: adminBlocked, url: adminAttemptUrl, note: adminBlocked ? '✅ محجوب' : '❌ وصل!' });
  console.log(`  Teacher→Admin: ${adminBlocked ? '✅ محجوب' : `❌ وصل (${adminAttemptUrl})`}`);
  
  // 5c: Student يحاول teacher
  await doLogin(secPg, 'student@test.com', 'Test@1234');
  await secPg.goto(BASE + '/dashboard/teacher', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await secPg.waitForTimeout(2000);
  const teacherAttemptUrl = secPg.url();
  const teacherBlocked = !teacherAttemptUrl.includes('/dashboard/teacher') || teacherAttemptUrl.includes('/login');
  await ss(secPg, 'security-student-teacher');
  report.securityTests.push({ test: 'Student يحاول /dashboard/teacher', pass: teacherBlocked, url: teacherAttemptUrl, note: teacherBlocked ? '✅ محجوب' : '❌ وصل!' });
  console.log(`  Student→Teacher: ${teacherBlocked ? '✅ محجوب' : `❌ وصل (${teacherAttemptUrl})`}`);
  
  // 5d: Unauthenticated → dashboard
  const noAuthCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const noAuthPg = await noAuthCtx.newPage();
  await noAuthPg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await noAuthPg.waitForTimeout(2000);
  const noAuthUrl = noAuthPg.url();
  const noAuthBlocked = noAuthUrl.includes('/login') || noAuthUrl === BASE + '/';
  await ss(noAuthPg, 'security-no-auth-dashboard');
  report.securityTests.push({ test: 'بدون تسجيل دخول → /dashboard/admin', pass: noAuthBlocked, url: noAuthUrl, note: noAuthBlocked ? '✅ محول لـ login' : '❌ وصل!' });
  console.log(`  No auth→Dashboard: ${noAuthBlocked ? '✅ محول لـ login' : `❌ وصل (${noAuthUrl})`}`);
  await noAuthCtx.close();
  await secCtx.close();
  
  // ═══════════════════════════════════════
  // ٦. التصميم Mobile vs Desktop
  // ═══════════════════════════════════════
  console.log('\n=== ٦. فحص التصميم ===');
  
  const designPages = ['/login', '/dashboard/admin', '/dashboard/teacher', '/dashboard/student'];
  
  for (const dp of designPages) {
    // Desktop 1440px
    const dCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const dPg = await dCtx.newPage();
    if (dp !== '/login') await doLogin(dPg, 'admin@test.com', 'Test@1234');
    await dPg.goto(BASE + dp, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await dPg.waitForTimeout(1500);
    const dssFile = await ss(dPg, `desktop-1440${dp.replace(/\//g,'-')}`);
    await dCtx.close();
    
    // Mobile 375px
    const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const mPg = await mCtx.newPage();
    if (dp !== '/login') await doLogin(mPg, 'admin@test.com', 'Test@1234');
    await mPg.goto(BASE + dp, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await mPg.waitForTimeout(1500);
    
    const overflow = await mPg.evaluate(() => document.body.scrollWidth > window.innerWidth + 2);
    const hasHorizScroll = await mPg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    const mssFile = await ss(mPg, `mobile-375${dp.replace(/\//g,'-')}`);
    await mCtx.close();
    
    report.designTests.push({ page: dp, mobileOverflow: overflow || hasHorizScroll, desktopSS: dssFile, mobileSS: mssFile });
    console.log(`  ${dp}: mobile overflow: ${(overflow || hasHorizScroll) ? '❌' : '✅'}`);
  }
  
  // ═══════════════════════════════════════
  // ٧. روابط الـ Sidebar
  // ═══════════════════════════════════════
  console.log('\n=== ٧. فحص Sidebar ===');
  
  const sideCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const sidePg = await sideCtx.newPage();
  await doLogin(sidePg, 'admin@test.com', 'Test@1234');
  await sidePg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 12000 });
  await sidePg.waitForTimeout(2000);
  
  const navLinks = await sidePg.$$eval('nav a, aside a, [class*="sidebar"] a, [class*="nav"] a', links =>
    links.map(a => ({ href: a.href, text: a.innerText.trim().substring(0, 40) }))
      .filter(l => l.href && !l.href.startsWith('javascript'))
  );
  
  console.log(`  وجدت ${navLinks.length} رابط`);
  
  const deadLinks = navLinks.filter(l => !l.href || l.href === '#' || l.href.endsWith('#'));
  const hashLinks = navLinks.filter(l => l.href === '#' || l.href.endsWith('#'));
  
  // Test first 15 links
  let brokenCount = 0;
  for (const link of navLinks.slice(0, 15)) {
    if (!link.href.startsWith('http')) continue;
    try {
      const resp = await sidePg.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 8000 });
      const status = resp?.status() || 0;
      const is404 = status === 404;
      if (is404) {
        brokenCount++;
        report.sidebarLinks.push({ href: link.href, text: link.text, broken: true, status });
      }
      // Go back
      await sidePg.goto(BASE + '/dashboard/admin', { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
    } catch(e) {
      brokenCount++;
      report.sidebarLinks.push({ href: link.href, text: link.text, broken: true, error: e.message });
    }
  }
  
  report.sidebarLinks.push({ totalFound: navLinks.length, hashLinks: hashLinks.length, brokenTested: brokenCount });
  console.log(`  Hash links (#): ${hashLinks.length}, broken tested: ${brokenCount}`);
  await sideCtx.close();
  
  // ═══════════════════════════════════════
  // حفظ التقرير
  // ═══════════════════════════════════════
  const passedLogin = report.loginTests.filter(t => t.pass === true).length;
  const totalLogin = report.loginTests.filter(t => t.pass !== null).length;
  const passedPages = report.pageTests.filter(t => t.pass).length;
  const passedSec = report.securityTests.filter(t => t.pass).length;
  const mobileOk = report.designTests.filter(t => !t.mobileOverflow).length;
  
  report.summary = {
    login: `${passedLogin}/${totalLogin}`,
    pages: `${passedPages}/${report.pageTests.length}`,
    security: `${passedSec}/${report.securityTests.length}`,
    mobileDesign: `${mobileOk}/${report.designTests.length}`,
    screenshots: sc,
    screenshotDir: SS_DIR,
  };
  
  fs.writeFileSync('/tmp/matin-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n═══════════════════════════════');
  console.log('✅ تم الانتهاء من الفحص');
  console.log(`📊 Login: ${report.summary.login}`);
  console.log(`📊 Pages: ${report.summary.pages}`);
  console.log(`📊 Security: ${report.summary.security}`);
  console.log(`📊 Mobile Design: ${report.summary.mobileDesign}`);
  console.log(`📷 Screenshots: ${sc} صورة في ${SS_DIR}`);
  
  await browser.close();
})().catch(e => {
  console.error('FATAL ERROR:', e.message);
  console.error(e.stack);
  process.exit(1);
});
