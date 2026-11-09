import type { ReactNode } from "react";
import { PageHero } from "@/shared/components/page-hero";
import { RelatedLinks } from "@/shared/components/related-links";
import type { PageKey } from "@/shared/seo/pages";
import { Contact } from "./contact";
import { Faq } from "./faq";
import { Goods } from "./goods";
import { Policy } from "./policy";
import { Pricing } from "./pricing";
import { Process } from "./process";
import { Services } from "./services";

// The body shown under the PageHero for each subpage, composed from existing sections so the
// content is proven and consistent. Home is rendered separately as the hub.
function body(key: PageKey): ReactNode {
  switch (key) {
    case "shipToJapan":
      return (
        <>
          <Services />
          <Process />
        </>
      );
    case "shipToVietnam":
      return (
        <>
          <Process />
          <Policy show={["warehouse"]} withHeader={false} />
        </>
      );
    case "pricing":
      return <Pricing />;
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
      return <Contact />;
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
