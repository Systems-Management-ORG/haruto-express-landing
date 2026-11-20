import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { PAGES, type PageKey, pagePath } from "@/shared/seo/pages";
import { SectionHead } from "@/shared/ui/section-head";

// Internal-linking block at the foot of every subpage: 2-4 related routes from the registry.
export function RelatedLinks({ page }: { page: PageKey }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("pages");
  const related = PAGES[page].related.filter((k) => k !== page);
  if (related.length === 0) return null;

  return (
    <section className="section bg-sage">
      <div className="wrap">
        <SectionHead title={t("relatedTitle")} align="start" />
        <ul className={`mt-8 grid gap-4 sm:grid-cols-2 ${related.length === 2 ? "" : "lg:grid-cols-3"}`}>
          {related.map((key) => (
            <li key={key}>
              <Link href={pagePath(locale, key)} className="related-card group">
                <span className="min-w-0">
                  <span className="block text-lg font-medium text-forest">{t(`${key}.breadcrumb`)}</span>
                  <span className="mt-1.5 line-clamp-2 block text-sm text-muted">{t(`${key}.metaDescription`)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
