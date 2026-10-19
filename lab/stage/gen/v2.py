from common import *
import random
rnd = random.Random(11)
W, H = 612, 600
f = F(W, H)
FLOOR, PX = 380, 262
# ---- structure with poche ----
f.L(0)
f.p(rect(0, 16, W, 16), "e"); f.p(hatch(0, 16, W, 16, 6), "m")
f.p(rect(0, 16, 14, 532), "e"); f.p(hatch(0, 32, 14, 516, 6), "m")
f.p(rect(598, 16, 14, 532), "e"); f.p(hatch(598, 32, 14, 516, 6), "m")
f.p(rect(0, 528, W, 20), "e"); f.p(hatch(14, 528, 584, 20, 6), "m")
f.p(rect(598, 120, 14, 20), "e p"); f.p(ln(598, 130, 612, 130), "m")               # booth port
f.L(1)
f.p(rect(PX, 32, 30, 80), "e p"); f.p(hatch(PX, 32, 30, 80, 6), "m")               # proscenium header
f.p(rect(PX - 4, 108, 38, 4), "e p")
# ---- fly loft ----
f.p(ln(14, 44, PX, 44) + ln(14, 50, PX, 50) + "".join(ln(14+12*k, 44, 14+12*k+6, 50) + ln(14+12*k+6, 50, 14+12*k+12, 44) for k in range(20)), "e")
f.p(ln(20, 56, 20, 372) + ln(34, 56, 34, 372), "m")
f.p("".join(rect(21, 80 + 11*k, 12, 9) + ln(21, 84 + 11*k, 33, 84 + 11*k) for k in range(9)), "e p")
f.p(rect(14, 190, 8, 4) + ln(14, 194, 14, 372), "e")
ropes = {50: 96, 86: 82, 122: 118, 140: 118, 196: 150, 218: 150, 238: 90}
f.L(2)
for x, yb in ropes.items():
    f.p(ell(x, 57, 4, 4) + ln(x, 61, x, yb), "e")
f.L(3)
f.p(rect(48, 96, 4, 40) + "".join(ln(48, 100+6*k, 52, 100+6*k) for k in range(6)), "e p")
f.p(rect(84, 82, 4, 150) + "".join(ln(84, 90+10*k, 88, 90+10*k) for k in range(14)), "e p")
f.p(rect(236, 90, 4, 110) + "".join(ln(236, 96+8*k, 240, 96+8*k) for k in range(13)), "e p")
def endtruss(cx, cy, w=28):
    x, y = cx - w/2, cy
    f.p(rect(x, y, w, w) + rect(x+3, y+3, w-6, w-6), "e p")
    f.p(ln(x, y, x+w, y+w) + ln(x+w, y, x, y+w), "m")
    f.p("".join(ell(px, py, 2.4, 2.4) for px in (x, x+w) for py in (y, y+w)), "e p")
f.L(4)
endtruss(131, 118)
endtruss(196, 150)
for cx, a in ((188, -28), (204, 22)):
    f.raw(f'<g transform="rotate({a} {cx} 180)">')
    f.p(rect(cx-5, 180, 10, 4) + rect(cx-8, 184, 16, 22) + "".join(ln(cx-8, 188 + 4*k, cx+8, 188 + 4*k) for k in range(4)), "e p")
    f.p(ell(cx, 206, 8, 2.2), "e"); f.raw("</g>")
