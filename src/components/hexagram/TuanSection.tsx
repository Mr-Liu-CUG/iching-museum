import type { Hexagram } from "@/lib/types";
import DetailCard from "./DetailCard";

interface Props {
  hexagram: Hexagram;
  index?: number;
}

export default function TuanSection({ hexagram, index = 1 }: Props) {
  return (
    <DetailCard icon="☰" title="彖传阐释" index={index}>
      {hexagram.tuan ? (
        <blockquote className="font-song text-ink-dark text-sm tracking-wider leading-loose text-justify m-0 mb-3 border-l-2 border-gold-primary/30 pl-4">
          {hexagram.tuan}
        </blockquote>
      ) : null}
      <p className="text-ink-muted text-sm leading-relaxed text-justify m-0">
        {hexagram.tuanExplain || "（数据收录中）"}
      </p>
    </DetailCard>
  );
}
