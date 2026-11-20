"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";

export function CopyButton({
  text,
  label = "Sao chép",
  copiedLabel = "Đã chép",
  className = "",
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is blocked
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${label}: ${text}`}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-ivory backdrop-blur-xs transition-all hover:border-gold hover:bg-gold/15 hover:text-gold active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <Check size={14} weight="bold" className="text-emerald-400" />
          <span className="text-emerald-300 font-semibold">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy size={14} weight="regular" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
