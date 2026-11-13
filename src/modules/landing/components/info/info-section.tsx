import type { ReactNode } from "react";
import { SectionHead } from "@/shared/ui/section-head";

// The one frame of an info-page section: an anchor, ivory or sage background, a left-aligned H2
// and the body under it.
export function InfoSection({
  id,
  tinted,
  title,
  intro,
  children,
}: {
  id: string;
  tinted: boolean;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={tinted ? "section bg-sage" : "section"}>
      <div className="wrap">
        <SectionHead title={title} intro={intro} align="start" />
        <div className="mt-8 lg:mt-10">{children}</div>
      </div>
    </section>
  );
}
