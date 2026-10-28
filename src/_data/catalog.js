import {
  loadContent,
  callStatus,
  eventStatus,
  zonedDateTime,
} from '../../lib/content.js';
export default function () {
  const content = loadContent();
  const now = new Date();
  // Resolve local fields only in the runtime catalog; never rewrite editor files.
  content.call = content.call
    .map((i) => ({
      ...i,
      status: callStatus(i, now),
      opens: i.opens ? zonedDateTime(i.opens, i.timeZone) : undefined,
      deadline: zonedDateTime(i.deadline, i.timeZone),
    }))
    .sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
  content.event = content.event
    .map((i) => ({
      ...i,
      status: eventStatus(i, now),
      date: zonedDateTime(i.date, i.timeZone),
      end: zonedDateTime(i.end, i.timeZone),
    }))
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  content.publication.sort((a, b) => b.year - a.year || a.slug.localeCompare(b.slug));
  content.news.sort((a, b) => b.date.localeCompare(a.date));
  return content;
}
