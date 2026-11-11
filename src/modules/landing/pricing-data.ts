// Rate tiers as numbers, the source for structured data (Service offers) and, later, the
// shipping calculator (S10). The rate tables people read still render the strings in
// `pricing.*` of the messages; `node scripts/check-pricing-data.mjs` checks that every row
// there matches a tier here, in every locale, so the two cannot drift apart.
//
// Keep this file free of path aliases and non-erasable TypeScript: the check script imports it
// directly with Node's type stripping.

export type Tier = {
  minKg: number;
  maxKg: number | null; // null = no upper bound
  vndPerKg: number | null; // null = negotiated case by case
  perParcelFee?: number; // VND per parcel, on top of the per-kg rate
};

// Vietnam → Japan, clean goods (fashion, household goods, furniture, machinery…).
// 21–50 kg tier confirmed by the business (B2, 2026-11-11).
export const VN_JP_CLEAN: Tier[] = [
  { minKg: 1, maxKg: 5, vndPerKg: 130_000, perParcelFee: 200_000 },
  { minKg: 6, maxKg: 9, vndPerKg: 125_000 },
  { minKg: 10, maxKg: 20, vndPerKg: 105_000 },
  { minKg: 21, maxKg: 50, vndPerKg: 95_000 },
  { minKg: 50, maxKg: 100, vndPerKg: 89_000 },
  { minKg: 100, maxKg: 200, vndPerKg: 88_000 },
  { minKg: 200, maxKg: 500, vndPerKg: 85_000 },
  { minKg: 500, maxKg: null, vndPerKg: null },
];

// Vietnam → Japan, mixed goods (food, clothing, footwear…). Published up to 30 kg.
// TODO(B2): pricing above 30 kg is not published.
export const VN_JP_MIXED: Tier[] = [
  { minKg: 1, maxKg: 1, vndPerKg: 390_000 },
  { minKg: 2, maxKg: 2, vndPerKg: 260_000 },
  { minKg: 3, maxKg: 3, vndPerKg: 215_000 },
  { minKg: 4, maxKg: 4, vndPerKg: 185_000 },
  { minKg: 5, maxKg: 5, vndPerKg: 170_000 },
  { minKg: 6, maxKg: 6, vndPerKg: 150_000 },
  { minKg: 7, maxKg: 9, vndPerKg: 140_000 },
  { minKg: 10, maxKg: 10, vndPerKg: 135_000 },
  { minKg: 11, maxKg: 14, vndPerKg: 125_000 },
  { minKg: 15, maxKg: 20, vndPerKg: 120_000 },
  { minKg: 21, maxKg: 25, vndPerKg: 108_000 },
  { minKg: 26, maxKg: 30, vndPerKg: 105_000 },
];

// Japan → Vietnam air freight: one rate for every weight.
export const JP_VN: Tier[] = [{ minKg: 0, maxKg: null, vndPerKg: 155_000 }];

// Lowest published per-kg rate in a set of tiers (negotiated tiers excluded).
export function lowestRate(tiers: Tier[]): Tier {
  const priced = tiers.filter((tier) => tier.vndPerKg != null);
  return priced.reduce((low, tier) => ((tier.vndPerKg ?? Infinity) < (low.vndPerKg ?? Infinity) ? tier : low));
}
