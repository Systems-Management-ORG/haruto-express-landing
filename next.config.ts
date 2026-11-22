import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

// Statically generated pages cannot carry a per-request nonce, so Next's inline scripts need
// 'unsafe-inline'. Everything else stays limited to this origin.
// Google Tag Manager loads the container; GA4 (with Google signals) and the Google Ads conversion
// tag send beacons to the hosts below. `*.analytics.google.com` does not cover the apex
// analytics.google.com, so both are listed. Google Ads audience pings go to the visitor's
// country Google domain (google.com.vn, google.co.jp).
const GOOGLE_TAG_HOSTS = [
  "https://*.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://analytics.google.com",
  "https://*.analytics.google.com",
  "https://www.google.com",
  "https://www.google.com.vn",
  "https://www.google.co.jp",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net",
  "https://*.g.doubleclick.net",
].join(" ");

// The header's sign-in modal shows the auth-portal in an iframe (src/shared/lib/auth-portal.ts, same switch).
function authPortalOrigin(): string {
  if (process.env.NEXT_PUBLIC_LOGIN_ENABLED?.trim().toLowerCase() !== "true") return "";
  try {
    return new URL((process.env.NEXT_PUBLIC_AUTH_PORTAL_URL ?? "").trim()).origin;
  } catch {
    return "";
  }
}
const AUTH_PORTAL_FRAME = authPortalOrigin() ? ` ${authPortalOrigin()}` : "";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: ${GOOGLE_TAG_HOSTS}`,
  "font-src 'self'",
  `connect-src 'self' ${GOOGLE_TAG_HOSTS}${isDev ? " ws:" : ""}`,
  // Google Maps embeds (warehouse location) render in an iframe from these hosts; the Ads tag
  // also opens hidden doubleclick frames for conversion measurement.
  `frame-src https://www.googletagmanager.com https://www.google.com https://maps.google.com https://td.doubleclick.net https://bid.g.doubleclick.net${AUTH_PORTAL_FRAME}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // The Docker build sets NEXT_OUTPUT=standalone and runs the self-contained server from .next/standalone;
  // local `npm run build` / `npm run start` stay unchanged.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  poweredByHeader: false,
  images: {
    // Allow the higher-quality encode the hero banners request; default optimization softens them.
    qualities: [75, 90],
  },
  experimental: {
    // Serves paths the locale routing does not handle, such as a missing file.
    globalNotFound: true,
  },
  // The /bang-gia hub was removed (2026-11-17): its URLs go to the pricing block on the home page.
  async redirects() {
    return [
      { source: "/vi/bang-gia", destination: "/vi#pricing", permanent: true },
      { source: "/ja/pricing", destination: "/ja#pricing", permanent: true },
      { source: "/en/pricing", destination: "/en#pricing", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
