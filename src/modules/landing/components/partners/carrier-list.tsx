import { Truck } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { CARRIER_ORDER, CARRIERS } from "../../partners";

// HARUTO's carriers inside Japan, one card each: the official logo once supplied (CARRIERS), else
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
          <li key={id} className="card flex items-center gap-4">
            {logo ? (
              /* eslint-disable-next-line @next/next/no-img-element -- static SVG logo, nothing to optimize */
              <img src={logo} alt="" height={40} width={40} className="h-10 w-auto shrink-0" />
            ) : (
              <span className="icon-chip" aria-hidden>
                <Truck size={22} weight="duotone" />
              </span>
            )}
            <div className="min-w-0">
              <Heading className="text-lg leading-snug font-medium text-forest">{name}</Heading>
              {native !== name && (
                <p lang="ja" className="text-sm text-muted">
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
