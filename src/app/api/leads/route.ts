import { NextResponse } from "next/server";

// Consultation requests from the contact form. The lead is validated here, then forwarded to the
// Google Apps Script web app that appends it to the HARUTO leads sheet (scripts/google-sheets).
// The webhook URL and its shared secret stay server-side, in the environment.

export const dynamic = "force-dynamic";

type Lead = {
  kind: "PERSONAL" | "BUSINESS";
  fullName: string;
  company: string;
  phone: string;
  email: string;
  direction: "VN_JP" | "JP_VN";
  weightKg: number | null;
  description: string;
  locale: string;
  page: string;
};

const LIMITS = { fullName: 120, company: 160, phone: 30, email: 160, description: 2000, page: 200 };

// Best-effort flood guard per server instance: at most 5 requests per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const str = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function parse(body: Record<string, unknown>): Lead | null {
  const lead: Lead = {
    kind: body.kind === "BUSINESS" ? "BUSINESS" : "PERSONAL",
    fullName: str(body.fullName, LIMITS.fullName),
    company: str(body.company, LIMITS.company),
    phone: str(body.phone, LIMITS.phone),
    email: str(body.email, LIMITS.email),
    direction: body.direction === "JP_VN" ? "JP_VN" : "VN_JP",
    weightKg: null,
    description: str(body.description, LIMITS.description),
    locale: ["vi", "ja", "en"].includes(String(body.locale)) ? String(body.locale) : "vi",
    page: str(body.page, LIMITS.page),
  };
  const weight = Number(body.weightKg);
  if (body.weightKg !== "" && body.weightKg !== undefined && Number.isFinite(weight) && weight >= 0 && weight < 100000) {
    lead.weightKg = Math.round(weight * 10) / 10;
  }

  if (!lead.fullName || !/^[+()\d\s.-]{8,20}$/.test(lead.phone)) return null;
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return null;
  if (lead.kind === "BUSINESS" && !lead.company) return null;
  if (body.privacyConsent !== true) return null;
  return lead;
}

export async function POST(request: Request) {
  const url = process.env.LEADS_WEBHOOK_URL;
  const secret = process.env.LEADS_WEBHOOK_SECRET;
  if (!url || !secret) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: a hidden field people never see; bots that fill it get a silent success.
  if (typeof body.website === "string" && body.website.trim() !== "") return NextResponse.json({ ok: true });

  const lead = parse(body);
  if (!lead) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  try {
    // Apps Script answers a POST with a redirect to the result; fetch follows it.
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, lead }),
      signal: AbortSignal.timeout(15000),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    if (!response.ok || !result?.ok) throw new Error(`sheet rejected the lead (${response.status})`);
  } catch (error) {
    console.error("[leads] forward failed:", error);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
