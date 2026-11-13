"use client";

import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";

// Pause / play for the marketplace marquee (moving content longer than 5 s needs a stop control,
// WCAG 2.2.2). It flags the nearest [data-marquee] ancestor with data-paused; CSS does the rest.
// Not persisted: every visit starts running.
export function MarqueeToggle({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const marquee = ref.current?.closest<HTMLElement>("[data-marquee]");
    if (marquee) marquee.dataset.paused = String(paused);
  }, [paused]);

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={paused}
      aria-label={paused ? playLabel : pauseLabel}
      title={paused ? playLabel : pauseLabel}
      onClick={() => setPaused((value) => !value)}
      className="marquee__toggle inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-forest"
    >
      {paused ? <Play size={16} weight="fill" aria-hidden /> : <Pause size={16} weight="fill" aria-hidden />}
    </button>
  );
}
