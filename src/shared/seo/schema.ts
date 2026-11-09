import { SITE_URL } from "./business";
import { PAGES, type PageKey, pagePath } from "./pages";
import type { Locale } from "@/shared/constants/locales";

const ORG_ID = `${SITE_URL}/#organization`;

// Service offered on a given page (areaServed: Vietnam + Japan, provider → the Organization node).
export function service({
  name,
  description,
  serviceType,
}: {
  name: string;
  description: string;
  serviceType: string;
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
