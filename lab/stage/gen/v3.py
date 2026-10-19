from common import *
import random, math
rnd = random.Random(5)
W, H = 612, 720
f = F(W, H)
CX, CY = 306, 238
# ---- walls ----
f.L(0)
f.p(rect(6, 6, 600, 708) + rect(14, 14, 584, 692), "e")
f.p(hatch(6, 6, 600, 8, 5) + hatch(6, 706, 600, 8, 5), "f")
# door gaps in the side walls, bottom corners (plate over the wall pair, leaf and swing)
for xw, sgn in ((14, 1), (598, -1)):
    f.p(rect(min(6, 598), 600, 8, 46) if False else "", "e")
f.p(rect(5, 601, 10, 44) + rect(597, 601, 10, 44), "e p")
f.p(ln(14, 646, 60, 646) + "M14 600A46 46 0 0 1 60 646" + ln(598, 646, 552, 646) + "M598 600A46 46 0 0 0 552 646", "m")
f.p(rect(18, 586, 10, 6) + rect(584, 586, 10, 6), "e p")     # exit signs
# stage wings: wall poche and flats
f.L(1)
f.p(rect(14, 14, 50, 222), "e p"); f.p(hatch(14, 14, 50, 222, 7), "m")
f.p(rect(548, 14, 50, 222), "e p"); f.p(hatch(548, 14, 50, 222, 7), "m")
# stage floor boards
f.p(rect(64, 14, 484, 206), "e p")
f.p("".join(ln(64, y, 548, y) for y in range(26, 220, 12)), "f")
f.p("".join(ln(x, y, x, y + 12) for y, off in zip(range(14, 220, 12), range(0, 40, 1)) for x in range(64 + (off * 37) % 61 + 20, 548, 61)), "f")
f.p(rect(64, 14, 484, 14) + ln(64, 21, 548, 21), "e p")          # back cyc
f.p(rect(206, 108, 200, 94) + rect(212, 114, 188, 82), "f")        # rug
f.p(rect(226, 220, 160, 24) + ln(226, 232, 386, 232), "e p")        # apron
f.p("".join(ln(x, 220, x + 0, 244) for x in (250, 274, 338, 362)), "f")
for x0 in (64, 502):                                              # stage stairs
    f.p("".join(rect(x0 + (0 if x0 == 64 else 0), 220 + 6*k, 46 - 0, 6) for k in range(4)), "e p")
# ---- orchestra pit ----
f.L(2)
f.p(rect(170, 262, 272, 40), "e p") if False else None
f.p(poly([(150, 252), (462, 252), (442, 300), (170, 300)]), "e p")
f.p(poly([(158, 258), (454, 258), (437, 294), (175, 294)]), "f")
for x in range(196, 430, 34):
    f.p(rect(x - 6, 266, 12, 6) + ln(x, 272, x, 280) + ell(x, 285, 4, 4), "m")
