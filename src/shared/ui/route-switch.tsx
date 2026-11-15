import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";

// Two buttons under the hero of the price-policy pages: the current route (aria-current) and a
// link to the other one, so a reader on the wrong direction switches in one tap.
export function RouteSwitch({ current }: { current: "vnJp" | "jpVn" }) {
  const t = useTranslations("pricing");
  const locale = useLocale() as Locale;

  return (
    <nav aria-label={t("tabsLabel")} className="mt-6 grid grid-cols-2 gap-2 sm:inline-grid">
      {(["vnJp", "jpVn"] as const).map((dir) => (
        <Link
          key={dir}
          href={pagePath(locale, dir === "vnJp" ? "priceVnJp" : "priceJpVn")}
          aria-current={dir === current ? "page" : undefined}
          className={dir === current ? "btn btn-primary" : "btn btn-outline bg-white/70"}
          data-track={`route_switch_${dir}`}
        >
          {t(`teaser.${dir}.label`)}
        </Link>
      ))}
    </nav>
  );
}
