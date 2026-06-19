import type { Hexagram } from "@/lib/types";
import DetailCard from "./DetailCard";

interface Props {
  hexagram: Hexagram;
  index?: number;
}

export default function MnemonicSection({ hexagram, index = 6 }: Props) {
  return (
    <DetailCard icon="✍" title="口诀记忆 · 诗文传承" index={index}>
      <div className="flex flex-col gap-3">
        {hexagram.mnemonic && (
          <div className="border-l-2 border-gold-primary/20 pl-4">
            <h4 className="font-sans text-[10px] tracking-[2px] text-ink-muted mb-1">
              记忆口诀
            </h4>
            <p className="font-song text-sm text-ink-dark leading-relaxed m-0">
              {hexagram.mnemonic}
            </p>
          </div>
        )}
        {hexagram.poetry && (
          <div className="border-l-2 border-gold-pale pl-4">
            <h4 className="font-sans text-[10px] tracking-[2px] text-ink-muted mb-1">
              相关诗词
            </h4>
            <p className="font-song text-sm text-ink-dark leading-relaxed italic m-0">
              {hexagram.poetry}
            </p>
          </div>
        )}
        {!hexagram.mnemonic && !hexagram.poetry && (
          <p className="text-ink-muted text-sm">（数据收录中）</p>
        )}
      </div>
    </DetailCard>
  );
}
