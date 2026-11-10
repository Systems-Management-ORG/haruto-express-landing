import { ArrowRight, ChatCircleText, Gavel, Package, ShoppingCart, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { CHAT_CHANNELS, ChannelIcon } from "@/shared/components/contact-links";
import type { Locale } from "@/shared/constants/locales";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { Goods } from "./goods";

// Art cut from HARUTO's text-free "5 groups customs check" poster (public/images/haruto/hang-cam).
const ART = "/images/haruto/hang-cam";
// One photo per entry of `customs.groups.items`, in order; the first three are the
// "pay special attention" groups, the last two "also watch out for".
const GROUP_IMAGES = ["my-pham", "hang-hieu", "thuc-pham-chuc-nang", "thuc-pham-dong-goi", "thiet-bi-co-pin"];
const SPECIAL = 3;
// The closing band links each HARUTO service to its page.
const SERVICES: { key: "ship" | "buy" | "auction"; Icon: typeof Package; page: PageKey }[] = [
  { key: "ship", Icon: Package, page: "shipToJapan" },
  { key: "buy", Icon: ShoppingCart, page: "concierge" },
  { key: "auction", Icon: Gavel, page: "auction" },
];

type Group = { short: string; title: string; body: string };

// Banner: poster headline ("5 groups customs check closely"), the warning callout, the customs
// inspection scene, and the five groups as round photo chips that jump to their cards.
export function CustomsHero() {
  const t = useTranslations("customs");
  const groups = t.raw("groups.items") as Group[];

  return (
    <section className="customs-hero">
      <div className="wrap py-10 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          <div className="relative z-[1]">
            <Breadcrumbs page="goods" />
            <h1 className="customs-title mt-6">
              <span className="customs-title__count">{t("hero.titleA")}</span>
              <span className="block text-[#ea580c]">{t("hero.titleB")}</span>
            </h1>
            <p className="auction-ribbon mt-4">{t("hero.ribbon")}</p>
            <div className="customs-alert mt-6">
              <WarningCircle size={28} weight="fill" aria-hidden className="shrink-0 text-[#f59e0b]" />
              <div>
                <p className="font-bold">{t("hero.alertTitle")}</p>
                <p className="mt-1 text-sm text-ivory/85 sm:text-base">{t("hero.alertBody")}</p>
              </div>
            </div>
          </div>
          <Image
            src={`${ART}/canh-kiem-tra-hai-quan.webp`}
            alt={t("hero.imageAlt")}
            width={694}
            height={466}
            priority
            quality={90}
            sizes="(max-width: 1023px) 100vw, 46vw"
            className="customs-scene"
          />
        </div>

        <ul className="customs-chips mt-8 lg:mt-10">
          {groups.map((group, index) => (
            <li key={group.short}>
              <a href={`#nhom-${index + 1}`} className="customs-chip">
                <span className="customs-chip__img">
                  <Image src={`${ART}/${GROUP_IMAGES[index]}.webp`} alt="" width={180} height={215} className="h-full w-full object-cover" />
                </span>
                <span className="customs-chip__label">{group.short}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function GroupCard({ group, index }: { group: Group; index: number }) {
  return (
    <li id={`nhom-${index + 1}`} className="customs-card">
      <p className="customs-card__no">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="customs-card__title">{group.title}</h3>
      <div className="customs-card__media">
        <Image src={`${ART}/${GROUP_IMAGES[index]}.webp`} alt="" width={244} height={215} className="h-full w-full object-contain" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{group.body}</p>
    </li>
  );
}

export function CustomsBody() {
  const t = useTranslations("customs");
  const locale = useLocale() as Locale;
  const groups = t.raw("groups.items") as Group[];
  const zalo = CHAT_CHANNELS.find((channel) => channel.id === "zalo");

  return (
    <>
      <section className="section">
        <div className="wrap">
          <p data-reveal className="mx-auto max-w-[44rem] text-center text-lg font-medium sm:text-xl">
            {t("groups.intro")}
          </p>
          <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div data-reveal className="customs-panel">
              <h2 className="customs-panel__title">
                <span className="customs-panel__count">{t("groups.specialCount")}</span>
                <span className="block text-[#ea580c]">{t("groups.specialTitle")}</span>
              </h2>
              <ul data-reveal-group className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {groups.slice(0, SPECIAL).map((group, index) => (
                  <GroupCard key={group.title} group={group} index={index} />
                ))}
              </ul>
            </div>
            <div data-reveal className="customs-panel">
              <h2 className="customs-panel__title">
                <span className="customs-panel__count">{t("groups.restCount")}</span>
                <span className="block text-[#ea580c]">{t("groups.restTitle")}</span>
              </h2>
              <ul data-reveal-group className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                {groups.slice(SPECIAL).map((group, index) => (
                  <GroupCard key={group.title} group={group} index={index + SPECIAL} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 lg:pb-24">
        <div className="wrap">
          <div data-reveal className="customs-support">
            <Image src={`${ART}/thung-hang-an-toan.webp`} alt="" width={220} height={122} className="customs-support__art" />
            <div className="relative z-[1] max-w-[40rem]">
              <p className="flex items-center gap-3 text-xl font-bold sm:text-2xl">
                <ChatCircleText size={34} weight="duotone" aria-hidden className="shrink-0 text-gold" />
                <span>
                  <span className="text-gold">HARUTO EXPRESS</span> {t("support.title")}
                </span>
              </p>
              <p className="mt-3 text-ivory/90 sm:text-lg">{t("support.body")}</p>
              <p className="mt-2 text-ivory/80">{t("support.ask")}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {zalo && (
                  <a href={zalo.href} target="_blank" rel="noopener noreferrer" data-track="click_zalo" className="btn btn-gold">
                    <span className="rounded-md bg-white p-0.5">
                      <ChannelIcon id="zalo" size={20} />
                    </span>
                    {t("support.zalo")}
                  </a>
                )}
                <a
                  href={`${pagePath(locale, "contact")}#contact`}
                  data-track="cta_contact"
                  className="btn btn-outline border-ivory/50 text-ivory hover:bg-white/10"
                >
                  {t("support.contact")}
                  <ArrowRight size={18} aria-hidden className="m-arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sage pt-16 lg:pt-24">
        <div className="wrap text-center">
          <h2 data-reveal className="heading-2">{t("lists.title")}</h2>
          <p data-reveal className="mx-auto mt-4 max-w-[44rem] sm:text-lg">{t("lists.intro")}</p>
        </div>
        <Goods />
      </section>

      <section className="customs-services">
        <div className="wrap flex flex-col items-center gap-5 py-8 lg:flex-row lg:justify-between">
          <p className="text-center text-lg font-bold tracking-wide uppercase lg:text-left">{t("services.title")}</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {SERVICES.map(({ key, Icon, page }) => (
              <li key={key}>
                <a href={pagePath(locale, page)} className="customs-service-link">
                  <Icon size={22} weight="duotone" aria-hidden />
                  {t(`services.${key}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
