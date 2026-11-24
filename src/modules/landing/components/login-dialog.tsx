"use client";

import { X } from "@phosphor-icons/react/dist/ssr";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { AUTH_PORTAL_ORIGIN } from "@/shared/lib/auth-portal";

/**
 * The header's "sign in" button and the near full-screen modal it opens: the whole auth-portal page (its 3D scene
 * included, `?layout=full`) in an iframe. The portal signs in against the Backend and then opens the app in the whole
 * tab. Renders nothing while the login switch is off.
 */
export function LoginDialog({ className = "", onOpen }: { className?: string; onOpen?: () => void }) {
  const nav = useTranslations("nav");
  const locale = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!AUTH_PORTAL_ORIGIN) return null;
  const src = `${AUTH_PORTAL_ORIGIN}/?lang=${encodeURIComponent(locale)}&layout=full`;

  return (
    <>
      <button
        type="button"
        data-track="cta_login"
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
        className={className}
      >
        {nav("login")}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={nav("loginTitle")}
        className="login-dialog"
        // Esc closes a modal dialog natively; keep the state in step with it.
        onClose={() => setOpen(false)}
        // A press on the backdrop lands on the dialog itself, outside its panel.
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="login-dialog__panel">
          {/* Loaded only while open, so a visit that never signs in never loads the portal. */}
          {open && <iframe src={src} title={nav("loginTitle")} className="login-dialog__frame" />}
          {/* Over the portal's top right corner; the portal leaves that corner free in this modal. */}
          <button type="button" onClick={() => setOpen(false)} aria-label={nav("closeLogin")} className="login-dialog__close">
            <X size={20} aria-hidden />
          </button>
        </div>
      </dialog>
    </>
  );
}
