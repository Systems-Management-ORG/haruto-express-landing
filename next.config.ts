import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

// Statically generated pages cannot carry a per-request nonce, so Next's inline scripts need
// 'unsafe-inline'. Everything else stays limited to this origin.
// Google Tag Manager loads the container and GA4 beacons from these hosts.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self'",
  `connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com${isDev ? " ws:" : ""}`,
  // Google Maps embeds (warehouse location) render in an iframe from these hosts.
  "frame-src https://www.googletagmanager.com https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
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
