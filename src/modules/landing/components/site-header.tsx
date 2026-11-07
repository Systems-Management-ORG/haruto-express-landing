"use client";

import { CaretDown, List, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES } from "@/shared/constants/locales";


// The links stay in the markup while closed so search engines can still find every language.
function LanguageMenu({ inline = false }: { inline?: boolean }) {
  const locale = useLocale();
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
        // Tells the mobile menu's handler that this Escape only closed the language list.
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
              href={`/${item}`}
              lang={item}
              aria-current={item === locale ? "page" : undefined}
              onClick={(event) => {
                // Keep the section the visitor last jumped to when the language changes.
                event.currentTarget.href = `/${item}${window.location.hash}`;
              }}
              className={`flex min-h-11 items-center px-3 text-sm ${
                item === locale ? "font-medium text-forest" : ""
              }`}
            >
              {LOCALE_NAMES[item]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const NAV_SECTIONS = ["services", "pricing", "process", "contact"] as const;
type NavSection = (typeof NAV_SECTIONS)[number];

// The last menu section whose top has passed this line stays active, so sections without a menu
// entry of their own (routes, FAQ) keep the entry before them lit.
const ACTIVE_LINE = 0.4;

function useActiveSection() {
  const [active, setActive] = useState<NavSection | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * ACTIVE_LINE;
      let current: NavSection | null = null;
      for (const id of NAV_SECTIONS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}

type Props = { homeHref?: string; solid?: boolean };

export function SiteHeader({ homeHref = "", solid = false }: Props) {
  const nav = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(solid);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const activeSection = useActiveSection();
  const links = NAV_SECTIONS.map((id) => ({
    href: `${homeHref}#${id}`,
    label: nav(id),
    current: activeSection === id ? ("location" as const) : undefined,
  }));

  useEffect(() => {
    if (solid) return;
    const updateScrolled = () => setScrolled(window.scrollY > 0);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, [solid]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const transparent = !scrolled && !open;

  return (
    <header data-transparent={transparent} data-scrolled={scrolled} className="site-header">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        {nav("skip")}
      </a>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4 lg:justify-start lg:gap-8 xl:gap-10">
        <a href={`${homeHref}#top`} className="flex min-h-11 items-center gap-2.5">
          <Image
            src="/logo/haruto-mark.png"
            alt=""
            width={46}
            height={40}
            priority
            className="site-header__mark h-10 w-auto"
          />
          <span className="text-[0.9375rem] font-medium leading-tight tracking-wide whitespace-nowrap">
            HARUTO EXPRESS
          </span>
        </a>

        <nav aria-label={nav("primary")} className="hidden lg:block">
          <ul className="flex gap-6 xl:gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} aria-current={link.current} className="nav-link whitespace-nowrap py-3 text-[0.9375rem] font-medium">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-2 lg:ml-auto lg:gap-3">
          <div className="hidden lg:block">
            <LanguageMenu />
          </div>
          <a
            href={`${homeHref}#contact`}
            className="btn btn-primary hidden whitespace-nowrap sm:inline-flex"
          >
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

      <div
        id="mobile-menu"
        hidden={!open}
        className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-line bg-ivory text-ink lg:hidden"
      >
        <nav aria-label={nav("primary")} className="wrap py-3">
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-b border-line">
                <a
                  href={link.href}
                  aria-current={link.current}
                  onClick={() => setOpen(false)}
                  className="nav-link flex min-h-14 items-center text-lg font-medium"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-3">
            <LanguageMenu inline />
            <a href={`${homeHref}#contact`} onClick={() => setOpen(false)} className="btn btn-primary w-full sm:hidden">
              {nav("cta")}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
