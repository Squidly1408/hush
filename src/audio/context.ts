import { makeNoiseBuffers, type NoiseType } from './noise';

let ac: AudioContext | null = null;
let master: GainNode | null = null;
let buffers: Record<NoiseType, AudioBuffer> | null = null;

/** Slider value (0–100) to gain; squared so the slider feels even to the ear. */
export const volumeCurve = (v: number) => (v / 100) ** 2;

/** Creates the context on first use (it must follow a user gesture) and resumes it if suspended. */
export function ensureContext(masterVolume: number): AudioContext {
  if (!ac) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ac = new Ctor();
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 4;
    comp.attack.value = 0.01;
    comp.release.value = 0.3;
    master = ac.createGain();
    master.gain.value = volumeCurve(masterVolume);
    master.connect(comp);
    comp.connect(ac.destination);
    buffers = makeNoiseBuffers(ac);
  }
  if (ac.state !== 'running') void ac.resume();
  return ac;
}

export const hasContext = () => ac !== null;

export function ctx(): AudioContext {
  if (!ac) throw new Error('Audio context not started');
  return ac;
}

export function masterGain(): GainNode {
  if (!master) throw new Error('Audio context not started');
  return master;
}

export function noiseBuffer(type: NoiseType): AudioBuffer {
  if (!buffers) throw new Error('Audio context not started');
  return buffers[type];
}
