"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

// Everything is visible in the markup, so content stays available without JavaScript and for visitors
// who prefer reduced motion. Reveals animate opacity only: visibility:hidden would drop links and
// form fields out of the keyboard tab order until they were scrolled to.
export function MotionLayer() {
  useGSAP(() => {
    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          y: 32,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });

      gsap.to(".hero-slide img", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".hero-stage", start: "top top", end: "bottom top", scrub: true },
      });

      // The two routes draw themselves across the world map as it scrolls through.
      const routes = document.querySelector("[data-route-map]");
      if (!routes) return;
      const flights = gsap.timeline({
        scrollTrigger: { trigger: routes, start: "top 70%", end: "center 45%", scrub: 0.6 },
      });
      routes.querySelectorAll<SVGPathElement>("[data-route]").forEach((route) => {
        gsap.set(route, { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
        flights.to(route, { attr: { "stroke-dashoffset": 0 }, ease: "none", duration: 1 }, 0);
      });
      routes.querySelectorAll<SVGGElement>("[data-plane]").forEach((plane) => {
        flights.to(
          plane,
          {
            ease: "none",
            duration: 1,
            motionPath: {
              path: `#${plane.dataset.plane}`,
              align: `#${plane.dataset.plane}`,
              alignOrigin: [0.5, 0.5],
              autoRotate: true,
              // Stops short of the destination so the plane covers neither its marker nor Hoang Sa.
              end: 0.62,
            },
          },
          0,
        );
      });
      // Renders the start now, so the planes wait at their origin instead of mid-route.
      flights.progress(1).progress(0);
    });

    // The warehouse mosaic settles from a slight zoom as its section scrolls into view.
    motion.add("(prefers-reduced-motion: no-preference) and (min-width: 48rem)", () => {
      gsap.fromTo(
        "[data-route-grid]",
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: "#routes", start: "top bottom", end: "top top", scrub: true },
        },
      );
    });

    return () => motion.revert();
  });

  return null;
}
