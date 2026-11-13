import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { MARKETPLACE_LOGOS, MARKETPLACE_WORDMARKS, MARQUEE_MARKETPLACES, type MarketplaceId } from "../../partners";
import { MarqueeToggle } from "./marquee-toggle";

// The Japanese stores HARUTO buys from as an endless horizontal strip of chips (logo + name, a
// wordmark alone, or the name alone when there is no logo file). The list is rendered twice: the
// first copy is the readable one, the second is aria-hidden and only closes the loop. It pauses on
// hover, on focus and with the toggle; under prefers-reduced-motion it stands still, wrapped.
// Chips are not links: nothing here leads off the site.
export function MarketplaceMarquee({ ids = MARQUEE_MARKETPLACES, label }: { ids?: MarketplaceId[]; label: string }) {
  const t = useTranslations("marketplaces");
  const tMarquee = useTranslations("partners.marquee");

  const item = (id: MarketplaceId, hidden = false) => {
    const logo = MARKETPLACE_LOGOS[id];
    const name = t(`${id}.name`);
    // A wordmark already spells the name: show it alone, the name as its alt text.
    const wordmark = Boolean(logo) && MARKETPLACE_WORDMARKS.includes(id);
    return (
      <li key={hidden ? `${id}-loop` : id} className="marquee__item" aria-hidden={hidden || undefined}>
        {logo && (
          /* eslint-disable-next-line @next/next/no-img-element -- static logo file, nothing to optimize */
          <img src={logo} alt={wordmark ? name : ""} width={28} height={28} className="h-7 w-auto shrink-0" />
        )}
        {!wordmark && name}
      </li>
    );
  };

  return (
    <div className="marquee" data-marquee style={{ "--marquee-duration": `${ids.length * 4}s` } as CSSProperties}>
      <MarqueeToggle pauseLabel={tMarquee("pause")} playLabel={tMarquee("play")} />
      <div className="marquee__viewport">
        <ul className="marquee__track" aria-label={label}>
          {ids.map((id) => item(id))}
          {ids.map((id) => item(id, true))}
        </ul>
      </div>
    </div>
  );
}
