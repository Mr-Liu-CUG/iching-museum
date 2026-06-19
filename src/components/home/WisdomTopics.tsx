"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { WISDOM_TOPICS, HEXAGRAM_NAMES } from "@/lib/wisdom-topics";
import type { WisdomTopic, WisdomScenario } from "@/lib/wisdom-topics";

export default function WisdomTopics() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  const selectedTopic = WISDOM_TOPICS.find((t) => t.id === selectedTopicId) || null;

  const handleBack = useCallback(() => {
    setSelectedTopicId(null);
    setExpandedScenario(null);
  }, []);

  return (
    <motion.section
      id="wisdom-topics"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 px-4 scroll-mt-32"
    >
      <AnimatePresence mode="wait">
        {selectedTopic ? (
          <TopicDetailView
            key="detail"
            topic={selectedTopic}
            expandedScenario={expandedScenario}
            onToggleScenario={(idx) =>
              setExpandedScenario(expandedScenario === idx ? null : idx)
            }
            onBack={handleBack}
          />
        ) : (
          <TopicGridView
            key="grid"
            onSelectTopic={(id) => setSelectedTopicId(id)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ── Grid View ── */

function TopicGridView({ onSelectTopic }: { onSelectTopic: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hero */}
      <div className="text-center mb-8">
        <h2 className="font-song text-lg tracking-[4px] text-ink-dark mb-2">
          人生智慧专题
        </h2>
        <p className="font-sans text-xs tracking-[2px] text-ink-muted mb-8">
          易经不是预测工具，而是一面认识自己的镜子
        </p>
        <p className="font-song text-base text-ink-dark mb-1">
          你现在最关心什么？
        </p>
        <p className="font-sans text-[10px] text-ink-muted">
          选择一个方向，让三千年的智慧为你照亮前路
        </p>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
        {WISDOM_TOPICS.map((topic, i) => (
          <motion.button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.id)}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2 p-5 rounded-lg border border-border-gold bg-bg-paper/60 hover:bg-gold-pale/10 hover:border-gold-primary/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-center"
          >
            <span className="text-2xl select-none">{topic.icon}</span>
            <span className="font-song text-sm text-ink-dark">{topic.title}</span>
            <span className="font-sans text-[10px] text-ink-muted leading-relaxed hidden sm:block">
              {topic.description.slice(0, 30)}...
            </span>
          </motion.button>
        ))}
      </div>

      {/* Bottom hint */}
      <p className="text-center font-sans text-[10px] text-ink-muted/50 mt-8">
        共 {WISDOM_TOPICS.length} 个专题 · {WISDOM_TOPICS.reduce((s, t) => s + t.scenarios.length, 0)} 个人生场景
      </p>
    </motion.div>
  );
}

/* ── Detail View ── */

function TopicDetailView({
  topic,
  expandedScenario,
  onToggleScenario,
  onBack,
}: {
  topic: WisdomTopic;
  expandedScenario: number | null;
  onToggleScenario: (idx: number) => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 font-sans text-[10px] tracking-[1px] text-ink-muted hover:text-gold-primary transition-colors mb-6 cursor-pointer"
      >
        <span>←</span>
        <span>返回全部专题</span>
      </button>

      {/* Topic header */}
      <div className="text-center mb-8">
        <span className="text-3xl block mb-3">{topic.icon}</span>
        <h3 className="font-song text-lg tracking-[3px] text-ink-dark mb-1">
          {topic.title}馆
        </h3>
        <p className="font-sans text-xs text-ink-muted leading-relaxed max-w-lg mx-auto">
          {topic.description}
        </p>
        <span className="inline-block mt-2 font-sans text-[9px] text-gold-primary bg-gold-pale/30 px-2 py-0.5 rounded-full">
          {topic.targetAudience}
        </span>
      </div>

      {/* Scenarios */}
      <div className="flex flex-col gap-3">
        {topic.scenarios.map((scenario, idx) => (
          <ScenarioCard
            key={idx}
            scenario={scenario}
            index={idx}
            isExpanded={expandedScenario === idx}
            onToggle={() => onToggleScenario(idx)}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Scenario Card ── */

function ScenarioCard({
  scenario,
  index,
  isExpanded,
  onToggle,
}: {
  scenario: WisdomScenario;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const setHexagram = useAppStore((s) => s.setHexagram);

  const handleHexagramClick = (binary: string) => {
    setHexagram(binary);
    setTimeout(() => {
      document.getElementById("hexagram-explorer")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Find the binary key from HEXAGRAM_NAMES that matches the name
  const findBinary = (name: string): string | null => {
    for (const [binary, hexName] of Object.entries(HEXAGRAM_NAMES)) {
      if (hexName === name) return binary;
    }
    return null;
  };

  // Map hexagram IDs to display names
  const hexagramNames = scenario.hexagramIds
    .map((id) => HEXAGRAM_NAMES[id])
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-lg border transition-all duration-300 ${
        isExpanded
          ? "border-gold-primary/30 bg-gold-pale/10"
          : "border-border-gold bg-card-bg-solid hover:border-gold-primary/20"
      }`}
    >
      {/* Scenario header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer"
      >
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-sans text-[10px] font-bold transition-all ${
            isExpanded
              ? "bg-gold-primary/15 text-gold-primary"
              : "bg-bg-paper text-ink-muted border border-border-gold"
          }`}
        >
          {index + 1}
        </span>
        <span className="flex-1 font-song text-sm text-ink-dark">{scenario.question}</span>
        <span className="flex items-center gap-1.5 shrink-0">
          {hexagramNames.slice(0, 3).map((name, i) => (
            <span
              key={i}
              className="font-sans text-[9px] text-gold-primary/70 bg-gold-pale/20 px-1.5 py-0.5 rounded hidden sm:inline-block"
            >
              {name}
            </span>
          ))}
          <span
            className={`text-ink-muted text-[10px] transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border-pale/50 mx-5">
              {/* Hexagram insight */}
              <div className="rounded-md border border-amber-200/60 bg-amber-50/40 p-3 mb-4">
                <h4 className="font-sans text-[10px] tracking-[2px] text-amber-700 mb-1.5 flex items-center gap-1.5">
                  <span className="text-xs">☰</span> 卦象智慧
                </h4>
                <p className="font-song text-[11px] text-ink-dark leading-relaxed">
                  {scenario.hexagramInsight}
                </p>
                {/* Related hexagrams */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {hexagramNames.map((name) => {
                    const binary = findBinary(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (binary) handleHexagramClick(binary);
                        }}
                        className="font-sans text-[9px] px-2 py-1 rounded-full border border-gold-primary/25 text-gold-primary hover:bg-gold-primary/10 transition-colors cursor-pointer"
                      >
                        {name} →
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Historical case */}
              <div className="rounded-md border border-blue-200/60 bg-blue-50/30 p-3 mb-4">
                <h4 className="font-sans text-[10px] tracking-[2px] text-blue-700 mb-1.5 flex items-center gap-1.5">
                  <span className="text-xs">📜</span> 历史案例 · {scenario.historicalCase.person}
                </h4>
                <p className="font-song text-[11px] text-ink-muted leading-relaxed">
                  {scenario.historicalCase.story}
                </p>
              </div>

              {/* Modern advice */}
              <div className="rounded-md border border-emerald-200/60 bg-emerald-50/30 p-3">
                <h4 className="font-sans text-[10px] tracking-[2px] text-emerald-700 mb-2 flex items-center gap-1.5">
                  <span className="text-xs">💡</span> 现代建议
                </h4>
                <ul className="space-y-1.5">
                  {scenario.modernAdvice.map((advice, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-2 text-[11px] text-ink-muted"
                    >
                      <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center font-sans text-[8px] text-emerald-600 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-relaxed">{advice}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
