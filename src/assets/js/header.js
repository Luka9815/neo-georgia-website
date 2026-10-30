const header = document.querySelector('.site-header');
if (header) {
  let queued = false;
  const update = () => {
    if (window.scrollY > 96) header.setAttribute('data-compact', '');
    else if (window.scrollY < 24) header.removeAttribute('data-compact');
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}
