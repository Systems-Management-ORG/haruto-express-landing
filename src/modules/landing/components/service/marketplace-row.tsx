import { DotsThree } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { MARKETPLACE_LOGOS, type MarketplaceId } from "../../marketplaces";

// The Japanese stores a service buys from: logo, name and a short note each; `withMore` adds an
// "and many more" cell. Names and notes come from the shared `marketplaces` namespace.
export function MarketplaceRow({ ids, withMore = false, label }: { ids: MarketplaceId[]; withMore?: boolean; label?: string }) {
  const t = useTranslations("marketplaces");

  return (
    <div className="svc-market">
      {label && (
        <p className="svc-market__label" aria-hidden>
          {label}
        </p>
      )}
      <ul aria-label={label} className="svc-market__list">
        {ids.map((id) => (
          <li key={id} className="svc-market__item">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo, nothing to optimize */}
            <img src={MARKETPLACE_LOGOS[id]} alt="" width={32} height={32} className="svc-market__logo" />
            <span className="min-w-0">
              <span className="svc-market__name">{t(`${id}.name`)}</span>
              <span className="svc-market__note">{t(`${id}.note`)}</span>
            </span>
          </li>
        ))}
        {withMore && (
          <li className="svc-market__item">
            <span className="svc-market__logo svc-market__logo--more" aria-hidden>
              <DotsThree size={24} weight="bold" />
            </span>
            <span className="svc-market__note">{t("more.note")}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
