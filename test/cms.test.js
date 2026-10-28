import { createFixtureSite } from '../scripts/fixture-site.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cpSync,
  mkdirSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
  rmSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { load as yaml } from 'js-yaml';
import { load } from 'cheerio';
import { loadContent } from '../lib/content.js';
import { eventOptions } from '../lib/validate-content.js';
const read = (file) => readFileSync(file, 'utf8');
const config = yaml(read('.pages.yml'));
const collection = (name) => config.content.find((entry) => entry.name === name);
const field = (entry, name) => entry.fields.find((item) => item.name === name);

function isolatedSite() {
  const root = createFixtureSite();
  cpSync('test/fixtures/news', join(root, 'src/content/news'), { recursive: true });
  return root;
}
function build(root) {
  return execFileSync(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs'], {
    cwd: root,
    env: {
      ...process.env,
      PATH_PREFIX: '/neo-georgia-website/',
      SITE_URL: 'https://luka9815.github.io/neo-georgia-website/',
    },
    stdio: 'pipe',
  });
}

test('CMS schema matches JSON collections, local time rules, translations and action slugs', () => {
  const data = loadContent();
  for (const [name, type] of [
    ['news', 'news'],
    ['events', 'event'],
  ]) {
    const entry = collection(name);
    assert.equal(entry.path, `src/content/${type}`);
    assert.equal(entry.format, 'json');
    assert.equal(entry.filename.template, '{fields.slug}.json');
    assert.deepEqual(
      field(entry, 'actions')
        .options.values.map((v) => v.name)
        .sort(),
      data.action.map((item) => item.slug).sort()
    );
    assert.equal(field(entry, 'actions').options.multiple, true);
    assert.equal(field(entry, 'actions').required, name === 'events');
    assert.equal(field(entry, 'ka').required, true);
    assert.equal(field(entry, 'en').required, name === 'events');
    for (const lang of ['ka', 'en']) {
      const body = field(field(entry, lang), 'body');
      assert.equal(body.type, 'rich-text');
      assert.equal(body.options.format, 'markdown');
      assert.equal(body.options.media, false);
    }
  }
  for (const [name, values] of Object.entries(eventOptions)) {
    assert.deepEqual(
      field(collection('events'), name).options.values.map((v) => v.name),
      values
    );
  }
  assert.equal(field(collection('events'), 'timeZone').default, 'Asia/Tbilisi');
  for (const name of ['date', 'end']) {
    const date = field(collection('events'), name);
    assert.equal(date.type, 'string');
    const regex = new RegExp(date.pattern.regex);
    assert.ok(regex.test('2026-12-15T17:00'));
    assert.ok(!regex.test('2026-12-15T17:00+04:00'));
  }
  const settings = collection('settings');
  assert.equal(settings.path, 'src/_data/settings.json');
  assert.deepEqual(
    settings.fields.map((item) => item.name),
    ['currentCallYear', 'logoPath']
  );
  assert.equal(config.settings.content.merge, true);
  assert.equal(config.media.input, 'src/assets/uploads');
  assert.equal(config.media.output, '/assets/uploads');
});

