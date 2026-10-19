// 07: one timeline for the proof (base.js staggers the hero copy first; the object runs alongside it).
{
  const s = document.querySelector('.stack');
  const at = (el, ms, v = '--d') => el && el.style.setProperty(v, `${ms}ms`);
  ['.floor', '.b2', '.b1', '.p2', '.p1', '.front'].forEach((q, i) => at(s.querySelector(q), 150 + i * 30));
  // marks draw once the sheet has opened: corners, targets, fold ticks
  s.querySelectorAll('.proof .mk').forEach((m, i) => at(m, 720 + i * 35, '--md'));
  s.querySelectorAll('.proof .crease').forEach((m) => at(m, 820, '--md'));
  s.querySelectorAll('.proof .steps').forEach((m) => at(m, 960, '--md'));
  // rows above the fold write in as the flap passes upright, rows below once it has opened
  s.querySelectorAll('.toc li').forEach((li, i) => at(li, i < 3 ? 600 + i * 55 : 900 + (i - 3) * 55));
}
