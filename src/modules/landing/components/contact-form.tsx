"use client";

import { CheckCircle, CircleNotch, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { CHAT_CHANNELS, ChannelIcon } from "@/shared/components/contact-links";

type Kind = "PERSONAL" | "BUSINESS";
type Status = "idle" | "sending" | "sent" | "error";

// Posts to /api/leads, which forwards the request to the HARUTO leads sheet. Field names follow
// the POST /api/leads contract in the spec. This is a consultation request, not an order.
export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [kind, setKind] = useState<Kind>("PERSONAL");
  const [status, setStatus] = useState<Status>("idle");
  const kinds: { value: Kind; label: string }[] = [
    { value: "PERSONAL", label: t("kindPersonal") },
    { value: "BUSINESS", label: t("kindBusiness") },
  ];
  const optional = <span className="font-normal text-muted"> ({t("optional")})</span>;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          fullName: data.get("fullName"),
          company: data.get("company") ?? "",
          phone: data.get("phone"),
          email: data.get("email"),
          direction: data.get("direction"),
          weightKg: data.get("weightKg"),
          description: data.get("description"),
          privacyConsent: data.get("privacyConsent") === "on",
          website: data.get("website"),
          locale,
          page: window.location.pathname,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      form.reset();
      setKind("PERSONAL");
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({ event: "generate_lead" });
    } catch {
      setStatus("error");
    }
  }

  const channelButtons = CHAT_CHANNELS.length > 0 && (
    <div className="mt-3 flex flex-wrap gap-2">
      {CHAT_CHANNELS.map(({ id, href }) => (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-track={`click_${id}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 font-medium text-ink hover:border-forest"
        >
          <ChannelIcon id={id} size={22} />
          {t(`channels.${id}`)}
        </a>
      ))}
    </div>
  );

  if (status === "sent") {
    return (
      <div className="card text-center" role="status">
        <CheckCircle size={56} weight="duotone" aria-hidden className="mx-auto text-forest" />
        <h3 className="mt-4 text-2xl text-forest">{t("sent.title")}</h3>
        <p className="mx-auto mt-2 max-w-[26rem] text-muted">{t("sent.body")}</p>
        <div className="flex justify-center">{channelButtons}</div>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-outline mt-6">
          {t("sent.again")}
        </button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
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
          <input id="fullName" name="fullName" required maxLength={120} autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">{t("fields.phone")}</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            pattern="[+()0-9 .\-]{8,20}"
            title={t("phoneHint")}
            autoComplete="tel"
            className="field"
          />
        </div>

        {kind === "BUSINESS" ? (
          <div className="sm:col-span-2">
            <label htmlFor="company" className="field-label">{t("fields.company")}</label>
            <input id="company" name="company" required maxLength={160} autoComplete="organization" className="field" />
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <label htmlFor="email" className="field-label">{t("fields.email")}{optional}</label>
          <input id="email" name="email" type="email" maxLength={160} autoComplete="email" className="field" />
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
          <textarea id="description" name="description" rows={3} maxLength={2000} className="field" />
        </div>
      </div>

      <label className="mt-5 flex min-h-11 items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" name="privacyConsent" required className="mt-0.5 size-5 shrink-0 accent-forest" />
        <span>{t("fields.consent")}</span>
      </label>

      {status === "error" && (
        <p role="alert" className="mt-5 flex gap-2.5 rounded-lg border border-[#e4b4b2] bg-[#fbeeed] px-4 py-3 text-sm text-[#7f2523]">
          <WarningCircle size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0" />
          <span>{t("error")}</span>
        </p>
      )}

      <button type="submit" disabled={status === "sending"} aria-busy={status === "sending"} className="btn btn-primary mt-5 w-full">
        {status === "sending" && <CircleNotch size={18} weight="bold" aria-hidden className="animate-spin" />}
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
