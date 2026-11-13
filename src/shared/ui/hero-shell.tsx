import type { ReactNode } from "react";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import type { PageKey } from "@/shared/seo/pages";

// The one hero frame of every subpage: breadcrumbs, eyebrow, H1, lead and actions on the left,
// the page's picture on the right.
// - `poster` (service pages): two-tone H1, HARUTO's artwork feathered into the page.
// - `framed` (info pages): one-colour H1, a photo in the white frame.
// Slots, in document order: `children` between the H1 and the lead (ribbon, alert, hook),
// `afterLead` (proof points), `note` (e.g. the effective-date pill), `actions`, `footer` (store
// logos), then `after` below the grid, full width (table-of-contents chips, goods chips).
type Props = {
  page: Exclude<PageKey, "home">; // breadcrumb trail
  variant: "poster" | "framed";
  eyebrow?: string;
  title: { a: string; b?: string };
  lead: string;
  children?: ReactNode;
  afterLead?: ReactNode;
  note?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  media: ReactNode; // the page's <Image priority …/>
  artModifier?: "route" | "seal"; // poster art variants (map tags, seal)
  after?: ReactNode;
};

export function HeroShell({
  page,
  variant,
  eyebrow,
  title,
  lead,
  children,
  afterLead,
  note,
  actions,
  footer,
  media,
  artModifier,
  after,
}: Props) {
  const twoTone = variant === "poster" && title.b;

  return (
    <section className="svc-hero">
      <div className="wrap svc-hero__grid">
        <div className="svc-hero__copy">
          <Breadcrumbs page={page} />
          {eyebrow && <p className="svc-eyebrow">{eyebrow}</p>}
          {/* The space between the two parts keeps the H1 text (and its schema name) readable. */}
          <h1 className="svc-title">
            <span className="svc-title__a">{twoTone ? title.a : [title.a, title.b].filter(Boolean).join(" ")}</span>
            {twoTone && (
              <>
                {" "}
                <span className="svc-title__b">{title.b}</span>
              </>
            )}
          </h1>
          {children}
          <p className="svc-lead">{lead}</p>
          {afterLead}
          {note}
          {actions && <div className="svc-hero__actions">{actions}</div>}
          {footer}
        </div>

        <div className={`svc-art${artModifier ? ` svc-art--${artModifier}` : ""}`}>
          {variant === "framed" ? <div className="page-hero__frame">{media}</div> : media}
        </div>
      </div>
      {after}
    </section>
  );
}
