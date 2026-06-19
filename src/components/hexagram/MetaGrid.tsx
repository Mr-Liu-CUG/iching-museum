import type { Hexagram } from "@/lib/types";

interface Props {
  hexagram: Hexagram;
}

const META_ITEMS = [
  { key: "upper" as const, label: "上 卦" },
  { key: "lower" as const, label: "下 卦" },
  { key: "element" as const, label: "五 行" },
  { key: "direction" as const, label: "方 位" },
];

export default function MetaGrid({ hexagram }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {META_ITEMS.map(({ key, label }) => (
        <div
          key={key}
          className="text-center px-3 py-3 rounded-md border border-border-gold bg-bg-paper/80 transition-colors hover:bg-gold-pale/10"
        >
          <span className="block font-sans text-[10px] tracking-[2px] text-ink-muted mb-1">
            {label}
          </span>
          <span className="block font-song text-base text-ink-dark">
            {key === "upper" || key === "lower" ? (
              <>
                <span className="mr-2 text-xl leading-none align-middle">
                  {key === "upper" ? hexagram.upperSymbol : hexagram.lowerSymbol}
                </span>
                {hexagram[key]}
              </>
            ) : (
              hexagram[key]
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
