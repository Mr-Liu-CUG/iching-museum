"use client";

import { useAppStore } from "@/stores/app-store";
import HexagramView from "./HexagramView";
import HexagramContent from "./HexagramContent";
import hexagramsData from "@/data/hexagrams-data.json";
import type { Hexagram } from "@/lib/types";

const data = hexagramsData as Hexagram[];

const lookupByBinary = new Map<string, Hexagram>();
for (const h of data) lookupByBinary.set(h.binary, h);

export default function HexagramExplorer() {
  const currentBinary = useAppStore((s) => s.currentBinary);
  const baseBinary = useAppStore((s) => s.baseBinary);
  const flipYaoAt = useAppStore((s) => s.flipYaoAt);
  const setHexagram = useAppStore((s) => s.setHexagram);

  const hex = lookupByBinary.get(currentBinary);
  const base = lookupByBinary.get(baseBinary);

  if (!hex || !base) {
    return (
      <div className="text-center py-20 text-ink-muted">
        加载中…
      </div>
    );
  }

  const rel = {
    ben: { binary: base.binary, name: base.shortName, symbol: base.symbol },
    bian: base.binary !== currentBinary
      ? { binary: hex.binary, name: hex.shortName, symbol: hex.symbol }
      : null,
    cuo: computeCuo(base),
    zong: computeZong(base),
    hu: computeHu(base),
  };

  const network = Array.from({ length: 6 }, (_, i) => {
    const toBinary = flipBit(baseBinary, i);
    const target = lookupByBinary.get(toBinary);
    return {
      position: i,
      yaoName: baseBinary[i] === "1" ? `九${5 - i}` : `六${5 - i}`,
      fromBinary: baseBinary,
      toBinary,
      targetName: target?.shortName || "?",
      targetSymbol: target?.symbol || "?",
      isChanged: baseBinary[i] !== currentBinary[i],
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-5 lg:gap-6" id="hexagram-explorer">
      <HexagramView
        hexagram={hex}
        baseHexagram={base}
        relationGraph={rel}
        yaoNetwork={network}
        onFlipYao={flipYaoAt}
        onNavigate={setHexagram}
      />
      <HexagramContent hexagram={hex} onNavigateBiangua={setHexagram} />
    </div>
  );
}

function flipBit(binary: string, index: number): string {
  const arr = binary.split("");
  arr[index] = arr[index] === "1" ? "0" : "1";
  return arr.join("");
}

function computeCuo(h: Hexagram) {
  const cuoBin = h.binary.split("").map((b) => (b === "1" ? "0" : "1")).join("");
  const t = lookupByBinary.get(cuoBin);
  return { binary: cuoBin, name: t?.shortName || "?", symbol: t?.symbol || "?" };
}

function computeZong(h: Hexagram) {
  const zongBin = h.binary.split("").reverse().join("");
  const t = lookupByBinary.get(zongBin);
  return { binary: zongBin, name: t?.shortName || "?", symbol: t?.symbol || "?" };
}

function computeHu(h: Hexagram) {
  const huBin = h.binary[1] + h.binary[2] + h.binary[3] + h.binary[2] + h.binary[3] + h.binary[4];
  const t = lookupByBinary.get(huBin);
  return { binary: huBin, name: t?.shortName || "?", symbol: t?.symbol || "?" };
}
