"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import hexagramsData from "@/data/hexagrams-data.json";
import type { Hexagram } from "@/lib/types";

const data = hexagramsData as Hexagram[];

const TRIGRAM_BINARY: Record<string, string> = {
  "乾": "111",
  "兑": "110",
  "离": "101",
  "震": "100",
  "巽": "011",
  "坎": "010",
  "艮": "001",
  "坤": "000",
};

const TRIGRAMS = [
  { symbol: "☰", name: "乾", element: "天", direction: "西北" },
  { symbol: "☱", name: "兑", element: "泽", direction: "西" },
  { symbol: "☲", name: "离", element: "火", direction: "南" },
  { symbol: "☳", name: "震", element: "雷", direction: "东" },
  { symbol: "☴", name: "巽", element: "风", direction: "东南" },
  { symbol: "☵", name: "坎", element: "水", direction: "北" },
  { symbol: "☶", name: "艮", element: "山", direction: "东北" },
  { symbol: "☷", name: "坤", element: "地", direction: "西南" },
];

export default function BaguaNavSection() {
  const setHexagram = useAppStore((s) => s.setHexagram);

  const scrollToExplorer = (binary: string) => {
    setHexagram(binary);
    setTimeout(() => {
      document.getElementById("hexagram-explorer")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <motion.section
      id="bagua-nav"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 px-4"
    >
      <h2 className="font-song text-lg tracking-[4px] text-ink-dark text-center mb-2">
        八卦导航
      </h2>
      <p className="font-sans text-xs tracking-[2px] text-ink-muted text-center mb-10">
        天地定位 · 山泽通气 · 雷风相薄 · 水火不相射
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {TRIGRAMS.map((t, i) => {
          const trigBin = TRIGRAM_BINARY[t.name];
          const doubleBinary = trigBin + trigBin;
          return (
            <motion.button
              key={t.name}
              type="button"
              onClick={() => scrollToExplorer(doubleBinary)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center p-4 rounded-lg border border-border-gold bg-bg-paper/60 hover:bg-gold-pale/10 hover:border-gold-primary/30 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
            >
              <span className="text-3xl mb-2 select-none">{t.symbol}</span>
              <span className="font-song text-sm text-ink-dark">{t.name}</span>
              <span className="font-sans text-[10px] text-ink-muted mt-0.5">
                {t.element} · {t.direction}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
