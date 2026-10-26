import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cpSync, mkdtempSync, readFileSync, writeFileSync, symlinkSync,
  rmSync, existsSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { load } from 'cheerio';
import getViews from '../src/_data/views.js';
import { redirectViews } from '../lib/redirects.js';

test('legacy mappings reject collisions, unsafe paths and unknown targets', () => {
  const views = getViews();
  const mapping = { from: '/old-cbhe/', to: '/ka/opportunities/cbhe/' };
  assert.equal(redirectViews(views, [mapping])[0].target, mapping.to);
  for (const from of ['/', '/ka/', '/ka/index.html', '/404.html', '/bad/../path/', '//evil/', '/old/?id=1']) {
    assert.throws(() => redirectViews(views, [{ ...mapping, from }]), /colliding/);
  }
  assert.throws(() => redirectViews(views, [mapping, mapping]), /colliding/);
  for (const to of ['/missing/', 'https://example.org/', '/']) {
    assert.throws(() => redirectViews(views, [{ ...mapping, to }]), /not a page/);
  }
});

test('legacy stub renders with a prefixed refresh, canonical and working visible link', () => {
  const root = mkdtempSync(join(tmpdir(), 'neo-redirect-'));
  try {
    for (const path of ['src', 'lib', 'eleventy.config.js', 'package.json']) {
      cpSync(path, join(root, path), { recursive: true });
    }
    symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir');
    const mappings = [{ from: '/old-cbhe/', to: '/ka/opportunities/cbhe/' }];
    writeFileSync(join(root, 'src/_data/redirects.json'), JSON.stringify(mappings));
    execFileSync(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs'], {
      cwd: root,
      env: {
        ...process.env,
        PATH_PREFIX: '/neo-georgia-website/',
        SITE_URL: 'https://luka9815.github.io/neo-georgia-website/',
      },
      stdio: 'pipe',
    });
    const $ = load(readFileSync(join(root, '_site/old-cbhe/index.html'), 'utf8'));
    const target = '/neo-georgia-website/ka/opportunities/cbhe/';
    assert.equal($('meta[http-equiv=refresh]').attr('content').replace(/\s/g, ''), `0;url=${target}`);
    assert.equal($('link[rel=canonical]').attr('href'), `https://luka9815.github.io${target}`);
    assert.equal($('main a').first().attr('href'), target);
    assert.ok(existsSync(join(root, '_site/.nojekyll')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
