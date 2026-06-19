import type { Hexagram } from "@/lib/types";
import DetailCard from "./DetailCard";

interface Props {
  hexagram: Hexagram;
  index?: number;
}

export default function XiangSection({ hexagram, index = 2 }: Props) {
  return (
    <DetailCard icon="☷" title="大象传" index={index}>
      {hexagram.xiang ? (
        <blockquote className="font-song text-ink-dark text-sm tracking-wider leading-loose text-justify m-0 mb-3 border-l-2 border-gold-primary/30 pl-4">
          {hexagram.xiang}
        </blockquote>
      ) : null}
      <p className="text-ink-muted text-sm leading-relaxed text-justify m-0">
        {hexagram.xiangExplain || "（数据收录中）"}
      </p>
    </DetailCard>
  );
}
