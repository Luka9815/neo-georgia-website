import { createSearch } from './search-runtime.js';

const root = document.querySelector('[data-search]');
const form = root.querySelector('[data-search-form]');
const results = root.querySelector('[data-search-results]');
const status = root.querySelector('[data-search-status]');
const list = root.querySelector('[data-search-list]');
const fallback = root.querySelector('[data-search-fallback]');
const search = createSearch(root.dataset.index, root.dataset.language);
let sequence = 0;

async function submit(event) {
  event?.preventDefault();
  const current = ++sequence;
  const query = form.elements.q.value.trim();
  list.replaceChildren();
  results.hidden = false;
  if (!query) { status.textContent = root.dataset.empty; return; }
  status.textContent = root.dataset.loading;
  try {
    const items = await search.search(query);
    if (current !== sequence) return;
    for (const item of items) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.url;
      link.textContent = item.meta.title;
      const excerpt = document.createElement('p');
      excerpt.textContent = item.plain_excerpt;
      li.append(link, excerpt);
      list.append(li);
    }
    status.textContent = items.length ? `${root.dataset.count}: ${items.length}` : root.dataset.none;
  } catch {
    if (current !== sequence) return;
    status.textContent = root.dataset.error;
    fallback.hidden = false;
  }
}

form.hidden = false;
fallback.hidden = true;
form.addEventListener('submit', submit);
const initialQuery = new URLSearchParams(location.search).get('q')?.slice(0, form.elements.q.maxLength);
if (initialQuery) {
  form.elements.q.value = initialQuery;
  void submit();
}
