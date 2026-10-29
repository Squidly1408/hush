import type { Mix } from '../data/presets';
import { ctx, masterGain, volumeCurve } from './context';
import { ENGINES } from './engines';
import type { Layer } from './nodes';

const live = new Map<string, Layer>();

function startSound(id: string, volume: number): void {
  const engine = ENGINES[id];
  if (!engine) return;
  const out = ctx().createGain();
  out.gain.value = 0;
  out.connect(masterGain());
  const layer: Layer = { srcs: [], timers: [], out };
  engine(layer, out);
  live.set(id, layer);
  setSoundVolume(id, volume, 1.2);
}

export function stopSound(id: string): void {
  const L = live.get(id);
  if (!L) return;
  live.delete(id);
  const now = ctx().currentTime;
  L.out.gain.cancelScheduledValues(now);
  L.out.gain.setTargetAtTime(0, now, 0.25);
  L.timers.forEach(clearInterval);
  setTimeout(() => {
    for (const s of L.srcs) {
      try {
        s.stop();
      } catch {
        // never started or already stopped
      }
    }
    L.out.disconnect();
  }, 1500);
}

/** Glides one sound to a slider level; `timeConstant` sets how quickly. */
export function setSoundVolume(id: string, volume: number, timeConstant = 0.08): void {
  const L = live.get(id);
  if (L) L.out.gain.setTargetAtTime(volumeCurve(volume), ctx().currentTime, timeConstant);
}

/** Starts every sound in the mix that isn't playing and stops every one that was removed. */
export function syncLayers(mix: Mix): void {
  for (const id of Object.keys(mix)) if (!live.has(id)) startSound(id, mix[id]);
  for (const id of [...live.keys()]) if (!(id in mix)) stopSound(id);
}
