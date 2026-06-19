"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { getDailyHexagramId, formatDateCN } from "@/lib/daily-utils";
import hexagramsData from "@/data/hexagrams-data.json";
import type { Hexagram } from "@/lib/types";

const data = hexagramsData as Hexagram[];

export default function DailyHexagram() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const setHexagram = useAppStore((s) => s.setHexagram);

  const id = mounted ? getDailyHexagramId() : 0;
  const hexagram = data[id];
  if (!hexagram) return null;

  const wisdom = hexagram.guaciExplain?.split("。")[0] + "。" || hexagram.mnemonic || "";

  return (
    <motion.section
      id="daily-hexagram"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 px-4 text-center"
    >
      <p className="font-sans text-[10px] tracking-[3px] text-ink-muted mb-2">
        {mounted ? formatDateCN() : ""}
      </p>
      <h2 className="font-song text-lg tracking-[4px] text-ink-dark mb-8">
        今日一卦
      </h2>

      <div className="inline-flex flex-col items-center">
        <span className="block text-5xl mb-4 select-none">{hexagram.symbol}</span>
        <h3 className="font-song text-xl tracking-[2px] text-ink-dark mb-1">
          {hexagram.name}
        </h3>
        <p className="font-sans text-xs text-ink-muted mb-6">{hexagram.pinyin}</p>

        <div className="max-w-md mx-auto">
          <p className="font-song text-sm text-ink-muted leading-relaxed italic mb-6">
            「{wisdom}」
          </p>

          <div className="grid grid-cols-2 gap-4 text-left mb-8">
            <div className="rounded-md border border-border-gold bg-bg-paper/60 p-4">
              <h4 className="font-sans text-[10px] tracking-[2px] text-gold-primary mb-2">
                思考方向
              </h4>
              <p className="font-song text-xs text-ink-muted leading-relaxed">
                {hexagram.guaciExplain?.length > 10
                  ? hexagram.guaciExplain.slice(0, 60) + "..."
                  : hexagram.guaciExplain || "静观其变，审时度势"}
              </p>
            </div>
            <div className="rounded-md border border-border-gold bg-bg-paper/60 p-4">
              <h4 className="font-sans text-[10px] tracking-[2px] text-gold-primary mb-2">
                行动建议
              </h4>
              <p className="font-song text-xs text-ink-muted leading-relaxed">
                {hexagram.xiangExplain?.length > 10
                  ? hexagram.xiangExplain.slice(0, 60) + "..."
                  : hexagram.xiangExplain || "君子以自强不息"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setHexagram(hexagram.binary);
            setTimeout(() => {
              document.getElementById("hexagram-explorer")?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }}
          className="font-song text-xs tracking-[2px] text-gold-primary hover:text-gold-dark transition-colors cursor-pointer"
        >
          查看完整解读 →
        </button>
      </div>
    </motion.section>
  );
}
