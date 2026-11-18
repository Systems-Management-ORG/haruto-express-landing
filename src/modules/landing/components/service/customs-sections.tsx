import Image from "next/image";
import { useTranslations } from "next-intl";
import { rawRecord } from "@/shared/lib/raw-messages";
import { SectionHead } from "@/shared/ui/section-head";
import { Goods } from "../goods";

// Sections only the accepted & prohibited goods page has: the five customs-check groups (one grid
// of cards, the first three tagged "extra care") and the colour-coded accepted / not-guaranteed /
// prohibited lists.

// Art cut from HARUTO's text-free "5 groups customs check" poster (public/images/haruto/hang-cam).
const ART = "/images/haruto/hang-cam";
// One photo per group id of `customs.groups.items` (whose key order is the display order); the
// first three are the "extra care" groups, the last two "also check".
const GROUP_IMAGES: Record<string, string> = {
  cosmetics: "my-pham",
  brands: "hang-hieu",
  supplements: "thuc-pham-chuc-nang",
  food: "thuc-pham-dong-goi",
  batteries: "thiet-bi-co-pin",
};
const SPECIAL = 3;

type Group = { short: string; title: string; body: string };
type Entry = [id: string, group: Group];

function useGroups(): Entry[] {
  const t = useTranslations("customs");
  return Object.entries(rawRecord<Group>(t, "groups.items"));
}

const no = (index: number) => String(index + 1).padStart(2, "0");

function GroupCard({ id, group, index, special }: { id: string; group: Group; index: number; special: boolean }) {
  const t = useTranslations("customs.groups");
  return (
    <li id={`nhom-${index + 1}`} className="customs-card">
      <div className="customs-card__media">
        <Image
          src={`${ART}/${GROUP_IMAGES[id]}.webp`}
          alt={group.title}
          width={244}
          height={215}
          sizes="(max-width: 639px) 80vw, (max-width: 1023px) 40vw, 15rem"
          className="h-full w-full object-contain"
        />
        <span className="customs-card__no">{no(index)}</span>
      </div>
      <div className="p-5">
        <span className={special ? "customs-tag customs-tag--special" : "customs-tag"}>
          {t(special ? "tagSpecial" : "tagRest")}
        </span>
        <h3 className="mt-3 text-lg font-medium text-forest">{group.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{group.body}</p>
      </div>
    </li>
  );
}

export function CustomsGroups() {
  const t = useTranslations("customs.groups");
  const groups = useGroups();

  return (
    <section className="section">
      <div className="wrap">
        <SectionHead title={t("title")} intro={t("intro")} />
        <ul data-reveal-group className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5">
          {groups.map(([id, group], index) => (
            <GroupCard key={id} id={id} group={group} index={index} special={index < SPECIAL} />
          ))}
        </ul>
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
