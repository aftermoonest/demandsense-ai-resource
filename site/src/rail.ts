// Card rails: the arrows step one card; disabled at the ends. `get` returns the rail the arrows drive (it can change, e.g. per tab).
// Own tween instead of scrollBy smooth: mandatory snap made the native smooth scroll jump.
// Snap is off while it runs, so the slide lands exactly one card over; clicks during a slide queue onto its target.
export function rail(get: () => HTMLElement, prev: HTMLButtonElement, next: HTMLButtonElement) {
  const step = (r: HTMLElement) => (r.firstElementChild as HTMLElement).offsetWidth + parseFloat(getComputedStyle(r).columnGap || '0');
  const sync = () => {
    const r = get();
    prev.disabled = r.scrollLeft < 4;
    next.disabled = r.scrollLeft + r.clientWidth >= r.scrollWidth - 4;
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0, target = 0;
  const slide = (dir: number) => {
    const r = get();
    const max = r.scrollWidth - r.clientWidth;
    target = Math.max(0, Math.min(max, (raf ? target : r.scrollLeft) + dir * step(r)));
    if (reduce.matches) { r.scrollLeft = target; return; }
    cancelAnimationFrame(raf);
    const from = r.scrollLeft, dist = target - from, t0 = performance.now(), dur = 500;
    r.style.scrollSnapType = 'none';
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      r.scrollLeft = from + dist * (1 - Math.pow(1 - p, 3)); // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(tick);
      else { raf = 0; r.style.scrollSnapType = ''; sync(); }
    };
    raf = requestAnimationFrame(tick);
  };
  prev.onclick = () => slide(-1);
  next.onclick = () => slide(1);
  addEventListener('resize', sync);
  sync();
  return sync;
}
