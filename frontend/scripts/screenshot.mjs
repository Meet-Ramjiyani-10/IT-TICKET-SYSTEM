import { chromium } from 'playwright';

(async () => {
  const url = process.env.URL || 'http://localhost:5174/';
  const out = 'frontend/login_screenshot.png';

  const browser = await chromium.launch({ args: ['--no-sandbox'], headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  try {
    await page.goto(url, { waitUntil: 'networkidle' , timeout: 30000 });
    // wait a bit for client-side routing to settle
    await page.waitForTimeout(1000);
    await page.screenshot({ path: out, fullPage: true });
    console.log('Saved screenshot to', out);
  } catch (err) {
    console.error('Screenshot failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
