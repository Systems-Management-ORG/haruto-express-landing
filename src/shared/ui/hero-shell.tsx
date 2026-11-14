import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { PAGE_IMAGES } from "@/shared/seo/page-media";
import type { PageKey } from "@/shared/seo/pages";

// The one banner of every subpage, the design system's page hero (12.4): the page's picture fills
// the banner with the copy over an ivory fade on the left; on phones and portrait screens the
// picture sits above the copy. The copy column holds breadcrumbs, eyebrow, H1, lead and actions.
// Slots, in document order: `children` between the H1 and the lead (ribbon, alert, hook),
// `afterLead` (proof points), `note` (e.g. the effective-date pill), `actions`, `footer` (store
// logos), then `after` below the banner, full width (table-of-contents chips, goods chips).
type Props = {
  page: Exclude<PageKey, "home">; // breadcrumb trail and the picture (PAGE_IMAGES)
  eyebrow?: string;
  title: string;
  lead: string;
  children?: ReactNode;
  afterLead?: ReactNode;
  note?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  after?: ReactNode;
};

export function HeroShell({ page, eyebrow, title, lead, children, afterLead, note, actions, footer, after }: Props) {
  const image = PAGE_IMAGES[page];

  return (
    <section className="page-hero">
      <div className="page-hero__stage">
        <div className="page-hero__media">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 62vw"
            style={{ objectPosition: image.position ?? "50% 50%" }}
          />
        </div>
        <div className="wrap page-hero__content">
          <div className="page-hero__text">
            <Breadcrumbs page={page} />
            {eyebrow && <p className="svc-eyebrow">{eyebrow}</p>}
            <h1 className="hero-title svc-title">{title}</h1>
            {children}
            <p className="svc-lead">{lead}</p>
            {afterLead}
            {note}
            {actions && <div className="svc-hero__actions">{actions}</div>}
            {footer}
          </div>
        </div>
      </div>
      {after}
    </section>
  );
}
