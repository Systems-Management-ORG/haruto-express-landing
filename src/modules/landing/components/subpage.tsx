import type { ReactNode } from "react";
import { InfoHero } from "@/shared/ui/info-hero";
import { RelatedLinks } from "@/shared/components/related-links";
import type { PageKey } from "@/shared/seo/pages";
import { isServiceKey } from "../service-copy";
import { Contact, ContactGuide } from "./contact";
import { Faq } from "./faq";
import { Policy } from "./policy";
import { Pricing, Surcharges } from "./pricing";
import { ServicePage } from "./service/service-page";

// The body shown under the InfoHero for the non-service subpages. /bang-gia carries both
// directions' rate tables plus surcharges and the weight rules. The six service pages render
// from one template instead (service/service-page.tsx).
function body(key: PageKey): ReactNode {
  switch (key) {
    case "pricing":
      return (
        <>
          <Pricing direction="vnJp" heading="direction" withSurcharges={false} />
          <div className="bg-sage">
            <Pricing direction="jpVn" heading="direction" withSurcharges={false} />
          </div>
          <Surcharges plain />
          <Policy show={["weight"]} withHeader={false} />
        </>
      );
    case "policy":
      return <Policy show={["weight", "compensation"]} withHeader={false} />;
    case "japanWarehouse":
      return <Policy show={["warehouse"]} withHeader={false} />;
    case "faq":
      return <Faq page="faq" />;
    case "contact":
      return (
        <>
          <Contact withMap />
          <ContactGuide />
        </>
      );
    default:
      return null;
  }
}

export function SubPage({ page }: { page: Exclude<PageKey, "home"> }) {
  if (isServiceKey(page)) {
    return (
      <main id="main">
        <ServicePage page={page} />
      </main>
    );
  }

  return (
    <main id="main">
      <InfoHero page={page} />
      {body(page)}
      {/* The questions tagged for this page (renders nothing when none are). */}
      {page !== "faq" && <Faq page={page} />}
      <RelatedLinks page={page} />
    </main>
  );
}
