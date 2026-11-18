import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";

function FlagVn() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden className="h-5 w-7 shrink-0 rounded-[3px] shadow-2xs">
      <rect width="30" height="20" fill="#da251d" />
      <polygon
        points="15,4 16.47,8.52 21.22,8.52 17.38,11.31 18.85,15.83 15,13.04 11.15,15.83 12.62,11.31 8.78,8.52 13.53,8.52"
        fill="#ffff00"
      />
    </svg>
  );
}

function FlagJp() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden className="h-5 w-7 shrink-0 rounded-[3px] border border-line bg-white shadow-2xs">
      <rect width="30" height="20" fill="#ffffff" />
      <circle cx="15" cy="10" r="5.5" fill="#bc002d" />
    </svg>
  );
}

// Route selector cards inspired by Tiximax's route switcher: flag badges + route name, with a
// highlighted gold/forest frame on the active route.
export function RouteSwitch({ current }: { current: "vnJp" | "jpVn" }) {
  const t = useTranslations("pricing");
  const locale = useLocale() as Locale;

  return (
    <nav aria-label={t("tabsLabel")} className="mt-6 grid grid-cols-1 gap-3 sm:inline-grid sm:grid-cols-2">
      {(["vnJp", "jpVn"] as const).map((dir) => {
        const active = dir === current;
        return (
          <Link
            key={dir}
            href={pagePath(locale, dir === "vnJp" ? "priceVnJp" : "priceJpVn")}
            aria-current={active ? "page" : undefined}
            data-track={`route_switch_${dir}`}
            className={
              active
                ? "flex items-center gap-3.5 rounded-2xl border-2 border-gold bg-forest px-5 py-3.5 text-white shadow-md transition-transform"
                : "flex items-center gap-3.5 rounded-2xl border border-line bg-white/90 px-5 py-3.5 text-ink shadow-2xs transition-colors hover:border-forest hover:bg-white"
            }
          >
            <span className="flex items-center gap-2" aria-hidden>
              {dir === "vnJp" ? <FlagVn /> : <FlagJp />}
              <ArrowRight size={14} weight="bold" className={active ? "text-gold" : "text-muted"} />
              {dir === "vnJp" ? <FlagJp /> : <FlagVn />}
            </span>
            <span className={`text-sm font-semibold sm:text-base ${active ? "text-white" : "text-forest"}`}>
              {t(`teaser.${dir}.label`)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