test('a deliberately bad Event fixture stops the real build with filename and field', () => {
  const root = isolatedSite();
  try {
    cpSync(
      'test/fixtures/cms-invalid/missing-title.json',
      join(root, 'src/content/event/missing-title.json')
    );
    assert.throws(
      () => build(root),
      (error) => {
        const output = `${error.stdout}\n${error.stderr}`;
        assert.match(
          output,
          /src\/content\/event\/missing-title.json: ka.title: required/
        );
        return true;
      }
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

for (const [type, mutate, expected] of [
  ['news', (item) => delete item.date, 'date'],
  ['news', (item) => delete item.ka.title, 'ka.title'],
  ['news', (item) => delete item.ka.body, 'ka.body'],
  ['news', (item) => (item.date = '2026-12-15T17:00+04:00'), 'date'],
  ['news', (item) => (item.date = '2026-02-30'), 'date'],
  ['news', (item) => (item.actions = ['unknown-action']), 'actions[0]'],
  ['news', (item) => (item.en = { title: 'Partial translation' }), 'en.body'],
  ['event', (item) => delete item.timeZone, 'timeZone'],
  ['event', (item) => delete item.en, 'en.title'],
  ['event', (item) => (item.date += '+04:00'), 'date'],
  ['event', (item) => (item.end += 'Z'), 'end'],
  ['event', (item) => (item.actions = ['unknown-action']), 'actions[0]'],
  ['event', (item) => (item.actions = []), 'actions'],
  ['news', (item) => (item.actions = 'cbhe'), 'actions'],
  ['event', (item) => (item.end = '2020-01-01T00:00'), 'end'],
]) {
  test(`loader rejects ${type} editor mistake in ${expected}`, () => {
    const root = mkdtempSync(join(tmpdir(), 'neo-bad-content-'));
    try {
      cpSync('src', join(root, 'src'), { recursive: true });
      const contentRoot = join(root, 'src/content');
      cpSync('test/fixtures/news', join(contentRoot, 'news'), { recursive: true });
      const original = type === 'news' ? 'update-1' : 'webinar';
      const file = join(contentRoot, type, `${original}.json`);
      const item = JSON.parse(read(file));
      mutate(item);
      writeFileSync(file, JSON.stringify(item));
      assert.throws(
        () => loadContent(contentRoot),
        (error) => {
          assert.ok(error.message.includes(`${file}: ${expected}:`), error.message);
          return true;
        }
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}

for (const [label, mutate] of [
  ['an empty Action list', (item) => (item.actions = [])],
  ['no Action field', (item) => delete item.actions],
]) {
  test(`loader accepts News with ${label}`, () => {
    const root = mkdtempSync(join(tmpdir(), 'neo-news-no-action-'));
    try {
      cpSync('src', join(root, 'src'), { recursive: true });
      const contentRoot = join(root, 'src/content');
      cpSync('test/fixtures/news', join(contentRoot, 'news'), { recursive: true });
      const file = join(contentRoot, 'news', 'update-1.json');
      const item = JSON.parse(read(file));
      mutate(item);
      writeFileSync(file, JSON.stringify(item));
      const loaded = loadContent(contentRoot).news.find((n) => n.slug === item.slug);
      assert.deepEqual(loaded.actions, []);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}

test('CMS-shaped JSON renders Markdown safely, keeps optional News English absent, and reads settings', () => {
  const root = isolatedSite();
  try {
    const body =
      '**Bold text**\n\n<script>alert(1)</script>\n\n![Test](/assets/uploads/probe.svg)';
    const entry = {
      slug: 'cms-roundtrip',
      date: '2026-12-15',
      actions: ['cbhe'],
      ka: { title: '[SAMPLE] CMS test', body },
      en: { title: '', body: '' },
    };
    writeFileSync(
      join(root, 'src/content/news/cms-roundtrip.json'),
      JSON.stringify(entry)
    );
    writeFileSync(
      join(root, 'src/assets/uploads/probe.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
    );
    writeFileSync(
      join(root, 'src/_data/settings.json'),
      JSON.stringify({
        currentCallYear: 2027,
        siteLaunched: false,
        logoPath: '/assets/uploads/probe.svg',
      })
    );
    const eventPath = join(root, 'src/content/event/webinar.json');
    const event = JSON.parse(read(eventPath));
    delete event.registration;
    delete event.ka.agenda;
    event.en.agenda = '   ';
    writeFileSync(eventPath, JSON.stringify(event));
    build(root);
    assert.equal(load(read(join(root, '_site/ka/news/update-3/index.html')))('header a[hreflang]').attr('href'), '/neo-georgia-website/en/news/');
    assert.equal(existsSync(join(root, '_site/en/news/update-3/index.html')), false);
    assert.equal(load(read(join(root, '_site/en/news/index.html')))('main a[href$="/update-3/"]').length, 0);
    const $ = load(read(join(root, '_site/ka/news/cms-roundtrip/index.html')));
    assert.equal($('main strong').text(), 'Bold text');
    assert.equal($('main script').length, 0);
    assert.ok($('main').text().includes('<script>alert(1)</script>'));
    assert.equal(
      $('main img').attr('src'),
      '/neo-georgia-website/assets/uploads/probe.svg'
    );
    assert.equal($('header a[hreflang]').attr('href'), '/neo-georgia-website/en/news/');
    for (const lang of ['ka', 'en']) {
      const eventPage = load(
        read(join(root, `_site/${lang}/events/webinar/index.html`))
      );
      const strings = JSON.parse(read(`src/_data/${lang}.json`));
      assert.ok(
        !eventPage('main dt')
          .toArray()
          .some((el) => eventPage(el).text() === strings.agenda)
      );
      assert.ok(
        !eventPage('main a')
          .toArray()
          .some((el) => eventPage(el).text() === strings.registration)
      );
    }
    const calls = load(read(join(root, '_site/ka/calls/index.html')));
    assert.equal(calls('[data-call-year]').first().attr('data-call-year'), '2027');
    assert.match($('meta[name=robots]').attr('content'), /noindex/);
    assert.equal(
      $('header .brand-image').attr('src'),
      '/neo-georgia-website/assets/uploads/probe.svg'
    );
    assert.equal(
      $('header .brand-image').attr('alt'),
      JSON.parse(read('src/_data/ka.json')).logoAlt
    );
    assert.equal($('header .brand-name').length, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
