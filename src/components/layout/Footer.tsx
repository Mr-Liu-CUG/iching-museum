"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-8 px-4 font-sans text-xs tracking-[2px] text-ink-muted border-t border-border-pale mt-16"
    >
      数字博物 · 易经美学可视化研究 &copy; 2026 | 宋韵美学 · 东方哲思
    </motion.footer>
  );
}
