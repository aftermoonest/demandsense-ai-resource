// Mounts hairline figures into the page. The bench allows one figure per page; this allows one per host:
// every [data-figure="<name>"] gets the figure that calls hairline() with that name. No auto tour.
// The host's static SVG (the rest pose) is the fallback and is replaced on mount.
window.hairline = (figure) => {
  HL.inject(document);
  const [lo, mid] = figure.range;
  for (const host of document.querySelectorAll(`[data-figure="${figure.name}"]`)) {
    const stage = host.querySelector("[data-stage]") || host;
    const out = host.querySelector("[data-read]");
    stage.setAttribute("data-hairline", figure.name);
    stage.replaceChildren();
    const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
    const read = { set textContent(v) { if (out) out.textContent = v ?? ""; }, get textContent() { return out ? out.textContent : ""; } };
    figure.mount({ stage, svg, read }, Number(host.dataset.value) || mid || lo);
    if (out && !out.textContent) out.textContent = "rest";
    // One lap of the figure's tour the first time it is seen, so a reader learns it answers the pointer.
    // Skipped under reduced motion; the kernel hands over to a real pointer by itself.
    if (!figure.tour || matchMedia("(prefers-reduced-motion: reduce)").matches) continue;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setTimeout(() => {
        const lap = HL.tour(stage, figure.tour, (i) => { if (i === figure.tour.length - 1) lap.stop(); });
      }, 900);
    }, { threshold: 0.6 });
    io.observe(stage);
  }
};
