from common import *
import random
rnd = random.Random(33)
W, H = 612, 460
f = F(W, H)
DECK = 330
# ---- hall shell, single line, no poche ----
f.L(0)
f.p(ln(8, 24, 604, 24) + ln(8, 30, 604, 30) + ln(8, 24, 8, 440) + ln(14, 30, 14, 440) + ln(604, 24, 604, 440) + ln(598, 30, 598, 440) + ln(8, 440, 604, 440) + ln(14, 434, 598, 434), "e")
f.p("".join(ln(x, 24, x, 30) for x in range(14, 598, 7)), "m")            # coffer ribs
f.p("".join(rect(x, 34, 26, 8) for x in range(228, 590, 38)), "f")
# proscenium
f.L(1)
f.p(rect(196, 30, 28, 66) + ln(196, 40, 224, 40) + ln(196, 90, 224, 90), "e p")
f.p(hatch(196, 44, 28, 44, 7) if False else "", "m")
# fly loft: ropes, end-on trusses, flats, banner
f.L(2)
for x in (40, 72, 104, 132, 160):
    f.p(ell(x, 38, 3.5, 3.5) + ln(x, 41.5, x, {40: 76, 72: 98, 104: 104, 132: 140, 160: 80}[x]), "e")
f.p(rect(38, 76, 4, 60) + "".join(ln(38, 82 + 7*k, 42, 82 + 7*k) for k in range(8)), "e p")
f.p(rect(158, 80, 4, 90) + "".join(ln(158, 86 + 7*k, 162, 86 + 7*k) for k in range(12)), "e p")
def tr(cx, cy, w=24):
    x, y = cx - w/2, cy
    f.p(rect(x, y, w, w) + rect(x + 3, y + 3, w - 6, w - 6) + ln(x, y, x + w, y + w) + ln(x + w, y, x, y + w), "e p")
    f.p("".join(ell(px, py, 2.2, 2.2) for px in (x, x + w) for py in (y, y + w)), "e p")
f.L(3)
tr(72, 98); tr(132, 140)
for cx, a in ((126, -26), (140, 24)):
    f.raw(f'<g transform="rotate({a} {cx} 166)">')
    f.p(rect(cx - 4, 166, 8, 4) + rect(cx - 7, 170, 14, 18) + "".join(ln(cx - 7, 174 + 4*k, cx + 7, 174 + 4*k) for k in range(3)), "e p")
    f.p(ell(cx, 188, 7, 2), "e"); f.raw("</g>")
# legs (side masking) and back wall folds
f.p("".join(ln(15 + 4*k, 44, 15 + 4*k, DECK) for k in range(6)), "m")
f.p(ln(15, DECK - 6, 39, DECK - 6), "e")
# ---- stage deck ----
f.L(4)
f.p(rect(14, DECK, 182, 9) + "".join(ln(14 + 9*k, DECK, 14 + 9*k, DECK + 9) for k in range(1, 20)), "e p")
f.p("".join(rect(20 + 30*k, DECK + 9, 5, 95) for k in range(6)), "e p")
f.p(ln(14, DECK + 56, 196, DECK + 56) + ln(14, DECK + 104, 196, DECK + 104), "m")
f.p("".join(ln(25 + 30*k, DECK + 12, 20 + 30*(k+1), DECK + 56) for k in range(0, 5, 2)), "f")
f.p(rect(196, DECK, 3, 104), "e p")
f.L(5)
f.p(poly([(30, 282), (50, 286), (47, DECK), (32, DECK)]) + rect(28, DECK - 5, 24, 5) + "M40 282V268Q40 263 45 263", "e p")      # lectern
f.p(ell(150, DECK - 22, 8, 2.6) + ln(143, DECK - 22, 141, DECK) + ln(157, DECK - 22, 159, DECK), "e p")
f.p(poly([(170, DECK), (192, DECK), (170, DECK - 12)]) + ln(175, DECK - 8, 184, DECK), "e p")
f.p(rect(176, 288, 20, 42) + ell(186, 301, 6, 6) + ell(186, 319, 6, 6) + ell(186, 301, 2, 2) + ell(186, 319, 2, 2), "e p")
MX = 96
mic = ln(MX, 268, MX, DECK - 4) + ln(MX, DECK - 4, MX - 12, DECK) + ln(MX, DECK - 4, MX + 12, DECK) + ln(MX, 268, MX + 17, 260) + rect(MX + 15, 254, 5, 9)
f.p(mic, "e")
f.p(f"M{MX-12} {DECK-1}Q{MX-34} {DECK-6} {MX-58} {DECK-1}", "m")
# ---- stalls rake with seated people ----
f.L(6)
X0, DX, DY, Y0, N = 224, 21, 7.5, 376, 17
prof = [(X0, Y0)]
for i in range(N):
    xi, yi = X0 + i*DX, Y0 - i*DY
    prof += [(xi + DX, yi), (xi + DX, yi - DY)]
