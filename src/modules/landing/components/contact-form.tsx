"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

type Kind = "PERSONAL" | "BUSINESS";

// Field names follow the POST /api/leads contract in the spec. The submit button stays
// disabled until the backend exists, so nothing is sent or stored.
export function ContactForm() {
  const t = useTranslations("contact");
  const [kind, setKind] = useState<Kind>("PERSONAL");
  const kinds: { value: Kind; label: string }[] = [
    { value: "PERSONAL", label: t("kindPersonal") },
    { value: "BUSINESS", label: t("kindBusiness") },
  ];
  const optional = <span className="font-normal text-muted"> ({t("optional")})</span>;

  return (
    <form className="card" aria-describedby="form-notice">
      <p id="form-notice" className="rounded-lg border border-gold bg-[#fdf6e7] px-4 py-3 text-sm">
        {t("notice")}
      </p>

      <fieldset className="mt-6">
        <legend className="field-label">{t("kindLegend")}</legend>
        <div className="grid grid-cols-2 gap-2">
          {kinds.map((item) => (
            <label
              key={item.value}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-center font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                kind === item.value ? "border-forest bg-forest text-white" : "border-forest text-forest"
              }`}
            >
              <input
                type="radio"
                name="kind"
                value={item.value}
                checked={kind === item.value}
                onChange={() => setKind(item.value)}
                className="sr-only"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="field-label">{t("fields.fullName")}</label>
          <input id="fullName" name="fullName" required autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">{t("fields.phone")}</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className="field" />
        </div>

        {kind === "BUSINESS" ? (
          <div className="sm:col-span-2">
            <label htmlFor="company" className="field-label">{t("fields.company")}</label>
            <input id="company" name="company" required autoComplete="organization" className="field" />
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <label htmlFor="email" className="field-label">{t("fields.email")}{optional}</label>
          <input id="email" name="email" type="email" autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="direction" className="field-label">{t("fields.direction")}</label>
          <select id="direction" name="direction" className="field">
            <option value="VN_JP">{t("routeVnJp")}</option>
            <option value="JP_VN">{t("routeJpVn")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="weightKg" className="field-label">{t("fields.weight")}{optional}</label>
          <input id="weightKg" name="weightKg" type="number" min="0" step="0.1" inputMode="decimal" className="field" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="field-label">{t("fields.description")}{optional}</label>
          <textarea id="description" name="description" rows={3} className="field" />
        </div>
      </div>

      <label className="mt-5 flex min-h-11 items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" name="privacyConsent" required className="mt-0.5 size-5 shrink-0 accent-forest" />
        <span>{t("fields.consent")}</span>
      </label>

      <button type="submit" disabled className="btn btn-primary mt-5 w-full">
        {t("submit")}
      </button>
      <p className="mt-3 text-sm">{t("consultationOnly")}</p>
    </form>
  );
}
