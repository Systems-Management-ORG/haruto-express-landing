import { useTranslations } from "next-intl";
import { FAQ_GROUPS } from "../../info-pages";
import type { FaqItem } from "../faq";

export type FaqGroup = { id: (typeof FAQ_GROUPS)[number]["id"]; items: FaqItem[] };

// Sort every question into the group of its first tag (ignoring "home"); no match → "shipping".
// Groups without questions are dropped.
export function useFaqGroups(): FaqGroup[] {
  const t = useTranslations("faq");
  const all = t.raw("items") as FaqItem[];
  const groups: FaqGroup[] = FAQ_GROUPS.map(({ id }) => ({ id, items: [] }));
  for (const item of all) {
    const tag = item.pages?.find((page) => page !== "home");
    const index = FAQ_GROUPS.findIndex((group) => tag && group.tags.includes(tag));
    groups[index < 0 ? 0 : index].items.push(item);
  }
  return groups.filter((group) => group.items.length > 0);
}
