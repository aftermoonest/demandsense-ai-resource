import math, random, re, json
ROOT = "/Users/aftermoonest/Files/Project Files/DemandSense/DS AI Resource"
LAB = ROOT + "/lab/stage"

def n(v):
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s

def rect(x, y, w, h): return f"M{n(x)} {n(y)}h{n(w)}v{n(h)}h{n(-w)}z"
def ln(x1, y1, x2, y2): return f"M{n(x1)} {n(y1)}L{n(x2)} {n(y2)}"
def poly(pts, close=True):
    return "M" + "L".join(f"{n(x)} {n(y)}" for x, y in pts) + ("z" if close else "")
def ell(cx, cy, rx, ry):
    return f"M{n(cx-rx)} {n(cy)}a{n(rx)} {n(ry)} 0 1 0 {n(2*rx)} 0a{n(rx)} {n(ry)} 0 1 0 {n(-2*rx)} 0z"

class F:
    def __init__(s, w, h):
        s.w, s.h, s.o, s.i = w, h, [], 0
        s.open = False
    def L(s, i, cls="", fine=False):
        s.end()
        c = ("L " + cls + (" fine" if fine else "")).strip()
        s.o.append(f'<g class="{c}" style="--i:{i}">'); s.open = True
    def end(s):
        if s.open: s.o.append("</g>"); s.open = False
    def p(s, d, cls="e"):
        if not d: return
        s.o.append(f'<path class="d {cls}" pathLength="1" d="{d}"/>')
    def fill(s, d, cls=""):
        if d: s.o.append(f'<path class="pf {cls}" d="{d}"/>')
    def raw(s, t): s.o.append(t)
    def svg(s, inner_extra=""):
        s.end()
        return (f'<svg viewBox="0 0 {s.w} {s.h}" aria-hidden="true" focusable="false"><g transform="translate(.5 .5)">'
                + "".join(s.o) + "</g></svg>")

def spot_group(f, cfg, pool_rx, pool_ry, lens_w, lit_inner, hatch=3, ring=True):
    """beam + pool + lit copies (blue lines clipped to the pool) + lamp transform at rest.
    lit_inner: svg string of blue duplicates of whatever the light reveals."""
    px, py = cfg["pivot"]; L = cfg["lens"]; x, y = cfg["rest"]
    dx, dy = x - px, y - py; d = math.hypot(dx, dy)
    th = math.degrees(math.atan2(-dx, dy))
    lx, ly = px + dx / d * L, py + dy / d * L
    n_ = lens_w / 2
    cfg["bn"], cfg["bf"] = n_, pool_rx
    ks = [-1, 1] + ([-.5, 0, .5] if hatch == 3 else [-.66, -.33, 0, .33, .66])
    inner = "".join(f'<path class="b{"" if abs(k) == 1 else " h"}" data-k="{k}" d="M{n(n_*k)} 0L{n(pool_rx*k)} {n(d-L)}"/>' for k in ks)
    beam = (f'<g class="spotg"><g id="beam" transform="translate({n(lx)} {n(ly)}) rotate({n(th)})">{inner}</g>'
            f'<clipPath id="pc"><ellipse id="pclip" rx="{pool_rx}" ry="{pool_ry}" transform="translate({n(x)} {n(y)})"/></clipPath>'
            f'<g clip-path="url(#pc)">{lit_inner}</g>'
            f'<g id="pool" transform="translate({n(x)} {n(y)})"><ellipse class="b" rx="{pool_rx}" ry="{pool_ry}"/>'
            f'<ellipse class="b h" rx="{n(pool_rx*.66)}" ry="{n(pool_ry*.66)}"/><ellipse class="b h" rx="{n(pool_rx*.33)}" ry="{n(pool_ry*.33)}"/>'
            f'<ellipse class="bf" rx="1.6" ry="{n(max(1.6*pool_ry/pool_rx,.6))}"/></g></g>')
    return beam, f'translate({n(px)} {n(py)}) rotate({n(th)})'


import time
V = str(int(time.time()))
SRC = open(ROOT + "/landing/index.html", encoding="utf-8").read()
SEC = re.search(r'<section class="sec" id="stage">.*?</section>', SRC, re.S).group(0)

