"use client";

import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { type ReactNode, useState } from "react";

// Auto-scrolling row of service cards. The CSS animation (globals.css, .marquee) pauses on hover
// and keyboard focus; this button pauses it for touch users and anyone who wants it still.
// Under reduced motion the row does not move at all and the button is hidden.
export function ServiceMarquee({
  children,
  pauseLabel,
  playLabel,
}: {
  children: ReactNode;
  pauseLabel: string;
  playLabel: string;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="marquee" data-paused={paused || undefined}>
      <div className="marquee__viewport">{children}</div>
      <div className="wrap marquee__controls">
        <button
          type="button"
          className="marquee__toggle"
          aria-pressed={paused}
          aria-label={paused ? playLabel : pauseLabel}
          title={paused ? playLabel : pauseLabel}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={16} weight="fill" aria-hidden /> : <Pause size={16} weight="fill" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
