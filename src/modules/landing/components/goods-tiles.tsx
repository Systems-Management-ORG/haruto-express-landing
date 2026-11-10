import { Armchair, ArrowRight, BookOpen, ForkKnife, TShirt } from "@phosphor-icons/react/dist/ssr";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { GOODS_TILE_ICONS } from "../home-data";

const ICONS = { clothing: TShirt, household: Armchair, books: BookOpen, food: ForkKnife } as const;

// Accepted-goods categories as solid icon tiles; the restricted and prohibited lists stay on the
// goods page, linked underneath.
export function GoodsTiles() {
  const t = useTranslations("home.goods");
  const tGoods = useTranslations("pages.goods");
  const locale = useLocale() as Locale;
  const items = tGoods.raw("accepted.items") as string[];

  return (
    <section id="goods" className="section bg-sage">
      <div className="wrap">
        <div className="text-center">
          <h2 data-reveal className="heading-2">{tGoods("accepted.title")}</h2>
          <p data-reveal className="mx-auto mt-4 max-w-[44rem] sm:text-lg">{t("intro")}</p>
        </div>

        <ul data-reveal-group className="mt-10 grid grid-cols-2 gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {GOODS_TILE_ICONS.map((key, index) => {
            const Icon = ICONS[key];
            return (
              <li key={key} className="goods-tile">
                <Icon size={44} weight="light" aria-hidden />
                <span>{items[index]}</span>
              </li>
            );
          })}
        </ul>

        <p data-reveal className="mt-8 text-center">
          <a href={pagePath(locale, "goods")} className="link-arrow text-forest">
            {t("more")}
            <ArrowRight size={18} aria-hidden className="m-arrow" />
          </a>
        </p>
      </div>
    </section>
  );
}
