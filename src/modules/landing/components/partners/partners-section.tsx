import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { SectionHead } from "@/shared/ui/section-head";
import { CarrierList } from "./carrier-list";
import { MarketplaceMarquee } from "./marketplace-marquee";

type Block = "marketplaces" | "carriers";

// Japanese stores (marquee) and/or carriers inside Japan. With both, one H2 over two H3 blocks
// (carrier names drop to H4); carriers alone take the H2 themselves. `compact` is the slimmer
// padding of a logo strip (home page).
export function PartnersSection({
  show,
  bg = "ivory",
  compact = false,
}: {
  show: Block[];
  bg?: "ivory" | "sage";
  compact?: boolean;
}) {
  const t = useTranslations("partners");
  const locale = useLocale() as Locale;
  const both = show.includes("marketplaces") && show.includes("carriers");
  const className = [compact ? "py-12 lg:py-16" : "section", bg === "sage" ? "bg-sage" : ""].filter(Boolean).join(" ");

  if (!both && show.includes("carriers")) {
    return (
      <section id="partners" className={className}>
        <div className="wrap">
          <SectionHead title={t("carriers.title")} intro={t("carriers.intro")} />
          <div className="mt-10 lg:mt-12">
            <CarrierList />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="partners" className={className}>
      <div className="wrap">
        {both && <SectionHead title={t("title")} intro={t("intro")} />}
        {/* grid-cols-1 = minmax(0, 1fr): the marquee track is max-content wide and must not
            stretch the column (and with it the carrier cards and the page). */}
        <div className={both ? "mt-10 grid grid-cols-1 gap-10 lg:mt-12" : "grid grid-cols-1 gap-10"}>
          {show.includes("marketplaces") && (
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 data-reveal className="text-xl text-forest">
                  {t("marketplaces.title")}
                </h3>
                <Link href={pagePath(locale, "concierge")} className="link-arrow text-forest">
                  {t("marketplaces.cta")}
                  <ArrowRight size={18} aria-hidden className="m-arrow" />
                </Link>
              </div>
              <div className="mt-4">
                <MarketplaceMarquee label={t("marketplaces.title")} />
              </div>
            </div>
          )}
          {both && (
            <div>
              <h3 data-reveal className="text-xl text-forest">
                {t("carriers.title")}
              </h3>
              <p data-reveal className="mt-2 max-w-[44rem] text-muted">
                {t("carriers.intro")}
              </p>
              <div className="mt-6">
                <CarrierList heading="h4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
