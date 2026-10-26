const root = document.querySelector('[data-search]');
if (root) {
  const form = root.querySelector('[data-search-form]');
  const results = root.querySelector('[data-search-results]');
  const status = root.querySelector('[data-search-status]');
  const list = root.querySelector('[data-search-list]');
  const fallback = root.querySelector('[data-search-fallback]');
  let sequence = 0;
  let engine;
  form.hidden = false;
  fallback.hidden = true;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const current = ++sequence;
    const query = form.elements.q.value.trim();
    list.replaceChildren();
    results.hidden = false;
    if (!query) { status.textContent = root.dataset.empty; return; }
    status.textContent = root.dataset.loading;
    try {
      engine ??= await import(root.dataset.index);
      const found = await engine.search(query);
      const items = await Promise.all(found.results.map(result => result.data()));
      if (current !== sequence) return;
      for (const item of items) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.meta.title;
        const excerpt = document.createElement('p');
        const inert = document.createElement('template');
        inert.innerHTML = item.excerpt;
        excerpt.textContent = inert.content.textContent;
        li.append(link, excerpt);
        list.append(li);
      }
      status.textContent = items.length ? `${root.dataset.count}: ${items.length}` : root.dataset.none;
    } catch {
      if (current !== sequence) return;
      status.textContent = root.dataset.error;
      fallback.hidden = false;
    }
  });
}
