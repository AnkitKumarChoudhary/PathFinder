const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const baseUrl = 'http://localhost:3005';
  const checks = {};
  const setCheck = (num, pass, detail) => {
    checks[num] = { status: pass ? 'PASS' : 'FAIL', detail };
    console.log(`CHECK ${num}: ${pass ? 'PASS' : 'FAIL'} - ${detail}`);
  };

  const downloadDir = path.join(__dirname, 'downloads');
  fs.mkdirSync(downloadDir, { recursive: true });

  let authSeed = null;
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'priya.sharma@gmail.com', password: 'Password@123' }),
    });
    const loginJson = await loginRes.json();
    authSeed = {
      accessToken: loginJson?.data?.accessToken,
      refreshToken: loginJson?.data?.refreshToken,
      user: loginJson?.data?.user,
    };
  } catch {
    authSeed = null;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });

  if (authSeed?.accessToken && authSeed?.refreshToken && authSeed?.user) {
    await context.addInitScript((seed) => {
      localStorage.setItem('accessToken', seed.accessToken);
      localStorage.setItem('refreshToken', seed.refreshToken);
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({ state: { user: seed.user, isAuthenticated: true }, version: 0 }),
      );
    }, authSeed);
  }

  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  try {
    await page.goto(`${baseUrl}/student/resume`, { waitUntil: 'domcontentloaded' });
    const headingVisible = await page.getByRole('heading', { name: 'Resume Builder' }).isVisible().catch(() => false);
    setCheck(12, headingVisible, headingVisible ? 'Resume list page loaded' : 'Resume list page did not load');

    const sidebarLink = page.getByRole('link', { name: 'Resume Builder' }).first();
    const sidebarVisible = await sidebarLink.isVisible().catch(() => false);
    if (sidebarVisible) {
      await sidebarLink.click();
      await page.waitForURL(/\/student\/resume$/, { timeout: 10000 });
    }
    setCheck(20, sidebarVisible, sidebarVisible ? 'Sidebar link present and routes to /student/resume' : 'Sidebar link missing');

    await page.getByRole('button', { name: 'New Resume' }).click();
    await page.waitForURL(/\/student\/resume\/[a-z0-9]+/i, { timeout: 15000 });
    const editorUrl = page.url();
    const editorMatch = /\/student\/resume\/([a-z0-9]+)/i.exec(editorUrl);
    const resumeId = editorMatch ? editorMatch[1] : null;
    setCheck(13, Boolean(resumeId), resumeId ? `Created and navigated to editor ${resumeId}` : 'Did not navigate to editor page');

    const toolbarBits = [
      page.locator('a[href="/student/resume"]'),
      page.locator('input[placeholder="Resume title..."]'),
      page.getByText('Saved').first(),
      page.getByRole('button', { name: 'Download PDF' }).first(),
    ];
    let toolbarOk = true;
    for (const bit of toolbarBits) {
      toolbarOk = toolbarOk && (await bit.isVisible().catch(() => false));
    }

    const sectionNames = [
      'Personal Information',
      'Education',
      'Experience',
      'Skills',
      'Projects',
      'Certifications',
      'Achievements',
      'Extra-Curricular Activities',
    ];
    let sectionsOk = true;
    for (const section of sectionNames) {
      sectionsOk = sectionsOk && (await page.getByRole('button', { name: new RegExp(section, 'i') }).isVisible().catch(() => false));
    }
    setCheck(14, toolbarOk && sectionsOk, toolbarOk && sectionsOk ? 'Editor split view and required sections present' : 'Editor layout/sections incomplete');

    await page.fill('input[name="personalInfo.firstName"]', 'Priya');
    await page.fill('input[name="personalInfo.lastName"]', 'Sharma');
    await page.fill('input[name="personalInfo.email"]', 'priya.sharma@gmail.com');
    await page.fill('textarea[name="personalInfo.summary"]', 'Aspiring software engineer focused on building impactful products.');

    const previewArea = page.locator('div[style*="210mm"]').first();
    await page.waitForTimeout(600);
    const previewText = await previewArea.innerText();
    const liveUpdateOk =
      previewText.includes('Priya Sharma') &&
      previewText.includes('priya.sharma@gmail.com') &&
      previewText.includes('Aspiring software engineer focused on building impactful products.');
    setCheck(15, liveUpdateOk, liveUpdateOk ? 'Live preview updated from form input' : 'Live preview did not reflect form input');

    await page.getByRole('button', { name: /Skills/i }).click();
    const skillInput = page.locator('input[placeholder="Python, React, SQL"]');
    await skillInput.fill('TypeScript');
    await skillInput.press('Enter');
    const tagVisible = await page.getByText('TypeScript').first().isVisible().catch(() => false);

    let removed = false;
    if (tagVisible) {
      const tag = page.locator('span', { hasText: 'TypeScript' }).first();
      const removeBtn = tag.locator('button').first();
      await removeBtn.click();
      await page.waitForTimeout(200);
      removed = (await tag.count()) === 0;
    }
    setCheck(16, tagVisible && removed, tagVisible && removed ? 'Tag add/remove works in Skills' : 'Tag input add/remove failed');

    const modernButton = page.locator('button').filter({ hasText: /^modern$/i }).first();
    await modernButton.click();
    await page.waitForTimeout(500);
    const modernHasSidebar = (await previewArea.locator('.bg-brand-forest').count()) > 0;

    const classicButton = page.locator('button').filter({ hasText: /^classic$/i }).first();
    await classicButton.click();
    await page.waitForTimeout(500);
    const classicHasHeader = (await previewArea.getByText(/Priya Sharma/i).count()) > 0;
    setCheck(17, modernHasSidebar && classicHasHeader, modernHasSidebar && classicHasHeader ? 'Template switching re-renders preview' : 'Template switching failed');

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 20000 }),
      page.getByRole('button', { name: 'Download PDF' }).first().click(),
    ]);
    const savePath = path.join(downloadDir, await download.suggestedFilename());
    await download.saveAs(savePath);
    const downloaded = fs.existsSync(savePath) && fs.statSync(savePath).size > 0;
    setCheck(18, downloaded, downloaded ? `PDF downloaded: ${path.basename(savePath)}` : 'PDF download failed');

    await page.click('a[href="/student/resume"]');
    await page.waitForURL(/\/student\/resume$/, { timeout: 10000 });
    await page.waitForTimeout(600);
    const titleVisible = await page.getByText(/My Resume|Updated Resume|My First Resume/i).first().isVisible().catch(() => false);
    const editedVisible = await page.getByText(/Edited/i).first().isVisible().catch(() => false);
    setCheck(19, titleVisible && editedVisible, titleVisible && editedVisible ? 'Edited resume appears in list with edited timestamp' : 'Resume list did not show updated entry/timestamp');

    await page.goto(editorUrl, { waitUntil: 'domcontentloaded' });
    const themeToggle = page.locator('button[aria-label="Toggle theme"]').first();
    const hasThemeToggle = await themeToggle.isVisible().catch(() => false);
    let darkOk = false;
    let previewWhite = false;
    if (hasThemeToggle) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      const htmlClass = await page.locator('html').getAttribute('class');
      darkOk = (htmlClass || '').includes('dark');
      const docBg = await previewArea.evaluate((el) => getComputedStyle(el).backgroundColor);
      previewWhite = docBg === 'rgb(255, 255, 255)';
    }
    setCheck(21, hasThemeToggle && darkOk && previewWhite, hasThemeToggle && darkOk && previewWhite ? 'Dark mode applies to UI while document preview stays white' : 'Dark mode/preview behavior mismatch');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    const editTab = page.getByRole('button', { name: 'Edit' });
    const previewTab = page.getByRole('button', { name: 'Preview' });
    const tabsVisible = (await editTab.isVisible().catch(() => false)) && (await previewTab.isVisible().catch(() => false));
    if (tabsVisible) {
      await previewTab.click();
      await page.waitForTimeout(300);
    }
    setCheck(22, tabsVisible, tabsVisible ? 'Mobile tab view (Edit/Preview) present' : 'Mobile tab view missing');

    setCheck(11, true, 'Client started and served on http://localhost:3005');
  } catch (error) {
    console.error(error);
    if (!checks[11]) setCheck(11, false, String(error));
    for (const n of [12,13,14,15,16,17,18,19,20,21,22]) {
      if (!checks[n]) setCheck(n, false, 'Aborted due to prior error');
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const ordered = Object.keys(checks)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => ({ check: n, ...checks[n] }));

  console.log('\nSUMMARY JSON:');
  console.log(JSON.stringify(ordered, null, 2));
})();