prof = prof[:-1]
f.p("M" + "L".join(f"{n(x)} {n(y)}" for x, y in prof), "e")
f.p(ln(X0 - 8, Y0, X0, Y0) + ln(X0 - 8, Y0, X0 - 8, 434), "e")
f.p("".join(ln(x, Y0 - ((x - X0)//DX)*DY, x, 434) for x in range(int(X0) + 5, 598, 7)), "f")
f.p(rect(196, 376, 28, 6) + ln(196, 382, 196, 434), "e p")                                    # pit lip
f.p(rect(220, 356, 3, 20) + ln(220, 360, 232, 360), "e p")                                     # rail
k = .62
def person(sx, yi):
    S = lambda v: v * k
    hx, hy = sx - S(4), yi - S(62)
    f.fill(poly([(hx - S(9), yi - S(24)), (hx - S(9), yi - S(44)), (hx + S(4), yi - S(44)), (hx + S(4), yi - S(22))]) + rect(sx - S(22), yi - S(23), S(20), S(5)))
    f.p(ell(hx, hy, S(6), S(6.6)), "e p")
    f.p(f"M{n(hx-S(6))} {n(hy)}Q{n(hx-S(1))} {n(hy-S(9))} {n(hx+S(6))} {n(hy-S(1))}", "m")
    f.p(f"M{n(hx-S(9))} {n(yi-S(24))}V{n(yi-S(44))}Q{n(hx-S(9))} {n(yi-S(49))} {n(hx-S(3))} {n(yi-S(49))}Q{n(hx+S(3))} {n(yi-S(49))} {n(hx+S(4))} {n(yi-S(44))}V{n(yi-S(22))}", "e")
    f.p(rect(sx - S(22), yi - S(23), S(20), S(5)) + rect(sx - S(24), yi - S(18), S(5), S(15)) + rect(sx - S(31), yi - S(3), S(12), S(3)), "e p")
for i in range(N):
    f.L(6 + i // 4)
    xi, yi = X0 + i*DX, Y0 - i*DY
    sx = xi + 16
    S = lambda v: v * k
    f.p(poly([(sx, yi - S(16)), (sx + S(3), yi - S(54)), (sx + S(7), yi - S(54)), (sx + S(5), yi - S(16))]) + rect(sx - S(20), yi - S(18), S(20), S(3)) + ln(sx - S(10), yi - S(15), sx - S(10), yi - S(3)), "e p")
    if rnd.random() < .85: person(sx, yi)
# ---- house: lanterns, FOH bridges with canted lamps, booth ----
f.L(8)
for x in range(250, 590, 56):
    f.p(ln(x, 30, x, 54) + ell(x, 58, 4, 4) + ln(x - 6, 66, x + 6, 66) + ln(x - 4, 62, x - 6, 66) + ln(x + 4, 62, x + 6, 66), "e p")
f.p(ln(300, 30, 300, 66) + ln(324, 30, 324, 66), "m"); tr(312, 66)
f.p(ln(410, 30, 410, 74) + ln(434, 30, 434, 74), "m"); tr(422, 74)
for cx, cy, a in ((304, 92, 58), (320, 92, 66), (414, 100, 62), (430, 100, 70)):
    f.raw(f'<g transform="rotate({a} {cx} {cy})">')
    f.p(rect(cx - 4, cy, 8, 4) + rect(cx - 7, cy + 4, 14, 18) + "".join(ln(cx - 7, cy + 8 + 4*kk, cx + 7, cy + 8 + 4*kk) for kk in range(3)), "e p")
    f.p(ell(cx, cy + 22, 7, 2), "e"); f.raw("</g>")
# booth (followspot operator, window onto the hall)
f.L(9)
f.p(rect(530, 142, 74, 76) + rect(534, 146, 66, 6), "e p")
f.p(rect(526, 162, 6, 36) + ln(526, 180, 532, 180), "e p")
f.p(rect(538, 218, 10, 36) + ln(538, 236, 548, 236), "e p")
f.p(ell(590, 194, 5, 5) + "M582 218Q582 202 590 201Q598 202 598 218z", "e p")   # operator
f.p(rect(572, 214, 30, 4), "e p")
f.p(rect(560, 126, 12, 8) + ln(566, 134, 566, 142), "e p")                                      # sign
# ---- lamp ----
cfg = dict(rest=[96, 329], **{"from": [170, 329]}, box=[26, 329, 176, 329], pivot=[560, 180], lens=36, span=[14, 598])
lit = f'<path class="b" d="{ln(14, DECK, 196, DECK)}"/><path class="b" d="{mic}"/>' + "".join(f'<path class="b" d="{ln(14+9*kk, DECK, 14+9*kk, DECK+9)}"/>' for kk in range(1, 20))
beam, lamp_t = spot_group(f, cfg, 40, 5, 20, lit, 5)
f.L(9)
f.p("M566 176V160H598V176", "e") if False else None
lamp_open(f, lamp_t); draw_lamp(f, 1.0); f.raw("</g>")
f.p(ell(560, 180, 2.4, 2.4), "e p")
f.L(12); f.raw(beam)
label = "A wide side view of a whole hall: a followspot in the booth at the back sends its beam over rows of seated people to the stage. The beam follows the pointer along the stage and lights one place on the floor: yours."
emit("05", f, cfg, label)
