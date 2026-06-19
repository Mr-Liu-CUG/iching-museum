"use client";

import { motion } from "framer-motion";
import HexagramMatrix from "./HexagramMatrix";

export default function MatrixSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 mb-8"
    >
      <div className="text-center mb-6">
        <h2 className="font-song text-lg tracking-[4px] text-ink-dark mb-2">
          六十四卦全景数字矩阵
        </h2>
        <p className="font-song text-xs text-ink-muted tracking-[2px]">
          乾坤德配 · 咸恒体用 · 周易通行卦序全景呈现
        </p>
      </div>
      <HexagramMatrix />
    </motion.section>
  );
}
