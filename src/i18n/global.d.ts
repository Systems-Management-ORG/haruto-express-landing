import type { Locale } from "@/shared/constants/locales";
import type messages from "./messages/vi.json";

// Vietnamese is the source language: message keys are checked against it at compile time.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
