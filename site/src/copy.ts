// CopyButton state: tick + "Copied" for 2s, then back to the copy icon
export function copied(b: HTMLElement) {
  const label = b.querySelector('.lb')!;
  b.dataset.copied = '';
  label.textContent = 'Copied';
  clearTimeout(Number(b.dataset.t));
  b.dataset.t = String(setTimeout(() => { delete b.dataset.copied; label.textContent = 'Copy'; }, 2000));
}
