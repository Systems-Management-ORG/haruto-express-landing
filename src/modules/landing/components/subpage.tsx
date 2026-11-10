import type { ReactNode } from "react";
import { PageHero } from "@/shared/components/page-hero";
import { RelatedLinks } from "@/shared/components/related-links";
import type { PageKey } from "@/shared/seo/pages";
import { ConciergeBody, ConciergeHero } from "./concierge";
import { Contact } from "./contact";
import { Faq } from "./faq";
import { Fulfillment } from "./fulfillment";
import { Goods } from "./goods";
import { Policy } from "./policy";
import { Pricing, Surcharges } from "./pricing";

// The body shown under the PageHero for each subpage. The two route pages carry that direction's
// full pricing plus the shared policy (weight + compensation); JP→VN also shows concierge and the
// Japan warehouse. /bang-gia carries both directions' rate tables plus surcharges and the weight rules.
function body(key: PageKey): ReactNode {
  switch (key) {
    case "shipToJapan":
      return (
        <>
          <Pricing direction="vnJp" />
          <Policy show={["weight", "compensation"]} />
        </>
      );
    case "shipToVietnam":
      return (
        <>
          <Pricing direction="jpVn" />
          <Policy show={["weight", "compensation", "concierge", "warehouse"]} />
        </>
      );
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
    case "goods":
      return <Goods />;
    case "policy":
      return <Policy show={["weight", "compensation"]} withHeader={false} />;
    case "concierge":
      return <ConciergeBody />;
    case "japanWarehouse":
      return <Policy show={["warehouse"]} withHeader={false} />;
    case "business":
      return <Fulfillment />;
    case "faq":
      return <Faq />;
    case "contact":
      return <Contact withMap />;
    case "guides":
      return null;
    default:
      return null;
  }
}

export function SubPage({ page }: { page: Exclude<PageKey, "home"> }) {
  return (
    <main id="main">
      {/* The buying-service page has its own art-directed banner; every other page the standard hero. */}
      {page === "concierge" ? <ConciergeHero /> : <PageHero page={page} />}
      {body(page)}
      <RelatedLinks page={page} />
    </main>
  );
}
