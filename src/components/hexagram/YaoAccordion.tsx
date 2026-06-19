"use client";

import { useState } from "react";
import type { Hexagram, YaoLine } from "@/lib/types";
import DetailCard from "./DetailCard";

interface Props {
  hexagram: Hexagram;
  onNavigateBiangua: (binary: string) => void;
  index?: number;
}

export default function YaoAccordion({ hexagram, onNavigateBiangua, index = 3 }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <DetailCard icon="☰☷" title="六爻爻辞演进" index={index}>
      <div className="flex flex-col gap-2">
        {hexagram.yaoci.map((yao, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-md border border-border-pale overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-bg-paper/50 hover:bg-gold-pale/10 transition-colors"
              >
                <span className="font-song text-sm text-ink-dark">{yao.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-song text-xs text-ink-muted truncate max-w-[200px] hidden sm:block">
                    {yao.text}
                  </span>
                  {yao.biangua && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateBiangua(yao.bianguaBinary);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          onNavigateBiangua(yao.bianguaBinary);
                        }
                      }}
                      className="font-sans text-[10px] px-2 py-0.5 rounded-full border border-gold-primary/30 text-gold-primary bg-gold-pale/20 hover:bg-gold-primary/20 transition-colors cursor-pointer"
                    >
                      变卦 → {yao.biangua}
                    </span>
                  )}
                  <span
                    className={`text-xs text-ink-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </button>
              {isOpen && <YaoDetail yao={yao} />}
            </div>
          );
        })}
      </div>
    </DetailCard>
  );
}

function YaoDetail({ yao }: { yao: YaoLine }) {
  return (
    <div className="px-4 py-4 bg-bg-paper/50 border-t border-border-pale">
      <h4 className="font-song text-sm text-red-palace mb-2">原文</h4>
      <p className="font-song text-sm text-ink-dark leading-relaxed text-justify mb-4">
        {yao.text}
      </p>
      <h4 className="font-song text-sm text-ink-muted mb-2">白话</h4>
      <p className="text-ink-muted text-sm leading-relaxed text-justify mb-3">{yao.explain}</p>
      {yao.shaoYong?.text && (
        <div className="mt-3 pt-3 border-t border-border-dashed">
          <h4 className="font-sans text-[11px] text-ink-muted mb-1">邵雍解</h4>
          <p className="text-ink-muted text-xs leading-relaxed">
            <span className="text-ink-dark font-medium">{yao.shaoYong.assessment} </span>
            {yao.shaoYong.text}
          </p>
        </div>
      )}
      {yao.fuPeirong?.shiyun && (
        <div className="mt-2 pt-2 border-t border-border-dashed">
          <h4 className="font-sans text-[11px] text-ink-muted mb-1">傅佩榮解</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-ink-muted">
            <span>时运：{yao.fuPeirong.shiyun}</span>
            <span>财运：{yao.fuPeirong.caiyun}</span>
            <span>家宅：{yao.fuPeirong.jiazhai}</span>
            <span>身体：{yao.fuPeirong.shenti}</span>
          </div>
        </div>
      )}
    </div>
  );
}
