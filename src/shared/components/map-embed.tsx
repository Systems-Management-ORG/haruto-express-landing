import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { mapsEmbed, mapsUrl } from "@/shared/seo/business";

// Interactive Google Maps embed plus a link to open the full map. Uses an exact embed URL when
// given (e.g. a Street View panorama), otherwise the keyless search embed. CSP allows frame-src
// https://www.google.com for this iframe.
export function MapEmbed({
  query,
  title,
  openLabel,
  src,
}: {
  query: string;
  title: string;
  openLabel: string;
  src?: string;
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-card border border-line">
        <iframe
          src={src ?? mapsEmbed(query)}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-64 w-full sm:h-72"
        />
      </div>
      <a
        href={mapsUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
        className="link-arrow mt-3 text-forest"
      >
        {openLabel}
        <ArrowSquareOut size={16} aria-hidden />
      </a>
    </div>
  );
}
