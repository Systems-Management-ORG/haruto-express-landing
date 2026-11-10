import { useTranslations } from "next-intl";

// Isometric parcel with its three measured edges labelled and the volumetric formula beneath.
// Drawn in brand colours; labels come from `policy.weight.diagram`.
export function VolumetricDiagram() {
  const t = useTranslations("policy.weight.diagram");

  return (
    <figure className="volumetric">
      <svg viewBox="0 0 345 212" role="img" aria-label={t("label")} className="block h-auto w-full">
        {/* box faces */}
        <path d="M70 80 L170 40 L270 80 L170 120 Z" fill="#e2a240" opacity="0.9" />
        <path d="M70 80 L170 120 L170 190 L70 150 Z" fill="#c98a2c" />
        <path d="M170 120 L270 80 L270 150 L170 190 Z" fill="#b27a26" />
        {/* tape */}
        <path d="M120 60 L220 100 L220 170" fill="none" stroke="#faf8ea" strokeWidth="6" opacity="0.55" />
        {/* dimension lines */}
        <g stroke="#235923" strokeWidth="1.6" fill="none">
          <path d="M62 160 L162 200" />
          <path d="M178 200 L278 160" />
          <path d="M282 150 L282 80" />
        </g>
        <g fill="#235923">
          <circle cx="62" cy="160" r="3" />
          <circle cx="162" cy="200" r="3" />
          <circle cx="178" cy="200" r="3" />
          <circle cx="278" cy="160" r="3" />
          <circle cx="282" cy="150" r="3" />
          <circle cx="282" cy="80" r="3" />
        </g>
        <g fontSize="13" fontWeight="600" fill="#173c22" fontFamily="inherit">
          <text x="92" y="200" textAnchor="middle">{t("length")}</text>
          <text x="244" y="200" textAnchor="middle">{t("width")}</text>
          <text x="292" y="120">{t("height")}</text>
        </g>
      </svg>
      <figcaption className="volumetric__formula">{t("formula")}</figcaption>
    </figure>
  );
}
