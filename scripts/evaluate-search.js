// Manual, offline-runtime experiment. Writes indexes only in a temporary directory.
import * as pagefind from 'pagefind';
import { chromium } from 'playwright';
import { load } from 'cheerio';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { performance } from 'node:perf_hooks';
import assert from 'node:assert/strict';
import getViews from '../src/_data/views.js';
const temporary = mkdtempSync(join(tmpdir(), 'neo-pagefind-'));
const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
const report = { version: '1.5.2', measuredAt: new Date().toISOString(), method: 'One cold local build per layout; application response bytes exclude HTTP headers. Temporary indexes only.', layouts: [] };
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  for (const prefix of ['/', '/neo-georgia-website/']) {
    const output = join(temporary, prefix === '/' ? 'root' : 'project');
    const buildStart = performance.now();
    execFileSync(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs', `--output=${output}`], {
      env: { ...process.env, PATH_PREFIX: prefix, SITE_URL: `https://example.org${prefix}` }, stdio: 'pipe',
    });
    const baselineBuildMs = Math.round(performance.now() - buildStart);
    const baselineBytes = files(output).reduce((sum, file) => sum + statSync(file).size, 0);
    const indexStart = performance.now();
    const expected = {};
    const pageCounts = {};
    for (const lang of ['ka', 'en']) {
      const { index, errors } = await pagefind.createIndex({ forceLanguage: lang, rootSelector: 'main', excludeSelectors: ['.notice'] });
      assert.deepEqual(errors, []);
      assert.ok(index);
      const views = getViews().filter(view => view.lang === lang && !['redirect', 'legacyRedirect', '404', 'search'].includes(view.kind));
      pageCounts[lang] = views.length;
      for (const view of views) {
        const content = readFileSync(join(output, view.path.slice(1), 'index.html'), 'utf8');
        const url = prefix + view.path.slice(1);
        const $ = load(content); $('.notice').remove();
        if (lang === 'ka') expected[url] = $('main').text();
        const added = await index.addHTMLFile({ url, content });
        assert.deepEqual(added.errors, []);
      }
      const written = await index.writeFiles({ outputPath: join(output, 'pagefind', lang) });
      assert.deepEqual(written.errors, []);
      await index.deleteIndex();
    }
    const indexingMs = Math.round(performance.now() - indexStart);
    const indexBytes = Object.fromEntries(['ka', 'en'].map(lang => [lang, files(join(output, 'pagefind', lang)).reduce((sum, file) => sum + statSync(file).size, 0)]));
    // Only local experiment assets are served. No production page or search UI changes.
    const server = createServer((request, response) => {
      const pathname = new URL(request.url, 'http://localhost').pathname;
      if (pathname === '/') { response.setHeader('Content-Type', 'text/html'); response.end('<!doctype html><html lang="en"><title>Local search experiment</title><body>Local experiment</body></html>'); return; }
      if (!/^\/pagefind\/(ka|en)\/[a-zA-Z0-9_./-]+$/.test(pathname) || pathname.split('/').includes('..')) { response.writeHead(404).end(); return; }
      try {
        response.setHeader('Content-Type', extname(pathname) === '.js' ? 'text/javascript' : 'application/octet-stream');
        response.end(readFileSync(join(output, pathname.slice(1))));
      } catch { response.writeHead(404).end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const page = await browser.newPage();
    const externalRequests = [];
    const transfers = [];
    const responseTasks = [];
    page.on('request', request => { if (new URL(request.url()).origin !== origin) externalRequests.push(request.url()); });
    await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    page.on('response', response => {
      if (response.url().includes('/pagefind/')) responseTasks.push(response.body().then(body => transfers.push({ path: new URL(response.url()).pathname, bytes: body.length })));
    });
    try {
      await page.goto(origin);
      const queries = [];
      const firstSearchBytes = {};
      for (const [lang, terms] of [['ka', ['მობილობა', 'მობილობ', 'მობილობის', 'ერასმუს', 'ერასმუსის', 'თანამშრომლობა', 'თანამშრომლობის', 'საგანმანათლებლო']], ['en', ['mobility', 'მობილობა']]]) {
        for (const query of terms) {
          const result = await page.evaluate(async ({lang, query}) => {
            const engine = await import(`/pagefind/${lang}/pagefind.js`);
            const found = await engine.search(query);
            const data = await Promise.all(found.results.map(result => result.data()));
            return { count: found.results.length, urls: data.map(result => result.url) };
          }, { lang, query });
          await Promise.all(responseTasks);
          // Includes all result fragments for the first query, an upper bound for a lazy UI.
          firstSearchBytes[lang] ??= transfers.filter(item => item.path.startsWith(`/pagefind/${lang}/`)).reduce((sum, item) => sum + item.bytes, 0);
          for (const url of result.urls) {
            assert.ok(url.startsWith(`${prefix}${lang}/`), `Language/prefix leak: ${url}`);
            assert.ok(statSync(join(output, url.slice(prefix.length), 'index.html')).isFile(), `Missing result: ${url}`);
          }
          const family = query.startsWith('მობილობ') ? 'მობილობ' : query.startsWith('თანამშრომლობ') ? 'თანამშრომლობ' : null;
          const relevant = lang === 'ka' && family ? Object.entries(expected).filter(([, text]) => text.includes(family)).map(([url]) => url) : [];
          queries.push({ lang, query, ...result, ...(relevant.length ? { family, relevant: relevant.length, missed: relevant.filter(url => !result.urls.includes(url)) } : {}) });
        }
      }
      assert.deepEqual(externalRequests, []);
      report.layouts.push({ prefix, baselineBuildMs, indexingMs, baselineBytes, indexBytes, firstSearchBytes, pageCounts, externalRequests, queries });
    } finally { await page.close(); await new Promise(resolve => server.close(resolve)); }
  }
  const flag = process.argv.find(arg => arg.startsWith('--report='));
  if (flag) writeFileSync(resolve(flag.slice('--report='.length)), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser?.close();
  await pagefind.close();
  rmSync(temporary, { recursive: true, force: true });
}
