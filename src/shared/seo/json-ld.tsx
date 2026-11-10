import { BUSINESS, HOTLINES, SITE_URL } from "./business";

// Renders a JSON-LD block. Safe under the CSP: it is a data script, not executable JS.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own constants, so there is no untrusted input to escape.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Drops empty fields so unconfirmed business facts never reach structured data.
function prune<T extends Record<string, unknown>>(object: T): T {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => {
      if (value == null || value === "") return false;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    }),
  ) as T;
}

const ORG_ID = `${SITE_URL}/#organization`;

export function organization() {
  const contactPoint = HOTLINES.map((line) => ({
    "@type": "ContactPoint",
    telephone: line.tel,
    contactType: "customer service",
    areaServed: line.country,
  }));

  return prune({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName || undefined,
    url: SITE_URL,
    logo: `${SITE_URL}${BUSINESS.logoPath}`,
    email: BUSINESS.email || undefined,
    contactPoint,
    sameAs: BUSINESS.sameAs,
  });
}

export function website(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS.name,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}
