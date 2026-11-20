import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { type PageKey, pagePath } from "@/shared/seo/pages";

// `pages` lists the pages a question belongs to (its FAQ block there). The home hub shows the
// questions tagged "home"; /cau-hoi-thuong-gap shows every question, grouped (info/faq-groups.tsx);
// FAQPage JSON-LD is emitted on every page that renders a filtered block (the schema's items
// mirror what the page shows), and the full list on /cau-hoi-thuong-gap.
// TODO(B6): grow faq.items to 10–12 real customer questions (from Zalo/Messenger), tagged with
// `pages` so each service page gets 3–4. No answers about prices or transit times without a source.
export type FaqItem = { question: string; answer: string; pages?: PageKey[] };

// The question list itself: one individual rounded card per question (inspired by Tiximax's FAQ
// cards), the first one open.
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="grid gap-3.5">
      {items.map((item, index) => (
        <details
          key={item.question}
          open={index === 0}
          className="faq-item group rounded-2xl border border-line bg-white px-6 py-4.5 shadow-2xs transition-[border-color,background-color,box-shadow] duration-200 hover:border-forest/30 open:border-forest/40 open:bg-forest/[0.015] open:shadow-xs"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 text-base sm:text-lg font-semibold text-forest select-none">
            <span>{item.question}</span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sage/60 transition-colors group-open:bg-forest group-open:text-white">
              <Plus size={16} weight="bold" aria-hidden className="faq-plus" />
              <Minus size={16} weight="bold" aria-hidden className="faq-minus" />
            </div>
          </summary>
          <p className="mt-3.5 border-t border-line/60 pt-3.5 pr-4 text-sm sm:text-base leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

// The questions tagged for a page, under the "FAQ" H2. `className` adds e.g. a top rule when
// the section above has the same background.
export function Faq({ page = "home", className }: { page?: PageKey; className?: string } = {}) {
  const t = useTranslations("faq");
  const all = t.raw("items") as FaqItem[];
  const items = page === "faq" ? all : all.filter((item) => item.pages?.includes(page));
  if (items.length === 0) return null;

  return (
    <section id="faq" className={className ? `section ${className}` : "section"}>
      <div className="wrap grid gap-8 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 data-reveal className="heading-2">{t("title")}</h2>
          <FaqSupport page={page} />
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}

// Beside the questions: one minimal card with a single action, to the consultation form (the one
// place on the page that gathers every channel). On home the form is on the page itself.
export function FaqSupport({ page }: { page: PageKey }) {
  const t = useTranslations("faq");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;
  const href = page === "home" ? "#contact" : `${pagePath(locale, "contact")}#contact`;

  return (
    <div data-reveal className="mt-8 rounded-(--radius-card) border border-line bg-white p-6">
      <p className="text-lg font-semibold text-forest">{t("support.title")}</p>
      <p className="mt-1 text-muted">{t("support.body")}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href={href} data-track="cta_faq_contact" className="btn btn-primary">
          {t("support.cta")}
        </a>
        {page !== "faq" && (
          <Link href={pagePath(locale, "faq")} className="text-sm font-semibold text-forest underline-offset-4 hover:underline">
            {tPages("faq.title")}
          </Link>
        )}
      </div>
    </div>
  );
}
