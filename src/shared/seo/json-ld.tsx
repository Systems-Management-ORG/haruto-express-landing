import { BUSINESS, HOTLINES, LOCATIONS, type Location, SITE_URL, mapsUrl } from "./business";

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

function postalAddress(location: Location) {
  return prune({
    "@type": "PostalAddress",
    streetAddress: location.streetAddress,
    addressLocality: location.addressLocality,
    addressRegion: location.addressRegion,
    postalCode: location.postalCode,
    addressCountry: location.addressCountry,
  });
}

// A walk-in location, linked to the Organization. Only built for `publicVisit: true` locations
// (the Hanoi warehouse and HCM office, B4), so a drop-off address is never presented as a shop.
export function localBusiness(location: Location) {
  return prune({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#location-${location.id}`,
    name: `${BUSINESS.name} ${location.addressRegion}`,
    url: SITE_URL,
    image: `${SITE_URL}${BUSINESS.logoPath}`,
    telephone: HOTLINES.find((line) => line.country === location.addressCountry)?.tel,
    address: postalAddress(location),
    geo: location.geo ? { "@type": "GeoCoordinates", ...location.geo } : undefined,
    openingHours: location.openingHours,
    hasMap: mapsUrl(location.query),
    parentOrganization: { "@id": ORG_ID },
  });
}

export const PUBLIC_LOCATIONS = LOCATIONS.filter((location) => location.publicVisit);

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
    address: LOCATIONS.map(postalAddress),
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
