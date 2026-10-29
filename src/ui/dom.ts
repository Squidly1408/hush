import { ICONS, type IconName } from '../data/icons';

export function $<T extends HTMLElement = HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

export const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const icon = (name: IconName) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

/** Range inputs draw their filled track from the --p custom property. */
export function paintRange(r: HTMLInputElement): void {
  r.style.setProperty('--p', `${r.value}%`);
}
