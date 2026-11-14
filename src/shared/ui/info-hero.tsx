import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { NAV } from "@/shared/seo/nav";
import type { PageKey } from "@/shared/seo/pages";
import { HeroShell } from "./hero-shell";

// Hero of the info pages (pricing, policy, warehouse, FAQ, guides, contact): the shared page hero
// with the page's title and intro from `pages.<key>`, its menu group as the eyebrow.
export function InfoHero({
  page,
  note,
  actions,
  after,
}: {
  page: Exclude<PageKey, "home">;
  note?: ReactNode;
  actions?: ReactNode;
  after?: ReactNode;
}) {
  const t = useTranslations("pages");
  const tNav = useTranslations("nav.groups");
  const group = NAV.find((item) => item.type === "group" && item.children.includes(page));

  return (
    <HeroShell
      page={page}
      eyebrow={group?.type === "group" ? tNav(group.id) : undefined}
      title={t(`${page}.title`)}
      lead={t(`${page}.intro`)}
      note={note}
      actions={actions}
      after={after}
    />
  );
}
