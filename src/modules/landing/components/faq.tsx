import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import type { PageKey } from "@/shared/seo/pages";

// `pages` lists the pages a question belongs to (its FAQ block there). The home hub shows the
// questions tagged "home"; /cau-hoi-thuong-gap shows every question, grouped (info/faq-groups.tsx);
// FAQPage JSON-LD is emitted on the FAQ page only.
// TODO(B6): grow faq.items to 10–12 real customer questions (from Zalo/Messenger), tagged with
// `pages` so each service page gets 3–4. No answers about prices or transit times without a source.
export type FaqItem = { question: string; answer: string; pages?: PageKey[] };

// The question list itself: one disclosure per question, the first one open.
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div data-reveal-group className="border-t border-line">
      {items.map((item, index) => (
        <details key={item.question} open={index === 0} className="faq-item border-b border-line py-4">
          <summary className="text-lg font-medium text-forest">
            <span>{item.question}</span>
            <Plus size={20} aria-hidden className="faq-plus shrink-0" />
            <Minus size={20} aria-hidden className="faq-minus shrink-0" />
          </summary>
          <p className="mt-2 pr-9">{item.answer}</p>
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
      <div className="wrap grid gap-8 lg:grid-cols-12 lg:gap-6">
        <h2 data-reveal className="heading-2 lg:col-span-5 lg:pr-8">{t("title")}</h2>
        <div className="lg:col-span-6 lg:col-start-7">
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}
