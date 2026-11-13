import Link from "next/link";
import {
  AirplaneTilt,
  ArrowRight,
  Calculator,
  CheckCircle,
  CreditCard,
  CurrencyJpy,
  Handshake,
  LinkSimple,
  Path,
  Warehouse,
} from "@phosphor-icons/react/dist/ssr";
import { getImageProps } from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { CHAT_CHANNELS, ChannelIcon } from "@/shared/components/contact-links";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { Policy } from "./policy";

// One icon per entry of `concierge.steps.items` and `concierge.why.items`, in order.
const STEP_ICONS = [LinkSimple, Calculator, CreditCard, Warehouse, AirplaneTilt];
const WHY_ICONS = [CreditCard, CurrencyJpy, Handshake, Path];

const zalo = CHAT_CHANNELS.find((channel) => channel.id === "zalo");

// Primary action: send the product link over Zalo (the consultant), else the contact form.
// One button style per use: stacking btn-primary and btn-gold let the primary hover colour win,
// which hid the button on the dark closing band.
function SendLinkButton({ label, variant = "primary" }: { label: string; variant?: "primary" | "gold" }) {
  const locale = useLocale() as Locale;
  if (!zalo) {
    return (
      <Link href={`${pagePath(locale, "contact")}#contact`} data-track="cta_contact" className={`btn btn-${variant}`}>
        {label}
        <ArrowRight size={18} weight="bold" aria-hidden className="m-arrow" />
      </Link>
    );
  }
  return (
    <a href={zalo.href} target="_blank" rel="noopener noreferrer" data-track="click_zalo" className={`btn btn-${variant}`}>
      <span className="rounded-md bg-white p-0.5">
        <ChannelIcon id="zalo" size={22} />
      </span>
      {label}
    </a>
  );
}

// Banner for the buying-service page: the landscape art fills the band on large screens with the
// copy over its blank cream left side; small screens stack the copy over the portrait art. One
// <picture>, so each visitor downloads only the art for their screen.
export function ConciergeHero() {
  const t = useTranslations("concierge.hero");
  const locale = useLocale() as Locale;
  const platforms = t.raw("platforms") as string[];

  const shared = { alt: t("imageAlt"), sizes: "100vw", priority: true, quality: 90 } as const;
  const {
    props: { srcSet: desktopSet },
  } = getImageProps({ ...shared, src: "/images/haruto/mua-ho/mua-ho-hang-nhat.webp", width: 760, height: 1001 });
  const {
    props: { srcSet: mobileSet, ...img },
  } = getImageProps({ ...shared, src: "/images/haruto/mua-ho/mua-ho-hang-nhat.webp", width: 760, height: 1001 });

  return (
    <section className="muaho-hero">
      <div className="wrap muaho-hero__copy">
        <Breadcrumbs page="concierge" />
        <p className="mt-5 text-sm font-semibold tracking-[0.14em] text-[#9a6514] uppercase">{t("eyebrow")}</p>
        <h1 className="heading-1 mt-3 max-w-[18ch] text-forest">{t("title")}</h1>
        <p className="mt-5 max-w-[34rem] sm:text-lg">{t("body")}</p>

        <p className="mt-6 text-sm font-medium text-muted">{t("platformsLabel")}</p>
        <ul className="mt-2 flex max-w-[34rem] flex-wrap gap-2">
          {platforms.map((name) => (
            <li key={name} className="muaho-chip">
              <CheckCircle size={16} weight="fill" aria-hidden />
              {name}
            </li>
          ))}
          <li className="muaho-chip muaho-chip--alt">{t("extra")}</li>
        </ul>

        <div className="mt-8">
          <Link href={`${pagePath(locale, "contact")}#contact`} data-track="cta_contact" className="btn btn-primary">
            {t("ctaContact")}
            <ArrowRight size={18} weight="bold" aria-hidden className="m-arrow" />
          </Link>
        </div>
      </div>

      <picture className="muaho-hero__art">
        <source media="(min-width: 1024px)" srcSet={desktopSet} />
        <source srcSet={mobileSet} />
        {/* eslint-disable-next-line @next/next/no-img-element -- art-directed <picture> from getImageProps */}
        <img {...img} alt={shared.alt} />
      </picture>
    </section>
  );
}

// Body of the buying-service page: steps, reasons, the payment/deposit terms and a closing CTA.
export function ConciergeBody() {
  const t = useTranslations("concierge");
  const steps = t.raw("steps.items") as string[];
  const reasons = t.raw("why.items") as { title: string; body?: string }[];

  return (
    <>
      <section className="section">
        <div className="wrap">
          <h2 data-reveal className="heading-2">{t("steps.title")}</h2>
          <ol data-reveal-group className="muaho-steps mt-10 lg:mt-12">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? LinkSimple;
              return (
                <li key={step} className="muaho-step">
                  <span className="muaho-step__icon" aria-hidden>
                    <Icon size={30} weight="duotone" />
                    <span className="muaho-step__no">{index + 1}</span>
                  </span>
                  <span className="muaho-step__label text-lg leading-snug font-medium text-forest">{step}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section bg-sage">
        <div className="wrap">
          <h2 data-reveal className="heading-2 text-center">{t("why.title")}</h2>
          <ul data-reveal-group className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {reasons.map((reason, index) => {
              const Icon = WHY_ICONS[index] ?? CheckCircle;
              return (
                <li key={reason.title} className="info-card text-center">
                  <span className="why-badge" aria-hidden>
                    <Icon size={32} weight="duotone" />
                  </span>
                  <p className="mt-5 text-lg leading-snug font-medium text-forest">{reason.title}</p>
                  {reason.body && <p className="mt-2 text-sm text-muted">{reason.body}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Policy show={["concierge"]} withHeader={false} />

      <section className="section ffm-cta text-ivory">
        <div className="wrap text-center">
          <h2 data-reveal className="heading-2 text-white">{t("cta.title")}</h2>
          <p data-reveal className="mx-auto mt-4 max-w-[40rem] text-ivory/85 sm:text-lg">{t("cta.body")}</p>
          <div data-reveal className="mt-8 flex justify-center">
            <SendLinkButton label={t("hero.ctaLink")} variant="gold" />
          </div>
        </div>
      </section>
    </>
  );
}