# ---- stage deck and under-stage ----
f.L(5)
f.p(rect(14, FLOOR, PX - 14, 10), "e p")
f.p("".join(ln(14 + 10*k, FLOOR, 14 + 10*k, FLOOR + 10) for k in range(1, 25)), "f")
f.p(rect(14, FLOOR + 10, PX - 14, 6), "e p")
f.p("".join(rect(18 + 34*k, FLOOR + 16, 6, 132) for k in range(8)), "e p")
f.p("".join(ln(24 + 34*k, FLOOR + 32, 18 + 34*(k+1), FLOOR + 100) for k in range(0, 7, 2)) + "".join(ln(24 + 34*(k+1), FLOOR + 32, 18 + 34*k + 6, FLOOR + 100) for k in range(1, 7, 2)), "m")
f.p(ln(14, 470, PX, 470) + ln(14, 482, PX, 482), "m")
f.p(rect(150, 396, 36, 4) + rect(154, 400, 28, 20) + ln(154, 410, 182, 410), "m")
f.p(rect(PX, FLOOR, 4, 92), "e p")
f.L(6)
f.p(rect(222, 322, 32, 58) + ell(238, 340, 9, 9) + ell(238, 364, 9, 9) + ell(238, 340, 3, 3) + ell(238, 364, 3, 3), "e p")
f.p(poly([(190, FLOOR), (216, FLOOR), (190, FLOOR - 14)]) + ln(196, FLOOR - 9, 206, FLOOR) + ln(192, FLOOR - 12, 210, FLOOR), "e p")
f.p(poly([(48, 312), (72, 318), (68, FLOOR), (50, FLOOR)]) + rect(46, FLOOR - 6, 28, 6) + "M60 312V296Q60 290 66 290", "e p")
f.p(ell(170, FLOOR - 26, 10, 3) + ln(162, FLOOR - 26, 160, FLOOR) + ln(178, FLOOR - 26, 180, FLOOR), "e p")
MX = 131
mic = ln(MX, 300, MX, FLOOR - 4) + ln(MX, FLOOR - 4, MX - 14, FLOOR) + ln(MX, FLOOR - 4, MX + 14, FLOOR) + ln(MX, 300, MX + 20, 292) + rect(MX + 18, 286, 5, 10)
f.p(mic, "e")
f.p(f"M{MX-14} {FLOOR-1}Q{MX-40} {FLOOR-8} {MX-70} {FLOOR-1}", "m")
# ---- pit ----
f.p(rect(PX + 4, 474, 74, 4) + ln(PX + 4, 478, PX + 4, 528), "e p")
for x in (286, 308):
    f.p(ln(x, 474, x, 440) + ln(x - 8, 474, x + 8, 474) + poly([(x - 8, 432), (x + 7, 430), (x + 9, 442), (x - 6, 444)]), "e p")
f.p(rect(338, 428, 4, 50), "e p")
# ---- stalls rake ----
f.L(7)
X0, DX, DY, Y0, N = 342, 28, 15, 440, 9
prof = [(X0, Y0)]
for i in range(N):
    xi, yi = X0 + i*DX, Y0 - i*DY
    prof += [(xi + DX, yi), (xi + DX, yi - DY)]
prof = prof[:-1]
under = [(X0, 478)] + prof + [(598, 528), (X0, 528)]
f.p(poly(under), "e p")
hatch_poly(f, under, "hs", 8)
f.p("".join(rect(X0 + i*DX, Y0 - i*DY - 3, DX, 3) for i in range(N)), "e p")
def person(sx, yi, rnd_):
    hx, hy = sx - 4, yi - 62
    head = ell(hx, hy, 6, 6.6)
    hair = f"M{n(hx-6)} {n(hy)}Q{n(hx-1)} {n(hy-9)} {n(hx+6)} {n(hy-1)}" if rnd_.random() < .6 else f"M{n(hx-6)} {n(hy-1)}Q{n(hx)} {n(hy-9)} {n(hx+6)} {n(hy-1)}V{n(hy+5)}"
    body = f"M{n(hx-3)} {n(hy+6)}V{n(hy+9)}M{n(hx-9)} {n(yi-24)}V{n(yi-44)}Q{n(hx-9)} {n(yi-49)} {n(hx-3)} {n(yi-49)}Q{n(hx+3)} {n(yi-49)} {n(hx+4)} {n(yi-44)}V{n(yi-22)}"
    legs = rect(sx - 22, yi - 23, 20, 5) + rect(sx - 24, yi - 18, 5, 15) + rect(sx - 31, yi - 3, 12, 3)
    arm = f"M{n(hx-7)} {n(yi-44)}L{n(hx-12)} {n(yi-34)}L{n(hx-17)} {n(yi-30)}"
    f.fill(poly([(hx-9, yi-24), (hx-9, yi-44), (hx+4, yi-44), (hx+4, yi-22)]) + rect(sx - 22, yi - 23, 20, 5))
    f.p(head, "e p"); f.p(hair, "m"); f.p(body, "e"); f.p(legs, "e p"); f.p(arm, "m")
