import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { argv, stdout } from 'node:process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const uiPackage = join(dirname(fileURLToPath(import.meta.url)), '../../packages/ui/package.json');
const { chromium } = createRequire(uiPackage)('playwright');

const jobs = JSON.parse(readFileSync(argv[2], 'utf8'));
const browser = await chromium.launch();
for (const job of jobs) {
  const page = await browser.newPage({
    viewport: { width: job.w, height: job.h },
    deviceScaleFactor: 1,
  });
  await page.setContent(job.html, { waitUntil: 'networkidle' });
  await page.evaluate('document.fonts.ready');
  await page.screenshot({ path: job.out, omitBackground: Boolean(job.transparent) });
  await page.close();
}
await browser.close();
stdout.write(`rendered ${jobs.length} files\n`);
