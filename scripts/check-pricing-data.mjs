// Checks that the numeric rate tiers in src/modules/landing/pricing-data.ts match the rate
// tables shown on the site (the `pricing.*` strings in every locale's messages), so structured
// data never states a price the page does not show.
//
// Usage: node scripts/check-pricing-data.mjs   (Node ≥ 22.18 strips the TypeScript types)

import { readFileSync } from "node:fs";
import { JP_VN, VN_JP_CLEAN, VN_JP_MIXED, lowestRate } from "../src/modules/landing/pricing-data.ts";

const LOCALES = ["vi", "ja", "en"];
const errors = [];

// "130.000 VNĐ/kg", "130,000 VND/kg" → 130000; "Thương lượng" / "応相談" → null.
const amount = (text) => {
  const digits = String(text ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
};

// "1 – 5 kg" → [1, 5]; "1 kg" → [1, 1]; "Trên 500 kg" (unpriced, open-ended) → [500, null].
function weightRange(text, priced) {
  const numbers = (String(text).match(/\d+/g) ?? []).map(Number);
  if (numbers.length === 2) return numbers;
  if (numbers.length === 1) return priced ? [numbers[0], numbers[0]] : [numbers[0], null];
  return [null, null];
}

function compare(locale, label, rows, tiers) {
  if (rows.length !== tiers.length) {
    errors.push(`${locale} ${label}: ${rows.length} rows shown, ${tiers.length} tiers in pricing-data.ts`);
    return;
  }
  rows.forEach((row, index) => {
    const tier = tiers[index];
    const price = amount(row.price);
    const [minKg, maxKg] = weightRange(row.weight, price != null);
    const where = `${locale} ${label} row ${index + 1} ("${row.weight}" / "${row.price}")`;
    if (price !== tier.vndPerKg) errors.push(`${where}: price ${price} ≠ ${tier.vndPerKg}`);
    if (minKg !== tier.minKg || maxKg !== tier.maxKg)
      errors.push(`${where}: weight ${minKg}–${maxKg} ≠ ${tier.minKg}–${tier.maxKg}`);
    const fee = row.note ? amount(row.note) : undefined;
    if ((fee ?? undefined) !== tier.perParcelFee) errors.push(`${where}: parcel fee ${fee} ≠ ${tier.perParcelFee}`);
  });
}

for (const locale of LOCALES) {
  const messages = JSON.parse(readFileSync(new URL(`../src/i18n/messages/${locale}.json`, import.meta.url), "utf8"));
  const pricing = messages.pricing;
  compare(locale, "vnJp.clean", pricing.vnJp.clean.rows, VN_JP_CLEAN);
  compare(locale, "vnJp.mixed", pricing.vnJp.mixed.rows, VN_JP_MIXED);

  const freight = amount(pricing.freight.price);
  if (freight !== JP_VN[0].vndPerKg) errors.push(`${locale} freight.price ${freight} ≠ ${JP_VN[0].vndPerKg}`);

  // The teaser's "from" price must be the lowest VN→JP rate; the JP→VN price the flat rate.
  const from = amount(pricing.teaser.vnJp.price);
  const lowest = Math.min(lowestRate(VN_JP_CLEAN).vndPerKg, lowestRate(VN_JP_MIXED).vndPerKg);
  if (from !== lowest) errors.push(`${locale} teaser.vnJp.price ${from} ≠ lowest rate ${lowest}`);
  const jpVn = amount(pricing.teaser.jpVn.price);
  if (jpVn !== JP_VN[0].vndPerKg) errors.push(`${locale} teaser.jpVn.price ${jpVn} ≠ ${JP_VN[0].vndPerKg}`);
}

if (errors.length) {
  console.error(`✖ ${errors.length} pricing mismatch(es):`);
  errors.forEach((error) => console.error(`  • ${error}`));
  process.exitCode = 1;
} else {
  console.log("✓ pricing-data.ts matches the rate tables in vi/ja/en.");
}
