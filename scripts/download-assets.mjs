import { mkdir, writeFile } from 'node:fs/promises';

// Wikimedia Commons photographs, resized to 960px. See assets/ATTRIBUTION.md.
const files = [
  ['mayo.jpg', 'https://upload.wikimedia.org/wikipedia/commons/5/58/Mayo_scissors.jpg'],
  ['metzenbaum.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/01/Metzenbaum_scissors_04.jpg'],
  ['kocher.jpg', 'https://upload.wikimedia.org/wikipedia/commons/3/32/Kocher%27s_forceps_with_toothed_jaw.jpg'],
  ['mayo-hegar.jpg', 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Naaldvoerder_Mayo-hegar.jpg'],
];
await mkdir(new URL('../assets/instruments/', import.meta.url), { recursive: true });
for (const [name, url] of files) {
  const filename = url.split('/').pop();
  const thumbnail = url.replace('upload.wikimedia.org/wikipedia/commons/', 'thumb.wikimedia.org/wikipedia/commons/thumb/') + `/960px-${filename}`;
  const response = await fetch(thumbnail, { headers: { 'User-Agent': 'OpenLearn-Prototype/1.0 (educational offline catalog)' } });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error(`${name}: not a JPEG`);
  await writeFile(new URL(`../assets/instruments/${name}`, import.meta.url), bytes);
  console.log(`${name}: ${bytes.length} bytes`);
}
