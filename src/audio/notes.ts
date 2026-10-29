const NOTE_INDEX: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** MIDI note number to frequency in Hz (A4 = 69 = 440 Hz). */
export const midiFreq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** Note name like "C4", "F#3" or "Bb5" to frequency in Hz. */
export function noteFreq(name: string): number {
  const m = name.match(/^([A-G])(#|b)?(\d)$/);
  if (!m) throw new Error(`Bad note name: ${name}`);
  const accidental = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  return midiFreq(NOTE_INDEX[m[1]] + accidental + (Number(m[3]) + 1) * 12);
}

/** Parses "E4:1 G4:3 R:1 …" (note:beats) into [frequency, beats] pairs; a rest "R" has frequency 0. */
export function parseMelody(seq: string): [freq: number, beats: number][] {
  return seq
    .trim()
    .split(/\s+/)
    .map((x) => {
      const [n, d] = x.split(':');
      return [n === 'R' ? 0 : noteFreq(n), Number(d)];
    });
}
