from common import *
import random
rnd = random.Random(7)
f = F(612, 720)

# ---- header, pillars (proscenium) ----
f.L(0)
f.p(rect(64, 96, 484, 328), "m p")                                   # back wall
f.p("".join(f"M{x} 96v328" for x in range(108, 548, 44)) + "".join(f"M64 {y}H548" for y in (190, 262, 340)), "f")
f.L(1)
# floor: trapezoid, boards converge to the back
f.p(poly([(104, 424), (508, 424), (548, 470), (64, 470)]), "e p")
bf = "".join(ln(104 + k*40.4, 424, 306 + (104 + k*40.4 - 306)*1.198, 470) for k in range(1, 10))
seams = ""
for y in (435, 447, 458):
    t = (y - 424) / 46
    seams += ln(104 - 40*t, y, 508 + 40*t, y)
f.p(bf, "f"); f.p(seams, "f")
f.L(1)
# legs (side drapes) with fold lines, hem
for x0 in (64, 508):
    f.p(rect(x0, 96, 40, 374), "e p")
    f.p("".join(f"M{x0+5*k} 98V468" for k in range(1, 8)), "m")
    f.p(ln(x0, 462, x0 + 40, 462), "e")
f.L(2)
# hanger cables + shackles (behind the swag)
for x in (132, 480):
    f.p(ln(x, 98, x, 142), "m"); f.p(rect(x-2, 137, 4, 6), "e p")
f.L(2)
# truss
f.p(ln(70, 142, 542, 142) + ln(70, 145, 542, 145) + ln(70, 171, 542, 171) + ln(70, 174, 542, 174), "e")
zz = "M70 171" + "".join(f"L{70+13*k} {145 if k%2 else 171}" for k in range(1, 37))
f.p(zz, "e")
f.p("".join(f"M{70+26*k} 145v26" for k in range(0, 19)), "m")
f.p("".join(rect(70+13*k-1.5, (143.5 if k % 2 else 172.5), 3, 3) for k in range(0, 37)), "e p")
f.p(rect(66, 140, 4, 36) + rect(542, 140, 4, 36), "e p")
f.L(3)
# swag valance under the teaser
f.p(rect(64, 96, 484, 22), "e p")
f.p("".join(f"M{64+44*k} 118Q{64+44*k+22} 134 {64+44*k+44} 118" for k in range(11)), "e")
f.p("".join(f"M{64+44*k+22} 106v8" for k in range(11)), "f")
# header
f.L(3)
f.p(rect(12, 20, 588, 76), "e p")
f.p("".join(f"M{x} 22v6" for x in range(16, 600, 8)), "m")
f.p(ln(12, 32, 600, 32) + ln(12, 84, 600, 84), "m")
cx = [306 + s*(70 + 56*j) for j in range(4) for s in (-1, 1)]
f.p("".join(rect(c-22, 40, 44, 36) for c in cx), "e")
f.p("".join(rect(c-18, 44, 36, 28) for c in cx), "f")
f.p("".join(ln(c-18, 44, c+18, 72) for c in cx), "f")
f.p(ell(306, 58, 16, 16) + ell(306, 58, 10, 10) + ell(306, 58, 4, 4) + ln(306, 38, 306, 78) + ln(286, 58, 326, 58), "e")
# pillars
f.L(4)
for x0, sx in ((12, 1), (548, 1)):
    f.p(rect(x0, 96, 52, 374), "e p")
    f.p("".join(f"M{x0+6*k} 112V446" for k in range(1, 9)), "m")      # fluting
    f.p(rect(x0-4, 96, 60, 10) + ln(x0, 106, x0+52, 106) + rect(x0-4, 446, 60, 24) + ln(x0, 452, x0+52, 452), "e p")
    f.p(rect(x0+12, 200, 28, 18) + ln(x0+26, 218, x0+26, 232) + rect(x0+12, 328, 28, 18) + ln(x0+26, 346, x0+26, 360), "e p")  # sconces
    f.p(rect(x0+17, 205, 18, 8) + rect(x0+17, 333, 18, 8), "m")
