// Builds the 1200×630 share image for every subpage into public/og/<key>.jpg, from the page's
// art in src/shared/seo/page-media.ts (`og` when set, else `src`).
//
// Wide art close to 1.91:1 is cropped to fill (honouring `position`). Anything else is shown
// whole, centred on a blurred, darkened fill of itself, so nothing important is cut off.
//
// Usage: npm run og:build   (sharp is a devDependency; Node ≥ 22.18 strips the TS types)

import { mkdirSync } from "node:fs";
import sharp from "sharp";
import { OG_SIZE, PAGE_IMAGES } from "../src/shared/seo/page-media.ts";

const { width: W, height: H } = OG_SIZE;
const OUT = new URL("../public/og/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const percent = (value, fallback = 0.5) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n / 100 : fallback;
};

async function cover(file, position = "50% 50%") {
  const { width, height } = await sharp(file).metadata();
  const scale = Math.max(W / width, H / height);
  const rw = Math.round(width * scale);
  const rh = Math.round(height * scale);
  const [px, py] = position.split(/\s+/);
  const left = Math.round((rw - W) * percent(px));
  const top = Math.round((rh - H) * percent(py));
  return sharp(file).resize(rw, rh).extract({ left, top, width: W, height: H });
}

async function contain(file) {
  const backdrop = await sharp(file)
    .resize(W, H, { fit: "cover" })
    .blur(28)
    .modulate({ brightness: 0.72 })
    .toBuffer();
  const pad = 36;
  const art = await sharp(file)
    .resize(W - pad * 2, H - pad * 2, { fit: "inside", withoutEnlargement: false })
    .toBuffer();
  return sharp(backdrop).composite([{ input: art, gravity: "centre" }]);
}

for (const [key, image] of Object.entries(PAGE_IMAGES)) {
  const source = image.og ?? image.src;
  const file = new URL(`../public${source}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
  const { width, height } = await sharp(file).metadata();
  const ratio = width / height;
  const fill = ratio >= 1.6 && ratio <= 2.3;
  const pipeline = fill ? await cover(file, image.og ? undefined : image.position) : await contain(file);
  const out = new URL(`${key}.jpg`, OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1");
  await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  console.log(`${key.padEnd(15)} ${fill ? "cover  " : "contain"} ${source}`);
}
