import { ArrowRight, ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { CHAT_CHANNELS, ChannelIcon } from "@/shared/components/contact-links";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";

// Art cut from HARUTO's text-free "FFM JAPAN" poster (public/images/haruto/ffm).
const ART = "/images/haruto/ffm";
// One icon per entry of `fulfillment.steps.items`, `.audience.items` and `.benefits.items`.
const STEP_ICONS = ["buoc-nhan-hang", "buoc-ton-kho", "buoc-dong-goi", "buoc-giao-hang", "buoc-bao-cao"];
const AUDIENCE_ICONS = ["dt-doanh-nghiep", "dt-ban-le", "dt-tmdt", "dt-thuong-hieu"];
const BENEFIT_ICONS = ["lt-chi-phi", "lt-xu-ly", "lt-an-toan", "lt-phat-trien"];

type Item = { title: string; body: string };

function ContactButtons({ withZalo = true }: { withZalo?: boolean }) {
  const t = useTranslations("fulfillment.cta");
  const locale = useLocale() as Locale;
  const zalo = CHAT_CHANNELS.find((channel) => channel.id === "zalo");

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link href={`${pagePath(locale, "contact")}#contact`} data-track="cta_contact" className="btn btn-primary">
        {t("contact")}
        <ArrowRight size={18} weight="bold" aria-hidden className="m-arrow" />
      </Link>
      {withZalo && zalo && (
        <a
          href={zalo.href}
          target="_blank"
          rel="noopener noreferrer"
          data-track="click_zalo"
          className="btn btn-outline bg-white/70"
        >
          <span className="rounded-md bg-white p-0.5">
            <ChannelIcon id="zalo" size={20} />
          </span>
          {t("zalo")}
        </a>
      )}
    </div>
  );
}

// Banner: "FFM JAPAN" headline, ribbon and pitch on the left; the HARUTO warehouse under Mount
// Fuji on the right, feathered into the page on its left and bottom edges.
export function FulfillmentHero() {
  const t = useTranslations("fulfillment.hero");

  return (
    <section className="ffm-hero">
      <div className="wrap grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-14">
        <div className="relative z-[1]">
          <Breadcrumbs page="business" />
          <h1 className="ffm-title mt-6">
            <span className="text-forest">FFM</span> <span className="text-[#f28c13]">JAPAN</span>
            <span className="ffm-title__flag" aria-hidden />
            <span className="sr-only"> – {t("srTitle")}</span>
          </h1>
          <p className="auction-ribbon mt-4">{t("ribbon")}</p>
          <p className="mt-6 text-xl font-bold text-forest sm:text-2xl">{t("tagline")}</p>
          <p className="mt-3 max-w-[36rem] sm:text-lg">{t("body")}</p>
          <div className="mt-8">
            <ContactButtons withZalo={false} />
          </div>
        </div>
        <div className="ffm-scene">
          <Image
            src={`${ART}/kho-ffm-nhat-ban.webp`}
            alt={t("imageAlt")}
            width={512}
            height={552}
            priority
            quality={90}
            sizes="(max-width: 1023px) 100vw, 42vw"
            className="ffm-scene__img"
          />
        </div>
      </div>
    </section>
  );
}

export function Fulfillment() {
  const t = useTranslations("fulfillment");
  const steps = t.raw("steps.items") as Item[];
  const audience = t.raw("audience.items") as Item[];
  const benefits = t.raw("benefits.items") as Item[];

  return (
    <>
      <section className="section bg-sage">
        <div className="wrap">
          <h2 data-reveal className="ffm-section-title">{t("steps.title")}</h2>
          <ol data-reveal-group className="ffm-flow mt-10 lg:mt-12">
            {steps.map((step, index) => (
              <li key={step.title} className="ffm-flow__step">
                <Image src={`${ART}/${STEP_ICONS[index]}.webp`} alt="" width={136} height={136} className="ffm-flow__icon" />
                <p className="mt-4 font-bold tracking-wide text-forest uppercase">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <p data-reveal className="ffm-flow__extra">
            <ArrowsLeftRight size={20} weight="bold" aria-hidden />
            {t("steps.extra")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 data-reveal className="ffm-section-title">{t("audience.title")}</h2>
          <ul data-reveal-group className="ffm-audience mt-10 lg:mt-12">
            {audience.map((item, index) => (
              <li key={item.title} className="ffm-audience__item">
                <Image src={`${ART}/${AUDIENCE_ICONS[index]}.webp`} alt="" width={100} height={84} className="mx-auto h-16 w-auto" />
                <p className="mt-3 font-bold tracking-wide text-forest uppercase">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ffm-benefits">
        <div className="wrap py-10 lg:py-12">
          <ul data-reveal-group className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {benefits.map((item, index) => (
              <li key={item.title} className="auction-benefit ffm-benefit">
                <Image src={`${ART}/${BENEFIT_ICONS[index]}.webp`} alt="" width={78} height={78} className="ffm-benefit__icon" />
                <span>
                  <span className="block font-bold tracking-wide uppercase">{item.title}</span>
                  <span className="mt-1 block text-sm text-ivory/80">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div data-reveal className="ffm-closing">
            <Image src="/logo/haruto-mark.png" alt="" width={92} height={80} className="mx-auto h-16 w-auto" />
            <p className="mx-auto mt-5 max-w-[46rem] text-lg sm:text-xl">{t("closing.body")}</p>
            <p className="mt-4 font-bold tracking-[0.12em] text-forest uppercase">{t("closing.tagline")}</p>
            <div className="mt-8 flex justify-center">
              <ContactButtons />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
