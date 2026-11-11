import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import type { PageKey } from "@/shared/seo/pages";

// `pages` lists the pages a question belongs to (its FAQ block there). The home hub and
// /cau-hoi-thuong-gap show every question; FAQPage JSON-LD is emitted on the FAQ page only.
// TODO(B6): grow faq.items to 10–12 real customer questions (from Zalo/Messenger), tagged with
// `pages` so each service page gets 3–4. No answers about prices or transit times without a source.
type Item = { question: string; answer: string; pages?: PageKey[] };

export function Faq({ page }: { page?: PageKey } = {}) {
  const t = useTranslations("faq");
  const all = t.raw("items") as Item[];
  const items = !page || page === "home" || page === "faq" ? all : all.filter((item) => item.pages?.includes(page));
  if (items.length === 0) return null;

  return (
    <section id="faq" className="section">
      <div className="wrap grid gap-8 lg:grid-cols-12 lg:gap-6">
        <h2 data-reveal className="heading-2 lg:col-span-5 lg:pr-8">{t("title")}</h2>
        <div data-reveal-group className="border-t border-line lg:col-span-6 lg:col-start-7">
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
      </div>
    </section>
  );
}
