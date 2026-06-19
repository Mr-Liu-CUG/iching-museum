"use client";

import type { Hexagram } from "@/lib/types";
import YaoLine from "./YaoLine";

const YAO_LABELS = ["上爻", "五爻", "四爻", "三爻", "二爻", "初爻"];

interface Props {
  hexagram: Hexagram;
  baseHexagram: Hexagram;
  onFlip: (index: number) => void;
}

export default function YaoLinesContainer({ hexagram, baseHexagram, onFlip }: Props) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-center font-song text-xs text-ink-muted mb-2 tracking-[2px]">
        点击任意爻线 · 体验变卦之妙
      </p>
      {YAO_LABELS.map((label, i) => (
        <YaoLine
          key={i}
          bit={hexagram.binary[i]}
          index={i}
          label={label}
          isChanged={hexagram.binary[i] !== baseHexagram.binary[i]}
          onClick={() => onFlip(i)}
        />
      ))}
    </div>
  );
}
