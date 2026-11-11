import type { ReactNode } from "react";
import { PageHero } from "@/shared/components/page-hero";
import { RelatedLinks } from "@/shared/components/related-links";
import type { PageKey } from "@/shared/seo/pages";
import { AuctionBody, AuctionHero } from "./auction";
import { ConciergeBody, ConciergeHero } from "./concierge";
import { Contact, ContactGuide } from "./contact";
import { CustomsBody, CustomsHero } from "./customs-check";
import { Faq } from "./faq";
import { Fulfillment, FulfillmentHero } from "./fulfillment";
import { Policy } from "./policy";
import { Pricing, Surcharges } from "./pricing";
import { ShipJapanBody, ShipJapanHero } from "./ship-japan";
import { ShipVietnamBody, ShipVietnamHero } from "./ship-vietnam";

// The body shown under the PageHero for each subpage. The two route pages carry that direction's
// full pricing plus the shared policy (weight + compensation); JP→VN has its own poster-style
// page (ship-vietnam.tsx) with rates, surcharges, policy and the Japan warehouse. /bang-gia carries both directions' rate tables plus surcharges and the weight rules.
function body(key: PageKey): ReactNode {
  switch (key) {
    case "shipToJapan":
      return <ShipJapanBody />;
    case "shipToVietnam":
      return <ShipVietnamBody />;
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
      return <CustomsBody />;
    case "policy":
      return <Policy show={["weight", "compensation"]} withHeader={false} />;
    case "concierge":
      return <ConciergeBody />;
    case "auction":
      return <AuctionBody />;
    case "japanWarehouse":
      return <Policy show={["warehouse"]} withHeader={false} />;
    case "business":
      return <Fulfillment />;
    case "faq":
      return <Faq />;
    case "contact":
      return (
        <>
          <Contact withMap />
          <ContactGuide />
        </>
      );
    case "guides":
      return null;
    default:
      return null;
  }
}

export function SubPage({ page }: { page: Exclude<PageKey, "home"> }) {
  return (
    <main id="main">
      {/* The buying and auction services have their own art-led banners; every other page the standard hero. */}
      {page === "shipToJapan" ? (
        <ShipJapanHero />
      ) : page === "concierge" ? (
        <ConciergeHero />
      ) : page === "auction" ? (
        <AuctionHero />
      ) : page === "shipToVietnam" ? (
        <ShipVietnamHero />
      ) : page === "goods" ? (
        <CustomsHero />
      ) : page === "business" ? (
        <FulfillmentHero />
      ) : (
        <PageHero page={page} />
      )}
      {body(page)}
      {/* The questions tagged for this page (renders nothing when none are). */}
      {page !== "faq" && <Faq page={page} />}
      <RelatedLinks page={page} />
    </main>
  );
}
