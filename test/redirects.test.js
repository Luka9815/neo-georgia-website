import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
  rmSync,
  existsSync,
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
  for (const from of [
    '/',
    '/ka/',
    '/ka/index.html',
    '/404.html',
    '/bad/../path/',
    '//evil/',
    '/old/?id=1',
    '/%2e%2e/private/',
    '/%252e%252e/private/',
    '/bad%2f..%2fpath/',
    '/%zz/',
  ]) {
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
    assert.equal(
      $('meta[http-equiv=refresh]').attr('content').replace(/\s/g, ''),
      `0;url=${target}`
    );
    assert.equal(
      $('link[rel=canonical]').attr('href'),
      `https://luka9815.github.io${target}`
    );
    assert.equal($('main a').first().attr('href'), target);
    assert.ok(existsSync(join(root, '_site/.nojekyll')));

    // Exercise the launch switch in an isolated copy, never in tracked files.
    const settingsPath = join(root, 'src/_data/settings.json');
    writeFileSync(
      settingsPath,
      readFileSync(settingsPath, 'utf8').replace(
        '"siteLaunched": false',
        '"siteLaunched": true'
      )
    );
    execFileSync(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs'], {
      cwd: root,
      env: {
        ...process.env,
        PATH_PREFIX: '/neo-georgia-website/',
        SITE_URL: 'https://luka9815.github.io/neo-georgia-website/',
      },
      stdio: 'pipe',
    });
    const home = load(readFileSync(join(root, '_site/ka/index.html'), 'utf8'));
    assert.equal(home('meta[name=robots]').length, 0);
    assert.match(readFileSync(join(root, '_site/robots.txt'), 'utf8'), /Allow: \//);
    assert.doesNotMatch(
      readFileSync(join(root, '_site/robots.txt'), 'utf8'),
      /Disallow:/
    );
    for (const path of ['index.html', '404.html', 'old-cbhe/index.html']) {
      const document = load(readFileSync(join(root, '_site', path), 'utf8'));
      assert.match(document('meta[name=robots]').attr('content'), /noindex/);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('encoded legacy emoji produces the decoded static-host path', () => {
  const [view] = redirectViews(getViews(), [{ from: '/%f0%9f%93%a3-old/', to: '/ka/news/' }]);
  assert.equal(view.path, '/📣-old/');
});
