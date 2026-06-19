import type { Hexagram } from "@/lib/types";

interface Props {
  hexagram: Hexagram;
}

export default function HexagramTitle({ hexagram }: Props) {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-4 mb-3">
        <span className="text-7xl leading-none select-none" aria-label={hexagram.name}>
          {hexagram.symbol}
        </span>
      </div>
      <h2 className="font-song text-3xl tracking-[4px] text-ink-dark m-0 mb-2">
        {hexagram.name}
      </h2>
      <div className="flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-3 py-0.5 rounded-full border border-gold-primary/30 text-xs font-sans text-gold-primary bg-gold-pale/20">
          第 {hexagram.kingWen} 卦
        </span>
        <span className="text-xs font-sans text-ink-muted">{hexagram.pinyin}</span>
      </div>
    </div>
  );
}
