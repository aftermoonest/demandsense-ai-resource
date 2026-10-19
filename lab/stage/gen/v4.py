from common import *
import random, math
rnd = random.Random(21)
W, H = 612, 720
f = F(W, H)
FY0, FY1 = 424, 524           # stage floor back / front edge
# ---- back drape ----
f.L(0)
f.p(rect(0, 40, W, FY0 - 40), "e p")
f.p("".join(f"M{x} 44V{FY0-6}" for x in range(0, W, 24)), "f")
f.p("".join(f"M{x} {FY0-4}q12 12 24 0" for x in range(0, W, 24)), "e")
f.L(1)
# floor
f.p(poly([(95, FY0), (517, FY0), (612, FY1), (0, FY1)]), "e p")
bf = "".join(ln(95 + 38*k, FY0, 306 + (95 + 38*k - 306)*1.45, FY1) for k in range(1, 11))
seam = "".join(ln(95 - 95*t, FY0 + 100*t, 517 + 95*t, FY0 + 100*t) for t in (.3, .58, .8))
f.p(bf, "f"); f.p(seam, "f")
PRX, PRY, REST = 118, 22, (306, 484)
f.raw(f'<g class="spotg"><clipPath id="pc"><ellipse id="pclip" rx="{PRX}" ry="{PRY}" transform="translate({REST[0]} {REST[1]})"/></clipPath>'
      f'<g clip-path="url(#pc)"><path class="b h" d="{bf}"/><path class="b h" d="{seam}"/></g>'
      f'<g id="pool" transform="translate({REST[0]} {REST[1]})"><ellipse class="b" rx="{PRX}" ry="{PRY}"/>'
      f'<ellipse class="b h" rx="{n(PRX*.66)}" ry="{n(PRY*.66)}"/><ellipse class="b h" rx="{n(PRX*.33)}" ry="{n(PRY*.33)}"/></g></g>')
# side legs
f.L(1)
for x0, x1 in ((0, 70), (542, 612)):
    f.p(rect(x0, 40, x1 - x0, FY1 - 40 - 4), "e p")
    f.p("".join(f"M{x} 44V{FY1-8}" for x in range(x0 + 7, x1, 9)), "f")
# ---- truss with hangers, speakers, pars ----
f.L(2)
f.p(rect(-4, 0, W + 8, 36), "e p")
f.p(ln(-4, 5, W + 4, 5) + ln(-4, 31, W + 4, 31), "e")
f.p("M-4 31" + "".join(f"L{-4 + 22*k} {5 if k % 2 else 31}" for k in range(1, 29)), "m")
f.p("".join(rect(-4 + 44*k - 2, 29, 4, 4) for k in range(0, 15)), "e p")
for x in (28, 560):
    f.p(ln(x + 8, 36, x + 8, 52) + ln(x + 32, 36, x + 32, 52), "m")
    for k in range(6):
        y = 52 + 22*k
        f.p(poly([(x, y), (x + 40, y), (x + 40 - 2*k, y + 20), (x + 2*k, y + 20)]) + ell(x + 20, y + 10, 6 - .5*k, 6 - .5*k) + ln(x, y + 4, x + 40, y + 4), "e p")
for x, a in ((120, 9), (190, -6), (432, 7), (502, -10)):
    f.raw(f'<g transform="rotate({a} {x} 44)">')
    f.p(rect(x - 8, 36, 16, 8) + ln(x, 44, x, 50), "e p")
    f.p(rect(x - 15, 50, 30, 40) + "".join(ln(x - 15, 56 + 5*k, x + 15, 56 + 5*k) for k in range(6)), "e p")
    f.p(rect(x - 13, 90, 26, 6) + ell(x, 96, 13, 3.4) + ln(x - 20, 100, x - 13, 94) + ln(x + 20, 100, x + 13, 94), "e p")
    f.raw("</g>")
# ---- props ----
f.L(3)
for x in (96, 262, 350, 516):                       # wedges: slanted top face, grille front
    f.p(poly([(x - 50, FY1 - 34), (x + 50, FY1 - 34), (x + 42, FY1 - 44), (x - 42, FY1 - 44)]) + rect(x - 50, FY1 - 34, 100, 26), "e p")
    f.p(rect(x - 44, FY1 - 29, 88, 16) + "".join(ln(x - 44 + 8*k, FY1 - 29, x - 44 + 8*k, FY1 - 13) for k in range(1, 11)) + ln(x - 44, FY1 - 21, x + 44, FY1 - 21), "m")
