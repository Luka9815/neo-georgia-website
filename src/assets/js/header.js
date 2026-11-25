const header = document.querySelector('.site-header');
if (header) {
  const backToTop = header.querySelector('.back-to-top');
  let queued = false;
  const update = () => {
    if (window.scrollY > 96) header.setAttribute('data-compact', '');
    else if (window.scrollY < 24) header.removeAttribute('data-compact');
    if (backToTop) backToTop.hidden = window.scrollY < 2 * window.innerHeight;
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
  if ('ResizeObserver' in window) {
    new ResizeObserver(([entry]) => {
      const key = header.hasAttribute('data-compact') ? '--header-h-compact' : '--header-h';
      const height = entry.borderBoxSize?.[0]?.blockSize ?? header.getBoundingClientRect().height;
      document.documentElement.style.setProperty(key, `${height}px`);
    }).observe(header);
  }
}
