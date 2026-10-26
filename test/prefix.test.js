import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { load } from 'cheerio';

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]
  );
}

for (const [prefix, origin] of [
  ['/neo-georgia-website/', 'https://luka9815.github.io'],
  ['/', 'https://example.org'],
]) {
  test(`build resolves links, metadata and refresh targets under ${origin}${prefix}`, () => {
    const output = mkdtempSync(join(tmpdir(), 'neo-prefix-'));
    try {
      execFileSync(process.execPath, [
        'node_modules/@11ty/eleventy/cmd.cjs', `--output=${output}`,
      ], {
        env: { ...process.env, PATH_PREFIX: prefix, SITE_URL: `${origin}${prefix}` },
        stdio: 'pipe',
      });
      for (const file of files(output).filter(path => path.endsWith('.html'))) {
        const $ = load(readFileSync(file, 'utf8'));
        for (const element of $('[href], [src]')) {
          const value = $(element).attr('href') || $(element).attr('src');
          if (value.startsWith('#') || /^https?:/.test(value)) continue;
          assert.ok(value.startsWith(prefix), `${file}: escaped prefix: ${value}`);
          const path = value.slice(prefix.length).split(/[?#]/)[0];
          const target = join(output, path + (path.endsWith('/') || !path ? 'index.html' : ''));
          assert.ok(existsSync(target), `${file}: missing ${target}`);
        }
        for (const element of $('link[rel=canonical], link[rel=alternate], meta[property="og:url"]')) {
          const value = $(element).attr('href') || $(element).attr('content');
          assert.ok(value.startsWith(`${origin}${prefix}`), `${file}: ${value}`);
        }
      }
      const index = load(readFileSync(join(output, 'index.html'), 'utf8'));
      assert.equal(index('meta[http-equiv=refresh]').attr('content').replace(/\s/g, ''), `0;url=${prefix}ka/`);
      const sitemap = load(readFileSync(join(output, 'sitemap.xml'), 'utf8'), { xmlMode: true });
      assert.ok(sitemap('loc').length > 0);
      for (const loc of sitemap('loc')) {
        assert.ok(sitemap(loc).text().startsWith(`${origin}${prefix}`));
      }
      assert.ok(readFileSync(join(output, 'robots.txt'), 'utf8').includes(`${origin}${prefix}sitemap.xml`));
    } finally {
      rmSync(output, { recursive: true, force: true });
    }
  });
}
