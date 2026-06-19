"use client";

import { useState } from "react";

interface Props {
  bit: string;
  index: number;
  label: string;
  isChanged: boolean;
  onClick?: () => void;
}

export default function YaoLine({ bit, index, label, isChanged, onClick }: Props) {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const isYang = bit === "1";

  const handleClick = (e: React.MouseEvent) => {
    if (!onClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative flex items-center gap-3 w-full py-3 px-4 rounded-md transition-colors duration-300 hover:bg-gold-pale/10 group"
      aria-label={`${label}: ${isYang ? "阳爻" : "阴爻"}${isChanged ? " (已变)" : ""}`}
    >
      <span className="font-sans text-xs text-ink-muted w-8 shrink-0 text-right select-none">
        {label}
      </span>
      <div className="flex-1 flex items-center justify-center h-8 relative">
        {isYang ? (
          <div
            className={`h-2 w-full max-w-[200px] mx-auto transition-all duration-500 ${
              isChanged
                ? "bg-red-palace/60 scale-x-105"
                : "bg-ink-dark/80 group-hover:bg-gold-primary/60"
            }`}
          />
        ) : (
          <div className="flex gap-3 items-center justify-center w-full max-w-[200px] mx-auto">
            <div
              className={`h-2 flex-1 transition-all duration-500 ${
                isChanged
                  ? "bg-red-palace/60 scale-x-105"
                  : "bg-ink-dark/80 group-hover:bg-gold-primary/60"
              }`}
            />
            <div
              className={`h-2 flex-1 transition-all duration-500 ${
                isChanged
                  ? "bg-red-palace/60 scale-x-105"
                  : "bg-ink-dark/80 group-hover:bg-gold-primary/60"
              }`}
            />
          </div>
        )}
        {ripple && (
          <span
            className="absolute rounded-full bg-gold-primary/20 animate-ping pointer-events-none"
            style={{
              left: ripple.x - 4,
              top: ripple.y - 4,
              width: 8,
              height: 8,
            }}
          />
        )}
      </div>
      {onClick && (
        <span className="font-sans text-[10px] text-ink-muted/0 group-hover:text-ink-muted/60 transition-colors select-none whitespace-nowrap">
          {isChanged ? "已变" : "点击翻转"}
        </span>
      )}
    </button>
  );
}
