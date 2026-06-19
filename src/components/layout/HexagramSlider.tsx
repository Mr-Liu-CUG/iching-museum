"use client";

import { useAppStore } from "@/stores/app-store";
import { binaryToKw } from "@/lib/utils";
import { numToChinese } from "@/lib/utils";
import type { Hexagram } from "@/lib/types";

export default function HexagramSlider() {
  const currentBinary = useAppStore((s) => s.currentBinary);
  const navigateKingWen = useAppStore((s) => s.navigateKingWen);
  const getData = useAppStore((s) => s.getData);

  const kw = binaryToKw(currentBinary, getData() as Hexagram[]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigateKingWen(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="font-sans text-xs text-ink-muted whitespace-nowrap shrink-0">卦序：</span>
      <input
        type="range"
        min={1}
        max={64}
        value={kw}
        onChange={handleChange}
        className="flex-1 min-w-[80px] h-1.5 rounded-full appearance-none bg-gold-pale cursor-pointer accent-gold-primary"
        aria-label="卦序滑块"
      />
      <span className="font-song text-sm text-ink-dark w-14 text-center shrink-0">
        {numToChinese(kw)}
      </span>
    </div>
  );
}
