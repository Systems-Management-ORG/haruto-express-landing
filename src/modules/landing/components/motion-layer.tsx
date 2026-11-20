"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Everything is visible in the markup, so content stays available without JavaScript and for visitors
// who prefer reduced motion. Reveals animate opacity only: visibility:hidden would drop links and
// form fields out of the keyboard tab order until they were scrolled to.
export function MotionLayer() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const motion = gsap.matchMedia();

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 32,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "opacity,transform,translate",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          gsap.from(group.children, {
            opacity: 0,
            y: 28,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "opacity,transform,translate",
            scrollTrigger: { trigger: group, start: "top 92%", once: true },
          });
        });
      });

      return () => motion.revert();
    },
    { dependencies: [pathname] }
  );

  useEffect(() => {
    // Refresh ScrollTrigger after DOM settle and route transition
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
