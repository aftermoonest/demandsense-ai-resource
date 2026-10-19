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
  }
};
