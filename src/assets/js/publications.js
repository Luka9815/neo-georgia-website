(() => {
  const form = document.querySelector('[data-publication-filters]');
  if (form) {
    const count = form.querySelector('[data-publication-count]');
    function filter() {
      const items = [...document.querySelectorAll('[data-publications] > li')];
      const { year, type } = form.elements;
      for (const item of items) item.hidden = Boolean(
        year.value && item.dataset.year !== year.value ||
        type.value && item.dataset.type !== type.value
      );
      count.textContent = `${count.dataset.label}: ${items.filter(item => !item.hidden).length}`;
    }
    form.addEventListener('change', filter);
    form.addEventListener('reset', () => setTimeout(filter, 0));
    form.hidden = false;
    document.addEventListener('DOMContentLoaded', filter, { once: true });
  }
})();
