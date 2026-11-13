import { Hanken_Grotesk, Lexend, Noto_Sans_JP } from "next/font/google";
import type { Locale } from "@/shared/constants/locales";

// Fonts of the Haruto design system (../design-system): Lexend for headings (h1, h2, display
// numbers), Hanken Grotesk for everything else. Japanese uses Noto Sans JP for both, since Lexend
// has no Japanese glyphs (globals.css points --font-display at it under :lang(ja)).
const heading = Lexend({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  display: "swap",
});

const text = Hanken_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-brand",
  display: "swap",
});

const textJa = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
  preload: false,
});

export function fontClassName(locale: Locale): string {
  return locale === "ja" ? textJa.variable : `${heading.variable} ${text.variable}`;
}
