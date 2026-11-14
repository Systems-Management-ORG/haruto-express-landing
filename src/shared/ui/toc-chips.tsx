import { useTranslations } from "next-intl";

// "On this page": a row of small outline chips linking to the page's sections. Scrolls sideways
// on small screens instead of wrapping. The 4px of padding above and below sit inside the scroll
// box (which clips both axes), so a chip lifted on hover keeps its top border.
export function TocChips({ items }: { items: { id: string; label: string }[] }) {
  const t = useTranslations("service");
  if (items.length === 0) return null;

  return (
    <nav aria-label={t("toc")} className="wrap pb-8 lg:pb-10">
      <ul className="-my-1 flex gap-2 overflow-x-auto py-1">
        {items.map(({ id, label }) => (
          <li key={id} className="shrink-0">
            <a href={`#${id}`} className="btn btn-outline min-h-9 bg-white/70 px-3 py-1 text-sm whitespace-nowrap">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
