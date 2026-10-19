// The box builds with the rows: hidden from now (like base.js .rv), shown with the first row base.js reveals.
const box = document.querySelector('.cardbox');
box.classList.add('pre');
new MutationObserver((_, mo) => { if (box.querySelector('.on')) { box.classList.add('on'); mo.disconnect(); } })
  .observe(box, { subtree: true, attributeFilter: ['class'] });
