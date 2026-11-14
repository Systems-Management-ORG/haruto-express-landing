import { JP_VN, type Tier, VN_JP_CLEAN, VN_JP_MIXED } from "./pricing-data";

// Freight estimate for the home/pricing calculator. Every rule here is a published one:
// - rounding: `pricing.vnJp.roundingRules` (clean: up to the next 0.5 kg; mixed: a remainder of
//   0.1 kg or more adds a kilo) and, for Japan → Vietnam, `policy.weight.rounding` (under 1 kg is
//   1 kg; above, one decimal). Under 1 kg is 1 kg in every case.
// - bulky goods: `policy.weight.bulky` (L + W + H over 140 cm or over 30 kg → the larger of the
//   actual weight and L × W × H ÷ 6,000).
// - tiers: pricing-data.ts. A weight on the boundary of two tiers takes the cheaper rate, and a
//   weight between two tiers (5.5 kg) takes the next one up (owner's decision, 2026-11-14).
// Surcharges by category and VAT are not included; the UI says so.

export type Route = "vnJp" | "jpVn";
export type GoodsKind = "clean" | "mixed";
export type Dimensions = { lengthCm: number; widthCm: number; heightCm: number };

export const VOLUMETRIC_DIVISOR = 6000;
export const BULKY_DIMENSION_SUM_CM = 140;
export const BULKY_WEIGHT_KG = 30;

const EPS = 1e-9;

export type Quote =
  | {
      status: "priced";
      billableKg: number;
      volumetric: boolean; // the volumetric weight was charged instead of the actual one
      vndPerKg: number;
      freight: number;
      parcelFee: number;
      total: number;
    }
  | { status: "negotiated" | "unpublished"; billableKg: number; volumetric: boolean };

function chargedWeight(actualKg: number, dims?: Dimensions): { kg: number; volumetric: boolean } {
  if (!dims) return { kg: actualKg, volumetric: false };
  const { lengthCm: l, widthCm: w, heightCm: h } = dims;
  const bulky = l + w + h > BULKY_DIMENSION_SUM_CM || actualKg > BULKY_WEIGHT_KG;
  const volumetricKg = (l * w * h) / VOLUMETRIC_DIVISOR;
  return bulky && volumetricKg > actualKg ? { kg: volumetricKg, volumetric: true } : { kg: actualKg, volumetric: false };
}

function roundWeight(kg: number, route: Route, goods: GoodsKind): number {
  let rounded: number;
  if (route === "jpVn") {
    rounded = Math.round(kg * 10 + EPS) / 10;
  } else if (goods === "clean") {
    rounded = Math.ceil(kg * 2 - EPS) / 2;
  } else {
    const whole = Math.floor(kg + EPS);
    rounded = kg - whole >= 0.1 - EPS ? whole + 1 : whole;
  }
  return Math.max(1, rounded);
}

// Tiers containing the weight → the cheapest priced one (or the negotiated one); none → the next
// tier up; past the last published tier → null.
function pickTier(tiers: Tier[], kg: number): Tier | null {
  const containing = tiers.filter((t) => kg >= t.minKg - EPS && (t.maxKg == null || kg <= t.maxKg + EPS));
  const priced = containing.filter((t) => t.vndPerKg != null);
  if (priced.length) return priced.reduce((low, t) => ((t.vndPerKg ?? Infinity) < (low.vndPerKg ?? Infinity) ? t : low));
  if (containing.length) return containing[0];
  return tiers.find((t) => t.minKg > kg) ?? null;
}

export function quote(route: Route, goods: GoodsKind, actualKg: number, dims?: Dimensions): Quote {
  const charged = chargedWeight(actualKg, dims);
  const billableKg = roundWeight(charged.kg, route, goods);
  const tiers = route === "jpVn" ? JP_VN : goods === "clean" ? VN_JP_CLEAN : VN_JP_MIXED;
  const tier = pickTier(tiers, billableKg);

  if (!tier) return { status: "unpublished", billableKg, volumetric: charged.volumetric };
  if (tier.vndPerKg == null) return { status: "negotiated", billableKg, volumetric: charged.volumetric };

  const freight = Math.round(tier.vndPerKg * billableKg);
  const parcelFee = tier.perParcelFee ?? 0;
  return {
    status: "priced",
    billableKg,
    volumetric: charged.volumetric,
    vndPerKg: tier.vndPerKg,
    freight,
    parcelFee,
    total: freight + parcelFee,
  };
}
