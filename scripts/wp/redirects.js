import { plainText, cleanUrl } from './convert.js';
import { oldSite } from './client.js';

// Section proposals follow SITE-PLAN "Where current content goes". More
// specific detail routes still require an editor's decision, not a guessed URL.
const sections = [
  {
    pattern: /სიახლ|news/iu,
    target: '/ka/news/',
    reason: 'News, split into News and Events after type review',
  },
  {
    pattern:
      /ეროვნული ოფის|ოფისის საქმიანობა|გუნდ|ეროვნულ.*ოფის|national office|what does neo do|neo georg|team|about|დღგ|გადასახად|VAT|მხარდაჭერის წერილ|support letters?|ექსპერტ|HEREs?\b|საკონტაქტ|contact/iu,
    target: '/ka/about/',
    reason: 'About: office, team, services, HEREs or contact',
  },
  {
    pattern:
      /პროგრამ|programme|opportunit|ერაზმუს მუნდუს|erasmus mundus|ჟან მონე|jean monnet|credit mobility|კრედიტმობილ|capacity building/iu,
    target: '/ka/opportunities/',
    reason: 'Opportunities: review the relevant structured Action page',
  },
  {
    pattern: /დედლაინ|ვადები|deadline|calls?/iu,
    target: '/ka/calls/',
    reason: 'Calls and deadlines',
  },
  {
    pattern:
      /პუბლიკაცი|სტატისტიკ|შეკითხვ|ჰორიზონტალურ|განათლების სისტემა|publication|statistics|FAQ|priorit|education system|resources?|recourses/iu,
    target: '/ka/resources/',
    reason:
      'Resources: publications, statistics, FAQ, priorities or education system',
  },
  {
    pattern: /^(?:მთავარი|მთავარი გვერდი|home|homepage)$/iu,
    target: '/ka/',
    reason: 'Home in the approved sitemap',
  },
];

export function draftRedirects(run, inventory, pages) {
  return {
    status:
      'DRAFT: manual review required; not connected to src/_data/redirects.json',
    source: run.source,
    runDate: run.runDate,
    window: run.window,
    news: inventory.items.map((row) => ({
      wpId: row.id,
      from: row.oldUrl,
      to:
        row.slug && row.language?.slot === 'ka'
          ? `/ka/news/${row.slug}/`
          : null,
      suggested: true,
      reason:
        row.slug && row.language?.slot === 'ka'
          ? row.typeCandidate.type === 'event'
            ? 'News draft exists, but confirm the Event candidate and target before promotion'
            : 'Proposed News slug; approve content and slug before promotion'
          : 'No Georgian News draft; resolve language or conversion failure first',
    })),
    pages: {
      complete: pages.complete,
      error: pages.error || null,
      scope: 'Published top-level WordPress pages only (parent=0), all dates',
      items: pages.items.map((page) => {
        const title = plainText(page.title?.rendered);
        const rule = sections.find((entry) =>
          entry.pattern.test(title.replaceAll('_', ' '))
        );
        const isHome = cleanUrl(page.link) === oldSite + '/';
        return {
          wpId: page.id,
          title,
          from: cleanUrl(page.link),
          suggestedTargetSection: isHome ? '/ka/' : rule?.target || null,
          reason: isHome
            ? 'Old site root maps to the Georgian home in the approved sitemap'
            : rule?.reason || 'No SITE-PLAN section matched; Luka must choose',
          suggested: true,
        };
      }),
    },
  };
}
