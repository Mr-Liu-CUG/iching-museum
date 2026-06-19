"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { LOCALES, type Locale } from "@/i18n/locales";

export default function Header() {
  const lang = useAppStore((s) => s.lang) as Locale;
  const setLang = useAppStore((s) => s.setLang);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLocale = LOCALES.find((l) => l.key === lang) || LOCALES[0];

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 p-4 flex items-center justify-between"
    >
      {/* Logo mark */}
      <div
        className="inline-grid place-items-center w-10 h-10 rounded-full border border-red-palace/40 text-red-palace/70 font-song text-sm font-bold bg-bg-paper/60 backdrop-blur-md"
        aria-label="易"
      >
        易
      </div>

      {/* Language switcher */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border-gold/40 bg-bg-paper/60 backdrop-blur-md font-sans text-[10px] text-ink-muted hover:text-ink-dark hover:border-gold-primary/30 transition-colors cursor-pointer"
        >
          <span>{currentLocale.nativeLabel}</span>
          <span className="text-[8px] opacity-50">▼</span>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full right-0 mt-1 rounded-md border border-border-gold bg-card-bg-solid shadow-lg overflow-hidden"
            >
              {LOCALES.map((loc) => (
                <button
                  key={loc.key}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLang(loc.key);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 font-sans text-xs transition-colors cursor-pointer ${
                    loc.key === lang
                      ? "text-gold-primary bg-gold-pale/20"
                      : "text-ink-muted hover:text-ink-dark hover:bg-bg-paper"
                  }`}
                >
                  {loc.nativeLabel}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
