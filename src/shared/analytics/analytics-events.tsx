"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Kept at module level so it survives the layout being rebuilt on a language switch.
let lastPath: string | null = null;

// One delegated listener pushes a dataLayer event for any clicked element carrying
// data-track (for example cta_contact, click_zalo). GTM reads these from the dataLayer.
// Pages change without a reload (next/link), so each change also pushes a route_change event
// with the new path and title. GA4's enhanced measurement already counts these history changes
// as page views; route_change is there for GTM triggers that need it, and does nothing on its own.
export function AnalyticsEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (lastPath === null || lastPath === pathname) {
      lastPath = pathname;
      return;
    }
    lastPath = pathname;
    // the new page's <title> is set after the route renders
    const timer = window.setTimeout(() => {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: "route_change",
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

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
