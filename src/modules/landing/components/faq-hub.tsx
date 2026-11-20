"use client";

import { MagnifyingGlass, PhoneCall, Question, XCircle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { HOTLINES, telHref } from "@/shared/seo/business";
import { ContactCta } from "@/shared/ui/contact-cta";
import { SectionHead } from "@/shared/ui/section-head";
import { FAQ_GROUP_ICONS } from "../info-pages";
import { FaqList } from "./faq";
import type { FaqGroup } from "./info/faq-groups";
import type { FaqItem } from "./faq";

// FAQ hub for /cau-hoi-thuong-gap. Mirrors the guides-page rhythm: a compact control section
// (search + category chips + hotline) at the top, then one `.section` per group with
// SectionHead (H2 + intro) and FaqList below — identical shape to InfoSection used by the
// guides, Japan-warehouse and price-policy pages. Support affordances live elsewhere on the
// page (hotline chip here, floating Zalo button, the CtaBand that InfoPage renders).

export function FaqHub({ groups }: { groups: FaqGroup[] }) {
  const t = useTranslations("faq");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");

  const allQuestions = useMemo(() => {
    const list: (FaqItem & { groupId: string })[] = [];
    for (const g of groups) {
      for (const item of g.items) list.push({ ...item, groupId: g.id });
    }
    return list;
  }, [groups]);

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return null;
    return allQuestions.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query),
    );
  }, [search, allQuestions]);

  const displayedGroups = useMemo(() => {
    if (activeTab === "all") return groups;
    return groups.filter((g) => g.id === activeTab);
  }, [groups, activeTab]);

  return (
    <div className="faq-hub">
      <section className="section pb-10 lg:pb-12">
        <div className="wrap flex flex-col gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-xl flex-1">
              <MagnifyingGlass
                size={20}
                weight="bold"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("hub.searchPlaceholder")}
                className="w-full rounded-xl border border-line bg-white pl-10 pr-10 py-2.5 text-sm text-ink transition-all placeholder:text-muted/80 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink"
                  aria-label={t("hub.searchClear")}
                >
                  <XCircle size={18} weight="fill" />
                </button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
              <span className="hidden sm:inline">{t("hub.supportHotline")}</span>
              <a
                href={telHref(HOTLINES[1].tel)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 font-semibold text-forest transition-colors hover:border-forest hover:bg-forest/5"
              >
                <PhoneCall size={15} weight="duotone" className="text-gold" />
                <span>{HOTLINES[1].display}</span>
              </a>
            </div>
          </div>

          {!search && (
            <div className="scrollbar-none -my-1 flex items-center gap-2 overflow-x-auto py-1">
              <CategoryChip
                active={activeTab === "all"}
                label={t("hub.allTopics")}
                count={allQuestions.length}
                onClick={() => setActiveTab("all")}
              />
              {groups.map((group) => {
                const Icon = FAQ_GROUP_ICONS[group.id] ?? Question;
                return (
                  <CategoryChip
                    key={group.id}
                    active={activeTab === group.id}
                    icon={Icon}
                    label={t(`groups.${group.id}`)}
                    count={group.items.length}
                    onClick={() => setActiveTab(group.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {filteredQuestions !== null ? (
        <section className="section bg-sage">
          <div className="wrap max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <p className="text-sm font-medium text-muted">
                {t("hub.searchResultsFor")}{" "}
                <strong className="text-forest">&ldquo;{search}&rdquo;</strong>:
              </p>
              <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                {filteredQuestions.length} {t("hub.searchHitsUnit")}
              </span>
            </div>

            {filteredQuestions.length > 0 ? (
              <FaqList items={filteredQuestions} />
            ) : (
              <div className="rounded-(--radius-card) border border-dashed border-line bg-white p-10 text-center">
                <Question size={40} weight="duotone" className="mx-auto text-muted" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-forest">
                  {t("hub.searchEmptyTitle")}
                </h3>
                <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">
                  {t("hub.searchEmptyBody")}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <ContactCta action="zalo" variant="primary" />
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        displayedGroups.map((group, index) => {
          const desc = t(`groupDescriptions.${group.id}`);
          const tinted = index % 2 === 1;
          return (
            <section
              key={group.id}
              id={`faq-${group.id}`}
              className={tinted ? "section bg-sage" : "section"}
            >
              <div className="wrap">
                <SectionHead title={t(`groups.${group.id}`)} intro={desc} align="start" />
                <div className="mt-8 max-w-4xl lg:mt-10">
                  <FaqList items={group.items} />
                </div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function CategoryChip({
  active,
  icon: Icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon?: typeof Question;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
        active
          ? "bg-forest text-white shadow-xs"
          : "border border-line bg-white text-forest hover:border-forest/40 hover:bg-forest/5"
      }`}
    >
      {Icon && <Icon size={15} weight={active ? "fill" : "duotone"} aria-hidden />}
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
          active ? "bg-white/20 text-white" : "bg-sage text-forest"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
