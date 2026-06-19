"use client";

import { useAppStore } from "@/stores/app-store";
import { MATRIX_ORDER } from "@/lib/constants";
import type { Hexagram } from "@/lib/types";

export default function HexagramMatrix() {
  const currentBinary = useAppStore((s) => s.currentBinary);
  const setHexagram = useAppStore((s) => s.setHexagram);
  const getData = useAppStore((s) => s.getData);

  const data = getData() as Hexagram[];
  const all = data.map((h) => h.binary);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 md:gap-2">
      {MATRIX_ORDER.flatMap((upper) =>
        MATRIX_ORDER.map((lower) => {
          const binary = upper + lower;
          const hex = data.find((h) => h.binary === binary);
          if (!hex) return null;
          const isActive = binary === currentBinary;

          return (
            <button
              key={binary}
              type="button"
              onClick={() => setHexagram(binary)}
              className={`aspect-square rounded-md border flex flex-col items-center justify-center p-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-gold-primary bg-gold-pale/30 shadow-gold scale-105 z-10"
                  : "border-border-gold bg-bg-paper/70 hover:bg-red-palace/5 hover:border-red-palace/20"
              }`}
              aria-label={hex.name}
              title={`${hex.name} (${hex.pinyin})`}
            >
              <span className="text-base sm:text-lg leading-none select-none">{hex.symbol}</span>
              <span className="text-[9px] sm:text-[10px] font-song text-ink-muted mt-0.5 leading-tight">
                {hex.shortName}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}
