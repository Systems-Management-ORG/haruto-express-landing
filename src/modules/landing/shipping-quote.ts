import {
  JP_VN,
  JP_VN_BULKY,
  type SizeStandard,
  type Tier,
  VN_JP_BULKY,
  VN_JP_CLEAN,
  VN_JP_MIXED,
  VN_JP_SIZE_STANDARD,
} from "./pricing-data";

// Freight estimate for the home/pricing calculator. Every rule here is a published one (the two
// price-policy PDFs, effective 2026-10-01), and the two directions differ:
// - Vietnam → Japan (`pricePolicy.vnJpWeight`): the actual weight, rounded up to the next 0.5 kg for
//   clean and mixed goods alike. No volumetric weight: a parcel over the size standard for its
//   weight, or with a side of 100 cm or more, takes a bulky surcharge (a 220,000 – 800,000 VND
//   range, so it is flagged, not added); over 260 cm or 50 kg → contact us first.
// - Japan → Vietnam (`policy.weight`): L + W + H over 140 cm or over 30 kg → the larger of the
//   actual weight and L × W × H ÷ 6,000; under 1 kg is 1 kg, above that one decimal.
// - tiers: pricing-data.ts. A weight on the boundary of two tiers takes the cheaper rate, and a
//   weight between two tiers (5.5 kg) takes the next one up (owner's decision, 2026-11-14).
// Under 1 kg is 1 kg in every case (the rate tables start at 1 kg). Surcharges by category and VAT
// are not included; the UI says so.

export type Route = "vnJp" | "jpVn";
export type GoodsKind = "clean" | "mixed";
export type Dimensions = { lengthCm: number; widthCm: number; heightCm: number };
// Vietnam → Japan only. contact: over the "check with us first" limit; oversize: over the size
// standard for the weight (the surcharge applies); review: a side of 100 cm or more, or a size
// inside a band the PDF gives as a range (the surcharge may apply).
export type BulkyFlag = "oversize" | "review" | "contact";

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
      bulky?: BulkyFlag;
    }
  | { status: "negotiated" | "unpublished"; billableKg: number; volumetric: boolean; bulky?: BulkyFlag };

// Japan → Vietnam only: a bulky parcel is charged on the larger of actual and volumetric weight.
function chargedWeight(route: Route, actualKg: number, dims?: Dimensions): { kg: number; volumetric: boolean } {
  if (route !== "jpVn" || !dims) return { kg: actualKg, volumetric: false };
  const { lengthCm: l, widthCm: w, heightCm: h } = dims;
  const bulky = l + w + h > JP_VN_BULKY.sumCm || actualKg > JP_VN_BULKY.weightKg;
  const volumetricKg = (l * w * h) / JP_VN_BULKY.volumetricDivisor;
  return bulky && volumetricKg > actualKg ? { kg: volumetricKg, volumetric: true } : { kg: actualKg, volumetric: false };
}

function roundWeight(kg: number, route: Route): number {
  const step = VN_JP_BULKY.roundingStepKg;
  const rounded = route === "jpVn" ? Math.round(kg * 10 + EPS) / 10 : Math.ceil(kg / step - EPS) * step;
  return Math.max(1, rounded);
}

// The size-standard band of a VN→JP weight (VN_JP_SIZE_STANDARD in order): under 10 kg,
// 10 – 20 kg, over 20 up to 30 kg; heavier parcels have no standard.
function sizeBand(kg: number): SizeStandard | undefined {
  const [under10, from10, over20] = VN_JP_SIZE_STANDARD;
  if (kg < under10.maxKg - EPS) return under10;
  if (kg <= from10.maxKg + EPS) return from10;
  if (kg <= over20.maxKg + EPS) return over20;
  return undefined;
}

function bulkyFlag(actualKg: number, dims?: Dimensions): BulkyFlag | undefined {
  const sum = dims ? dims.lengthCm + dims.widthCm + dims.heightCm : 0;
  if (actualKg > VN_JP_BULKY.contactKg + EPS || sum > VN_JP_BULKY.contactSumCm + EPS) return "contact";
  if (!dims) return undefined;
  const band = sizeBand(actualKg);
  if (band && sum > band.maxSumCm[1] + EPS) return "oversize";
  const longSide = Math.max(dims.lengthCm, dims.widthCm, dims.heightCm) >= VN_JP_BULKY.anySideCm - EPS;
  // Within a band given as a range (140 – 150 cm): at or under the low end is within the standard.
  const inRange = band != null && band.maxSumCm[0] < band.maxSumCm[1] && sum > band.maxSumCm[0] + EPS;
  return longSide || inRange ? "review" : undefined;
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
  const charged = chargedWeight(route, actualKg, dims);
  const billableKg = roundWeight(charged.kg, route);
  const bulky = route === "vnJp" ? bulkyFlag(actualKg, dims) : undefined;
  const tiers = route === "jpVn" ? JP_VN : goods === "clean" ? VN_JP_CLEAN : VN_JP_MIXED;
  const tier = pickTier(tiers, billableKg);

  if (!tier) return { status: "unpublished", billableKg, volumetric: charged.volumetric, bulky };
  if (tier.vndPerKg == null) return { status: "negotiated", billableKg, volumetric: charged.volumetric, bulky };

  const freight = Math.round(tier.vndPerKg * billableKg);
  const parcelFee = tier.perParcelFee ?? 0;
  return {
    status: "priced",
    billableKg,
    volumetric: charged.volumetric,
    vndPerKg: tier.vndPerKg,
    freight,
    parcelFee,
    total: freight + parcelFee, // a bulky surcharge (VN→JP) is a range, so it is flagged, never added
    bulky,
  };
}
