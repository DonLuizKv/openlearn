import { deflateSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';

// Small code-drawn book mark. Reproducible PNGs, no image service required.
const paths = [
  [[.28, .34], [.40, .34], [.50, .40], [.50, .72], [.40, .66], [.28, .66], [.28, .34]],
  [[.50, .40], [.60, .34], [.72, .34], [.72, .66], [.60, .66], [.50, .72]],
];
function distance(x, y, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
}
const table = Array.from({ length: 256 }, (_, value) => {
  for (let i = 0; i < 8; i++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function chunk(type, data) {
  const name = Buffer.from(type);
  let crc = 0xffffffff;
  for (const byte of Buffer.concat([name, data])) crc = table[(crc ^ byte) & 255] ^ (crc >>> 8);
  const length = Buffer.alloc(4), checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length); checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  return Buffer.concat([length, name, data, checksum]);
}
async function generate(name, size, transparent) {
  const bytes = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const px = (x + .5) / size, py = (y + .5) / size;
    let d = Infinity;
    for (const path of paths) for (let i = 1; i < path.length; i++) d = Math.min(d, distance(px, py, path[i - 1], path[i]));
    const coverage = Math.max(0, Math.min(1, (.014 - d) * size + .5));
    const offset = y * (size * 4 + 1) + 1 + x * 4;
    const bg = transparent ? [255, 255, 255] : [44, 102, 81];
    for (let channel = 0; channel < 3; channel++) bytes[offset + channel] = Math.round(bg[channel] + (255 - bg[channel]) * coverage);
    bytes[offset + 3] = transparent ? Math.round(coverage * 255) : 255;
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  await writeFile(new URL(`../assets/${name}`, import.meta.url), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(bytes)), chunk('IEND', Buffer.alloc(0))]));
}
await generate('openlearn-icon.png', 1024, false);
await generate('openlearn-adaptive.png', 1024, true);
await generate('openlearn-favicon.png', 64, false);
console.log('Generated OpenLearn app icons.');
