"use client";

import { CaretDown, List, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES, isLocale } from "@/shared/constants/locales";
import type { Locale } from "@/shared/constants/locales";
import { NAV } from "@/shared/seo/nav";
import { pageByLocaleSlug, pagePath } from "@/shared/seo/pages";

// The same page's URL in another language, resolved through the registry so localized slugs
// map correctly (e.g. /vi/bang-gia → /en/pricing), not by reusing the current path.
function localeHref(pathname: string, target: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  const current = parts[0];
  if (!current || !isLocale(current)) return `/${target}`;
  const slug = parts.slice(1).join("/");
  if (!slug) return `/${target}`;
  const def = pageByLocaleSlug(current, slug);
  return def ? pagePath(target, def.key) : `/${target}`;
}

function LanguageMenu({ inline = false }: { inline?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const label = useTranslations("nav")("language");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        data-lang-toggle
        aria-expanded={open}
        aria-label={`${label}: ${LOCALE_NAMES[locale]}`}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium"
      >
        {LOCALE_LABELS[locale]}
        <CaretDown size={14} aria-hidden className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        hidden={!open}
        className={
          inline
            ? "mt-1"
            : "absolute right-0 top-full mt-1 min-w-40 rounded-md border border-line bg-ivory py-1 text-ink shadow-[0_8px_24px_rgb(10_30_18/0.16)]"
        }
      >
        {LOCALES.map((item) => (
          <li key={item}>
            <a
              href={localeHref(pathname, item)}
              lang={item}
              aria-current={item === locale ? "page" : undefined}
              className={`flex min-h-11 items-center px-3 text-sm ${item === locale ? "font-medium text-forest" : ""}`}
            >
              {LOCALE_NAMES[item]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteHeader({ homeHref = "", solid = false }: { homeHref?: string; solid?: boolean }) {
  const nav = useTranslations("nav");
  const groups = useTranslations("nav.groups");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu
  const [openGroup, setOpenGroup] = useState<string | null>(null); // open dropdown id
  const [scrolled, setScrolled] = useState(solid);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const isCurrent = (key: Parameters<typeof pagePath>[1]) => pathname === pagePath(locale, key);

  useEffect(() => {
    if (solid) return;
    const updateScrolled = () => setScrolled(window.scrollY > 0);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, [solid]);

  // Close an open dropdown on outside click.
  useEffect(() => {
    if (!openGroup) return;
    const onDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openGroup]);

  useEffect(() => {
    if (!open && !openGroup) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setOpenGroup(null);
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, openGroup]);

  const transparent = !scrolled && !open && !openGroup;

  return (
    <header data-transparent={transparent} data-scrolled={scrolled} data-solid={solid || undefined} className="site-header">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        {nav("skip")}
      </a>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4 lg:justify-start lg:gap-8 xl:gap-10">
        <a href={homeHref || `/${locale}`} className="flex min-h-11 items-center gap-2.5">
          <Image src="/logo/haruto-mark.png" alt="" width={46} height={40} priority className="site-header__mark h-10 w-auto" />
          <span className="text-[0.9375rem] font-medium leading-tight tracking-wide whitespace-nowrap">HARUTO EXPRESS</span>
        </a>

        <nav ref={navRef} aria-label={nav("primary")} className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {NAV.map((item) =>
              item.type === "link" ? (
                <li key={item.key}>
                  <a href={pagePath(locale, item.key)} aria-current={isCurrent(item.key) ? "page" : undefined} className="nav-link whitespace-nowrap py-3 text-[0.9375rem] font-medium">
                    {tPages(`${item.key}.nav`)}
                  </a>
                </li>
              ) : (
                <li
                  key={item.id}
                  className="nav-group relative"
                  onMouseEnter={() => setOpenGroup(item.id)}
                  onMouseLeave={() => setOpenGroup((current) => (current === item.id ? null : current))}
                >
                  <button
                    type="button"
                    aria-expanded={openGroup === item.id}
                    aria-controls={`nav-${item.id}`}
                    onClick={() => setOpenGroup((current) => (current === item.id ? null : item.id))}
                    data-active={item.children.some(isCurrent) || undefined}
                    className="nav-link flex items-center gap-1 whitespace-nowrap py-3 text-[0.9375rem] font-medium"
                  >
                    {groups(item.id)}
                    <CaretDown size={13} aria-hidden className={`transition-transform duration-150 ${openGroup === item.id ? "rotate-180" : ""}`} />
                  </button>
                  <ul id={`nav-${item.id}`} hidden={openGroup !== item.id} className="nav-panel">
                    {item.children.map((key) => (
                      <li key={key}>
                        <a href={pagePath(locale, key)} aria-current={isCurrent(key) ? "page" : undefined} className="flex min-h-11 items-center whitespace-nowrap px-4 text-[0.9375rem] hover:text-forest">
                          {tPages(`${key}.nav`)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-2 lg:ml-auto lg:gap-3">
          <div className="hidden lg:block">
            <LanguageMenu />
          </div>
          <a href={pagePath(locale, "contact")} data-track="cta_contact" className="btn btn-primary hidden whitespace-nowrap sm:inline-flex">
            {nav("cta")}
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav("closeMenu") : nav("openMenu")}
            onClick={() => setOpen((value) => !value)}
            className="flex size-11 items-center justify-center rounded-lg border border-current lg:hidden"
          >
            {open ? <X size={22} aria-hidden /> : <List size={22} aria-hidden />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-line bg-ivory text-ink lg:hidden">
        <nav aria-label={nav("primary")} className="wrap py-3">
          <ul>
            {NAV.map((item) =>
              item.type === "link" ? (
                <li key={item.key} className="border-b border-line">
                  <a href={pagePath(locale, item.key)} aria-current={isCurrent(item.key) ? "page" : undefined} onClick={() => setOpen(false)} className="nav-link flex min-h-14 items-center text-lg font-medium">
                    {tPages(`${item.key}.nav`)}
                  </a>
                </li>
              ) : (
                <li key={item.id} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={openGroup === item.id}
                    onClick={() => setOpenGroup((current) => (current === item.id ? null : item.id))}
                    className="flex min-h-14 w-full items-center justify-between text-lg font-medium"
                  >
                    {groups(item.id)}
                    <CaretDown size={16} aria-hidden className={`transition-transform duration-150 ${openGroup === item.id ? "rotate-180" : ""}`} />
                  </button>
                  <ul hidden={openGroup !== item.id} className="pb-2">
                    {item.children.map((key) => (
                      <li key={key}>
                        <a href={pagePath(locale, key)} aria-current={isCurrent(key) ? "page" : undefined} onClick={() => setOpen(false)} className="flex min-h-12 items-center pl-4 text-base hover:text-forest">
                          {tPages(`${key}.nav`)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ),
            )}
          </ul>
          <div className="mt-3 flex flex-col gap-3">
            <LanguageMenu inline />
            <a href={pagePath(locale, "contact")} data-track="cta_contact" onClick={() => setOpen(false)} className="btn btn-primary w-full sm:hidden">
              {nav("cta")}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
