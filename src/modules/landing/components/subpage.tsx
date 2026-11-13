import { notFound } from "next/navigation";
import type { PageKey } from "@/shared/seo/pages";
import { isInfoKey } from "../info-pages";
import { isServiceKey } from "../service-copy";
import { InfoPage } from "./info/info-page";
import { ServicePage } from "./service/service-page";

// Every subpage renders from one of two templates: the six service pages from ServicePage
// (service-pages.ts), the info pages from InfoPage (info-pages.ts).
export function SubPage({ page }: { page: Exclude<PageKey, "home"> }) {
  if (isServiceKey(page)) {
    return (
      <main id="main">
        <ServicePage page={page} />
      </main>
    );
  }
  if (isInfoKey(page)) {
    return (
      <main id="main">
        <InfoPage page={page} />
      </main>
    );
  }
  notFound();
}
