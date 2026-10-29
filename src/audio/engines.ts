import { ctx, noiseBuffer } from './context';
import {
  burst,
  chain,
  echo,
  filt,
  gain,
  melody,
  noise,
  osc,
  panner,
  pick,
  rand,
  sched,
  tone,
  type Layer,
} from './nodes';
import { midiFreq } from './notes';

/**
 * Builds one sound's graph into `out`. Anything long-lived goes in the layer (sources via
 * noise()/osc(), timers via sched()) so stopping the sound can clean it up.
 */
export type Engine = (L: Layer, out: AudioNode) => void;

/** Disconnects a per-event node once its notes have rung out. */
function disconnectLater(node: AudioNode, t: number, tail: number) {
  setTimeout(
    () => {
      try {
        node.disconnect();
      } catch {
        // already disconnected
      }
    },
    (t - ctx().currentTime + tail) * 1000,
  );
}

export const ENGINES: Record<string, Engine> = {
  // ---------- rain & storm ----------
  rain(L, out) {
    chain(noise(L, 'pink'), filt('highpass', 500), filt('lowpass', 7000), gain(0.9), out);
    chain(noise(L, 'brown'), filt('lowpass', 600), gain(0.35), out);
    sched(
      L,
      () => rand(0.008, 0.05),
      (t) =>
        burst(out, t, rand(0.01, 0.03), rand(0.03, 0.14), 'bandpass', rand(2000, 7000), rand(1, 4)),
    );
  },

  drizzle(L, out) {
    chain(noise(L, 'pink'), filt('highpass', 1200), filt('lowpass', 6000), gain(0.35), out);
    sched(
      L,
      () => rand(0.04, 0.18),
      (t) =>
        burst(
          out,
          t,
          rand(0.008, 0.02),
          rand(0.02, 0.08),
          'bandpass',
          rand(3000, 8000),
          rand(1, 3),
        ),
    );
  },

  roof(L, out) {
    chain(noise(L, 'pink'), filt('bandpass', 2500, 0.6), gain(0.3), out);
    chain(noise(L, 'brown'), filt('lowpass', 300), gain(0.3), out);
    sched(
      L,
      () => rand(0.01, 0.06),
      (t) => {
        burst(
          out,
          t,
          rand(0.005, 0.015),
          rand(0.05, 0.18),
          'bandpass',
          rand(1500, 5000),
          rand(2, 6),
        );
        if (Math.random() < 0.12) {
          tone(out, t, rand(1800, 3200), rand(0.08, 0.18), rand(0.01, 0.03), {
            type: 'triangle',
            attack: 0.001,
          });
        }
      },
    );
  },

  thunder(L, out) {
    chain(noise(L, 'brown'), filt('lowpass', 110), gain(0.5), out);
    sched(
      L,
      () => rand(12, 28),
      (t) => {
        const s = ctx().createBufferSource();
        s.buffer = noiseBuffer('brown');
        const e = gain(0);
        const peak = rand(0.9, 1.6);
        const len = rand(5, 9);
        e.gain.setValueAtTime(0, t);
        e.gain.linearRampToValueAtTime(peak, t + rand(0.3, 1));
        e.gain.setTargetAtTime(peak * 0.5, t + 1.2, 0.6);
        e.gain.linearRampToValueAtTime(peak * 0.8, t + 2.2);
        e.gain.exponentialRampToValueAtTime(0.0001, t + len);
        chain(s, filt('lowpass', rand(160, 380)), e, out);
        s.start(t, rand(0, 5));
        s.stop(t + len + 0.1);
      },
      rand(1.5, 4),
    );
  },

  // ---------- water ----------
  ocean(L, out) {
    const lp = filt('lowpass', 400);
    const g = gain(0.15);
    chain(noise(L, 'brown'), lp, g, out);
    sched(
      L,
      () => rand(6.5, 10.5),
      (t) => {
        g.gain.setTargetAtTime(rand(0.7, 1.1), t, 1.1);
        g.gain.setTargetAtTime(0.12, t + 2.9, 2.1);
        lp.frequency.setTargetAtTime(rand(1300, 2000), t, 1);
        lp.frequency.setTargetAtTime(380, t + 2.6, 1.8);
      },
      0.2,
    );
  },

  stream(L, out) {
    const g = gain(0.35);
    chain(noise(L, 'white'), filt('highpass', 400), filt('lowpass', 2600), g, out);
    chain(osc(L, 'sine', 0.37), gain(0.08), g.gain);
    sched(
      L,
      () => rand(0.04, 0.25),
      (t) => {
        const f = rand(350, 1300);
        tone(out, t, f, rand(0.04, 0.09), rand(0.02, 0.06), { fEnd: f * rand(1.3, 2.1) });
      },
    );
  },

  waterfall(L, out) {
    chain(noise(L, 'white'), filt('highpass', 250), filt('lowpass', 3500), gain(0.35), out);
    chain(noise(L, 'brown'), filt('lowpass', 500), gain(0.9), out);
    const g = gain(0.15);
    chain(noise(L, 'pink'), filt('bandpass', 900, 0.5), g, out);
    chain(osc(L, 'sine', 0.21), gain(0.06), g.gain);
  },

  drips(L, out) {
    const e = echo(out, 0.27, 0.45, 2500);
    chain(noise(L, 'brown'), filt('lowpass', 200), gain(0.12), out);
    sched(
      L,
      () => rand(0.5, 2.4),
      (t) => {
        const f = rand(900, 1800);
        tone(e, t, f, rand(0.15, 0.3), rand(0.08, 0.16), {
          fEnd: f * rand(1.5, 2.2),
          sweep: 0.035,
          attack: 0.002,
        });
      },
      0.2,
    );
  },

  underwater(L, out) {
    const lp = filt('lowpass', 260, 2);
    chain(noise(L, 'brown'), lp, gain(0.9), out);
    chain(osc(L, 'sine', 0.08), gain(90), lp.frequency);
    sched(
      L,
      () => (Math.random() < 0.3 ? rand(0.03, 0.1) : rand(0.4, 2)),
      (t) => {
        const f = rand(160, 420);
        tone(out, t, f, rand(0.08, 0.18), rand(0.03, 0.08), {
          fEnd: f * rand(1.6, 2.6),
          attack: 0.01,
        });
      },
    );
  },

  // ---------- outdoors ----------
  wind(L, out) {
    const bp = filt('bandpass', 500, 0.9);
    const g = gain(0.6);
    chain(noise(L, 'pink'), bp, g, out);
    const whistle = filt('bandpass', 1800, 3);
    const g2 = gain(0.05);
    chain(noise(L, 'white'), whistle, g2, out);
    sched(
      L,
      () => rand(1.5, 3.5),
      (t) => {
        bp.frequency.setTargetAtTime(rand(250, 950), t, 1.2);
        g.gain.setTargetAtTime(rand(0.3, 1.2), t, 1.4);
        whistle.frequency.setTargetAtTime(rand(1200, 2600), t, 1);
        g2.gain.setTargetAtTime(rand(0, 0.08), t, 1.2);
      },
    );
  },

  fire(L, out) {
    chain(noise(L, 'brown'), filt('lowpass', 450), gain(0.7), out);
    sched(
      L,
      () => (Math.random() < 0.18 ? rand(0.005, 0.04) : rand(0.06, 0.45)),
      (t) => {
        burst(out, t, rand(0.003, 0.014), rand(0.15, 0.7), 'highpass', rand(1400, 4500), 0.7);
        if (Math.random() < 0.08) {
          burst(out, t, rand(0.03, 0.07), rand(0.3, 0.6), 'bandpass', rand(200, 500), 2, 'brown');
        }
      },
    );
  },

  birds(L, out) {
    sched(
      L,
      () => rand(1.2, 5),
      (t) => {
        const p = panner(rand(-0.8, 0.8));
        chain(p, gain(1), out);
        const n = Math.floor(rand(2, 6));
        const base = rand(2400, 4600);
        const up = Math.random() < 0.5;
        for (let i = 0; i < n; i++) {
          const f = base * rand(0.92, 1.08);
          tone(p, t + i * rand(0.09, 0.16), f, rand(0.06, 0.13), rand(0.05, 0.11), {
            fEnd: up ? f * rand(1.2, 1.5) : f * rand(0.6, 0.8),
          });
        }
        disconnectLater(p, t, 3);
      },
      0.3,
    );
  },

  crickets(L, out) {
    const voices: [freq: number, pan: number][] = [
      [4400, -0.5],
      [4700, 0.55],
      [4150, 0.1],
    ];
    voices.forEach(([f, pan], k) => {
      const p = panner(pan);
      chain(p, out);
      sched(
        L,
        () => rand(0.45, 1.1),
        (t) => {
          const n = Math.floor(rand(3, 5));
          for (let i = 0; i < n; i++) tone(p, t + i * 0.045, f, 0.03, 0.045, { attack: 0.004 });
        },
        rand(0, 0.6) + k * 0.2,
      );
    });
  },

  frogs(L, out) {
    const voices: [pan: number, pitch: number][] = [
      [-0.6, 1],
      [0.5, 1.25],
      [0.05, 0.85],
    ];
    voices.forEach(([pan, m], k) => {
      const p = panner(pan);
      const bp = filt('bandpass', 700 * m, 3);
      chain(bp, p, out);
      sched(
        L,
        () => rand(0.6, 2.6),
        (t) => {
          const n = Math.floor(rand(2, 5));
          const f = rand(90, 140) * m;
          for (let i = 0; i < n; i++) {
            tone(bp, t + i * 0.034, f, 0.028, 0.35, { type: 'sawtooth', attack: 0.004 });
          }
        },
        rand(0, 1) + k * 0.4,
      );
    });
  },

  owl(L, out) {
    const e = echo(out, 0.33, 0.35, 1500);
    const p = panner(rand(-0.5, 0.5));
    chain(p, e);
    const patterns = [
      [0, 0.75, 1.05, 1.55],
      [0, 0.55],
      [0, 0.8, 1.3],
    ];
    sched(
      L,
      () => rand(7, 16),
      (t) => {
        const f = rand(340, 400);
        const pat = pick(patterns);
        pat.forEach((offset, i) => {
          const last = i === pat.length - 1;
          tone(p, t + offset, f * (last ? 0.94 : 1), last ? 0.75 : 0.42, 0.12, {
            fEnd: f * 0.9,
            attack: 0.07,
          });
        });
      },
      rand(1, 3),
    );
  },

  // ---------- cosy indoors ----------
  purr(L, out) {
    const bp = filt('bandpass', 150, 1.5);
    const am = gain(0.5);
    const g = gain(0);
    chain(noise(L, 'brown'), bp, am, g, out);
    chain(osc(L, 'sine', 24), gain(0.5), am.gain);
    // One breath: louder purr in, short dip, softer purr out.
    sched(
      L,
      () => rand(2.2, 2.8),
      (t) => {
        g.gain.setTargetAtTime(2.2, t, 0.15);
        g.gain.setTargetAtTime(0.6, t + 1, 0.2);
        g.gain.setTargetAtTime(1.8, t + 1.3, 0.15);
        g.gain.setTargetAtTime(0.2, t + 2.05, 0.12);
        bp.frequency.setTargetAtTime(170, t, 0.2);
        bp.frequency.setTargetAtTime(130, t + 1.2, 0.2);
      },
      0.1,
    );
  },

  heartbeat(L, out) {
    const lp = filt('lowpass', 160);
    chain(lp, gain(1.6), out);
    sched(
      L,
      () => rand(0.98, 1.04),
      (t) => {
        tone(lp, t, 62, 0.16, 0.9, { fEnd: 42, attack: 0.01 });
        tone(lp, t + 0.27, 55, 0.14, 0.6, { fEnd: 38, attack: 0.01 });
      },
    );
  },

  clock(L, out) {
    let k = 0;
    const e = echo(out, 0.09, 0.2, 3000);
    sched(
      L,
      () => 1,
      (t) => {
        const tick = k++ % 2 === 0;
        burst(e, t, 0.012, 0.35, 'bandpass', tick ? 3200 : 2500, 4);
        tone(e, t, tick ? 1900 : 1500, 0.03, 0.05, { type: 'triangle', attack: 0.001 });
      },
    );
  },

  train(L, out) {
    const g = gain(0.9);
    chain(noise(L, 'brown'), filt('lowpass', 320), g, out);
    chain(osc(L, 'sine', 0.13), gain(0.15), g.gain);
    chain(noise(L, 'pink'), filt('bandpass', 1200, 0.7), gain(0.06), out);
    // Clickety-clack: two wheels over each rail joint.
    sched(
      L,
      () => rand(1.55, 1.7),
      (t) => {
        for (const o of [0, 0.13]) {
          burst(out, t + o, 0.06, 1.4, 'bandpass', rand(500, 800), 1.5, 'brown');
          burst(out, t + o, 0.02, 0.12, 'bandpass', 2200, 2);
        }
      },
      0.3,
    );
  },

  plane(L, out) {
    chain(noise(L, 'brown'), filt('lowpass', 380), gain(0.9), out);
    chain(noise(L, 'pink'), filt('bandpass', 550, 0.8), gain(0.35), out);
    chain(noise(L, 'white'), filt('bandpass', 3000, 1), gain(0.03), out);
    chain(osc(L, 'sine', 96), gain(0.012), out);
  },

  fan(L, out) {
    chain(noise(L, 'pink'), filt('lowpass', 850), gain(0.75), out);
    chain(osc(L, 'sine', 118), gain(0.025), out);
    chain(noise(L, 'white'), filt('bandpass', 2400, 4), gain(0.06), out);
  },

  // ---------- tones ----------
  chimes(L, out) {
    const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
    sched(
      L,
      () => rand(0.6, 4.5),
      (t) => {
        const f = pick(notes);
        const p = panner(rand(-0.7, 0.7));
        chain(p, out);
        tone(p, t, f, rand(3, 5), 0.12, { attack: 0.003 });
        tone(p, t, f * 2.76, 1.5, 0.035, { attack: 0.003 });
        tone(p, t, f * 5.4, 0.6, 0.012, { attack: 0.003 });
        disconnectLater(p, t, 6);
      },
      0.2,
    );
  },

  bowl(L, out) {
    // Slightly detuned partial pairs give the slow beating of a real bowl.
    const partials = [
      [1, 0.22, 10],
      [1.004, 0.14, 10],
      [2.76, 0.08, 7],
      [2.765, 0.05, 7],
      [5.4, 0.025, 3.5],
    ];
    sched(
      L,
      () => rand(9, 15),
      (t) => {
        const f = pick([174.6, 196, 220, 246.9]);
        for (const [m, g, d] of partials) tone(out, t, f * m, d, g, { attack: 0.02 });
      },
      0.15,
    );
  },

  drone(L, out) {
    const lp = filt('lowpass', 380, 1.5);
    chain(lp, gain(0.18), out);
    const voices: [number, OscillatorType][] = [
      [55, 'sawtooth'],
      [55.35, 'sawtooth'],
      [82.4, 'triangle'],
      [110.2, 'sine'],
    ];
    for (const [f, type] of voices) chain(osc(L, type, f), gain(0.25), lp);
    chain(osc(L, 'sine', 0.045), gain(160), lp.frequency);
  },

  theta(L, out) {
    // 200 Hz left, 206 Hz right: a 6 Hz binaural beat.
    const merger = ctx().createChannelMerger(2);
    merger.connect(out);
    const left = gain(0.12);
    const right = gain(0.12);
    osc(L, 'sine', 200).connect(left);
    osc(L, 'sine', 206).connect(right);
    left.connect(merger, 0, 0);
    right.connect(merger, 0, 1);
  },

  // ---------- lullabies ----------
  musicbox(L, out) {
    const e = echo(out, 0.29, 0.38, 4000);
    melody(
      L,
      'E4:1 E4:1 G4:3 E4:1 E4:2 G4:4 E4:1 G4:1 C5:2 B4:3 A4:1 A4:2 G4:2 D4:1 E4:1 F4:2 D4:2 D4:1 E4:1 F4:4 D4:1 F4:1 B4:1 A4:1 G4:2 B4:2 C5:4 C4:1 C4:1 C5:4 A4:1 F4:1 G4:4 E4:1 C4:1 F4:2 G4:2 A4:2 G4:4 C4:1 C4:1 C5:4 A4:1 F4:1 G4:4 E4:1 C4:1 F4:2 E4:2 D4:2 C4:6',
      0.3,
      (t, f) => {
        f *= 2;
        tone(e, t, f, 1.6, 0.07, { attack: 0.002 });
        tone(e, t, f * 2, 0.6, 0.02, { attack: 0.002 });
        tone(e, t, f * 3, 0.25, 0.01, { attack: 0.002 });
      },
      6,
    );
  },

  twinkle(L, out) {
    const e = echo(out, 0.36, 0.32, 2600);
    melody(
      L,
      'C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2',
      0.7,
      (t, f) => {
        tone(e, t, f, 2.4, 0.09, { type: 'triangle', attack: 0.006 });
        tone(e, t, f / 2, 2.8, 0.04, { attack: 0.01 });
        tone(e, t, f * 2, 0.6, 0.012, { attack: 0.004 });
      },
      4,
    );
  },

  harp(L, out) {
    const e = echo(out, 0.31, 0.35, 3000);
    // I–vi–IV–V, as MIDI notes, played up and down.
    const progression = [
      [48, 52, 55, 60, 64, 67],
      [45, 48, 52, 57, 60, 64],
      [41, 45, 48, 53, 57, 60],
      [43, 47, 50, 55, 59, 62],
    ];
    const order = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];
    let chord = 0;
    let step = 0;
    sched(
      L,
      () => 0.26,
      (t) => {
        const f = midiFreq(progression[chord][order[step]] + 12);
        tone(e, t, f, 1.6, 0.08, { type: 'triangle', attack: 0.002 });
        tone(e, t, f * 2, 0.5, 0.02, { attack: 0.002 });
        if (++step >= order.length) {
          step = 0;
          chord = (chord + 1) % progression.length;
        }
      },
      0.2,
    );
  },

  lullaby(L, out) {
    const e = echo(out, 0.38, 0.4, 2200);
    const notes = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];
    let i = 3;
    // A random walk over the C pentatonic scale, mostly in small steps.
    sched(
      L,
      () => pick([0.6, 0.6, 0.9, 1.2]),
      (t) => {
        i = Math.max(0, Math.min(notes.length - 1, i + pick([-2, -1, -1, 0, 1, 1, 2])));
        const f = notes[i];
        tone(e, t, f, 1.8, 0.09, { type: 'triangle', attack: 0.004 });
        tone(e, t, f * 2, 0.8, 0.025, { attack: 0.004 });
        if (Math.random() < 0.25) tone(e, t, f / 2, 2.5, 0.05, { attack: 0.004 });
      },
      0.2,
    );
  },

  // ---------- noise ----------
  white(L, out) {
    chain(noise(L, 'white'), filt('lowpass', 9500), gain(0.22), out);
  },
  pink(L, out) {
    chain(noise(L, 'pink'), gain(0.55), out);
  },
  brown(L, out) {
    chain(noise(L, 'brown'), gain(1), out);
  },
};
