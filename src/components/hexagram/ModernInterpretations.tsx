import type { Hexagram } from "@/lib/types";
import DetailCard from "./DetailCard";

const FIELDS = [
  { key: "career" as const, label: "/ 事业之思 /" },
  { key: "wealth" as const, label: "/ 财富之思 /" },
  { key: "love" as const, label: "/ 情感之思 /" },
  { key: "health" as const, label: "/ 身心之思 /" },
  { key: "interpersonal" as const, label: "/ 人际之思 /" },
];

interface Props {
  hexagram: Hexagram;
  index?: number;
}

export default function ModernInterpretations({ hexagram, index = 5 }: Props) {
  return (
    <DetailCard title="现代生活之思" index={index}>
      <p className="font-song text-xs text-ink-muted mb-3 text-justify leading-relaxed">
        以下从哲学视角解读此卦对现代生活的启示，供思考而非预测。
      </p>
      <div className="flex flex-col gap-3">
        {FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className="border-l-2 border-gold-primary/25 pl-4 py-1 transition-colors hover:border-gold-primary/60"
          >
            <h4 className="font-sans text-[10px] tracking-[2px] text-gold-primary mb-1">
              {label}
            </h4>
            <p className="text-sm text-ink-muted leading-relaxed m-0">
              {hexagram.interpretation?.[key] || "—"}
            </p>
          </div>
        ))}
      </div>
    </DetailCard>
  );
}
