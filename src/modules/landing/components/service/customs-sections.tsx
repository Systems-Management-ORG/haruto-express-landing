import Image from "next/image";
import { useTranslations } from "next-intl";
import { Goods } from "../goods";

// Sections only the accepted & prohibited goods page has: the five customs-check groups (round
// chips in the hero that jump to their cards, then the cards in two panels) and the colour-coded
// accepted / not-guaranteed / prohibited lists.

// Art cut from HARUTO's text-free "5 groups customs check" poster (public/images/haruto/hang-cam).
const ART = "/images/haruto/hang-cam";
// One photo per entry of `customs.groups.items`, in order; the first three are the
// "pay special attention" groups, the last two "also watch out for".
const GROUP_IMAGES = ["my-pham", "hang-hieu", "thuc-pham-chuc-nang", "thuc-pham-dong-goi", "thiet-bi-co-pin"];
const SPECIAL = 3;

type Group = { short: string; title: string; body: string };

export function CustomsChips() {
  const t = useTranslations("customs");
  const groups = t.raw("groups.items") as Group[];

  return (
    <div className="wrap pb-10 lg:pb-12">
      <ul className="customs-chips">
        {groups.map((group, index) => (
          <li key={group.short}>
            <a href={`#nhom-${index + 1}`} className="customs-chip">
              <span className="customs-chip__img">
                <Image
                  src={`${ART}/${GROUP_IMAGES[index]}.webp`}
                  alt=""
                  width={180}
                  height={215}
                  sizes="7rem"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="customs-chip__label">{group.short}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupCard({ group, index }: { group: Group; index: number }) {
  return (
    <li id={`nhom-${index + 1}`} className="customs-card">
      <p className="customs-card__no">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="customs-card__title">{group.title}</h3>
      <div className="customs-card__media">
        <Image
          src={`${ART}/${GROUP_IMAGES[index]}.webp`}
          alt=""
          width={244}
          height={215}
          sizes="(max-width: 639px) 45vw, 15rem"
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{group.body}</p>
    </li>
  );
}

export function CustomsGroups() {
  const t = useTranslations("customs.groups");
  const groups = t.raw("items") as Group[];

  return (
    <section className="section">
      <div className="wrap">
        <p data-reveal className="mx-auto max-w-[44rem] text-center text-lg font-medium sm:text-xl">
          {t("intro")}
        </p>
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="customs-panel">
            <h2 data-reveal className="customs-panel__title">
              <span className="customs-panel__count">{t("specialCount")}</span>{" "}
              <span className="block text-sun">{t("specialTitle")}</span>
            </h2>
            <ul data-reveal-group className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {groups.slice(0, SPECIAL).map((group, index) => (
                <GroupCard key={group.title} group={group} index={index} />
              ))}
            </ul>
          </div>
          <div className="customs-panel">
            <h2 data-reveal className="customs-panel__title">
              <span className="customs-panel__count">{t("restCount")}</span>{" "}
              <span className="block text-sun">{t("restTitle")}</span>
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
  );
}

export function CustomsLists() {
  const t = useTranslations("customs.lists");

  return (
    <section className="bg-sage pt-16 lg:pt-24">
      <div className="wrap text-center">
        <h2 data-reveal className="heading-2">
          {t("title")}
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-[44rem] sm:text-lg">
          {t("intro")}
        </p>
      </div>
      <Goods />
    </section>
  );
}