f.p(poly([(40, 372), (178, 372), (166, 504), (52, 504)]) + rect(34, 362, 150, 12) + rect(52, 504, 114, 8), "e p")   # lectern
f.p(rect(72, 396, 82, 40) + ln(72, 416, 154, 416) + ln(113, 396, 113, 436), "m")
f.p(poly([(52, 354), (172, 354), (184, 362), (34, 362)]), "e p")
f.p("M60 354v-18h8v18M150 354l22 -26", "m")                     # lectern: lamp and gooseneck
f.p(ell(448, 392, 36, 7) + ln(412, 392, 406, 520) + ln(484, 392, 490, 520) + ln(448, 399, 448, 520) + ell(448, 460, 40, 7) + ell(448, 520, 44, 6), "e p")  # stool
MX = 306
mic = ln(MX, 340, MX, 504) + ln(MX, 504, MX - 40, 520) + ln(MX, 504, MX + 40, 520) + ln(MX, 504, MX, 516) + ln(MX, 340, MX + 58, 308) + rect(MX + 54, 288, 14, 30) + ln(MX + 54, 298, MX + 68, 298) + ln(MX + 54, 306, MX + 68, 306) + rect(MX - 7, 400, 14, 18)
f.p(mic, "e")
f.p(f"M{MX-40} 518Q{MX-120} 530 {MX-200} 512M{MX+40} 518Q{MX+120} 530 {MX+210} 514", "m")
# ---- stage lip, fascia, steps, pit rail ----
f.L(4)
f.p(rect(0, FY1, W, 56), "e p")
f.p("".join(f"M{x} {FY1+6}V{FY1+50}" for x in range(11, W, 22)), "f")
f.p(ln(0, FY1 + 6, W, FY1 + 6) + ln(0, FY1 + 50, W, FY1 + 50), "e")
f.p("".join(rect(x, FY1 - 4, 10, 4) for x in range(30, W, 52)), "m")
f.p(rect(0, FY1 + 56, W, 8) + "".join(rect(x, FY1 + 64, 4, 18) for x in range(10, W, 44)), "e p")
# ---- audience, seen from behind ----
def row(yt, w, gap, f_i, occ):
    f.L(f_i)
    pitch = w + 4
    xs = []
    x = 306 + gap/2
    while x < W + w: xs.append(x + w/2); x += pitch
    xs = [W - c for c in xs[::-1]] + xs
    hb = w*1.32
    f.p("".join(rect(c - w/2, yt, w, hb) + rect(c - w*.32, yt - w*.14, w*.64, w*.14) for c in xs), "e p")
    f.p("".join(rect(c - w/2 + w*.1, yt + w*.34, w*.8, w*.7) for c in xs), "f")
    pf, ph, pd = "", "", ""
    for c in xs:
        if rnd.random() < occ:
            hx = c + rnd.uniform(-.04, .04)*w; r = w*.2; hy = yt - w*.02; sh = yt + w*.3
            body = (f"M{n(c-w*.44)} {n(yt+hb*.85)}V{n(sh+w*.1)}Q{n(c-w*.44)} {n(sh)} {n(hx-r*1.1)} {n(sh)}"
                    f"L{n(hx+r*1.1)} {n(sh)}Q{n(c+w*.44)} {n(sh)} {n(c+w*.44)} {n(sh+w*.1)}V{n(yt+hb*.85)}z")
            pf += body
            ph += ell(hx, hy, r, r*1.15) + f"M{n(hx-r*.45)} {n(hy+r*1.05)}V{n(sh)}M{n(hx+r*.45)} {n(hy+r*1.05)}V{n(sh)}"
            pd += f"M{n(hx-r*.95)} {n(hy-r*.2)}Q{n(hx)} {n(hy-r*1.5)} {n(hx+r*.95)} {n(hy-r*.2)}"
    f.fill(pf); f.p(pf, "e"); f.p(ph, "e p"); f.p(pd, "m")
    f.p("".join(rect(c + w/2 - 1, yt + hb*.48, 6, 5) for c in xs[:len(xs)//2 - 1] + xs[len(xs)//2:-1]), "e p")
row(596, 50, 46, 5, .6)
row(640, 76, 70, 7, .6)
row(684, 112, 96, 9, .7)
# ---- lamp ----
cfg = dict(rest=list(REST), **{"from": [150, 470]}, box=[150, 456, 462, 490], pivot=[306, 86], lens=113, bn=17, bf=PRX)
def pose(x, y):
    px, py = cfg["pivot"]; dx, dy = x - px, y - py; d = math.hypot(dx, dy); ux, uy = dx / d, dy / d
    lx, ly = px + ux * cfg["lens"], py + uy * cfg["lens"]
    rays = "".join(f'<path class="b{"" if abs(k) == 1 else " h"}" data-k="{k}" d="M{n(lx + uy*cfg["bn"]*k)} {n(ly - ux*cfg["bn"]*k)}L{n(x + PRX*k)} {n(y)}"/>' for k in (-1, -.5, 0, .5, 1))
    return rays, f'translate({px} {py}) rotate({n(math.degrees(math.atan2(-dx, dy)))})'
rays, lamp_t = pose(*REST)
f.L(4)
f.p(ln(306, 36, 306, 78) + rect(294, 76, 24, 10), "e p")
# the whole fixture swings from the clamp: yoke and barrel turn together, so the yoke never leaves the trunnions
lamp_open(f, lamp_t)
f.p("M-36 52V0H36V52", "e")
f.p(ell(-36, 52, 4.4, 4.4) + ell(36, 52, 4.4, 4.4), "e p")
f.raw('<g transform="translate(0 52)">'); draw_lamp(f, 1.7); f.raw("</g></g>")
f.end(); f.raw(f'<g class="spotg" id="beam">{rays}</g>')
label = "A close view of a stage edge from the audience: a followspot under a truss, monitors and a mic stand on the boards, and the first rows of seat backs with the heads of people in front. The beam follows the pointer and lights one place on the floor: yours."
emit("04", f, cfg, label)
h = open(f"{LAB}/04.html").read()
h = re.sub(r'<script src="stage.js[^"]*"></script>', '<script src="../../illustrations/stage-edge.js"></script>', h)
h = h.replace('href="stage.css', 'href="../../illustrations/stage-edge.css').replace('class="spot stagefig"', 'class="spot edgefig"')
open(f"{LAB}/04.html", "w").write(h)
js = open(f"{LAB}/04.js").read().replace("Stage.mount", "StageEdge.mount").replace(".stagefig", ".edgefig"); open(f"{LAB}/04.js", "w").write(js)
open(ROOT + "/illustrations/stage-edge.svg", "w").write(f.svg() + "\n")
