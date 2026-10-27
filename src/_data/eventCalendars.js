import { loadContent, eventStatus } from '../../lib/content.js';
import { calendarMonths, eventIcs } from '../../lib/event-calendar.js';
import { siteUrl } from '../../lib/urls.js';

export default function () {
  const events = loadContent().event;
  const now = new Date();
  const base = siteUrl();
  const files = [];
  for (const lang of ['ka', 'en']) {
    for (const event of events) {
      files.push({
        path: `/${lang}/events/${event.slug}/event.ics`,
        body: eventIcs([event], lang, base, now),
      });
    }
    files.push({
      path: `/${lang}/events/upcoming.ics`,
      body: eventIcs(events.filter(item => eventStatus(item, now) === 'upcoming')
        .sort((a, b) => a.date.localeCompare(b.date)), lang, base, now),
    });
  }
  return { months: calendarMonths(events), files };
}
