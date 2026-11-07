import Image from "next/image";
import { useTranslations } from "next-intl";

const LINKS = ["services", "pricing", "process", "contact"] as const;

export function SiteFooter({ homeHref = "" }: { homeHref?: string }) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-deep py-12 text-ivory lg:py-16">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="flex items-start gap-5 md:col-span-7">
            <Image
              src="/logo/haruto-lockup.webp"
              alt={t("logoAlt")}
              width={96}
              height={96}
              className="size-24 shrink-0 rounded-2xl bg-ivory p-1.5"
            />
            <div>
              <p className="text-xl font-medium">HARUTO EXPRESS</p>
              <p className="mt-2 text-ivory/85">{t("positioning")}</p>
              <p className="mt-2 font-medium text-gold">{t("tagline")}</p>
            </div>
          </div>
          <nav aria-label={t("navigationTitle")} className="md:col-span-4 md:col-start-9">
            <p className="text-sm font-medium text-ivory/70">{t("navigationTitle")}</p>
            <ul className="mt-2">
              {LINKS.map((link) => (
                <li key={link}>
                  <a href={`${homeHref}#${link}`} className="flex min-h-11 items-center hover:text-gold">
                    {nav(link)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-ivory/20 pt-6 text-sm text-ivory/75">
          <p>© {new Date().getFullYear()} HARUTO EXPRESS</p>
        </div>
      </div>
    </footer>
  );
}
