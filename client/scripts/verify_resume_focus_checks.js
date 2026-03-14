const { chromium } = require('playwright');

(async () => {
  const login = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'priya.sharma@gmail.com', password: 'Password@123' }),
  }).then((r) => r.json());

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  await context.addInitScript((seed) => {
    localStorage.setItem('accessToken', seed.data.accessToken);
    localStorage.setItem('refreshToken', seed.data.refreshToken);
    localStorage.setItem(
      'auth-storage',
      JSON.stringify({ state: { user: seed.data.user, isAuthenticated: true }, version: 0 }),
    );
  }, login);

  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  await page.goto('http://localhost:3005/student/resume', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  const c12 = await page.getByRole('heading', { name: 'Resume Builder' }).isVisible();

  const sidebarLink = page.getByRole('link', { name: /Resume Builder/i }).first();
  const sidebarVisible = await sidebarLink.isVisible().catch(() => false);
  if (sidebarVisible) {
    await sidebarLink.click();
    await page.waitForTimeout(600);
  }
  const c20 = sidebarVisible && /\/student\/resume$/.test(page.url());

  await page.getByRole('button', { name: 'New Resume' }).click();
  await page.waitForURL(/\/student\/resume\/[a-z0-9]+/i);
  await page.waitForTimeout(800);

  const c14 =
    (await page.locator('a[href="/student/resume"]').isVisible()) &&
    (await page.locator('input[placeholder="Resume title..."]').isVisible()) &&
    (await page.getByRole('button', { name: /Personal Information/i }).isVisible()) &&
    (await page.locator('div.lg\\:w-1\/2').count()) >= 2;

  await page.fill('input[name="personalInfo.firstName"]', 'Priya');
  await page.fill('input[name="personalInfo.lastName"]', 'Sharma');
  await page.fill('input[name="personalInfo.email"]', 'priya.sharma@gmail.com');
  await page.fill(
    'textarea[name="personalInfo.summary"]',
    'Aspiring software engineer with strong analytical skills',
  );
  await page.waitForTimeout(1500);
  const bodyText = await page.locator('body').innerText();
  const c15 =
    bodyText.includes('Priya Sharma') &&
    bodyText.includes('Aspiring software engineer with strong analytical skills');

  const resumeTitle = await page.locator('input[placeholder="Resume title..."]').inputValue();
  await page.click('a[href="/student/resume"]');
  await page.waitForTimeout(1400);
  const listText = await page.locator('body').innerText();
  const c19 = listText.includes(resumeTitle) && /Edited/i.test(listText);

  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.waitForURL(/\/student\/resume\/[a-z0-9]+/i);

  const themeToggle = page.locator('button[aria-label="Toggle theme"]').first();
  const hasToggle = await themeToggle.isVisible().catch(() => false);
  let c21 = false;
  if (hasToggle) {
    await themeToggle.click();
    await page.waitForTimeout(500);
    const htmlClass = await page.locator('html').getAttribute('class');
    const isDark = (htmlClass || '').includes('dark');
    const preview = page.locator('div[style*="210mm"]').first();
    const bg = await preview.evaluate((el) => getComputedStyle(el).backgroundColor);
    c21 = isDark && bg === 'rgb(255, 255, 255)';
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const c22 =
    (await page.getByRole('button', { name: 'Edit' }).isVisible().catch(() => false)) &&
    (await page.getByRole('button', { name: 'Preview' }).isVisible().catch(() => false));

  console.log(JSON.stringify({ c12, c14, c15, c19, c20, c21, c22 }, null, 2));

  await context.close();
  await browser.close();
})();