export type NoiseType = 'white' | 'pink' | 'brown';

const SECONDS = 6;
const SEAM = 2048;

/** Fills one channel with noise; pink uses Paul Kellet's filter, brown a leaky integrator. */
export function fillNoise(d: Float32Array, type: NoiseType): void {
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0; // prettier-ignore
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    if (type === 'white') {
      d[i] = w;
    } else if (type === 'pink') {
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    } else {
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
  }
  // Crossfade the tail into the head so the buffer loops without a click.
  const len = d.length;
  for (let i = 0; i < SEAM; i++) {
    const k = i / SEAM;
    d[i] = d[i] * k + d[len - SEAM + i] * (1 - k);
  }
}

export function makeNoiseBuffers(ac: BaseAudioContext): Record<NoiseType, AudioBuffer> {
  const make = (type: NoiseType) => {
    const b = ac.createBuffer(2, ac.sampleRate * SECONDS, ac.sampleRate);
    for (let c = 0; c < 2; c++) fillNoise(b.getChannelData(c), type);
    return b;
  };
  return { white: make('white'), pink: make('pink'), brown: make('brown') };
}
