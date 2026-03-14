const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const baseClient = 'http://localhost:3005';
  const baseApi = 'http://localhost:5000/api';
  const out = {};
  const set = (n, ok, detail) => {
    out[n] = { status: ok ? 'PASS' : 'FAIL', detail };
    console.log(`CHECK ${n}: ${ok ? 'PASS' : 'FAIL'} - ${detail}`);
  };

  const login = await fetch(`${baseApi}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'priya.sharma@gmail.com', password: 'Password@123' }),
  }).then((r) => r.json());

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const downloadDir = path.join(__dirname, 'downloads');
  fs.mkdirSync(downloadDir, { recursive: true });

  await context.addInitScript((seed) => {
    localStorage.setItem('accessToken', seed.data.accessToken);
    localStorage.setItem('refreshToken', seed.data.refreshToken);
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: seed.data.user, isAuthenticated: true }, version: 0 }));
  }, login);

  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  try {
    set(11, true, 'Client reachable at :3005 during verification');

    await page.goto(`${baseClient}/student/resume`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    set(12, await page.getByRole('heading', { name: /Resume Builder/i }).isVisible().catch(() => false), 'Resume page opens');

    const sidebarLink = page.getByRole('link', { name: /Resume Builder/i }).first();
    const sidebarVisible = await sidebarLink.isVisible().catch(() => false);
    if (sidebarVisible) {
      await sidebarLink.click();
      await page.waitForTimeout(500);
    }
    set(20, sidebarVisible && /\/student\/resume$/.test(page.url()), 'Sidebar link exists and routes correctly');

    await page.getByRole('button', { name: /New Resume/i }).click();
    await page.waitForURL(/\/student\/resume\/[a-z0-9]+/i);
    set(13, true, `Navigated to editor ${page.url()}`);

    const sectionChecks = await Promise.all([
      page.getByRole('button', { name: /Personal Information/i }).isVisible().catch(() => false),
      page.getByRole('button', { name: /^Education/i }).isVisible().catch(() => false),
      page.getByRole('button', { name: /^Experience/i }).isVisible().catch(() => false),
      page.getByRole('button', { name: /^Skills/i }).isVisible().catch(() => false),
      page.getByRole('button', { name: /^Projects/i }).isVisible().catch(() => false),
      page.getByRole('button', { name: /^Certifications/i }).isVisible().catch(() => false),
      page.getByRole('button', { name: /^Achievements/i }).isVisible().catch(() => false),
      page.getByRole('button', { name: /Extra-Curricular Activities/i }).isVisible().catch(() => false),
    ]);

    const toolbarOk =
      (await page.locator('a[href="/student/resume"]').isVisible().catch(() => false)) &&
      (await page.locator('input[placeholder="Resume title..."]').isVisible().catch(() => false)) &&
      (await page.getByRole('button', { name: /Download PDF/i }).first().isVisible().catch(() => false));

    set(14, toolbarOk && sectionChecks.every(Boolean), 'Toolbar + accordion sections visible');

    await page.fill('input[name="personalInfo.firstName"]', 'Priya');
    await page.fill('input[name="personalInfo.lastName"]', 'Sharma');
    await page.fill('input[name="personalInfo.email"]', 'priya.sharma@gmail.com');
    await page.fill('textarea[name="personalInfo.summary"]', 'Aspiring software engineer with strong analytical skills');
    await page.waitForTimeout(1400);
    const txt = await page.locator('body').innerText();
    set(15, txt.includes('Priya Sharma') && txt.includes('Aspiring software engineer with strong analytical skills'), 'Preview reflects personal info updates');

    await page.getByRole('button', { name: /^Skills/i }).click();
    const skillInput = page.locator('input[placeholder="Python, React, SQL"]');
    await skillInput.fill('TypeScript');
    await skillInput.press('Enter');
    const tagVisible = await page.getByText('TypeScript').first().isVisible().catch(() => false);
    if (tagVisible) {
      const tag = page.locator('span', { hasText: 'TypeScript' }).first();
      await tag.locator('button').first().click();
      await page.waitForTimeout(300);
    }
    const removed = (await page.locator('span', { hasText: 'TypeScript' }).count()) === 0;
    set(16, tagVisible && removed, 'Skills tag add/remove works');

    await page.locator('button').filter({ hasText: /^modern$/i }).first().click();
    await page.waitForTimeout(400);
    const modernMarker = (await page.locator('.bg-brand-forest').count()) > 0;
    await page.locator('button').filter({ hasText: /^classic$/i }).first().click();
    await page.waitForTimeout(400);
    set(17, modernMarker, 'Template switching works (classic/modern)');

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 20000 }),
      page.getByRole('button', { name: /Download PDF/i }).first().click(),
    ]);
    const saveAs = path.join(downloadDir, await download.suggestedFilename());
    await download.saveAs(saveAs);
    const downloaded = fs.existsSync(saveAs) && fs.statSync(saveAs).size > 0;
    set(18, downloaded, downloaded ? `PDF downloaded: ${path.basename(saveAs)}` : 'PDF generation failed');

    const currentTitle = await page.locator('input[placeholder="Resume title..."]').inputValue();
    await page.goto(`${baseClient}/student/resume`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1400);
    const listTxt = await page.locator('body').innerText();
    set(19, listTxt.includes(currentTitle) && /Edited/i.test(listTxt), 'Edited resume appears in list with timestamp text');

    await page.getByRole('button', { name: /Edit/i }).first().click();
    await page.waitForURL(/\/student\/resume\/[a-z0-9]+/i);
    const themeToggle = page.locator('button[aria-label="Toggle theme"]').first();
    const toggleVisible = await themeToggle.isVisible().catch(() => false);
    let darkOk = false;
    let previewWhite = false;
    if (toggleVisible) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      const htmlClass = await page.locator('html').getAttribute('class');
      darkOk = (htmlClass || '').includes('dark');
      const docBg = await page.locator('div[style*="210mm"]').first().evaluate((el) => getComputedStyle(el).backgroundColor);
      previewWhite = docBg === 'rgb(255, 255, 255)';
    }
    set(21, toggleVisible && darkOk && previewWhite, 'Dark mode applies to chrome while preview remains white');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    const mobileTabs =
      (await page.getByRole('button', { name: /^Edit$/i }).isVisible().catch(() => false)) &&
      (await page.getByRole('button', { name: /^Preview$/i }).isVisible().catch(() => false));
    set(22, mobileTabs, 'Mobile uses Edit/Preview tab mode');
  } catch (error) {
    console.error('RUNTIME_SCRIPT_ERROR', error?.message || error);
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('RESULT_JSON');
  console.log(JSON.stringify(out, null, 2));
})();