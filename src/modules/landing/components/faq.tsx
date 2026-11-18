import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { type PageKey, pagePath } from "@/shared/seo/pages";

// `pages` lists the pages a question belongs to (its FAQ block there). The home hub shows the
// questions tagged "home"; /cau-hoi-thuong-gap shows every question, grouped (info/faq-groups.tsx);
// FAQPage JSON-LD is emitted on the FAQ page only.
// TODO(B6): grow faq.items to 10–12 real customer questions (from Zalo/Messenger), tagged with
// `pages` so each service page gets 3–4. No answers about prices or transit times without a source.
export type FaqItem = { question: string; answer: string; pages?: PageKey[] };

// The question list itself: one individual rounded card per question (inspired by Tiximax's FAQ
// cards), the first one open.
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div data-reveal-group className="grid gap-3.5">
      {items.map((item, index) => (
        <details
          key={item.question}
          open={index === 0}
          className="faq-item rounded-2xl border border-line bg-white px-6 py-4 shadow-2xs transition-colors open:border-forest/35"
        >
          <summary className="text-lg font-medium text-forest">
            <span>{item.question}</span>
            <Plus size={20} aria-hidden className="faq-plus shrink-0" />
            <Minus size={20} aria-hidden className="faq-minus shrink-0" />
          </summary>
          <p className="mt-3 border-t border-line/70 pt-3 pr-9 text-muted">{item.answer}</p>
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
          <Link href={pagePath(locale, "faq")} className="link-arrow text-forest">
            {tPages("faq.title")}
          </Link>
        )}
      </div>
    </div>
  );
}
