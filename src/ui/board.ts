import { SOUND_GROUPS } from '../data/sounds';
import { setSoundLevel, toggleSound } from '../player';
import { state } from '../state';
import { $, icon, paintRange } from './dom';

export function renderBoard(): void {
  const board = $('#board');
  board.innerHTML = SOUND_GROUPS.map(
    (g) => `<section>
      <div class="label">${g.items.length} sounds</div>
      <h2>${g.title}</h2>
      <div class="grid">${g.items
        .map(
          (s) => `<div class="tile" data-id="${s.id}">
            <button class="tbtn" type="button" aria-pressed="false">
              <span class="ic">${icon(s.icon)}</span>
              <span><span class="tname">${s.name}</span><br><span class="tsub">${s.sub}</span></span>
            </button>
            <input type="range" min="0" max="100" value="50" aria-label="${s.name} volume">
          </div>`,
        )
        .join('')}</div>
    </section>`,
  ).join('');

  board.querySelectorAll<HTMLElement>('.tile').forEach((tile) => {
    const id = tile.dataset.id!;
    const range = tile.querySelector('input')!;
    tile.querySelector('button')!.addEventListener('click', () => toggleSound(id, +range.value));
    range.addEventListener('input', () => {
      paintRange(range);
      setSoundLevel(id, +range.value);
    });
  });
}

export function renderTiles(): void {
  document.querySelectorAll<HTMLElement>('.tile').forEach((tile) => {
    const id = tile.dataset.id!;
    const on = id in state.mix;
    const range = tile.querySelector('input')!;
    tile.classList.toggle('on', on);
    tile.querySelector('button')!.setAttribute('aria-pressed', String(on));
    if (on && +range.value !== state.mix[id]) range.value = String(state.mix[id]);
    paintRange(range);
  });
}
