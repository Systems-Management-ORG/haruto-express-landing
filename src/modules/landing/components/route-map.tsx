import { useTranslations } from "next-intl";
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

// The two-way air route over East Asia: glowing dashed arcs, pulsing pings at Hanoi and Tokyo and
// a plane on each arc (CSS offset-path, still under reduced motion). The whole map is always shown
// (never cropped), so Vietnam's Hoang Sa and Truong Sa stay in view.
export function RouteMap() {
  const t = useTranslations("routes");

  return (
    <svg viewBox="-96 -34 1008 948" preserveAspectRatio="xMidYMid meet" role="img" aria-label={t("mapLabel")} className="route-map__svg">
      <image href="/images/haruto/dong-a-vn-nhat.svg" x="-96" y="-34" width="1008" height="948" />

      <defs>
        <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <path d={OUTBOUND} fill="none" stroke="#e2a240" strokeWidth="10" opacity="0.45" filter="url(#route-glow)" />
      <path d={INBOUND} fill="none" stroke="#faf8ea" strokeWidth="10" opacity="0.35" filter="url(#route-glow)" />
      <path d={OUTBOUND} fill="none" stroke="#e2a240" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 8" />
      <path d={INBOUND} fill="none" stroke="#faf8ea" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="10 8" opacity="0.9" />

      <circle className="route-ping" cx={VIETNAM.x} cy={VIETNAM.y} fill="#e2a240" />
      <circle className="route-ping route-ping--delay" cx={JAPAN.x} cy={JAPAN.y} fill="#e2a240" />
      <circle cx={VIETNAM.x} cy={VIETNAM.y} r="5" fill="#e2a240" stroke="#faf8ea" strokeWidth="1.2" />
      <circle cx={JAPAN.x} cy={JAPAN.y} r="5" fill="#e2a240" stroke="#faf8ea" strokeWidth="1.2" />

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
  );
}
