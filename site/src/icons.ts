// Hairline icons from the shared illustrations folder, inlined so CSS tokens can colour them
const raw = import.meta.glob('../../illustrations/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const icon = (name: string) => raw[`../../illustrations/icons/${name}.svg`] ?? '';
