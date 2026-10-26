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

// Scroll lock: a vertical wheel over the rail scrolls it sideways; at either end the page takes over again.
// The wheel moves a target and the rail eases toward it every frame (no stepping on raw deltas); once the wheel stops,
// the target settles on the nearest card. Snap is off while this runs, so the browser never jumps to a snap point mid-way.
export function wheelX(r: HTMLElement) {
  let target = 0, raf = 0, idle = 0;
  const max = () => r.scrollWidth - r.clientWidth;
  const stops = () => { const first = (r.firstElementChild as HTMLElement).offsetLeft; return [...r.children].map((c) => Math.min(max(), (c as HTMLElement).offsetLeft - first)); };
  const tick = () => {
    const d = target - r.scrollLeft;
    if (Math.abs(d) < .5) { r.scrollLeft = target; raf = 0; if (!idle) r.style.scrollSnapType = ''; return; }
    r.scrollLeft += d * .18;
    raf = requestAnimationFrame(tick);
  };
  r.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // trackpad sideways swipes stay native
    const from = raf || idle ? target : r.scrollLeft;
    if ((e.deltaY < 0 && from <= 0) || (e.deltaY > 0 && from >= max() - 1)) return;
    e.preventDefault();
    r.style.scrollSnapType = 'none';
    target = Math.max(0, Math.min(max(), from + (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY)));
    clearTimeout(idle);
    idle = window.setTimeout(() => {
      idle = 0;
      target = stops().reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a), 0);
      if (!raf) raf = requestAnimationFrame(tick);
    }, 140);
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: false });
}
