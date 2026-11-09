import { useLocale, useTranslations } from "next-intl";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/shared/constants/locales";
import { PAGES, type PageKey, pagePath } from "@/shared/seo/pages";

// Visible breadcrumb trail built from the registry's parent chain. The matching
// BreadcrumbList JSON-LD is emitted separately by the page.
export function Breadcrumbs({ page }: { page: PageKey }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("pages");

  const chain: PageKey[] = [];
  let cursor: PageKey | undefined = page;
  while (cursor) {
    chain.unshift(cursor);
    cursor = PAGES[cursor].parent;
  }
  if (chain.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {chain.map((key, index) => {
          const last = index === chain.length - 1;
          return (
            <li key={key} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page">{t(`${key}.breadcrumb`)}</span>
              ) : (
                <>
                  <a href={pagePath(locale, key)} className="underline-offset-4 hover:underline">
                    {t(`${key}.breadcrumb`)}
                  </a>
                  <CaretRight size={13} aria-hidden className="opacity-60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
