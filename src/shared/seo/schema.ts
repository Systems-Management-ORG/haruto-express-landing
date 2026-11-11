import { SITE_URL } from "./business";
import { PAGES, type PageKey, pagePath } from "./pages";
import type { Locale } from "@/shared/constants/locales";
import type { Tier } from "@/modules/landing/pricing-data";

const ORG_ID = `${SITE_URL}/#organization`;

// A per-kg price offer built from a pricing-data.ts tier, so every number is one the rate tables
// show (checked by scripts/check-pricing-data.mjs).
export function perKgOffer(name: string, tier: Tier) {
  if (tier.vndPerKg == null) throw new Error(`perKgOffer: "${name}" has no published price`);
  return {
    "@type": "Offer",
    name,
    price: tier.vndPerKg,
    priceCurrency: "VND",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: tier.vndPerKg,
      priceCurrency: "VND",
      unitCode: "KGM",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "KGM" },
      // The weight band the rate applies to; left out for a flat rate (any weight).
      ...(tier.minKg || tier.maxKg != null
        ? {
            eligibleQuantity: {
              "@type": "QuantitativeValue",
              minValue: tier.minKg || undefined,
              maxValue: tier.maxKg ?? undefined,
              unitCode: "KGM",
            },
          }
        : {}),
    },
  };
}

// Service offered on a given page (areaServed: Vietnam + Japan, provider → the Organization node).
export function service({
  name,
  description,
  serviceType,
  offers,
}: {
  name: string;
  description: string;
  serviceType: string;
  offers?: ReturnType<typeof perKgOffer>[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "Country", name: "Vietnam" },
      { "@type": "Country", name: "Japan" },
    ],
    ...(offers?.length ? { offers } : {}),
  };
}

// BreadcrumbList from the registry's parent chain (home → … → current).
export function breadcrumb(locale: Locale, key: PageKey, labelFor: (k: PageKey) => string) {
  const chain: PageKey[] = [];
  let cursor: PageKey | undefined = key;
  while (cursor) {
    chain.unshift(cursor);
    cursor = PAGES[cursor].parent;
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: chain.map((k, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: labelFor(k),
      item: `${SITE_URL}${pagePath(locale, k)}`,
    })),
  };
}

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// The contact page: its main entity is the Organization node (hotlines, addresses, sameAs).
export function contactPage({ name, description, url, inLanguage }: { name: string; description: string; url: string; inLanguage: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    description,
    url,
    inLanguage,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": ORG_ID },
  };
}