def emit(num, f, cfg, label, css="", lamp_t=""):
    fig = (f'<figure class="spot stagefig" role="img" aria-label="{label}">' + f.svg() + '</figure>')
    sec = re.sub(r'<figure class="spot".*?</figure>', lambda m: fig, SEC, flags=re.S)
    html = ("<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
            f"<title>Stage lab {num}</title>\n<link rel=\"icon\" href=\"data:,\">\n"
            "<link rel=\"stylesheet\" href=\"../../landing/landing.css\">\n<link rel=\"stylesheet\" href=\"stage.css?v=" + V + "\">\n"
            f"<link rel=\"stylesheet\" href=\"{num}.css\">\n<script>document.documentElement.classList.add('js')</script>\n</head>\n<body>\n<main>\n"
            + sec + f"\n</main>\n<script src=\"stage.js?v=" + V + "\"></script>\n<script src=\"" + num + ".js\"></script>\n</body>\n</html>\n")
    open(f"{LAB}/{num}.html", "w", encoding="utf-8").write(html)
    open(f"{LAB}/{num}.css", "w", encoding="utf-8").write(css or f"/* {num}: nothing beyond stage.css */\n")
    j = json.dumps({k: cfg[k] for k in ("rest", "from", "box", "pivot", "lens", "span", "bn", "bf") if k in cfg}, separators=(",", ":"))
    open(f"{LAB}/{num}.js", "w", encoding="utf-8").write(f"Stage.mount(document.querySelector('.stagefig'), {j});\n")
    print(num, "svg bytes", len(fig))

def base():
    sec = SEC
    html = ("<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Stage lab base</title>\n<link rel=\"icon\" href=\"data:,\">\n"
            "<link rel=\"stylesheet\" href=\"../../landing/landing.css\">\n<script>document.documentElement.classList.add('js')</script>\n</head>\n<body>\n<main>\n"
            + sec + "\n</main>\n<script src=\"../../illustrations/hairline-kernel.js\"></script>\n<script src=\"../../illustrations/embed.js\"></script>\n"
            "<script type=\"module\" src=\"../../illustrations/followspot.js\"></script>\n</body>\n</html>\n")
    open(f"{LAB}/base.html", "w", encoding="utf-8").write(html)

def hatch(x, y, w, h, step=6):
    """45-degree lines clipped to a rect (section poche)."""
    d = ""
    t = -h
    while t < w:
        xa, ya = x + t, y + h        # bottom-left start
        xb, yb = x + t + h, y        # top-right end
        if xa < x: ya -= (x - xa); xa = x
        if xb > x + w: yb += (xb - (x + w)); xb = x + w
        if xa < xb: d += ln(xa, ya, xb, yb)
        t += step
    return d

def draw_lamp(f, s=1.0):
    """The followspot barrel in local coordinates: trunnion at 0,0, lens at +36*s. Inside <g id=lamp>."""
    k = lambda *a: [v * s for v in a]
    f.p(rect(*k(-14, -30, 28, 18)) + "".join(ln(*k(-14, -27 + 3*i, 14, -27 + 3*i)) for i in range(5)), "e p")
    f.p(poly([k(-12, -12)[0:2], k(12, -12)[0:2], k(10, 32)[0:2], k(-10, 32)[0:2]]) + ln(*k(-11, 18, 11, 18)) + ln(*k(-10.6, 22, 10.6, 22)), "e p")
    f.p(rect(*k(-12, 32, 24, 4)) + ln(*k(12, 0, 26, 8)) + rect(*k(26, 6, 5, 4)) + ln(*k(-12, -6, -19, 24)) + ln(*k(0, -30, 0, -36)), "e p")
    f.p(ell(0, 36*s, 10*s, 2.5*s), "b")

def lamp_open(f, t):
    f.raw(f'<g id="lamp" transform="{t}">')

def hatch_poly(f, pts, uid, step=7, cls="m"):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
    f.raw(f'<clipPath id="{uid}"><path d="{poly(pts)}"/></clipPath><g clip-path="url(#{uid})">')
    f.p(hatch(x0, y0, x1 - x0, y1 - y0, step), cls)
    f.raw("</g>")
