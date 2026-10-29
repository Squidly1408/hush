import { SOUND_BY_ID } from '../data/sounds';
import { setKeepScreenOn, setMasterVolume, setTimer, togglePlay } from '../player';
import { state } from '../state';
import { $, paintRange } from './dom';

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z"/></svg>';
const PAUSE_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

const playBtn = () => $<HTMLButtonElement>('#play');
const timerSelect = () => $<HTMLSelectElement>('#timer');

function formatLeft(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function renderBar(): void {
  const btn = playBtn();
  const wasPlaying = btn.getAttribute('aria-label') === 'Pause';
  if (wasPlaying !== state.playing || !btn.innerHTML) {
    btn.innerHTML = state.playing ? PAUSE_ICON : PLAY_ICON;
    btn.setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
  }

  const ids = Object.keys(state.mix);
  $('#nowTitle').textContent = ids.length ? state.title : 'Nothing selected';
  let sub = ids.length ? ids.map((id) => SOUND_BY_ID[id].name).join(', ') : 'Tap a sound to begin';
  if (!state.playing && ids.length) sub = `Paused · ${sub}`;
  if (state.timerEnd && state.playing)
    sub = `Fades out in ${formatLeft(state.timerEnd - Date.now())} · ${sub}`;
  $('#nowSub').textContent = sub;

  if (!state.timerEnd && timerSelect().value !== '0') timerSelect().value = '0';
}

function renderWake(): void {
  const b = $('#wake');
  b.setAttribute('aria-pressed', String(state.keepScreenOn));
  b.textContent = state.keepScreenOn ? 'Screen on' : 'Screen can sleep';
}

export function bindBar(): void {
  playBtn().addEventListener('click', togglePlay);

  const master = $<HTMLInputElement>('#master');
  master.value = String(state.masterVolume);
  paintRange(master);
  master.addEventListener('input', () => {
    paintRange(master);
    setMasterVolume(+master.value);
  });

  timerSelect().addEventListener('change', () => setTimer(+timerSelect().value));

  renderWake();
  $('#wake').addEventListener('click', () => {
    setKeepScreenOn(!state.keepScreenOn);
    renderWake();
  });

  // Space toggles playback, unless the user is typing or on a control that uses Space itself.
  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (
      e.code !== 'Space' ||
      /INPUT|SELECT|BUTTON|TEXTAREA/.test(t.tagName) ||
      t.closest('.chip')
    ) {
      return;
    }
    e.preventDefault();
    togglePlay();
  });
}
