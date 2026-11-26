import { createSearch } from './search-runtime.js';

export function attachResults(form) {
  const input = form.elements.q;
  const popup = form.querySelector('.header-search-popup');
  const list = form.querySelector('[role="listbox"]');
  const message = form.querySelector('.header-search-message');
  const announcement = form.querySelector('[data-search-announcement]');
  let options = [];
  let selected = -1;
  let timeout;
  let sequence = 0;
  const language = document.documentElement.lang;
  const strings = form.dataset;
  const search = createSearch(strings.index, language);
  const types = JSON.parse(strings.types);
  const format = (template, query) => template.replace('{query}', () => query);

  function cancel() {
    clearTimeout(timeout);
    return ++sequence;
  }

  function reset() {
    selected = -1;
    options = [];
    list.replaceChildren();
    input.removeAttribute('aria-activedescendant');
    input.setAttribute('aria-expanded', 'false');
    popup.hidden = true;
    announcement.textContent = '';
  }

  function makeOption(url) {
    const option = document.createElement('a');
    option.href = url;
    option.tabIndex = -1;
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    return option;
  }

  function highlight(title, pattern) {
    return pattern ? title.split(pattern).map((part, i) => {
      if (i % 2 === 0) return part;
      const match = document.createElement('strong');
      match.textContent = part;
      return match;
    }) : [title];
  }

  function makeResult(item, pattern) {
    const option = makeOption(item.url);
    option.className = 'header-search-result';
    const title = document.createElement('span');
    title.className = 'header-search-title';
    title.append(...highlight(item.meta.title, pattern));
    const type = item.meta.type;
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = Object.hasOwn(types, type) ? types[type] : types.page;
    if (type === 'action' && item.meta.sector) chip.dataset.sector = item.meta.sector;
    const excerpt = document.createElement('span');
    excerpt.className = 'header-search-excerpt';
    excerpt.textContent = item.plain_excerpt;
    const heading = document.createElement('span');
    heading.className = 'header-search-heading';
    heading.append(title, chip);
    option.append(heading, excerpt);
    return option;
  }

  function show(query, items, feedback = '') {
    reset();
    const tokens = query.match(/[\p{L}\p{M}\p{N}]+/gu);
    const pattern = tokens && new RegExp(`(${tokens.sort((a, b) => b.length - a.length).join('|')})`, 'giu');
    options = items.map(item => makeResult(item, pattern));
    const allUrl = new URL(form.action);
    if (query) allUrl.searchParams.set('q', query);
    const all = makeOption(allUrl);
    all.className = 'header-search-all';
    all.textContent = query ? format(strings.all, query) : strings.full;
    options.push(all);
    options.forEach((option, i) => { option.id = `header-search-option-${i}`; });
    list.replaceChildren(...options);
    message.textContent = feedback;
    message.hidden = !feedback;
    popup.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    announcement.textContent = feedback || `${strings.count}: ${items.length}`;
  }

  function schedule() {
    const current = cancel();
    const query = input.value.trim();
    reset();
    if (query.length < 2) return;
    show(query, [], strings.loading);
    timeout = setTimeout(async () => {
      try {
        const items = await search.search(query, 6);
        if (current === sequence) show(query, items, items.length ? '' : format(strings.none, query));
      } catch {
        if (current === sequence) show(query, [], strings.error);
      }
    }, 200);
  }

  function move(step) {
    options[selected]?.setAttribute('aria-selected', 'false');
    selected = selected < 0 ? (step > 0 ? 0 : options.length - 1)
      : (selected + step + options.length) % options.length;
    const next = options[selected];
    next.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', next.id);
    const row = next.getBoundingClientRect();
    const viewport = popup.getBoundingClientRect();
    if (row.top < viewport.top) popup.scrollTop += row.top - viewport.top;
    else if (row.bottom > viewport.bottom) popup.scrollTop += row.bottom - viewport.bottom;
  }

  input.addEventListener('input', event => {
    if (!event.isComposing) schedule();
  });
  input.addEventListener('compositionstart', () => { cancel(); reset(); });
  input.addEventListener('compositionend', schedule);
  input.addEventListener('keydown', event => {
    if (event.isComposing || !options.length || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowDown' ? 1 : -1);
  });
  form.addEventListener('submit', event => {
    if (selected >= 0) {
      event.preventDefault();
      location.assign(options[selected].href);
    } else {
      input.value = input.value.trim();
    }
  });

  return {
    open() {
      schedule();
      const current = sequence;
      void search.load().catch(() => {
        if (current === sequence && input.value.trim().length < 2) show(input.value.trim(), [], strings.error);
      });
    },
    close() {
      cancel();
      reset();
    },
  };
}
