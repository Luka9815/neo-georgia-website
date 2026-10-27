// Ad hoc tool installation only, see README.md. Run from the repository root.
import { writeFileSync } from 'node:fs';
const { default: lighthouse } = await import(
  process.env.LIGHTHOUSE_MODULE || '/tmp/neo-lighthouse/node_modules/lighthouse/core/index.js'
);
const { launch } = await import(
  process.env.CHROME_LAUNCHER_MODULE || '/tmp/neo-lighthouse/node_modules/chrome-launcher/dist/index.js'
);
const chrome = await launch({
  chromePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
});
const report = {
  date: new Date().toISOString(),
  lighthouse: '13.0.1',
  origin: process.env.TEST_URL || 'http://127.0.0.1:8080',
  method: 'One sequential mobile simulated-throttling navigation per URL on the local production build. Performance and accessibility categories. Shared bilingual root 404 tested once.',
  pages: [],
};
const paths = [
  '', 'opportunities/', 'opportunities/cbhe/', 'calls/', 'news/',
  'news/neo-dissemination-event-2025/', 'events/', 'resources/publications/',
  'resources/faq/', 'about/contact/',
];
const urls = [...['ka', 'en'].flatMap(lang => paths.map(path => `/${lang}/${path}`)), '/404.html'];
try {
  for (const path of urls) {
    const { lhr } = await lighthouse(report.origin + path, {
      port: chrome.port,
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility'],
    });
    const row = {
      path,
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      fcpMs: lhr.audits['first-contentful-paint'].numericValue,
      lcpMs: lhr.audits['largest-contentful-paint'].numericValue,
      tbtMs: lhr.audits['total-blocking-time'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      warnings: lhr.runWarnings,
      failedAudits: Object.entries(lhr.audits)
        .filter(([, audit]) => audit.score !== null && audit.score < 1 &&
          audit.details?.type !== 'opportunity' && audit.scoreDisplayMode === 'binary')
        .map(([id, audit]) => ({ id, title: audit.title })),
      opportunities: Object.entries(lhr.audits)
        .filter(([, audit]) => audit.details?.overallSavingsMs > 0)
        .map(([id, audit]) => ({ id, savingsMs: audit.details.overallSavingsMs })),
    };
    report.pages.push(row);
    console.log(path, row.performance, row.accessibility);
    writeFileSync(
      process.env.PERFORMANCE_REPORT || '/tmp/session-16-performance.json',
      JSON.stringify(report, null, 2) + '\n'
    );
  }
} finally {
  await chrome.kill();
}
