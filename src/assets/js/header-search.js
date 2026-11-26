(() => {
  const header = document.querySelector('.site-header');
  const link = header.querySelector('a.search-link');
  const form = header.querySelector('#header-search');
  const input = form.elements.q;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = link.className;
  toggle.setAttribute('aria-label', link.getAttribute('aria-label'));
  toggle.setAttribute('aria-controls', form.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.append(...link.childNodes);
  link.replaceWith(toggle);

  const unavailable = form.querySelector('[data-search-unavailable]');
  let results;
  let connecting;

  function connect() {
    if (results) {
      results.open();
    } else if (!connecting) {
      connecting = import('./header-search-results.js').then(({ attachResults }) => {
        results = attachResults(form);
        if (!form.hidden) results.open();
      }).catch(() => {
        if (!form.hidden) unavailable.hidden = false;
      }).finally(() => { connecting = undefined; });
    }
  }

  function open() {
    const pageForm = document.querySelector('[data-search-form]:not([hidden])');
    if (pageForm) {
      pageForm.elements.q.focus();
      return;
    }
    header.querySelector('.mobile-menu').open = false;
    header.setAttribute('data-search-open', '');
    toggle.setAttribute('aria-expanded', 'true');
    form.hidden = false;
    input.focus({ preventScroll: true });
    connect();
  }

  function close(returnFocus = true) {
    results?.close();
    unavailable.hidden = true;
    form.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    header.removeAttribute('data-search-open');
    if (returnFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => form.hidden ? open() : close());
  form.querySelector('.header-search-close').addEventListener('click', () => close());
  document.addEventListener('click', event => {
    if (!form.hidden && !form.contains(event.target) && !toggle.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.isComposing || event.defaultPrevented) return;
    if (event.key === 'Escape' && !form.hidden) {
      event.preventDefault();
      close();
    } else if (event.key === '/' && !event.altKey && !event.ctrlKey && !event.metaKey
      && !event.target.isContentEditable && !event.target.closest('input, select, textarea, [role="textbox"]')) {
      event.preventDefault();
      if (form.hidden) open();
      else input.focus({ preventScroll: true });
    } else if (event.key === 'Tab' && !form.hidden) {
      setTimeout(() => {
        if (!form.hidden && !form.contains(document.activeElement) && document.activeElement !== toggle) close(false);
      });
    }
  });
})();
