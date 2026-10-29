import { ctx, noiseBuffer } from './context';
import type { NoiseType } from './noise';
import { parseMelody } from './notes';

/** Everything one playing sound owns, so it can be torn down cleanly. */
export interface Layer {
  srcs: AudioScheduledSourceNode[];
  timers: number[];
  out: GainNode;
}

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const pick = <T>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];

/** Looping noise source, started at a random offset so stacked layers never phase-align. */
export function noise(L: Layer, type: NoiseType): AudioBufferSourceNode {
  const ac = ctx();
  const s = ac.createBufferSource();
  s.buffer = noiseBuffer(type);
  s.loop = true;
  s.start(ac.currentTime, rand(0, 5));
  L.srcs.push(s);
  return s;
}

export function osc(L: Layer, type: OscillatorType, freq: number): OscillatorNode {
  const o = ctx().createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.start();
  L.srcs.push(o);
  return o;
}

export function filt(type: BiquadFilterType, freq: number, Q = 0.7): BiquadFilterNode {
  const f = ctx().createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = Q;
  return f;
}

export function gain(v: number): GainNode {
  const g = ctx().createGain();
  g.gain.value = v;
  return g;
}

export function panner(p: number): AudioNode {
  const ac = ctx();
  if (!('createStereoPanner' in ac)) return gain(1);
  const s = ac.createStereoPanner();
  s.pan.value = p;
  return s;
}

/** Connects nodes in series. The last item may be an AudioParam, for modulation. */
export function chain(first: AudioNode, ...rest: (AudioNode | AudioParam)[]): void {
  let prev = first;
  for (const next of rest) {
    if (next instanceof AudioParam) {
      prev.connect(next);
      return;
    }
    prev.connect(next);
    prev = next;
  }
}

/** Feedback delay with a darkening filter in the loop; returns the input node. */
export function echo(out: AudioNode, time: number, feedback: number, cutoff: number): GainNode {
  const inp = gain(1);
  const d = ctx().createDelay(2);
  const lp = filt('lowpass', cutoff);
  const fb = gain(feedback);
  d.delayTime.value = time;
  inp.connect(out);
  inp.connect(d);
  d.connect(lp);
  lp.connect(fb);
  fb.connect(d);
  lp.connect(out);
  return inp;
}

/**
 * Lookahead scheduler: queues events on the audio clock 1.5 s ahead, so sounds keep flowing
 * even when the page is backgrounded and timers are throttled.
 */
export function sched(L: Layer, gap: () => number, ev: (t: number) => void, first = 0.1): void {
  const ac = ctx();
  let next = ac.currentTime + first;
  const tick = () => {
    const now = ac.currentTime;
    if (next < now - 1) next = now + 0.05;
    while (next < now + 1.5) {
      if (next >= now) ev(next);
      next += gap();
    }
  };
  tick();
  L.timers.push(window.setInterval(tick, 200));
}

/** A short enveloped burst of filtered noise: a drop, a crackle, a click. */
export function burst(
  dest: AudioNode,
  t: number,
  dur: number,
  peak: number,
  type: BiquadFilterType,
  freq: number,
  Q: number,
  buffer: NoiseType = 'white',
): void {
  const s = ctx().createBufferSource();
  s.buffer = noiseBuffer(buffer);
  const e = gain(0);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(peak, t + Math.min(0.004, dur / 3));
  e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  chain(s, filt(type, freq, Q), e, dest);
  s.start(t, rand(0, 5));
  s.stop(t + dur + 0.05);
}

export interface ToneOptions {
  type?: OscillatorType;
  /** Glide to this frequency over `sweep` seconds (or the whole note). */
  fEnd?: number;
  sweep?: number;
  attack?: number;
}

/** A single enveloped oscillator note. */
export function tone(
  dest: AudioNode,
  t: number,
  f: number,
  dur: number,
  peak: number,
  { type = 'sine', fEnd, sweep, attack = 0.005 }: ToneOptions = {},
): void {
  const ac = ctx();
  const o = ac.createOscillator();
  const e = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (fEnd) o.frequency.exponentialRampToValueAtTime(fEnd, t + (sweep || dur));
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(peak, t + attack);
  e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  chain(o, e, dest);
  o.start(t);
  o.stop(t + dur + 0.05);
}

/** Loops a written melody forever, with `rest` beats of silence between repeats. */
export function melody(
  L: Layer,
  seq: string,
  beat: number,
  voice: (t: number, f: number) => void,
  rest = 4,
): void {
  const notes = parseMelody(seq);
  let i = 0;
  sched(
    L,
    () => {
      const d = notes[i][1] * beat;
      i++;
      if (i >= notes.length) {
        i = 0;
        return d + rest * beat;
      }
      return d;
    },
    (t) => voice(t, notes[i][0]),
    0.3,
  );
}
