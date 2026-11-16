"use client";

import { ArrowSquareOut, MapPin } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LOCATIONS, type LocationId, mapsEmbed, mapsUrl } from "@/shared/seo/business";

// Contact page: every HARUTO location as a selectable card beside one map, which shows the chosen
// place (addresses from business.ts; opening hours on the walk-in locations, `publicVisit`). The
// first walk-in location is shown first.
export function ContactLocations() {
  const t = useTranslations("contact.guide");
  const tContact = useTranslations("contact");
  const tFooter = useTranslations("footer");
  const [active, setActive] = useState<LocationId>(
    (LOCATIONS.find((location) => location.publicVisit) ?? LOCATIONS[0]).id,
  );
  const current = LOCATIONS.find((location) => location.id === active) ?? LOCATIONS[0];
  const name = (id: LocationId) => tFooter(`locations.${id}`);

  return (
    <section className="section">
      <div className="wrap">
        <h2 data-reveal className="heading-2">
          {t("locationsTitle")}
        </h2>
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          <ul data-reveal-group className="grid content-start gap-3">
            {LOCATIONS.map((location) => (
              <li key={location.id}>
                <button
                  type="button"
                  aria-pressed={location.id === active}
                  onClick={() => setActive(location.id)}
                  className="location-card"
                >
                  <MapPin size={22} weight="duotone" aria-hidden className="location-card__pin" />
                  <span className="min-w-0">
                    <span className="block font-medium text-forest">{name(location.id)}</span>
                    <span className="mt-0.5 block text-sm text-muted">{t(`locations.${location.id}`)}</span>
                    {location.publicVisit && <span className="mt-2 block text-sm text-ink">{t("hours")}</span>}
                    <span className="mt-2 block text-sm text-ink">{location.address}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div data-reveal>
            <div className="overflow-hidden rounded-card border border-line bg-white">
              <iframe
                key={current.id}
                src={mapsEmbed(current.query)}
                title={`${name(current.id)} · Google Maps`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-80 w-full lg:h-[27rem]"
              />
            </div>
            <a
              href={mapsUrl(current.query)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="open_map"
              className="link-arrow mt-3 text-forest"
            >
              {tContact("mapOpen")}
              <ArrowSquareOut size={16} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
