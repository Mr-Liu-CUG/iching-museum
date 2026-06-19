"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 scroll-mt-32"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-6"
      >
        <span
          className="block font-song text-[7rem] sm:text-[8rem] leading-none text-red-palace select-none"
          style={{ textShadow: "0 0 80px rgba(180, 130, 80, 0.25)" }}
          aria-label="易"
        >
          易
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="font-song text-2xl sm:text-3xl tracking-[8px] text-ink-dark mb-3"
      >
        易经数字博物馆
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="font-sans text-[10px] sm:text-xs tracking-[3px] text-ink-muted uppercase mb-2"
      >
        I Ching Digital Museum
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-song text-sm tracking-[3px] text-ink-muted/70 mb-10"
      >
        三千年前的智慧 · 今天依然在回答人生问题
      </motion.p>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        onClick={() => {
          document.getElementById("daily-hexagram")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="font-song text-xs tracking-[3px] text-ink-muted hover:text-gold-primary transition-colors cursor-pointer"
      >
        开始探索 ↓
      </motion.button>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-px h-16 bg-gold-pale/50 origin-top"
      />
    </motion.section>
  );
}
