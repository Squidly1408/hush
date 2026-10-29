// Renders the crescent-moon app icons to public/icons as PNGs, with no image dependencies.
// Run with `npm run icons` after changing the design; the outputs are committed.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
const BG_TOP = [0x14, 0x1b, 0x33];
const BG_BOTTOM = [0x0e, 0x13, 0x22];
const MOON = [0xf3, 0xc4, 0x8e];
const SS = 4; // supersamples per axis

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Coverage (0–1) of shape(u, v) over the pixel, in unit coordinates. */
function coverage(px, py, size, shape) {
  let hits = 0;
  for (let i = 0; i < SS; i++)
    for (let j = 0; j < SS; j++)
      if (shape((px + (i + 0.5) / SS) / size, (py + (j + 0.5) / SS) / size)) hits++;
  return hits / (SS * SS);
}

const inCircle = (u, v, cx, cy, r) => (u - cx) ** 2 + (v - cy) ** 2 <= r * r;
// Crescent sized to sit inside the maskable safe zone (central 80%).
const moon = (u, v) => inCircle(u, v, 0.5, 0.5, 0.28) && !inCircle(u, v, 0.62, 0.42, 0.24);
function roundedSquare(u, v, radius) {
  const dx = Math.max(radius - u, 0, u - (1 - radius));
  const dy = Math.max(radius - v, 0, v - (1 - radius));
  return dx * dx + dy * dy <= radius * radius;
}

function render(size, { rounded }) {
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    const k = y / (size - 1);
    const bg = BG_TOP.map((c, i) => Math.round(c + (BG_BOTTOM[i] - c) * k));
    for (let x = 0; x < size; x++) {
      const m = coverage(x, y, size, moon);
      const a = rounded ? coverage(x, y, size, (u, v) => roundedSquare(u, v, 0.22)) : 1;
      const o = (y * size + x) * 4;
      for (let i = 0; i < 3; i++) buf[o + i] = Math.round(bg[i] * (1 - m) + MOON[i] * m);
      buf[o + 3] = Math.round(a * 255);
    }
  }
  return png(size, buf);
}

mkdirSync(OUT, { recursive: true });
const icons = [
  ['icon-192.png', 192, { rounded: true }],
  ['icon-512.png', 512, { rounded: true }],
  ['maskable-512.png', 512, { rounded: false }],
  ['apple-touch-icon.png', 180, { rounded: false }],
];
for (const [name, size, opts] of icons) {
  writeFileSync(join(OUT, name), render(size, opts));
  console.log(`wrote public/icons/${name}`);
}
