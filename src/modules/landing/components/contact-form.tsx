"use client";

import { AirplaneTilt, Check, CheckCircle, CircleNotch, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useId, useState } from "react";
import { CHAT_CHANNELS, ChannelIcon } from "@/shared/components/contact-links";

type Kind = "PERSONAL" | "BUSINESS";
type Origin = "VN" | "JP";
type Status = "idle" | "sending" | "sent" | "error";

// Posts to /api/leads, which forwards the request to the HARUTO leads sheet. Field names follow
// the POST /api/leads contract in the spec. This is a consultation request, not an order.
export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const formId = useId();
  const [kind, setKind] = useState<Kind>("PERSONAL");
  const [origin, setOrigin] = useState<Origin>("VN");
  const [status, setStatus] = useState<Status>("idle");
  const direction = origin === "VN" ? "VN_JP" : "JP_VN";

  const kinds: { value: Kind; label: string }[] = [
    { value: "PERSONAL", label: t("kindPersonal") },
    { value: "BUSINESS", label: t("kindBusiness") },
  ];

  const routes: { origin: Origin; label: string }[] = [
    { origin: "VN", label: t("routeVnJp") },
    { origin: "JP", label: t("routeJpVn") },
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
          direction,
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
      setOrigin("VN");
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({ event: "generate_lead" });
    } catch {
      setStatus("error");
    }
  }

  const channelButtons = CHAT_CHANNELS.length > 0 && (
    <div className="mt-4 flex flex-wrap justify-center gap-2.5">
      {CHAT_CHANNELS.map(({ id, href }) => (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-track={`click_${id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3.5 font-medium text-ink transition-colors hover:border-forest"
        >
          <ChannelIcon id={id} size={22} />
          {t(`channels.${id}`)}
        </a>
      ))}
    </div>
  );

  if (status === "sent") {
    return (
      <div className="card text-center lg:p-10" role="status">
        <CheckCircle size={56} weight="duotone" aria-hidden className="mx-auto text-forest" />
        <h3 className="mt-4 text-2xl font-semibold text-forest">{t("sent.title")}</h3>
        <p className="mx-auto mt-2 max-w-[26rem] text-muted text-pretty">{t("sent.body")}</p>
        {channelButtons}
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-outline mt-6">
          {t("sent.again")}
        </button>
      </div>
    );
  }

  return (
    <form className="card lg:p-10" data-fab-away onSubmit={onSubmit}>
      {/* Honeypot: hidden from people and assistive tech; bots parsing raw HTML fill every field. */}
      <div hidden aria-hidden="true" className="hidden">
        <label htmlFor={`${formId}-website`}>
          Website
          <input id={`${formId}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Customer Type Segmented Switch */}
      <fieldset>
        <legend className="field-label">{t("kindLegend")}</legend>
        <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-sage/55 p-1">
          {kinds.map((item) => {
            const active = kind === item.value;
            return (
              <label
                key={item.value}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full px-3 py-2 text-center text-sm font-semibold transition-all duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold ${
                  active
                    ? "bg-forest text-white shadow-xs"
                    : "text-forest hover:bg-forest/8"
                }`}
              >
                <input
                  type="radio"
                  name="kind"
                  value={item.value}
                  checked={active}
                  onChange={() => setKind(item.value)}
                  className="sr-only"
                />
                {item.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-fullName`} className="field-label">
            {t("fields.fullName")}
          </label>
          <input
            id={`${formId}-fullName`}
            name="fullName"
            required
            maxLength={120}
            autoComplete="name"
            className="field"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="field-label">
            {t("fields.phone")}
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            required
            pattern="[+()0-9 .\-]{8,20}"
            title={t("phoneHint")}
            autoComplete="tel"
            className="field tabular-nums"
          />
        </div>

        {kind === "BUSINESS" ? (
          <div className="sm:col-span-2">
            <label htmlFor={`${formId}-company`} className="field-label">
              {t("fields.company")}
            </label>
            <input
              id={`${formId}-company`}
              name="company"
              required
              maxLength={160}
              autoComplete="organization"
              className="field"
            />
          </div>
        ) : null}

        <div>
          <label htmlFor={`${formId}-email`} className="field-label">
            {t("fields.email")}
            {optional}
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            maxLength={160}
            autoComplete="email"
            className="field"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-weightKg`} className="field-label">
            {t("fields.weight")}
            {optional}
          </label>
          <div className="relative flex items-center">
            <input
              id={`${formId}-weightKg`}
              name="weightKg"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              className="field pr-11 tabular-nums"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3.5 my-auto flex h-5 items-center text-sm font-medium text-muted">
              kg
            </span>
          </div>
        </div>

        {/* Route Direction Selector: replaces 2 redundant native <select> boxes with a single-tap 2-way route control */}
        <fieldset className="sm:col-span-2">
          <legend className="field-label">{t("fields.direction")}</legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {routes.map((route) => {
              const active = origin === route.origin;
              return (
                <label
                  key={route.origin}
                  className={`flex min-h-12 cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold ${
                    active
                      ? "border-forest bg-sage/75 text-forest ring-2 ring-forest/15"
                      : "border-line bg-white text-ink hover:border-forest/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="routeDirection"
                    value={route.origin}
                    checked={active}
                    onChange={() => setOrigin(route.origin)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                      active ? "bg-forest text-gold" : "bg-sage text-forest"
                    }`}
                  >
                    <AirplaneTilt size={16} weight={active ? "fill" : "regular"} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{route.label}</span>
                  <span
                    aria-hidden
                    className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      active ? "border-forest bg-forest text-white" : "border-forest/35 bg-white text-transparent"
                    }`}
                  >
                    <Check size={12} weight="bold" />
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-description`} className="field-label">
            {t("fields.description")}
            {optional}
          </label>
          <textarea
            id={`${formId}-description`}
            name="description"
            rows={3}
            maxLength={2000}
            className="field"
          />
        </div>
      </div>

      {/* Custom styled checkbox (choice-controls.md): peer appearance-none + SVG Check icon */}
      <label className="mt-5 flex min-h-11 w-fit cursor-pointer items-start gap-3 text-sm leading-relaxed select-none">
        <span className="relative mt-0.5 inline-flex size-5 shrink-0 items-center justify-center">
          <input
            type="checkbox"
            name="privacyConsent"
            required
            className="peer size-5 cursor-pointer appearance-none rounded-md border-[1.5px] border-forest/50 bg-white transition-colors checked:border-forest checked:bg-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          />
          <Check
            size={13}
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100"
          />
        </span>
        <span className="text-ink text-pretty">{t("fields.consent")}</span>
      </label>

      {status === "error" && (
        <p
          role="alert"
          className="mt-5 flex gap-2.5 rounded-lg border border-orange-deep/35 bg-orange-soft px-4 py-3 text-sm text-orange-deep"
        >
          <WarningCircle size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0" />
          <span className="text-pretty">{t("error")}</span>
        </p>
      )}

      <button
        type="submit"
        aria-disabled={status === "sending" || undefined}
        aria-busy={status === "sending" || undefined}
        className="btn btn-primary mt-5 w-full aria-disabled:pointer-events-none aria-disabled:opacity-75"
      >
        {status === "sending" && <CircleNotch size={18} weight="bold" aria-hidden className="animate-spin" />}
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
