"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { PLANE_PATH, planeTransform } from "./plane-icon";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

const FLIGHT = "M40 200 C 300 20, 620 20, 860 130 S 1120 220, 1160 60";

export function NotFoundView({ homeHref }: { homeHref: string }) {
  const t = useTranslations("notFound");
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-line]", { opacity: 0, y: 32, duration: 0.8, stagger: 0.12, ease: "power3.out" });
        gsap.fromTo(
          "[data-flight]",
          { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } },
          { attr: { "stroke-dashoffset": 0 }, duration: 2.6, ease: "power1.inOut" },
        );
        gsap.to("[data-plane]", {
          duration: 2.6,
          ease: "power1.inOut",
          motionPath: { path: "#lost-flight", align: "#lost-flight", alignOrigin: [0.5, 0.5], autoRotate: true },
        });
      });
      return () => motion.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="not-found-band">
      <svg viewBox="0 0 1200 260" aria-hidden className="not-found-flight">
        <path d={FLIGHT} fill="none" stroke="#faf8ea" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 8" />
        <path id="lost-flight" data-flight d={FLIGHT} pathLength={1} fill="none" stroke="#e2a240" strokeWidth="2" />
        <g data-plane transform="translate(1160 60)">
          <path d={PLANE_PATH} fill="#faf8ea" transform={planeTransform(34)} />
        </g>
      </svg>

      <div className="wrap relative">
        <p data-line aria-hidden className="font-display font-(--weight-display) text-7xl leading-none text-gold sm:text-8xl lg:text-9xl">
          404
        </p>
        <h1 data-line className="heading-1 mt-6 max-w-[40rem] text-white">
          {t("title")}
        </h1>
        <p data-line className="mt-4 max-w-[36rem] text-white/95 sm:text-lg">
          {t("text")}
        </p>
        <div data-line className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={homeHref} className="btn btn-gold">
            {t("home")}
          </Link>
          <Link href={`${homeHref}#contact`} className="btn btn-outline-light">
            {t("contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
