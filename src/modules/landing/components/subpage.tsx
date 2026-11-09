import type { ReactNode } from "react";
import { PageHero } from "@/shared/components/page-hero";
import { RelatedLinks } from "@/shared/components/related-links";
import type { PageKey } from "@/shared/seo/pages";
import { Contact } from "./contact";
import { Faq } from "./faq";
import { Goods } from "./goods";
import { Policy } from "./policy";
import { Pricing } from "./pricing";
import { PricingTeaser } from "./pricing-teaser";
import { Services } from "./services";

// The body shown under the PageHero for each subpage. The two route pages carry that direction's
// full pricing plus the shared policy (weight + compensation); JP→VN also shows concierge and the
// Japan warehouse. /bang-gia is a short overview linking to both routes.
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
      return <PricingTeaser withHeader={false} />;
    case "goods":
      return <Goods />;
    case "policy":
      return <Policy show={["weight", "compensation"]} withHeader={false} />;
    case "concierge":
      return <Policy show={["concierge"]} withHeader={false} />;
    case "japanWarehouse":
      return <Policy show={["warehouse"]} withHeader={false} />;
    case "business":
      return <Services />;
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
      <PageHero page={page} />
      {body(page)}
      <RelatedLinks page={page} />
    </main>
  );
}
