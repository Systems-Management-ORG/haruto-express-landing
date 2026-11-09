import { useTranslations } from "next-intl";
import type { PageKey } from "@/shared/seo/pages";
import { Breadcrumbs } from "./breadcrumbs";

// Static hero for a subpage: breadcrumb + the single H1 + a short intro. No carousel.
export function PageHero({ page }: { page: PageKey }) {
  const t = useTranslations(`pages.${page}`);

  return (
    <section className="border-b border-line bg-sage">
      <div className="wrap py-14 lg:py-20">
        <Breadcrumbs page={page} />
        <h1 className="heading-1 mt-4 max-w-[22ch] text-forest">{t("title")}</h1>
        <p className="mt-5 max-w-[46rem] text-base leading-[1.6] sm:text-lg">{t("intro")}</p>
      </div>
    </section>
  );
}
