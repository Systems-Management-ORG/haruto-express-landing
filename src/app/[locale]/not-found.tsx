import { getLocale } from "next-intl/server";
import { NotFoundView } from "@/modules/landing/components/not-found-view";

export default async function NotFound() {
  return <NotFoundView locale={await getLocale()} />;
}
