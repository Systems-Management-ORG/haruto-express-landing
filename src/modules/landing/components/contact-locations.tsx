"use client";

import { ArrowSquareOut, Check, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
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
          <ul data-reveal-group className="min-w-0 grid content-start gap-3.5">
            {LOCATIONS.map((location) => {
              const isActive = location.id === active;
              return (
                <li key={location.id} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActive(location.id)}
                    className="location-card min-w-0"
                  >
                    <span className="location-card__pin" aria-hidden>
                      <MapPin size={20} weight={isActive ? "fill" : "duotone"} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="min-w-0 font-semibold text-forest wrap-break-word">{name(location.id)}</span>
                        <span
                          aria-hidden
                          className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isActive
                              ? "border-forest bg-forest text-white"
                              : "border-forest/30 bg-white text-transparent"
                          }`}
                        >
                          <Check size={12} weight="bold" />
                        </span>
                      </span>
                      <span className="mt-0.5 block text-sm text-muted text-pretty wrap-break-word">
                        {t(`locations.${location.id}`)}
                      </span>
                      <span className="mt-2 block text-sm font-medium text-ink text-pretty wrap-break-word">
                        {location.address}
                      </span>
                      {location.publicVisit && (
                        <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-md bg-sage/85 px-2.5 py-1 text-xs font-medium text-forest text-pretty">
                          <Clock size={14} weight="fill" aria-hidden className="shrink-0" />
                          <span className="min-w-0 wrap-break-word">{t("hours")}</span>
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div data-reveal className="min-w-0 flex flex-col">
            <div className="overflow-hidden rounded-card border border-line bg-white shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-forest">{name(current.id)}</p>
                  <p className="truncate text-xs text-muted">{current.address}</p>
                </div>
                <a
                  href={mapsUrl(current.query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="open_map"
                  className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-forest/30 bg-sage/60 px-3 py-1.5 text-xs sm:text-sm font-semibold text-forest transition-colors hover:border-forest hover:bg-sage"
                >
                  <span>{tContact("mapOpen")}</span>
                  <ArrowSquareOut size={16} aria-hidden />
                </a>
              </div>
              <iframe
                key={current.id}
                src={current.embedSrc ?? mapsEmbed(current.query)}
                title={`${name(current.id)} · Google Maps`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-80 w-full lg:h-[26rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
