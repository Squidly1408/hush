import { PRESETS, type Mix, type NamedMix } from './data/presets';
import { SOUND_BY_ID } from './data/sounds';
import { store } from './lib/storage';

/** Drops sounds that no longer exist, so an old saved mix can't break the app. */
export function cleanMix(m: unknown): Mix | null {
  if (!m || typeof m !== 'object') return null;
  const out: Mix = {};
  for (const [id, v] of Object.entries(m)) {
    if (id in SOUND_BY_ID && typeof v === 'number') out[id] = Math.max(0, Math.min(100, v));
  }
  return out;
}

const savedMixes = store.get<NamedMix[]>('hush.saved', []).flatMap((s) => {
  const mix = cleanMix(s?.mix);
  return mix && typeof s.name === 'string' ? [{ name: s.name, mix }] : [];
});

export const state = {
  mix: cleanMix(store.get('hush.mix', null)) ?? { ...PRESETS[0].mix },
  title: store.get('hush.title', PRESETS[0].name),
  saved: savedMixes,
  masterVolume: store.get('hush.master', 80),
  keepScreenOn: store.get('hush.wake', true),
  playing: false,
  /** Epoch ms when the sleep timer ends, or 0 for no timer. */
  timerEnd: 0,
  fading: false,
};

export function persistMix(): void {
  store.set('hush.mix', state.mix);
  store.set('hush.title', state.title);
}

type Topic = 'change' | 'saved';
const listeners: Record<Topic, Set<() => void>> = { change: new Set(), saved: new Set() };

/** 'change' fires on anything the tiles or bar show; 'saved' when the saved-mix list changes. */
export function subscribe(topic: Topic, fn: () => void): void {
  listeners[topic].add(fn);
}

export function emit(topic: Topic): void {
  listeners[topic].forEach((fn) => fn());
}
