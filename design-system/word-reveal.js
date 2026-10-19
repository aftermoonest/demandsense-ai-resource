// Splits text inside [data-word-reveal] into words; words light up as the block scrolls through the viewport.
(() => {
  const els = document.querySelectorAll('[data-word-reveal]');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  els.forEach(el => {
    el.classList.add('wr');
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach(n => {
      const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) return f.append(t); const s = document.createElement('span'); s.className = 'w'; s.textContent = t; f.append(s); });
      n.replaceWith(f);
    });
    const words = el.querySelectorAll('.w');
    const update = () => {
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .8 - r.top) / (r.height + vh * .3)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    };
    if (still) return words.forEach(w => w.classList.add('on'));
    let raf; const tick = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); update();
  });
})();
