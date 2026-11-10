import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { PLANE_PATH } from "./plane-icon";

// Projected positions on dong-a-vn-nhat.svg (Hanoi, Tokyo) in its own coordinate system.
const VIETNAM = { x: 161, y: 463.5 };
const JAPAN = { x: 663, y: 229 };
// Two arcs bowing north: outbound rides higher, the return dips lower, so the planes never overlap.
type Pt = readonly [number, number];
const OUT_PTS: readonly Pt[] = [[VIETNAM.x, VIETNAM.y], [320, 350], [520, 250], [JAPAN.x, JAPAN.y]];
const IN_PTS: readonly Pt[] = [[JAPAN.x, JAPAN.y], [500, 300], [330, 430], [VIETNAM.x, VIETNAM.y]];
const arc = (p: readonly Pt[]) => `M${p[0][0]} ${p[0][1]} C ${p[1][0]} ${p[1][1]}, ${p[2][0]} ${p[2][1]}, ${p[3][0]} ${p[3][1]}`;
const OUTBOUND = arc(OUT_PTS);
const INBOUND = arc(IN_PTS);

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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <h2 data-reveal className="heading-2 text-white">{t("title")}</h2>
            <p data-reveal className="mt-4 max-w-[34rem] text-white/85 sm:text-lg">{t("intro")}</p>
            <ul data-reveal-group className="mt-8 max-w-[26rem]">
              {directions.map(({ key, label }) => (
                <li key={key}>
                  <a
                    href={pagePath(locale, key)}
                    className="flex min-h-14 items-center justify-between gap-4 border-t border-white/20 text-lg font-medium transition-colors last:border-b hover:text-gold"
                  >
                    {label}
                    <ArrowRight size={20} aria-hidden className="m-arrow shrink-0" />
                  </a>
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
              className="block size-full"
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

              {/* A light streak travels along each route (CSS dash animation, loops on its own). */}
              <path className="route-streak route-streak--out" d={OUTBOUND} pathLength={1} fill="none" stroke="#fff3d6" strokeWidth="4" strokeLinecap="round" />
              <path className="route-streak route-streak--in" d={INBOUND} pathLength={1} fill="none" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" />

              {/* Pulsing pings at the two cities. */}
              <circle className="route-ping" cx={VIETNAM.x} cy={VIETNAM.y} fill="#e2a240" />
              <circle className="route-ping route-ping--delay" cx={JAPAN.x} cy={JAPAN.y} fill="#e2a240" />
              <circle cx={VIETNAM.x} cy={VIETNAM.y} r="5" fill="#e2a240" stroke="#faf8ea" strokeWidth="1.2" />
              <circle cx={JAPAN.x} cy={JAPAN.y} r="5" fill="#e2a240" stroke="#faf8ea" strokeWidth="1.2" />

              {/* Planes fly along the arcs via CSS offset-path (self-running, respects reduced motion). */}
              <g className="route-plane route-plane--out">
                <path d={PLANE_PATH} transform="rotate(90) scale(0.9)" fill="#faf8ea" />
              </g>
              <g className="route-plane route-plane--in">
                <path d={PLANE_PATH} transform="rotate(90) scale(0.9)" fill="#e2a240" />
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
