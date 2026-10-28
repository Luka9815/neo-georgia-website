import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { load } from 'cheerio';
import projectData from '../src/_data/projectData.js';
import { getPathPrefix } from '../lib/urls.js';

globalThis.fetch = () => { throw new Error('Network access forbidden in project page tests'); };
const data = projectData();
const prefix = getPathPrefix();

test('both languages publish complete static year tables under 1 MB with original titles and official cards', () => {
  for (const lang of ['ka', 'en']) {
    let total = 0;
    for (const year of data.years) {
      const file = `_site/${lang}/resources/projects/${year}/index.html`;
      assert.ok(statSync(file).size < 1_000_000, file);
      const $ = load(readFileSync(file, 'utf8'));
      const projects = data.projects.filter(p => p.year === year);
      assert.equal($('.project-table tbody tr').length, projects.length);
      total += projects.length;
      assert.equal($('.project-table th:not([scope])').length, 0);
      // Index once instead of rescanning each large year table for every row.
      // Still require exactly one original-title link for every source record.
      const linksByUrl = new Map();
      for (const element of $('.project-table a[href]')) {
        const url = $(element).attr('href');
        if (!linksByUrl.has(url)) linksByUrl.set(url, []);
        linksByUrl.get(url).push(element);
      }
      for (const project of projects) {
        const link = $(linksByUrl.get(project.officialUrl) || []);
        assert.equal(link.length, 1);
        const title = link.closest('th').find('span').first();
        assert.equal(title.text(), project.title.replace(/\r\n?/g, '\n'));
        assert.equal(title.attr('lang'), project.titleLang);
      }
      assert.equal($('[data-project-attribution] a').attr('href'), data.sourceUrl);
      assert.equal($('[data-project-attribution] time').first().attr('datetime'), '2026-10-28');
      assert.notEqual($('[data-project-attribution] time').last().attr('datetime'), '2026-10-28');
      assert.ok($('h1').text().includes(String(year)));
    }
    assert.equal(total, 6764);
  }
});

test('bilingual statistics and homepage use named-institution counts and no illustrative figure keys', () => {
  for (const lang of ['ka', 'en']) {
    const $ = load(readFileSync(`_site/${lang}/resources/statistics/index.html`, 'utf8'));
    for (const [key, count] of [['total',6764], ['organisations',605], ['participations',5079], ['coordinated',106], ['mobility',2045]]) {
      assert.equal($(`[data-project-${key}]`).text(), String(count));
    }
    for (const kind of ['years','groups','statuses','periods']) {
      const sum = $(`[data-project-statistics="${kind}"] tbody td`).toArray().reduce((n, el) => n + Number($(el).text()), 0);
      assert.equal(sum, 6764, kind);
    }
    const home = load(readFileSync(`_site/${lang}/index.html`, 'utf8'));
    assert.deepEqual(home('.figures dd').map((_, el) => home(el).text()).get(), ['6764','605','106']);
    assert.equal(home(`.figures a[href="${prefix}${lang}/resources/statistics/"]`).length, 3);
    const strings = JSON.parse(readFileSync(`src/_data/${lang}.json`));
    assert.ok(!('sampleNumber' in strings) && !('figuresNote' in strings));
  }
});

test('bilingual coverage notes sit beside year and Action comparisons and explain the 2020/2021 break', () => {
  assert.equal(data.projects.filter(p => p.reference.includes('-KA107-')).length, 0);
  assert.equal(data.projects.filter(p => p.period === '2014–2020' && /^Mobility\s+of higher education/.test(p.actionLabel)).length, 0);
  for (const lang of ['ka', 'en']) {
    const strings = JSON.parse(readFileSync(`src/_data/${lang}.json`));
    for (const path of ['projects', 'statistics']) {
      const $ = load(readFileSync(`_site/${lang}/resources/${path}/index.html`, 'utf8'));
      const notes = $('[data-project-mobility-coverage]');
      assert.equal(notes.length, 2, `${lang}/${path}`);
      for (const note of notes) {
        assert.equal($(note).text(), strings.projectMobilityCoverage);
        assert.equal($(note).attr('hidden'), undefined);
        assert.match($(note).text(), /KA107/);
        assert.match($(note).text(), /KA171/);
        assert.match($(note).text(), /2020\/2021/);
      }
      if (path === 'statistics') {
        for (const kind of ['years', 'groups']) assert.equal($(`[data-project-statistics="${kind}"]`).prev('[data-project-mobility-coverage]').length, 1);
      } else {
        assert.equal($('#projects-all [data-project-mobility-coverage]').length, 1);
        assert.equal($('[data-project-action-index] > [data-project-mobility-coverage]').length, 1);
      }
    }
  }
});
