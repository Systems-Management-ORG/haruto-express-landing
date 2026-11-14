"use client";

import { ChatCircleDots, X } from "@phosphor-icons/react/dist/ssr";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { telHref } from "@/shared/seo/business";
import { CHAT_CHANNELS, ChannelIcon, PhoneIcon, primaryHotline } from "./contact-links";

// Floating quick contact in the bottom-right corner of every page: one round button that opens a
// short list of flat options above it (a call on small screens, where tel: places a call; Zalo; the
// Facebook page). Escape or a tap outside closes it. Tracked as click_hotline_<id> / click_zalo /
// click_facebook, as before.
export function ContactFab() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const hotline = primaryHotline(locale);
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (CHAT_CHANNELS.length === 0 && !hotline) return null;

  return (
    <nav ref={rootRef} aria-label={t("fab.label")} className="contact-fab">
      <ul id={`${id}-list`} hidden={!open} className="contact-fab__list">
        {hotline && (
          <li className="lg:hidden">
            <a href={telHref(hotline.tel)} data-track={`click_hotline_${hotline.id}`} className="contact-fab__item">
              <span className="contact-fab__call" aria-hidden>
                <PhoneIcon size={18} />
              </span>
              <span>
                {t("fab.call")} <span className="tabular-nums">{hotline.display}</span>
              </span>
            </a>
          </li>
        )}
        {CHAT_CHANNELS.map(({ id: channel, href }) => (
          <li key={channel}>
            <a href={href} target="_blank" rel="noopener noreferrer" data-track={`click_${channel}`} className="contact-fab__item">
              <ChannelIcon id={channel} size={32} />
              {t(`fab.${channel}`)}
            </a>
          </li>
        ))}
      </ul>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={t(open ? "fab.close" : "fab.open")}
        onClick={() => setOpen((value) => !value)}
        className="contact-fab__toggle"
      >
        {open ? <X size={26} weight="bold" aria-hidden /> : <ChatCircleDots size={28} weight="fill" aria-hidden />}
      </button>
    </nav>
  );
}