# par cans
f.L(5)
for x, a in ((118, 8), (176, -6), (436, 7), (494, -9)):
    f.raw(f'<g transform="rotate({a} {x} 176)">')
    f.p(rect(x-5, 174, 10, 5) + ln(x, 179, x, 182), "e p")
    f.p(rect(x-9, 182, 18, 26) + "".join(ln(x-9, 187+4*k, x+9, 187+4*k) for k in range(4)), "e p")
    f.p(ell(x, 208, 8, 2.5) + ln(x-12, 211, x-9, 208) + ln(x+12, 211, x+9, 208), "e")
    f.p(f"M{x+9} 190Q{x+16} 178 {x+6} 175", "m")
    f.raw("</g>")
# stage props
f.L(6)
# monitors (wedges)
for x in (126, 232, 380, 486):
    f.p(poly([(x, 466), (x+40, 466), (x+40, 458), (x+6, 450)]) , "e p")
    f.p(poly([(x+6, 450), (x+40, 458)], False) + "".join(ln(x+9+9*k, 457, x+9+9*k+3, 465) for k in range(3)), "m")
# lectern
f.p(poly([(150, 380), (206, 380), (200, 462), (156, 462)]) + rect(148, 374, 60, 6) + rect(154, 462, 48, 4), "e p")
f.p(rect(166, 396, 24, 22) + ln(166, 407, 190, 407), "m")
f.p(f"M178 374V344Q178 336 186 334", "e")                           # gooseneck
f.p(rect(184, 326, 5, 10), "e p")
# stool
f.p(ell(432, 424, 16, 4) + ln(416, 424, 412, 462) + ln(448, 424, 452, 462) + ln(432, 428, 432, 462) + ell(432, 440, 18, 3), "e p")
# mic stand: tripod, pole, boom, capsule, cable
MX, MY = 306, 446
f.p(ln(MX, MY, MX-18, MY+10) + ln(MX, MY, MX+18, MY+10) + ln(MX, MY, MX, MY+8) + ln(MX, 366, MX, MY), "e")
f.p(ln(MX, 366, MX+26, 350) + rect(MX+24, 344, 6, 12) + f"M{MX-20} {MY+10}Q{MX-60} {MY+16} {MX-96} {MY+8}", "e")
f.p(rect(MX-3, 392, 6, 8), "e p")
# stage lip, fascia, steps
f.L(7)
f.p(rect(12, 470, 588, 34), "e p")
f.p("".join(f"M{x} 474v26" for x in range(26, 600, 14)), "f")
f.p(ln(12, 474, 600, 474) + ln(12, 500, 600, 500), "e")
f.p("".join(rect(x, 466, 6, 3) for x in range(80, 540, 24)), "m")          # footlight strip
f.p(rect(24, 504, 72, 14) + rect(34, 518, 52, 14) + ln(24, 508, 96, 508) + ln(34, 522, 86, 522), "e p")
f.p(rect(0, 534, 612, 5) + "".join(rect(x, 539, 3, 14) for x in range(8, 612, 36)) + ln(0, 553, 612, 553), "e p")
# audience rows
f.L(8)
f.p(poly([(306-17, 553), (306+17, 553), (306+31, 720), (306-31, 720)]), "f")
f.p("".join(ln(306-17+i*0, y, 306+17, y) for i, y in enumerate((590, 650))), "f")
rows = [(566, .78), (620, 1.04), (680, 1.38)]
for ri, (yt, s) in enumerate(rows):
    f.L(8 + ri * 2)
    sw, arm, gap = 30*s, 5*s, 44*s
    pitch = sw + arm
    xs = []
    x = 306 + gap/2
    while x < 640: xs.append(x + sw/2); x += pitch
    xs = [612 - c for c in xs[::-1]] + xs
    hb = 60*s
    seats = "".join(rect(c - sw/2, yt, sw, hb) + rect(c - sw*.3, yt - 6*s, sw*.6, 6*s) for c in xs)
    f.p(seats, "e p")
    f.p("".join(ln(c - sw/2 + 3*s, yt + 12*s, c + sw/2 - 3*s, yt + 12*s) for c in xs), "f")
    heads, bodies, hair, bfill = "", "", "", ""
    for c in xs:
        if rnd.random() < .55:
            jx = rnd.uniform(-2.5, 2.5)*s; r = rnd.uniform(7, 8.4)*s; hx = c + jx; hy = yt - 2*s
            heads += ell(hx, hy, r, r*1.1)
            xa, xb = c - sw*.46, c + sw*.46
            ysh = yt + 14*s
            bo = f"M{n(xa)} {n(yt+hb*.7)}V{n(ysh+4*s)}Q{n(xa)} {n(ysh)} {n(hx-6*s)} {n(ysh-1*s)}L{n(hx-3*s)} {n(yt+7*s)}M{n(hx+3*s)} {n(yt+7*s)}L{n(hx+6*s)} {n(ysh-1*s)}Q{n(xb)} {n(ysh)} {n(xb)} {n(ysh+4*s)}V{n(yt+hb*.7)}"
            bodies += bo
            bfill += bo + "z"
            kind = rnd.random()
            if kind < .5: hair += f"M{n(hx-r)} {n(hy)}Q{n(hx)} {n(hy-r*1.5)} {n(hx+r)} {n(hy)}"
            elif kind < .75: hair += f"M{n(hx-r)} {n(hy-1)}Q{n(hx)} {n(hy-r*1.5)} {n(hx+r)} {n(hy-1)}" + ell(hx, hy - r*1.35, 2.6*s, 2.6*s)
            else: hair += f"M{n(hx-r*.9)} {n(hy-r*.3)}Q{n(hx)} {n(hy-r*1.4)} {n(hx+r*.9)} {n(hy-r*.3)}V{n(hy+r*.6)}M{n(hx-r*.9)} {n(hy+r*.2)}"
    f.fill(bfill); f.p(bodies, "e"); f.p(heads, "e p"); f.p(hair, "m")
    arms = "".join(rect(c + sw/2 - 1, yt + hb*.5, arm + 2, 4*s) for c in xs[:len(xs)//2 - 1] + xs[len(xs)//2:-1])
    f.p(arms, "e p")
    f.p(rect(306 - gap/2 - 2*s, yt + hb - 5*s, 3*s, 3*s) + rect(306 + gap/2 - s, yt + hb - 5*s, 3*s, 3*s), "e p")

# ---- lamp (turns) ----
cfg = dict(rest=[306, 440], **{"from": [150, 448]}, box=[150, 432, 462, 460], pivot=[306, 214], lens=36)
beam, lamp_t = spot_group(f, cfg, 62, 12, 20, "", 3)
f.L(6)
f.p(ln(306, 174, 306, 196) + rect(298, 174, 16, 6), "e p")
f.p("M291 214V196H321V214", "e")
f.p(ell(291, 214, 2.6, 2.6) + ell(321, 214, 2.6, 2.6), "e p")
f.raw(f'<g id="lamp" transform="{lamp_t}">')
f.p(rect(-14, -30, 28, 18) + "".join(ln(-14, -27 + 3*k, 14, -27 + 3*k) for k in range(5)), "e p")
f.p(poly([(-12, -12), (12, -12), (10, 32), (-10, 32)]) + ln(-11, 18, 11, 18) + ln(-10.6, 22, 10.6, 22), "e p")
f.p(rect(-12, 32, 24, 4) + ln(12, 0, 26, 8) + rect(26, 6, 5, 4) + ln(-12, -6, -19, 24) + ln(0, -30, 0, -36), "e p")
f.p(ell(0, 36, 10, 2.5), "b")
f.raw("</g>")

# lit copies of the floor and props, in blue, shown inside the pool only
lit = "".join(f'<path class="b" d="{d}"/>' for d in (bf, seams, ln(MX, 366, MX, MY) + ln(MX, MY, MX-18, MY+10) + ln(MX, MY, MX+18, MY+10) + ln(MX, MY, MX, MY+8) + ln(MX, 366, MX+26, 350) + rect(MX+24, 344, 6, 12)))
beam = beam.replace('<g clip-path="url(#pc)"></g>', f'<g clip-path="url(#pc)">{lit}</g>')
f.L(12); f.raw(beam)

label = "A stage seen from the audience: a proscenium, a truss with a followspot over the stage and rows of seats in front. The spot follows the pointer and lights one place on the stage floor: yours."
emit("01", f, cfg, label)
