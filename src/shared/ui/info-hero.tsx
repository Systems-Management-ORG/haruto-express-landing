import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { PAGE_IMAGES } from "@/shared/seo/page-media";
import { NAV } from "@/shared/seo/nav";
import type { PageKey } from "@/shared/seo/pages";
import { HeroShell } from "./hero-shell";

// Hero of the info pages (pricing, policy, warehouse, FAQ, guides, contact): the shared hero frame
// with the page's title and intro from `pages.<key>`, its menu group as the eyebrow, and its photo.
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
  const image = PAGE_IMAGES[page];
  const group = NAV.find((item) => item.type === "group" && item.children.includes(page));

  return (
    <HeroShell
      page={page}
      variant="framed"
      eyebrow={group?.type === "group" ? tNav(group.id) : undefined}
      title={{ a: t(`${page}.title`) }}
      lead={t(`${page}.intro`)}
      note={note}
      actions={actions}
      after={after}
      media={
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 50vw"
          className="object-cover"
          style={{ objectPosition: image.position ?? "50% 50%" }}
        />
      }
    />
  );
}
