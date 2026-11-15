// Extracts the large embedded images (FlateDecode, 8-bit RGB/Gray, optional SMask) from a PDF
// exported by Google Sheets and writes them as WebP. No new dependency: zlib + sharp (already in
// the project). Used for the price-policy infographics; re-run when the business sends a new PDF.
//
// Usage: node scripts/extract-pdf-images.mjs <file.pdf> <outDir> [minWidth=1000]
// Output: <outDir>/<pdf-name>-obj<id>-<w>x<h>.webp, plus a log line per image.

import { readFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import { inflateSync } from "node:zlib";

const [pdfPath, outDir, minWidthArg] = process.argv.slice(2);
if (!pdfPath || !outDir) {
  console.error("Usage: node scripts/extract-pdf-images.mjs <file.pdf> <outDir> [minWidth=1000]");
  process.exit(1);
}
const minWidth = Number(minWidthArg ?? 1000);
const buf = readFileSync(pdfPath);
const text = buf.toString("latin1"); // 1 char = 1 byte, so string indexes are byte offsets

// Every "N 0 obj << … >> stream … endstream" whose dictionary is an image.
function readObjects() {
  const objects = new Map();
  const re = /(\d+)\s+0\s+obj\s*<<((?:(?!endobj)[\s\S])*?)>>\s*stream\r?\n/g;
  let m;
  while ((m = re.exec(text))) {
    const dict = m[2];
    const start = m.index + m[0].length;
    let end = text.indexOf("endstream", start);
    if (end < 0) continue;
    if (text[end - 1] === "\n") end -= 1;
    if (text[end - 1] === "\r") end -= 1;
    objects.set(Number(m[1]), { dict, start, end });
    re.lastIndex = end;
  }
  return objects;
}

function key(dict, name) {
  const tokens = dict.split(/[\s]+|(?=\/)/).filter(Boolean);
  const i = tokens.indexOf(`/${name}`);
  return i < 0 ? undefined : tokens.slice(i + 1, i + 4);
}

function decode(obj) {
  const raw = buf.subarray(obj.start, obj.end);
  const filter = key(obj.dict, "Filter")?.[0];
  if (filter && filter !== "/FlateDecode") throw new Error(`unsupported filter ${filter}`);
  if (key(obj.dict, "DecodeParms")) throw new Error("predictors are not supported");
  return filter ? inflateSync(raw, { finishFlush: 2 /* Z_SYNC_FLUSH: tolerate trailing bytes */ }) : raw;
}

const objects = readObjects();
const { default: sharp } = await import("sharp");
mkdirSync(outDir, { recursive: true });

// Alpha masks are merged into their image, never written on their own.
const masks = new Set(
  [...objects.values()].map((obj) => key(obj.dict, "SMask")).filter(Boolean).map((ref) => Number(ref[0])),
);

for (const [id, obj] of objects) {
  if (!/\/Subtype\s*\/Image/.test(obj.dict) || masks.has(id)) continue;
  const width = Number(key(obj.dict, "Width")[0]);
  const height = Number(key(obj.dict, "Height")[0]);
  if (width < minWidth) continue;
  if (key(obj.dict, "BitsPerComponent")[0] !== "8") throw new Error(`obj ${id}: only 8-bit images`);
  const space = key(obj.dict, "ColorSpace")[0];
  const channels = space === "/DeviceRGB" ? 3 : space === "/DeviceGray" ? 1 : 0;
  if (!channels) throw new Error(`obj ${id}: unsupported colour space ${space}`);

  let pixels = decode(obj);
  let outChannels = channels;
  const smask = key(obj.dict, "SMask");
  if (smask) {
    const alpha = decode(objects.get(Number(smask[0])));
    const rgba = Buffer.alloc(width * height * 4);
    for (let p = 0; p < width * height; p++) {
      rgba[p * 4] = pixels[p * channels];
      rgba[p * 4 + 1] = pixels[p * channels + (channels === 3 ? 1 : 0)];
      rgba[p * 4 + 2] = pixels[p * channels + (channels === 3 ? 2 : 0)];
      rgba[p * 4 + 3] = alpha[p];
    }
    pixels = rgba;
    outChannels = 4;
  }
  if (pixels.length < width * height * outChannels) throw new Error(`obj ${id}: short image data`);

  const file = join(outDir, `${basename(pdfPath, ".pdf")}-obj${id}-${width}x${height}.webp`);
  const info = await sharp(pixels.subarray(0, width * height * outChannels), { raw: { width, height, channels: outChannels } })
    .webp({ quality: 82 })
    .toFile(file);
  console.log(`${file}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
