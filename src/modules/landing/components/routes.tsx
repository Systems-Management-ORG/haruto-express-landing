import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { PLANE_PATH, planeTransform } from "./plane-icon";

// dong-a-vn-nhat.svg: East Asia drawn on a gently curved surface (orthographic projection of a
// large globe centred on 122°E 24°N, its rim outside the frame), coastlines and borders from
// Natural Earth 1:50m (public domain), Vietnam (with Hoang Sa and Truong Sa) and Japan in gold.
// The points and paths below are in the SVG's own coordinates, computed by the same script that
// drew the map: Hanoi, Tokyo, and the two flights along the great circle between them. Outbound
// bows north, the return dips a little, so the two planes never overlap.
const VIETNAM = { x: 148.4, y: 476.9 };
const JAPAN = { x: 654.8, y: 221.8 };
const OUTBOUND =
  "M148.4 476.9 L160.5 456.4 L172.7 436.2 L185.2 416.1 L197.9 396.5 L211.0 377.4 L224.6 359.0 L238.5 341.4 L253.0 324.6 L268.0 308.9 L283.5 294.1 L299.7 280.6 L316.4 268.2 L333.8 257.1 L351.9 247.2 L370.5 238.6 L389.8 231.3 L409.6 225.2 L430.1 220.3 L451.0 216.6 L472.5 214.1 L494.3 212.5 L516.6 211.9 L539.2 212.1 L562.1 213.1 L585.2 214.6 L608.4 216.7 L631.6 219.1 L654.8 221.8";
const INBOUND =
  "M654.8 221.8 L638.8 233.3 L622.6 244.9 L606.3 256.5 L589.8 268.1 L573.2 279.6 L556.5 291.0 L539.5 302.2 L522.4 313.2 L505.1 324.0 L487.6 334.6 L469.9 344.9 L452.1 354.9 L434.0 364.6 L415.8 374.0 L397.3 383.1 L378.7 391.8 L360.0 400.3 L341.1 408.4 L322.1 416.2 L302.9 423.8 L283.7 431.1 L264.4 438.1 L245.0 444.9 L225.7 451.5 L206.3 458.0 L186.9 464.4 L167.6 470.6 L148.4 476.9";

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
  const locale = useLocale() as Locale;
  const photoAlts = t.raw("photoAlts") as string[];

  const directions = [
    { key: "shipToJapan" as const, label: t("outbound") },
    { key: "shipToVietnam" as const, label: t("inbound") },
  ];

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
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="route-copy">
            <h2 data-reveal className="heading-2 text-white">{t("title")}</h2>
            <p data-reveal className="mt-4 max-w-[34rem] text-white/85 sm:text-lg">{t("intro")}</p>
            <ul data-reveal-group className="mt-8 max-w-[26rem]">
              {directions.map(({ key, label }) => (
                <li key={key}>
                  <Link
                    href={pagePath(locale, key)}
                    className="flex min-h-14 items-center justify-between gap-4 border-t border-white/20 text-lg font-medium transition-colors last:border-b hover:text-gold"
                  >
                    {label}
                    <ArrowRight size={20} aria-hidden className="m-arrow shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="route-map">
            <svg
              viewBox="-96 -34 1008 948"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={t("mapLabel")}
              className="route-map__svg"
            >
              <image href="/images/haruto/dong-a-vn-nhat.svg" x="-96" y="-34" width="1008" height="948" />

              <defs>
                <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>

              {/* The two flight paths: a soft glow under a bold dashed line, visible without motion too. */}
              <path d={OUTBOUND} fill="none" stroke="#e2a240" strokeWidth="10" opacity="0.45" filter="url(#route-glow)" />
              <path d={INBOUND} fill="none" stroke="#faf8ea" strokeWidth="10" opacity="0.35" filter="url(#route-glow)" />
              <path d={OUTBOUND} fill="none" stroke="#e2a240" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 8" />
              <path d={INBOUND} fill="none" stroke="#faf8ea" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="10 8" opacity="0.9" />


              {/* Pulsing pings at the two cities. */}
              <circle className="route-ping" cx={VIETNAM.x} cy={VIETNAM.y} fill="#e2a240" />
              <circle className="route-ping route-ping--delay" cx={JAPAN.x} cy={JAPAN.y} fill="#e2a240" />
              <circle cx={VIETNAM.x} cy={VIETNAM.y} r="5" fill="#e2a240" stroke="#faf8ea" strokeWidth="1.2" />
              <circle cx={JAPAN.x} cy={JAPAN.y} r="5" fill="#e2a240" stroke="#faf8ea" strokeWidth="1.2" />

              {/* Planes fly along the arcs via CSS offset-path (self-running, respects reduced motion). */}
              <g className="route-plane route-plane--out" style={{ offsetPath: `path("${OUTBOUND}")` }}>
                <path d={PLANE_PATH} transform={planeTransform(40)} fill="#faf8ea" stroke="#173c22" strokeWidth="40" paintOrder="stroke" />
              </g>
              <g className="route-plane route-plane--in" style={{ offsetPath: `path("${INBOUND}")` }}>
                <path d={PLANE_PATH} transform={planeTransform(40)} fill="#e2a240" stroke="#173c22" strokeWidth="40" paintOrder="stroke" />
              </g>

              <text x={VIETNAM.x - 12} y={VIETNAM.y + 6} textAnchor="end" className="route-map__label">
                {t("vietnam")}
              </text>
              <text x={JAPAN.x + 14} y={JAPAN.y + 6} className="route-map__label">
                {t("japan")}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
