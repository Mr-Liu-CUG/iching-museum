import type { Hexagram } from "@/lib/types";
import DetailCard from "./DetailCard";

interface Props {
  hexagram: Hexagram;
  index?: number;
}

export default function GuaciSection({ hexagram, index = 0 }: Props) {
  return (
    <DetailCard icon="📜" title="卦辞本义" index={index}>
      <blockquote className="font-song text-red-palace text-base tracking-wider leading-loose text-justify m-0 mb-3 border-l-2 border-red-palace/30 pl-4">
        {hexagram.guaci || "（暂无数据）"}
      </blockquote>
      <p className="text-ink-muted text-sm leading-relaxed text-justify m-0">
        {hexagram.guaciExplain || "（数据收录中）"}
      </p>
    </DetailCard>
  );
}
