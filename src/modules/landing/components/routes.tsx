import Image from "next/image";
import { useTranslations } from "next-intl";
import { PLANE_PATH } from "./plane-icon";

// Map coordinates of the two countries; the same projection drew world-map.svg.
const VIETNAM = { x: 448.5, y: 254.7 };
const JAPAN = { x: 565.9, y: 173.8 };
const OUTBOUND = `M${VIETNAM.x} ${VIETNAM.y} C 450 205, 498 168, ${JAPAN.x} ${JAPAN.y}`;
const INBOUND = `M${JAPAN.x} ${JAPAN.y} C 562 212, 510 232, ${VIETNAM.x} ${VIETNAM.y}`;

// The order packs the mosaic without gaps at every breakpoint.
const WAREHOUSE_TILES = [
  { file: "kho-haruto-kien-hang-cho-xu-ly.jpg" },
  { file: "kho-haruto-kien-hang-tren-pallet.jpg", size: "wide" },
  { file: "mat-tien-kho-haruto-express.jpg", size: "feature" },
  { file: "ben-trong-kho-haruto-express.jpg", size: "wide" },
  { file: "kho-haruto-thung-hang-xep-chong.webp" },
  { file: "khu-lam-viec-va-kien-hang-kho-haruto.jpg", size: "wide" },
  { file: "kho-haruto-kien-hang-boc-mang.webp", size: "wide" },
  { file: "hang-nhat-tieu-dung.webp" },
];

export function Routes() {
  const t = useTranslations("routes");
  const photoAlts = t.raw("photoAlts") as string[];

  return (
    <section id="routes" className="section route-band text-white">
      <div className="route-backdrop" aria-hidden="true">
        <div className="route-backdrop__layer">
          <div className="route-backdrop__grid" data-route-grid>
            {WAREHOUSE_TILES.map(({ file, size }, index) => (
              <div key={file} className={`route-backdrop__tile${size ? ` route-backdrop__tile--${size}` : ""}`}>
                <Image src={`/images/haruto/kho/${file}`} alt={photoAlts[index] ?? ""} fill sizes="(max-width: 767px) 50vw, 40vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <h2 data-reveal className="heading-2 text-white">{t("title")}</h2>
      </div>

      <div className="route-map mt-8 lg:mt-12">
        <svg
          data-route-map
          viewBox="0 0 1200 560"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={t("mapLabel")}
          className="block size-full"
        >
          <g>
            <image href="/images/haruto/world-map.svg" width="1200" height="560" />
            <path id="route-outbound" data-route d={OUTBOUND} pathLength={1} fill="none" stroke="#e2a240" strokeWidth="1.5" />
            <path id="route-inbound" data-route d={INBOUND} pathLength={1} fill="none" stroke="#faf8ea" strokeWidth="1.5" />
            <circle cx={VIETNAM.x} cy={VIETNAM.y} r="3.4" fill="#e2a240" stroke="#faf8ea" strokeWidth="0.8" />
            <circle cx={JAPAN.x} cy={JAPAN.y} r="3.4" fill="#e2a240" stroke="#faf8ea" strokeWidth="0.8" />
            <g data-plane="route-outbound" transform="translate(488 197)">
              <path d={PLANE_PATH} fill="#faf8ea" transform="rotate(90) scale(0.6)" />
            </g>
            <g data-plane="route-inbound" transform="translate(520 218)">
              <path d={PLANE_PATH} fill="#faf8ea" transform="rotate(90) scale(0.6)" />
            </g>
            <text data-map-label x={VIETNAM.x - 8} y={VIETNAM.y + 6} textAnchor="end" className="route-map__label">
              {t("vietnam")}
            </text>
            <text data-map-label x={JAPAN.x + 12} y={JAPAN.y + 4} className="route-map__label">
              {t("japan")}
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}
