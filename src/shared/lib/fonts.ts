import { Hanken_Grotesk, Newsreader, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import type { Locale } from "@/shared/constants/locales";

const heading = Newsreader({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  display: "swap",
});

const text = Hanken_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-brand",
  display: "swap",
});

const headingJa = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: false,
});

const textJa = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
  preload: false,
});

export function fontClassName(locale: Locale): string {
  return locale === "ja" ? `${headingJa.variable} ${textJa.variable}` : `${heading.variable} ${text.variable}`;
}
