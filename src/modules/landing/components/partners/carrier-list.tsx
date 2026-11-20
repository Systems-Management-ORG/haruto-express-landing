import { Truck } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { CARRIER_ORDER, CARRIERS } from "../../partners";

// HARUTO's carriers inside Japan, one card each: the official logo (CARRIERS) or, without one,
// a truck icon; the name, and the Japanese name under it unless they are the same (JA). Not links.
export function CarrierList({ heading = "h3" }: { heading?: "h3" | "h4" }) {
  const t = useTranslations("partners.carriers.items");
  const Heading = heading;

  return (
    <ul data-reveal-group className="grid gap-4 sm:grid-cols-3">
      {CARRIER_ORDER.map((id) => {
        const { logo } = CARRIERS[id];
        const name = t(`${id}.name`);
        const native = t(`${id}.native`);
        return (
          <li key={id} className="card group flex items-center gap-4 p-5 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-xs">
            {logo ? (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-line/60 bg-white p-2 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo, nothing to optimize */}
                <img src={logo} alt="" height={40} width={40} className="max-h-9 w-auto object-contain" />
              </div>
            ) : (
              <span className="icon-chip" aria-hidden>
                <Truck size={22} weight="duotone" />
              </span>
            )}
            <div className="min-w-0">
              <Heading className="text-base sm:text-lg leading-snug font-semibold text-forest">{name}</Heading>
              {native !== name && (
                <p lang="ja" className="mt-0.5 text-xs text-muted font-medium">
                  {native}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