# ---- audience, fan of arcs ----
f.L(3)
rows = [92 + 21*k for k in range(16)]
seats_total = 0
aisles = (0.0, 0.43, -0.43)
for ri, r in enumerate(rows):
    f.L(3 + ri // 3)
    cush, back, heads, arms = "", "", "", ""
    cnt = 0
    for sgn in (-1, 1):
        j = 0
        while True:
            phi = sgn * (6.25 + 12.5*j) / r; j += 1
            if abs(phi) > 1.08: break
            px, py = CX + r*math.sin(phi), CY + r*math.cos(phi)
            if px < 26 or px > 586 or py > 664: break
            if any(r*abs(phi - a) < 11 for a in aisles): continue
            tx, ty = math.cos(phi), -math.sin(phi); rx_, ry_ = math.sin(phi), math.cos(phi)
            pt = lambda u, v: (px + u*tx + v*rx_, py + u*ty + v*ry_)
            cush += poly([pt(-4.5, -5), pt(4.5, -5), pt(4.5, 2), pt(-4.5, 2)])
            back += poly([pt(-4.5, 2), pt(4.5, 2), pt(4.5, 5), pt(-4.5, 5)])
            arms += ln(*pt(-5.4, -4), *pt(-5.4, 2)) + ln(*pt(5.4, -4), *pt(5.4, 2))
            if rnd.random() < .66:
                hx, hy = pt(0, -1)
                heads += ell(hx, hy, 2.8, 2.8)
            cnt += 1
    seats_total += cnt
    f.p(cush, "e p"); f.p(back, "e p"); f.p(arms, "m")
    f.L(3 + ri // 3, fine=True); f.p(heads, "m")
print("seats", seats_total)
# aisle step lines
f.L(7)
steps = ""
for a in aisles:
    for r in rows:
        for da in (-11, 11):
            phi = a + da / r
            px, py = CX + r*math.sin(phi), CY + r*math.cos(phi)
            steps += f"M{n(px)} {n(py)}l{n(-3*math.cos(phi))} {n(3*math.sin(phi))}"
f.p(steps, "m")
# sound desk
f.p(rect(262, 672, 88, 26) + "".join(ln(270 + 8*k, 678, 270 + 8*k, 692) for k in range(10)) + rect(262, 664, 88, 8), "e p")
# FOH truss over the house with lamps (above the seats, so it hides them)
f.L(8)
f.p(rect(34, 392, 544, 14), "e p")
f.p("M34 406" + "".join(f"L{34 + 12*k} {392 if k % 2 else 406}" for k in range(1, 46)), "m")
f.p(ln(34, 392, 34, 406) + ln(578, 392, 578, 406), "e")
for x in (74, 140, 206, 272, 340, 406, 472, 538):
    f.p(ell(x, 386, 6, 6) + ell(x, 386, 2.6, 2.6) + ln(x, 380, x, 374) + rect(x - 4, 394, 8, 5), "e p")
# ---- stage trusses, static lamps ----
f.L(9)
for ty in (62, 138):
    f.p(rect(84, ty, 444, 14) + ln(84, ty, 84, ty + 14) + "".join(rect(84 + 22*k - 1.5, ty + (-1.5 if k % 2 else 12.5), 3, 3) for k in range(21)), "e p")
    f.p(f"M84 {ty+14}" + "".join(f"L{84 + 11*k} {ty if k % 2 else ty + 14}" for k in range(1, 41)), "m")
for x, ty in ((124, 62), (168, 62), (212, 62), (400, 62), (444, 62), (488, 62), (150, 138), (232, 138), (380, 138), (462, 138)):
    f.p(ell(x, ty + 22, 6, 6) + ell(x, ty + 22, 2.6, 2.6) + ln(x, ty + 14, x, ty + 16) + ln(x - 8, ty + 22, x - 6, ty + 22) + ln(x + 6, ty + 22, x + 8, ty + 22), "e p")
# props
f.L(9)
f.p(rect(110, 160, 26, 18) + rect(114, 164, 18, 10) + ell(123, 169, 3, 3) , "e p")            # lectern
f.p(ell(470, 170, 9, 9) + ell(470, 170, 4, 4) + ln(470, 161, 470, 156), "e p")                 # stool
f.p(ell(430, 138, 9, 9) + ell(430, 138, 4, 4), "e p")
for x in (126, 210, 402, 486):                                                                 # monitors
    f.p(poly([(x - 14, 212), (x + 14, 212), (x + 9, 202), (x - 9, 202)]) + "".join(ln(x - 8 + 5*k, 203, x - 9 + 5*k, 211) for k in range(4)), "e p")
for x in (72, 540):                                                                            # speaker stacks
    f.p(rect(x - 6, 180, 12, 30) + ell(x, 190, 4, 4) + ell(x, 202, 4, 4), "e p")
f.p("M122 178Q180 232 226 224M490 180Q430 238 392 226M300 214Q340 236 392 224", "m")           # cables
MX, MY = 306, 168
mic = ln(MX, MY, MX - 6, MY + 5) + ln(MX, MY, MX + 6, MY + 5) + ln(MX, MY, MX, MY - 6) + ln(MX, MY - 2, MX - 14, MY - 14) + rect(MX - 17, MY - 18, 5, 5) + ell(MX, MY, 2.2, 2.2)
f.p(mic, "e p")
f.p("".join(ln(x - 3, y - 3, x + 3, y + 3) + ln(x - 3, y + 3, x + 3, y - 3) for x, y in ((222, 140), (390, 196), (250, 196), (360, 120))), "m")   # spike marks
# ---- lamp ----
cfg = dict(rest=[306, 168], **{"from": [140, 190]}, box=[100, 100, 512, 206], pivot=[306, 70], lens=30)
bf = "".join(ln(64, y, 548, y) for y in range(26, 220, 24))
lit = f'<path class="b" d="{bf}"/><path class="b" d="{rect(206, 108, 200, 94) + rect(212, 114, 188, 82)}"/><path class="b" d="{mic}"/>'
beam, lamp_t = spot_group(f, cfg, 44, 44, 18, lit, 3)
f.L(9)
f.p(rect(292, 60, 28, 18), "e p")                                                  # clamp plate on the truss
f.p(rect(283, 64, 4, 14) + rect(325, 64, 4, 14), "e p")
lamp_open(f, lamp_t)
f.p(rect(-9, -26, 18, 16) + "".join(ln(-9, -23 + 3*k, 9, -23 + 3*k) for k in range(4)), "e p")
f.p(poly([(-8, -10), (8, -10), (7, 28), (-7, 28)]) + ln(-8, 8, 8, 8) + ln(-7.6, 12, 7.6, 12), "e p")
f.p(rect(-8, 28, 16, 3) + ln(8, 6, 20, 14) + rect(19, 13, 5, 5) + ell(-10, 0, 2.2, 2.2) + ell(10, 0, 2.2, 2.2), "e p")
f.p(ln(-7, 31.5, 7, 31.5), "b")
f.raw("</g>")
f.L(12); f.raw(beam)
label = "A plan of a hall from above: the stage with its truss and a followspot at the top, a fan of about five hundred seats below it. The beam follows the pointer and lights one round place on the stage floor: yours."
emit("03", f, cfg, label)
