import { loadContent, callStatus, eventStatus } from '../../lib/content.js';
export default function () {
  const content = loadContent();
  const now = new Date();
  content.call = content.call.map(i => ({ ...i, status: callStatus(i, now) })).sort((a,b) => a.deadline.localeCompare(b.deadline));
  content.event = content.event.map(i => ({ ...i, status: eventStatus(i, now) })).sort((a,b) => a.date.localeCompare(b.date));
  content.news.sort((a,b) => b.date.localeCompare(a.date));
  return content;
}
