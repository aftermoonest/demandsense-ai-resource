// The only arrows on the site: Figma icon/arrow (116:2219), exported to /design-system/icons. Sized by CSS where used.
const raw = import.meta.glob('../../design-system/icons/arrow-*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export type Dir = 'up' | 'down' | 'left' | 'right';
export const arrow = (dir: Dir = 'right', cls = '') =>
  raw[`../../design-system/icons/arrow-${dir}.svg`].trim().replace(' width="24" height="24"', '').replace('<svg ', cls ? `<svg class="${cls}" ` : '<svg ');
