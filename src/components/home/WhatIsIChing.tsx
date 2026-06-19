"use client";

import { motion } from "framer-motion";

const ERAS = [
  {
    number: "一",
    title: "伏羲画卦",
    subtitle: "上古 · 一画开天",
    body: "仰观天文，俯察地理。始作八卦，以通神明之德，以类万物之情。",
  },
  {
    number: "二",
    title: "文王演易",
    subtitle: "中古 · 羑里七年",
    body: "囚于羑里，将八卦重为六十四卦，系以卦辞。困厄之中，演天地之道。",
  },
  {
    number: "三",
    title: "孔子十翼",
    subtitle: "近古 · 韦编三绝",
    body: "晚年好易，作传七种十篇。将占筮之书提升为修身齐家治国的人生哲学。",
  },
  {
    number: "四",
    title: "现代价值",
    subtitle: "当代 · 智慧重生",
    body: "二进制启发了莱布尼茨，辩证法呼应了黑格尔。三千年智慧仍在回答今天的问题。",
  },
];

export default function WhatIsIChing() {
  return (
    <motion.section
      id="what-is-iching"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 px-4"
    >
      <h2 className="font-song text-lg tracking-[4px] text-ink-dark text-center mb-2">
        易经是什么
      </h2>
      <p className="font-sans text-xs tracking-[2px] text-ink-muted text-center mb-10">
        三千年东方智慧的源流
      </p>

      <div className="relative max-w-2xl mx-auto pl-10">
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gold-pale" />
        {ERAS.map((era, i) => (
          <motion.div
            key={era.number}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative pb-8 last:pb-0"
          >
            <span className="absolute -left-[25px] top-1 w-[18px] h-[18px] rounded-full border-2 border-gold-primary bg-bg-paper flex items-center justify-center font-sans text-[9px] text-gold-primary font-bold">
              {era.number}
            </span>
            <span className="font-sans text-[10px] tracking-[2px] text-ink-muted/60">
              {era.subtitle}
            </span>
            <h3 className="font-song text-base text-ink-dark mt-1 mb-1">{era.title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{era.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
