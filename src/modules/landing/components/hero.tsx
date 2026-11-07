"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import gsap from "gsap";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type CSSProperties } from "react";

// "position" is the crop on portrait screens; landscape screens keep the right side of the image.
const IMAGES = [
  { file: "may-bay-nui-phu-si-thap-tokyo-hoa-anh-dao", position: "76% 50%" },
  { file: "may-bay-tuyen-viet-nam-nhat-ban", position: "68% 50%" },
  { file: "thung-hang-va-hang-nhat-nui-phu-si", position: "70% 50%" },
];
const AUTOPLAY_MS = 6000;
const SWIPE_PX = 40;

const prefersCalm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function playSlideIn(slide: HTMLElement) {
  gsap.fromTo(slide.querySelector("img"), { scale: 1.1 }, { scale: 1, duration: 6.5, ease: "power1.out", overwrite: "auto" });
  gsap.fromTo(
    slide.querySelectorAll("[data-hero-line]"),
    { opacity: 0, y: 44 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, delay: 0.15, ease: "power3.out", overwrite: "auto" },
  );
}

type Slide = { title: string; description: string };

export function Hero() {
  const t = useTranslations("hero");
  const slides = t.raw("slides") as Slide[];
  const alts = t.raw("carousel.alts") as string[];
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const previousRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  const show = (index: number) => setActive((index + IMAGES.length) % IMAGES.length);

  useEffect(() => {
    const first = slidesRef.current[0];
    if (first && !prefersCalm()) playSlideIn(first);
  }, []);

  // Stops while the visitor points at or tabs into the banner, and never runs for reduced motion.
  useEffect(() => {
    if (held || prefersCalm()) return;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % IMAGES.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, held]);

  useEffect(() => {
    const previous = slidesRef.current[previousRef.current];
    const next = slidesRef.current[active];
    if (!next || previousRef.current === active) return;
    const calm = prefersCalm();
    const duration = calm ? 0 : 0.9;
    gsap.set(next, { zIndex: 1 });
    gsap.set(previous, { zIndex: 0 });
    gsap.to(previous, { autoAlpha: 0, duration, ease: "power2.inOut", overwrite: "auto" });
    gsap.to(next, { autoAlpha: 1, duration, ease: "power2.inOut", overwrite: "auto" });
    if (!calm) playSlideIn(next);
    previousRef.current = active;
  }, [active]);

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label={t("carousel.label")}
      data-header-over
      className="hero-stage"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onTouchStart={(event) => {
        touchStartRef.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartRef.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartRef.current;
        touchStartRef.current = null;
        if (Math.abs(distance) >= SWIPE_PX) show(active + (distance < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, index) => {
        const Heading = index === 0 ? "h1" : "h2";
        return (
          <div
            key={slide.title}
            ref={(node) => {
              slidesRef.current[index] = node;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${slides.length}`}
            aria-hidden={index !== active}
            className="hero-slide"
          >
            <div className="hero-media">
              <Image
                src={`/images/haruto/hero/${IMAGES[index].file}.webp`}
                alt={alts[index]}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "eager"}
                sizes="100vw"
                className="hero-image"
                style={{ "--hero-position": IMAGES[index].position } as CSSProperties}
              />
              <div className="hero-overlay" />
            </div>
            <div className="hero-content wrap">
              <div className="hero-text">
                <Heading data-hero-line className="hero-title">
                  {slide.title}
                </Heading>
                <p data-hero-line className="mt-5 max-w-[36rem] text-base leading-[1.65] sm:text-lg xl:text-xl">
                  {slide.description}
                </p>
                <div data-hero-line className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#pricing" className="btn btn-gold">
                    {t("primary")}
                    <ArrowRight size={18} aria-hidden className="m-arrow" />
                  </a>
                  <a href="#contact" className="btn btn-outline">
                    {t("secondary")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
