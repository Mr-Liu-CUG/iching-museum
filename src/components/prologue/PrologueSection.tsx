"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/use-translation";
import PrologueTabs from "./PrologueTabs";
import HistoryTab from "./HistoryTab";
import MethodTab from "./MethodTab";
import MastersTab from "./MastersTab";
import ModernTab from "./ModernTab";

export default function PrologueSection() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("history");

  return (
    <section className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-center py-4 px-6 rounded-lg border border-dashed border-gold-primary/30 bg-bg-paper/60 hover:bg-gold-pale/10 transition-colors font-song text-sm tracking-[2px] text-ink-muted hover:text-gold-primary cursor-pointer"
      >
        {isOpen ? t("prologue.close") : t("prologue.open")}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-lg border border-border-gold bg-card-bg-solid p-5 lg:p-6">
              <PrologueTabs active={activeTab} onChange={setActiveTab} />
              <div className="mt-5 min-h-[200px]">
                {activeTab === "history" && <HistoryTab />}
                {activeTab === "method" && <MethodTab />}
                {activeTab === "masters" && <MastersTab />}
                {activeTab === "modern" && <ModernTab />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
