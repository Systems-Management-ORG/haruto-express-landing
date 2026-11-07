import { getLocale } from "next-intl/server";
import { NotFoundView } from "@/modules/landing/components/not-found-view";
import { SiteFooter } from "@/modules/landing/components/site-footer";
import { SiteHeader } from "@/modules/landing/components/site-header";

export default async function NotFound() {
  const homeHref = `/${await getLocale()}`;
  return (
    <>
      <SiteHeader homeHref={homeHref} solid />
      <main id="main">
        <NotFoundView homeHref={homeHref} />
      </main>
      <SiteFooter homeHref={homeHref} />
    </>
  );
}
