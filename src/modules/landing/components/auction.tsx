import {
  ArrowRight,
  CheckCircle,
  ClipboardText,
  Gavel,
  Headset,
  LinkSimple,
  Package,
  ShieldCheck,
  SealCheck,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { CHAT_CHANNELS, ChannelIcon, PhoneIcon, primaryHotline } from "@/shared/components/contact-links";
import type { Locale } from "@/shared/constants/locales";
import { telHref } from "@/shared/seo/business";
import { pagePath } from "@/shared/seo/pages";

// Art cut from HARUTO's text-free auction artwork (public/images/haruto/dau-gia).
const ART = "/images/haruto/dau-gia";
// One photo per entry of `auction.products.items`, in order.
const PRODUCT_IMAGES = ["may-anh", "mo-hinh-figure", "tui-xach", "noi-com-dien", "meo-than-tai"];
// One icon per entry of `auction.steps.items` / `auction.benefits.items`.
const STEP_ICONS = [LinkSimple, ClipboardText, Gavel, Truck];
const BENEFIT_ICONS = [ShieldCheck, Headset, Package, SealCheck];

const zalo = CHAT_CHANNELS.find((channel) => channel.id === "zalo");

function ZaloButton({ label, variant }: { label: string; variant: "primary" | "gold" }) {
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

function CallButton({ className }: { className: string }) {
  const locale = useLocale();
  const line = primaryHotline(locale);
  if (!line) return null;
  return (
    <a href={telHref(line.tel)} data-track={`click_hotline_${line.id}`} className={className}>
      <PhoneIcon size={20} />
      {line.display}
    </a>
  );
}

// Banner: copy on the left; on the right the auction scene (Fuji, sakura, phone bidding on a
// camera, gavel, parcels) eases in, its left edge feathered into the page, with a gently
// floating "thousands of products" seal.
export function AuctionHero() {
  const t = useTranslations("auction.hero");
  const platforms = t.raw("platforms") as string[];

  return (
    <section className="auction-hero">
      <div className="wrap grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-6 lg:py-14">
        <div className="relative z-[1]">
          <Breadcrumbs page="auction" />
          <p className="mt-5 text-sm font-semibold tracking-[0.14em] text-[#c2410c] uppercase">{t("eyebrow")}</p>
          <h1 className="auction-title mt-3">
            <span className="block text-forest">{t("titleA")}</span>
            <span className="block text-[#ea580c]">{t("titleB")}</span>
          </h1>
          <p className="auction-ribbon mt-4">{t("ribbon")}</p>
          <p className="mt-5 max-w-[34rem] sm:text-lg">{t("body")}</p>

          <p className="mt-6 text-sm font-medium text-muted">{t("platformsLabel")}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {platforms.map((name) => (
              <li key={name} className="muaho-chip">
                <Gavel size={16} weight="fill" aria-hidden />
                {name}
              </li>
            ))}
          </ul>

        </div>

        <div className="auction-art">
          <Image
            src={`${ART}/dau-gia-hang-nhat-banner.webp`}
            alt={t("imageAlt")}
            width={937}
            height={600}
            priority
            quality={90}
            sizes="(max-width: 1023px) 100vw, 52vw"
            className="auction-art__img"
          />
          <p className="auction-seal" aria-hidden>
            {t("badge")}
          </p>
        </div>
      </div>
    </section>
  );
}

export function AuctionBody() {
  const t = useTranslations("auction");
  const tPolicy = useTranslations("policy.concierge");
  const products = t.raw("products.items") as string[];
  const steps = t.raw("steps.items") as { title: string; body: string }[];
  const benefits = t.raw("benefits.items") as { title: string; body: string }[];

  return (
    <>
      <section className="section">
        <div className="wrap">
          <div className="text-center">
            <h2 data-reveal className="heading-2">{t("products.title")}</h2>
            <p data-reveal className="mx-auto mt-4 max-w-[40rem] sm:text-lg">{t("products.intro")}</p>
          </div>
          <ul data-reveal-group className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-12 lg:grid-cols-5">
            {products.map((item, index) => (
              <li key={item} className="auction-product">
                <div className="auction-product__media">
                  <Image
                    src={`${ART}/${PRODUCT_IMAGES[index] ?? "may-anh"}.webp`}
                    alt=""
                    width={188}
                    height={134}
                    sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 18vw"
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="auction-product__label">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-sage">
        <div className="wrap">
          <h2 data-reveal className="heading-2 text-center">{t("steps.title")}</h2>
          <ol data-reveal-group className="muaho-steps muaho-steps--4 mt-10 lg:mt-12">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? LinkSimple;
              return (
                <li key={step.title} className="muaho-step">
                  <span className="muaho-step__icon" aria-hidden>
                    <Icon size={30} weight="duotone" />
                    <span className="muaho-step__no">{index + 1}</span>
                  </span>
                  <span className="muaho-step__label">
                    <span className="block text-lg leading-snug font-semibold text-forest">{step.title}</span>
                    <span className="mt-1 block text-sm text-muted">{step.body}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div data-reveal className="auction-terms mt-12">
            <Gavel size={28} weight="duotone" aria-hidden className="shrink-0 text-forest" />
            <div>
              <p className="font-semibold text-forest">{t("terms.title")}</p>
              <p className="mt-1 text-muted">{tPolicy("auction.body")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="auction-benefits">
        <div className="wrap">
          <ul data-reveal-group className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:py-12">
            {benefits.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[index] ?? CheckCircle;
              return (
                <li key={benefit.title} className="auction-benefit">
                  <Icon size={40} weight="duotone" aria-hidden className="shrink-0 text-gold" />
                  <span>
                    <span className="block font-semibold tracking-wide uppercase">{benefit.title}</span>
                    <span className="mt-1 block text-sm text-ivory/80">{benefit.body}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div data-reveal className="auction-cta">
            <div className="relative z-[1] max-w-[36rem]">
              <h2 className="heading-2">{t("cta.title")}</h2>
              <p className="mt-4 sm:text-lg">{t("cta.body")}</p>
              <p className="mt-3 font-medium text-forest">{t("benefits.tagline")}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ZaloButton label={t("hero.ctaLink")} variant="gold" />
                <CallButton className="btn btn-outline bg-white" />
              </div>
            </div>
            <Image
              src={`${ART}/xe-tai-giao-hang.webp`}
              alt=""
              width={385}
              height={122}
              sizes="(max-width: 1023px) 80vw, 30vw"
              className="auction-cta__truck"
            />
          </div>
        </div>
      </section>
    </>
  );
}