def seat(sx, yi, occupied):
    f.p(poly([(sx, yi-16), (sx+3, yi-54), (sx+7, yi-54), (sx+5, yi-16)]) + rect(sx - 20, yi - 18, 20, 3) + ln(sx - 10, yi - 15, sx - 10, yi - 3) + rect(sx - 14, yi - 3, 8, 3), "e p")
    f.p(rect(sx - 12, yi - 24, 3, 8) + ln(sx - 11, yi - 24, sx - 11, yi - 16), "m")
    if occupied: person(sx, yi, rnd)
for i in range(N):
    f.L(8 + i // 2)
    seat(X0 + i*DX + 24, Y0 - i*DY, rnd.random() < .8)
# ---- balcony ----
f.L(9)
BX, BY, BDX, BDY, BN = 452, 226, 28, 14, 5
bprof = [(430, BY), (BX, BY)]
for i in range(BN):
    xi, yi = BX + i*BDX, BY - i*BDY
    bprof += [(xi + BDX, yi), (xi + BDX, yi - BDY)]
bprof = bprof[:-1]
slab = bprof + [(598, 200), (430, 246)]
f.p(poly(slab), "e p"); hatch_poly(f, slab, "hb", 8)
f.p(rect(426, BY - 22, 4, 22) + ln(426, BY - 22, 452, BY - 22) + ln(430, BY - 11, 452, BY - 11), "e p")
f.p("".join(rect(BX + i*BDX, BY - i*BDY - 3, BDX, 3) for i in range(BN)), "e p")
for i in range(BN):
    f.L(10 + i // 3)
    seat(BX + i*BDX + 24, BY - i*BDY, rnd.random() < .8)
# ceiling over the house: acoustic baffles, pendants, exit sign
f.L(10)
for k in range(8):
    x = 306 + 36*k
    f.p(poly([(x, 32), (x + 26, 32), (x + 20, 58), (x - 6, 58)]) + ln(x + 3, 38, x + 13, 38), "e p")
f.p(ln(344, 32, 344, 70) + ell(344, 74, 4, 4) + ln(338, 82, 350, 82) + ln(418, 32, 418, 70) + ell(418, 74, 4, 4) + ln(412, 82, 424, 82), "e p")
f.p(rect(572, 262, 20, 8) + ln(582, 270, 582, 278), "e p")
# front-of-house truss over the pit, its lamps canted at the stage; a sightline from the back row
f.L(10)
f.p(ln(336, 32, 336, 104) + ln(354, 32, 354, 104), "m")
f.p(rect(333, 104, 24, 24) + rect(336, 107, 18, 18) + ln(333, 104, 357, 128) + ln(357, 104, 333, 128), "e p")
for cx, a in ((338, 62), (352, 70)):
    f.raw(f'<g transform="rotate({a} {cx} 130)">')
    f.p(rect(cx-4, 130, 8, 4) + rect(cx-7, 134, 14, 20) + "".join(ln(cx-7, 138 + 4*k, cx+7, 138 + 4*k) for k in range(3)), "e p")
    f.p(ell(cx, 154, 7, 2), "e"); f.raw("</g>")
f.p(ln(578, 120, PX, FLOOR), "f")
# ---- lamp ----
cfg = dict(rest=[131, 379], **{"from": [60, 379]}, box=[40, 379, 238, 379], pivot=[131, 180], lens=36, span=[14, 598])
FLO = ln(14, FLOOR, PX, FLOOR)
lit = f'<path class="b" d="{FLO}"/><path class="b" d="{mic}"/>' + "".join(f'<path class="b" d="{ln(14+10*k, FLOOR, 14+10*k, FLOOR+10)}"/>' for k in range(1, 25))
beam, lamp_t = spot_group(f, cfg, 34, 4, 20, lit, 3)
f.L(4)
f.p(ln(131, 146, 131, 164) + rect(126, 146, 10, 4), "e p")
f.p("M116 180V164H146V180", "e")
f.p(ell(116, 180, 2.4, 2.4) + ell(146, 180, 2.4, 2.4), "e p")
lamp_open(f, lamp_t); draw_lamp(f, 1.0); f.raw("</g>")
f.L(12); f.raw(beam)
label = "A side section of a hall: a followspot hangs from the flown truss above the stage; raked stalls and a balcony of seated people face it. The beam follows the pointer along the stage and lights one place on the floor: yours."
emit("02", f, cfg, label)
