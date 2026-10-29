import { describe, expect, it } from 'vitest';
import { volumeCurve } from '../src/audio/context';
import { fillNoise } from '../src/audio/noise';
import { midiFreq, noteFreq, parseMelody } from '../src/audio/notes';

describe('notes', () => {
  it('maps note names to equal-tempered frequencies', () => {
    expect(noteFreq('A4')).toBeCloseTo(440);
    expect(noteFreq('C4')).toBeCloseTo(261.63, 2);
    expect(noteFreq('F#3')).toBeCloseTo(185, 0);
    expect(noteFreq('Bb4')).toBeCloseTo(noteFreq('A#4'));
    expect(midiFreq(81)).toBeCloseTo(880);
  });

  it('rejects malformed names', () => {
    expect(() => noteFreq('H2')).toThrow();
  });

  it('parses melody strings', () => {
    const m = parseMelody(' A4:1  C5:2 ');
    expect(m).toHaveLength(2);
    expect(m[0][0]).toBeCloseTo(440);
    expect(m[1][1]).toBe(2);
  });
});

describe('noise', () => {
  it.each(['white', 'pink', 'brown'] as const)('%s noise stays within [-1, 1]-ish', (type) => {
    const d = new Float32Array(48_000);
    fillNoise(d, type);
    const peak = d.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
    expect(peak).toBeGreaterThan(0);
    expect(peak).toBeLessThan(1.5);
  });
});

describe('volumeCurve', () => {
  it('is quadratic from 0 to 1', () => {
    expect(volumeCurve(0)).toBe(0);
    expect(volumeCurve(50)).toBe(0.25);
    expect(volumeCurve(100)).toBe(1);
  });
});
