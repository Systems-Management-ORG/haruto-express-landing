import { Gavel, Question, Scales, ShieldCheck, Stamp, Warehouse } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { SectionHead } from "@/shared/ui/section-head";
import { type ContentPage, GUIDE_CARDS } from "../home-data";

const GUIDE_ICONS: Partial<Record<ContentPage, typeof Scales>> = {
  policy: Scales,
  insurancePolicy: ShieldCheck,
  auctionPolicy: Gavel,
  japanWarehouse: Warehouse,
  goods: Stamp,
  faq: Question,
};

// Guide & policy pages as an editorial bento: two wide featured cards on the top row (7:5 split),
// followed by a four-card row below where every card has its own artwork, index badge, icon chip,
// and bottom-aligned action link.
export function GuideGrid() {
  const t = useTranslations("home.guides");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;
  const topRow = GUIDE_CARDS.slice(0, 2);
  const bottomRow = GUIDE_CARDS.slice(2);

  return (
    <div className="grid gap-6">
      <ul data-reveal-group className="grid gap-6 lg:grid-cols-12">
        {topRow.map(({ page, image }, index) => {
          const Icon = GUIDE_ICONS[page] ?? Scales;
          const span = index === 0 ? "lg:col-span-7" : "lg:col-span-5";
          return (
            <li key={page} className={span}>
              <Link href={pagePath(locale, page)} className="guide-card guide-card--feature group flex h-full flex-col">
                <div className="guide-card__media relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={image}
                    alt={tPages(`${page}.title`)}
                    fill
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-deep/90 px-3 py-1 text-xs font-semibold text-gold backdrop-blur-xs">
                    <Icon size={15} weight="duotone" aria-hidden />
                    {tPages(`${page}.nav`)}
                  </span>
                  <span
                    aria-hidden
                    className="absolute top-3.5 right-3.5 inline-flex size-7 items-center justify-center rounded-full bg-white/90 font-display text-xs font-semibold text-forest tabular-nums"
                  >
                    0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-xl leading-snug text-forest sm:text-2xl">{tPages(`${page}.title`)}</h3>
                  <p className="mt-2 flex-1 line-clamp-3 text-muted">{tPages(`${page}.intro`)}</p>
                  <span className="link-arrow mt-3 self-start text-forest">{t("more")}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {bottomRow.length > 0 && (
        <ul data-reveal-group className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bottomRow.map(({ page, image }, offset) => {
            const Icon = GUIDE_ICONS[page] ?? Scales;
            const num = offset + 3;
            return (
              <li key={page} className="h-full">
                <Link href={pagePath(locale, page)} className="guide-card group flex h-full flex-col">
                  <div className="guide-card__media relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={image}
                      alt={tPages(`${page}.title`)}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-deep/90 px-2.5 py-1 text-xs font-semibold text-gold backdrop-blur-xs">
                      <Icon size={14} weight="duotone" aria-hidden />
                      {tPages(`${page}.nav`)}
                    </span>
                    <span
                      aria-hidden
                      className="absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-full bg-white/90 font-display text-xs font-semibold text-forest tabular-nums"
                    >
                      0{num}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-lg leading-snug text-forest">{tPages(`${page}.title`)}</h3>
                    <p className="mt-1.5 flex-1 line-clamp-3 text-sm text-muted">{tPages(`${page}.intro`)}</p>
                    <span className="link-arrow mt-3 self-start text-sm text-forest">{t("more")}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Home hub: the guide grid in its own section, under "Guides and policies".
export function Guides() {
  const t = useTranslations("home.guides");

  return (
    <section id="guides" className="section bg-sage">
      <div className="wrap">
        <SectionHead title={t("title")} intro={t("intro")} align="start" />
        <div className="mt-10 lg:mt-12">
          <GuideGrid />
        </div>
      </div>
    </section>
  );
}
