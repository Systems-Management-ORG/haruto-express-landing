"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// One delegated listener pushes a dataLayer event for any clicked element carrying
// data-track (for example cta_contact, click_zalo). GTM reads these from the dataLayer.
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-track]");
      const name = trigger?.dataset.track;
      if (!name) return;
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({ event: name });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
