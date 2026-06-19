"use client";

import type { HexagramRelation } from "@/lib/types";

interface Props {
  relation: HexagramRelation;
  onNavigate: (binary: string) => void;
}

export default function RelationGraph({ relation, onNavigate }: Props) {
  return (
    <div className="mt-6">
      <h3 className="text-center font-song text-xs tracking-[3px] text-ink-muted mb-4">
        卦象演变图谱
      </h3>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <RelationNode
          label="本 卦"
          data={relation.ben}
          highlight
          onNavigate={onNavigate}
        />
        {relation.bian ? (
          <>
            <span className="text-gold-primary text-sm animate-pulse select-none">→</span>
            <RelationNode
              label="变 卦"
              data={relation.bian}
              highlight
              onNavigate={onNavigate}
            />
          </>
        ) : (
          <span className="font-song text-xs text-ink-muted ml-2">未生变爻</span>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
        <span className="font-sans text-[10px] text-ink-muted">错卦：</span>
        <RelationNode
          label=""
          data={relation.cuo}
          onNavigate={onNavigate}
        />
        <span className="font-sans text-[10px] text-ink-muted">综卦：</span>
        <RelationNode
          label=""
          data={relation.zong}
          onNavigate={onNavigate}
        />
        <span className="font-sans text-[10px] text-ink-muted">互卦：</span>
        <RelationNode
          label=""
          data={relation.hu}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

function RelationNode({
  label,
  data,
  highlight,
  onNavigate,
}: {
  label: string;
  data: { binary: string; name: string; symbol: string };
  highlight?: boolean;
  onNavigate: (binary: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(data.binary)}
      className={`inline-flex flex-col items-center px-3 py-2 rounded-md border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
        highlight
          ? "border-gold-primary/40 bg-gold-pale/20 shadow-gold"
          : "border-border-gold bg-bg-paper/60 hover:border-gold-primary/30"
      }`}
    >
      {label && (
        <span className="font-sans text-[10px] tracking-[1px] text-ink-muted mb-1">
          {label}
        </span>
      )}
      <span className="text-xl leading-none select-none">{data.symbol}</span>
      <span className="font-song text-[11px] text-ink-dark mt-0.5">{data.name}</span>
    </button>
  );
}
