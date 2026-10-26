import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import MarkdownIt from 'markdown-it';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const slugs = ['europe-day-in-kutaisi', 'announcement-clarification-on-erasmus-opportunities-for-education-institutions-in-georgia', 'neo-dissemination-event-2025', 'eve-statistics', 'information-about-capacity-building-project-proposals'];
const md = new MarkdownIt();
const links = body => [...body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]).sort();
test('five approved News splits preserve source wording and every body link', () => {
  for (const slug of slugs) {
    const source = read(`migration/review/news/${slug}.json`);
    const item = read(`src/content/news/${slug}.json`);
    assert.equal(item.date, source.date);
    assert.ok(!item.image);
    assert.deepEqual(links(item.ka.body + item.en.body), links(source.sourceText.body));
    for (const lang of ['ka', 'en']) {
      assert.ok(item[lang].title);
      assert.match(item[lang].body, lang === 'ka' ? /[ა-ჰ]/ : /[A-Za-z]/);
      assert.doesNotMatch(item[lang].body, /For (English|Georgian).*Scroll|ALT NEEDED/i);
      // Every retained paragraph is copied, including original spelling and punctuation.
      for (const paragraph of item[lang].body.split('\n\n')) assert.ok(source.sourceText.body.includes(paragraph), `${slug}: ${paragraph}`);
      assert.ok(md.render(item[lang].body).length > 100);
    }
  }
});

test('promoted News render both languages with sequential headings', () => {
  for (const slug of slugs) for (const lang of ['ka', 'en']) {
    const html = readFileSync(`_site/${lang}/news/${slug}/index.html`, 'utf8');
    let previous = 0;
    for (const match of html.matchAll(/<h([1-6])(?:\s[^>]*)?>/g)) {
      const level = Number(match[1]);
      assert.ok(level <= previous + 1, `${lang}/${slug}: h${previous} to h${level}`);
      previous = level;
    }
  }
});
