import type { Hexagram } from "@/lib/types";
import HexagramTitle from "./HexagramTitle";
import YaoLinesContainer from "./YaoLinesContainer";
import MetaGrid from "./MetaGrid";
import RelationGraph from "./RelationGraph";
import type { HexagramRelation, YaoNetworkItem } from "@/lib/types";

interface Props {
  hexagram: Hexagram;
  baseHexagram: Hexagram;
  relationGraph: HexagramRelation;
  yaoNetwork: YaoNetworkItem[];
  onFlipYao: (index: number) => void;
  onNavigate: (binary: string) => void;
}

export default function HexagramView({
  hexagram,
  baseHexagram,
  relationGraph,
  yaoNetwork,
  onFlipYao,
  onNavigate,
}: Props) {
  return (
    <section className="rounded-lg border border-border-gold bg-card-bg p-5 lg:p-6 shadow-sm">
      <div className="text-center mb-4 p-2">
        <span className="inline-grid place-items-center w-10 h-10 rounded-full border border-red-palace/30 text-red-palace/40 font-song text-lg select-none">
          ☯
        </span>
      </div>
      <HexagramTitle hexagram={hexagram} />
      <YaoLinesContainer
        hexagram={hexagram}
        baseHexagram={baseHexagram}
        onFlip={onFlipYao}
      />
      <MetaGrid hexagram={hexagram} />
      <RelationGraph relation={relationGraph} onNavigate={onNavigate} />

      {/* Yao change network */}
      <div className="mt-6">
        <h3 className="text-center font-song text-xs tracking-[3px] text-ink-muted mb-3">
          六爻变卦网络
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {yaoNetwork.map((item) => (
            <button
              key={item.position}
              type="button"
              onClick={() => onNavigate(item.toBinary)}
              className={`flex flex-col items-center px-2 py-2 rounded-md border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
                item.isChanged
                  ? "border-red-palace/40 bg-red-palace/5"
                  : "border-border-gold bg-bg-paper/60 hover:border-gold-primary/30"
              }`}
            >
              <span className="font-song text-[10px] text-ink-muted">{item.yaoName}</span>
              <span className="text-sm leading-none my-0.5 select-none">{item.targetSymbol}</span>
              <span className="font-song text-[10px] text-ink-dark">{item.targetName}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
