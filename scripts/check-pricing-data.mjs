// Checks that the numbers in src/modules/landing/pricing-data.ts match the copy shown on the site
// (every locale's messages): the rate tables, the prose that quotes a rate, the surcharge, bulky-
// goods and compensation amounts. Structured data and components read pricing-data.ts, so the
// page never states a price the data does not, and vice versa.
//
// Usage: node scripts/check-pricing-data.mjs   (Node ≥ 22.18 strips the TypeScript types)

import { readFileSync } from "node:fs";
import {
  COMPENSATION,
  JP_VN,
  SURCHARGES,
  VN_JP_BULKY,
  VN_JP_CLEAN,
  VN_JP_MIXED,
  lowestRate,
} from "../src/modules/landing/pricing-data.ts";

const LOCALES = ["vi", "ja", "en"];
// The FAQ question on how rates are calculated, per locale (found by its text, not its index).
const RATE_QUESTION = {
  vi: "Giá cước được tính như thế nào?",
  ja: "運賃はどのように計算されますか？",
  en: "How are shipping rates calculated?",
};
const errors = [];

// "130.000 VNĐ/kg", "130,000 VND/kg" → 130000; "Thương lượng" / "応相談" → null.
const amount = (text) => {
  const digits = String(text ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
};

// 3563 → /3[.,]563/; 3000000 → /3[.,]000[.,]000/ (either thousands separator).
const amountPattern = (n) => new RegExp(`(?<!\\d)${n.toLocaleString("en-US").replace(/,/g, "[.,]")}(?!\\d)`);

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
  const raw = readFileSync(new URL(`../src/i18n/messages/${locale}.json`, import.meta.url), "utf8");
  const messages = JSON.parse(raw);
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

  // Prose that quotes the JP→VN rate: page intros/meta and the FAQ answer about rates. Every
  // "155.000"-style amount (2–3 digits + thousands) in them must be the flat JP→VN rate.
  // Smaller numbers such as the volumetric divisor (6.000) are not amounts and are skipped.
  const prose = {
    "pages.shipToVietnam.intro": messages.pages.shipToVietnam.intro,
    "pages.shipToVietnam.metaTitle": messages.pages.shipToVietnam.metaTitle,
    "pages.shipToVietnam.metaDescription": messages.pages.shipToVietnam.metaDescription,
    "pages.pricing.intro": messages.pages.pricing.intro,
    "pages.pricing.metaDescription": messages.pages.pricing.metaDescription,
    "pages.priceJpVn.intro": messages.pages.priceJpVn.intro,
    "pages.priceJpVn.metaDescription": messages.pages.priceJpVn.metaDescription,
  };
  messages.faq.items.forEach((item, index) => {
    if (item.pages?.includes("pricing")) prose[`faq.items[${index}].answer`] = item.answer;
  });
  for (const [key, text] of Object.entries(prose)) {
    const found = String(text ?? "").match(/\b\d{2,3}[.,]000\b/g) ?? [];
    if (found.length === 0) errors.push(`${locale} ${key}: no JP→VN amount found ("${text}")`);
    for (const match of found) {
      if (amount(match) !== JP_VN[0].vndPerKg) errors.push(`${locale} ${key}: ${match} ≠ ${JP_VN[0].vndPerKg}`);
    }
  }

  // Surcharges: the amounts render from SURCHARGES, so the rows carry no `fee` (except "other",
  // on request), and the rows are exactly SURCHARGES' ids. The foam row's yen prices stay in its
  // text and must match.
  const surcharges = pricing.surcharge.items;
  const shown = Object.keys(surcharges).sort().join(",");
  const data = Object.keys(SURCHARGES).sort().join(",");
  if (shown !== data) errors.push(`${locale} pricing.surcharge.items ids [${shown}] ≠ SURCHARGES [${data}]`);
  for (const [id, row] of Object.entries(surcharges)) {
    if (id !== "other" && "fee" in row) errors.push(`${locale} pricing.surcharge.items.${id}.fee: amount belongs in SURCHARGES`);
  }
  for (const yen of Object.values(SURCHARGES.foam.yenPerBox)) {
    if (!amountPattern(yen).test(surcharges.foam?.item ?? ""))
      errors.push(`${locale} pricing.surcharge.items.foam.item: missing ¥${yen} ("${surcharges.foam?.item}")`);
  }

  // Compensation: the insurance rate and the uninsured cap.
  const compensation = messages.policy.compensation;
  if (!String(compensation.insured.body).includes(`${COMPENSATION.insuranceRatePct}%`))
    errors.push(`${locale} policy.compensation.insured.body: missing ${COMPENSATION.insuranceRatePct}%`);
  for (const key of ["body", "statLabel"]) {
    if (!amountPattern(COMPENSATION.uninsuredCapVnd).test(compensation.uninsured[key]))
      errors.push(`${locale} policy.compensation.uninsured.${key}: missing ${COMPENSATION.uninsuredCapVnd}`);
  }

  // FAQ answers on the VN→JP price-policy page that describe the bulky rule (they quote the
  // any-side limit) must quote the surcharge range from VN_JP_BULKY.
  messages.faq.items.forEach((item, index) => {
    if (!item.pages?.includes("priceVnJp")) return;
    if (!new RegExp(`(?<!\\d)${VN_JP_BULKY.anySideCm}\\s?cm`).test(item.answer)) return;
    for (const vnd of VN_JP_BULKY.surchargeVnd) {
      if (!amountPattern(vnd).test(item.answer)) errors.push(`${locale} faq.items[${index}].answer: missing ${vnd}`);
    }
  });

  // The FAQ answer on how rates are calculated tells the two directions apart: the JP→VN flat rate
  // and the VN→JP 0.5 kg rounding (it shows on the VN→JP page, where there is no volumetric weight).
  const rateQuestion = messages.faq.items.find((item) => item.question === RATE_QUESTION[locale]);
  if (!rateQuestion) errors.push(`${locale} faq: no "${RATE_QUESTION[locale]}"`);
  else {
    if (!/155[.,]000/.test(rateQuestion.answer)) errors.push(`${locale} faq "${RATE_QUESTION[locale]}": missing 155.000`);
    if (!new RegExp(`0[.,]${String(VN_JP_BULKY.roundingStepKg).split(".")[1]}\\s?kg`).test(rateQuestion.answer))
      errors.push(`${locale} faq "${RATE_QUESTION[locale]}": missing the VN→JP ${VN_JP_BULKY.roundingStepKg} kg rounding`);
  }

  // The /bang-gia hub no longer carries the weight rules, so its meta must not promise them.
  if (/cách tính cân|容積重量|weight rules/i.test(messages.pages.pricing.metaDescription))
    errors.push(`${locale} pages.pricing.metaDescription mentions weight rules the hub no longer has`);

  // The old carton fee (25.500) must not come back anywhere.
  if (/25[.,]500/.test(raw)) errors.push(`${locale}: the old carton fee 25.500 is back`);
}

if (errors.length) {
  console.error(`✖ ${errors.length} pricing mismatch(es):`);
  errors.forEach((error) => console.error(`  • ${error}`));
  process.exitCode = 1;
} else {
  console.log("✓ pricing-data.ts matches the rate tables in vi/ja/en.");
}
