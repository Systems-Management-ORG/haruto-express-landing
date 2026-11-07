import { defineRouting } from "next-intl/routing";
import { LOCALES } from "@/shared/constants/locales";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "vi",
  // The Link header needs the production domain; turn this on together with canonical tags.
  alternateLinks: false,
});
