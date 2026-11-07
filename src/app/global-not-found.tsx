import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/shared/constants/locales";
import { fontClassName } from "@/shared/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | HARUTO EXPRESS",
  robots: { index: false },
};

// An unknown URL has no locale to go by, so the page offers all three languages.
const OPTIONS = [
  { href: "/vi", lang: "vi", message: "Không tìm thấy trang này.", action: "Về trang chủ" },
  { href: "/ja", lang: "ja", message: "ページが見つかりません。", action: "ホームへ戻る" },
  { href: "/en", lang: "en", message: "This page could not be found.", action: "Go to the home page" },
];

export default function GlobalNotFound() {
  return (
    <html lang="vi" className={fontClassName("vi")}>
      <body>
        <main className="wrap flex min-h-svh flex-col justify-center py-16">
          <Image src="/logo/haruto-mark.png" alt="HARUTO EXPRESS" width={69} height={60} priority />
          <h1 className="heading-2 mt-6">404</h1>
          <ul className="mt-6 max-w-[36rem] border-t border-line">
            {OPTIONS.map((option) => (
              <li
                key={option.lang}
                lang={option.lang}
                className={`flex flex-col gap-3 border-b border-line py-4 font-sans sm:flex-row sm:items-center sm:justify-between ${fontClassName(option.lang as Locale)}`}
              >
                <span>{option.message}</span>
                <a href={option.href} className="btn btn-outline shrink-0">
                  {option.action}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
