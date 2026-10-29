import { PRESETS, type NamedMix } from '../data/presets';
import { applyMix, deleteSaved, play, saveMix } from '../player';
import { state } from '../state';
import { $, esc } from './dom';

function load({ mix, name }: NamedMix): void {
  applyMix(mix, name);
  play();
}

export function renderPresets(): void {
  const el = $('#presets');
  el.innerHTML = PRESETS.map(
    (p, i) => `<button class="chip" type="button" data-i="${i}">${esc(p.name)}</button>`,
  ).join('');
  el.addEventListener('click', (e) => {
    const chip = (e.target as Element).closest<HTMLElement>('[data-i]');
    if (chip) load(PRESETS[+chip.dataset.i!]);
  });
}

export function renderSaved(): void {
  const el = $('#saved');
  if (!state.saved.length) {
    el.innerHTML =
      '<span class="empty">Saved mixes appear here. They stay in this browser only.</span>';
    return;
  }
  el.innerHTML = state.saved
    .map(
      (s, i) =>
        `<span class="chip" role="button" tabindex="0" data-i="${i}">${esc(s.name)}<span class="x" data-del="${i}" role="button" tabindex="0" aria-label="Delete ${esc(s.name)}">×</span></span>`,
    )
    .join('');
}

/** Saved chips are re-rendered often, so their events are delegated from the container. */
export function bindSaved(): void {
  const el = $('#saved');
  const activate = (target: Element) => {
    const del = target.closest<HTMLElement>('[data-del]');
    if (del) return deleteSaved(+del.dataset.del!);
    const chip = target.closest<HTMLElement>('[data-i]');
    if (chip) load(state.saved[+chip.dataset.i!]);
  };
  el.addEventListener('click', (e) => activate(e.target as Element));
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    activate(e.target as Element);
  });

  const form = $<HTMLFormElement>('#saveForm');
  const input = $<HTMLInputElement>('#mixName');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (saveMix(input.value.trim())) input.value = '';
    else input.placeholder = 'Turn on at least one sound first';
  });
}
