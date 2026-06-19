"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CURRICULUM, TOTAL_XP, TOTAL_MODULES } from "@/lib/curriculum";
import type { LearningModule } from "@/lib/curriculum";

type ExerciseState = {
  selectedAnswer?: number;
  showFeedback?: boolean;
  matchSelections: Record<string, string>;
  reflectionText: string;
};

export default function LearningPathSection() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedMod, setExpandedMod] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string>("zero");
  const [xpAnim, setXpAnim] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("iching-completed") || "[]");
      if (Array.isArray(stored)) setCompleted(new Set(stored));
    } catch { /* empty */ }
  }, []);

  useEffect(() => setXpAnim(true), []);

  const earnedXp = [...completed].reduce((sum, id) => {
    for (const level of CURRICULUM) {
      for (const mod of level.modules) {
        if (mod.id === id) return sum + mod.xp;
      }
    }
    return sum;
  }, 0);

  const toggleModule = useCallback(
    (modId: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(modId)) next.delete(modId);
        else next.add(modId);
        localStorage.setItem("iching-completed", JSON.stringify([...next]));
        return next;
      });
    },
    []
  );

  const masteryPct = Math.round((earnedXp / TOTAL_XP) * 100);
  const completedCount = completed.size;

  const levelProgress = (levelId: string) => {
    const level = CURRICULUM.find((l) => l.id === levelId);
    if (!level) return 0;
    const total = level.modules.length;
    const done = level.modules.filter((m) => completed.has(m.id)).length;
    return Math.round((done / total) * 100);
  };

  return (
    <motion.section
      id="learning-path"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 px-4 scroll-mt-32"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="font-song text-lg tracking-[4px] text-ink-dark mb-2">
          学习路径
        </h2>
        <p className="font-sans text-xs tracking-[2px] text-ink-muted mb-6">
          五阶十八课 · 从入门到精通
        </p>

        {/* Mastery card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block rounded-lg border border-border-gold bg-card-bg-solid px-8 py-4 min-w-[260px]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[10px] tracking-[2px] text-ink-muted">
              当前进度
            </span>
            <span className="font-sans text-xs font-bold text-gold-primary">
              {completedCount} / {TOTAL_MODULES} 课
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gold-pale/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: xpAnim ? `${masteryPct}%` : "0%" }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gold-primary"
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-sans text-[10px] text-ink-muted">
              {earnedXp} / {TOTAL_XP} XP
            </span>
            <span className="font-song text-xs text-gold-primary">{masteryPct}%</span>
          </div>
        </motion.div>
      </div>

      {/* Level tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CURRICULUM.map((level, i) => {
          const pct = levelProgress(level.id);
          const isActive = activeLevel === level.id;
          return (
            <motion.button
              key={level.id}
              type="button"
              onClick={() => setActiveLevel(level.id)}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative flex flex-col items-center px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "border-gold-primary/40 bg-gold-primary/10 text-gold-primary"
                  : "border-border-gold bg-bg-paper/60 text-ink-muted hover:border-gold-primary/25 hover:text-ink-dark"
              }`}
            >
              <span className="font-song text-sm tracking-[1px]">{level.title}</span>
              <span className="font-sans text-[9px] mt-0.5 opacity-70">{level.subtitle}</span>
              {pct > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold-primary text-white font-sans text-[8px] flex items-center justify-center">
                  {pct === 100 ? "✓" : `${pct}%`}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Module cards for active level */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto flex flex-col gap-3"
        >
          {CURRICULUM.find((l) => l.id === activeLevel)?.modules.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              index={i}
              isCompleted={completed.has(mod.id)}
              isExpanded={expandedMod === mod.id}
              onToggle={() => toggleModule(mod.id)}
              onExpand={() => setExpandedMod(expandedMod === mod.id ? null : mod.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      {masteryPct === 100 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center font-song text-sm text-gold-primary mt-10"
        >
          全部课程完成——你已是一位易学导师
        </motion.p>
      )}
    </motion.section>
  );
}

function ModuleCard({
  module: mod,
  index,
  isCompleted,
  isExpanded,
  onToggle,
  onExpand,
}: {
  module: LearningModule;
  index: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
}) {
  const [exercise, setExercise] = useState<ExerciseState>({
    selectedAnswer: undefined,
    showFeedback: false,
    matchSelections: {},
    reflectionText: "",
  });

  // Reset exercise state when module changes
  useEffect(() => {
    setExercise({ selectedAnswer: undefined, showFeedback: false, matchSelections: {}, reflectionText: "" });
  }, [mod.id]);

  const handleQuizSelect = (idx: number) => {
    if (exercise.showFeedback) return;
    setExercise((prev) => ({ ...prev, selectedAnswer: idx, showFeedback: true }));
  };

  const handleQuizReset = () => {
    setExercise((prev) => ({ ...prev, selectedAnswer: undefined, showFeedback: false }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-lg border transition-all duration-300 ${
        isCompleted
          ? "border-gold-primary/25 bg-gold-pale/10"
          : "border-border-gold bg-card-bg-solid hover:border-gold-primary/20"
      }`}
    >
      {/* Module header */}
      <button
        type="button"
        onClick={onExpand}
        className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer"
      >
        {/* Number badge */}
        <div
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-sans text-xs font-bold border-2 transition-all ${
            isCompleted
              ? "bg-gold-primary/15 border-gold-primary text-gold-primary"
              : "bg-bg-paper border-border-gold text-ink-muted"
          }`}
        >
          {isCompleted ? "✓" : mod.id}
        </div>

        {/* Title area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{mod.icon}</span>
            <h3 className="font-song text-sm text-ink-dark">{mod.title}</h3>
          </div>
          <p className="font-sans text-[11px] text-ink-muted mt-0.5">{mod.subtitle}</p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-sans text-[9px] text-ink-muted/60">{mod.xp} XP</span>
          <span
            role="checkbox"
            aria-checked={isCompleted}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }
            }}
            className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
              isCompleted
                ? "bg-gold-primary border-gold-primary text-white"
                : "border-border-gold text-transparent hover:border-gold-primary/40"
            }`}
          >
            {isCompleted && <span className="text-[10px]">✓</span>}
          </span>
          <span
            className={`text-ink-muted text-[10px] transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Expanded deep content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pt-1 border-t border-border-pale/50 mx-5">
              {/* Description */}
              <p className="text-sm text-ink-muted leading-relaxed mb-5">
                {mod.description}
              </p>

              {/* Learning Goal */}
              <div className="rounded-md border border-emerald-200/60 bg-emerald-50/40 p-3 mb-4">
                <h4 className="font-sans text-[10px] tracking-[2px] text-emerald-700 mb-1.5 flex items-center gap-1.5">
                  <span className="text-xs">🎯</span> 学习目标
                </h4>
                <p className="font-song text-xs text-ink-dark leading-relaxed">
                  {mod.learningGoal}
                </p>
              </div>

              {/* Key Concepts */}
              <div className="mb-4">
                <h4 className="font-sans text-[10px] tracking-[2px] text-gold-primary mb-2 flex items-center gap-1.5">
                  <span className="text-xs">🔑</span> 核心概念
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mod.keyConcepts.map((kc, i) => (
                    <motion.div
                      key={kc.title}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="rounded border border-border-gold/40 bg-bg-paper/50 p-2.5"
                    >
                      <span className="font-sans text-[10px] font-bold text-ink-dark">
                        {kc.title}
                      </span>
                      <p className="font-sans text-[10px] text-ink-muted mt-0.5 leading-relaxed">
                        {kc.brief}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual Metaphor */}
              <div className="rounded-md border border-purple-200/60 bg-purple-50/30 p-3 mb-4">
                <h4 className="font-sans text-[10px] tracking-[2px] text-purple-700 mb-1.5 flex items-center gap-1.5">
                  <span className="text-xs">🎨</span> 可视化隐喻
                </h4>
                <p className="font-song text-[11px] text-ink-muted leading-relaxed italic">
                  {mod.visualMetaphor}
                </p>
              </div>

              {/* Deep Dive */}
              <div className="mb-4">
                <h4 className="font-sans text-[10px] tracking-[2px] text-gold-primary mb-2 flex items-center gap-1.5">
                  <span className="text-xs">📖</span> 深度解读
                </h4>
                <div className="space-y-3">
                  {mod.deepDive.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                      className="text-[11px] text-ink-muted leading-relaxed pl-3 border-l-2 border-gold-primary/20"
                    >
                      {para}
                    </motion.p>
                  ))}
                </div>
              </div>

              {/* Interactive Exercise */}
              <div className="rounded-md border border-amber-200/70 bg-amber-50/50 p-4 mb-4">
                <h4 className="font-sans text-[10px] tracking-[2px] text-amber-700 mb-3 flex items-center gap-1.5">
                  <span className="text-xs">🎮</span> 互动练习
                  <span className="ml-auto font-sans text-[9px] text-amber-500 bg-amber-100 px-2 py-0.5 rounded-full">
                    {mod.interactiveExercise.type === "quiz"
                      ? "选择题"
                      : mod.interactiveExercise.type === "match"
                        ? "配对题"
                        : mod.interactiveExercise.type === "reflect"
                          ? "思考题"
                          : "构建题"}
                  </span>
                </h4>
                <p className="font-sans text-[11px] text-ink-dark mb-3 leading-relaxed">
                  {mod.interactiveExercise.prompt}
                </p>

                {/* Quiz type */}
                {mod.interactiveExercise.type === "quiz" && mod.interactiveExercise.options && (
                  <div className="space-y-1.5">
                    {mod.interactiveExercise.options.map((opt, oi) => {
                      const isSelected = exercise.selectedAnswer === oi;
                      const isCorrect = oi === mod.interactiveExercise.correctIndex;
                      let bgClass = "bg-bg-paper hover:bg-gold-pale/30 border-border-gold/50";
                      if (exercise.showFeedback) {
                        if (isCorrect) bgClass = "bg-emerald-100 border-emerald-300";
                        else if (isSelected) bgClass = "bg-red-100 border-red-300";
                        else bgClass = "bg-bg-paper/50 border-border-gold/30 opacity-60";
                      }
                      return (
                        <button
                          key={oi}
                          type="button"
                          onClick={() => handleQuizSelect(oi)}
                          className={`w-full text-left px-3 py-2 rounded border text-[11px] transition-all cursor-pointer ${bgClass}`}
                        >
                          <span className="font-sans text-[10px] text-ink-muted mr-2">
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          <span className="font-song text-ink-dark">{opt}</span>
                          {exercise.showFeedback && isCorrect && (
                            <span className="ml-2 text-emerald-600">✓ 正确</span>
                          )}
                          {exercise.showFeedback && isSelected && !isCorrect && (
                            <span className="ml-2 text-red-500">✗</span>
                          )}
                        </button>
                      );
                    })}
                    {exercise.showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-border-pale/50"
                      >
                        <p className="text-[10px] text-ink-muted leading-relaxed">
                          <span className="text-amber-600 font-bold mr-1">解析：</span>
                          {mod.interactiveExercise.explanation}
                        </p>
                        <button
                          type="button"
                          onClick={handleQuizReset}
                          className="mt-2 font-sans text-[9px] text-gold-primary hover:underline cursor-pointer"
                        >
                          重新作答
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Match type */}
                {mod.interactiveExercise.type === "match" && mod.interactiveExercise.options && (
                  <div>
                    <p className="text-[10px] text-ink-muted mb-2">
                      将左侧的项目拖到正确的分类中（点击分类查看答案）
                    </p>
                    <div className="space-y-2">
                      {Object.entries(mod.interactiveExercise.correctMatches || {}).map(([category, items]) => (
                        <motion.details
                          key={category}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="rounded border border-border-gold/40 bg-bg-paper/50"
                        >
                          <summary className="px-3 py-2 font-sans text-[10px] text-ink-dark cursor-pointer hover:text-gold-primary transition-colors">
                            {category}
                          </summary>
                          <p className="px-3 pb-2 font-song text-[10px] text-ink-muted">{items}</p>
                        </motion.details>
                      ))}
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 pt-3 border-t border-border-pale/50"
                    >
                      <p className="text-[10px] text-ink-muted leading-relaxed">
                        <span className="text-amber-600 font-bold mr-1">解析：</span>
                        {mod.interactiveExercise.explanation}
                      </p>
                    </motion.div>
                  </div>
                )}

                {/* Reflect type */}
                {mod.interactiveExercise.type === "reflect" && (
                  <div>
                    <textarea
                      value={exercise.reflectionText}
                      onChange={(e) =>
                        setExercise((prev) => ({ ...prev, reflectionText: e.target.value }))
                      }
                      placeholder="在此写下你的思考..."
                      rows={4}
                      className="w-full rounded border border-border-gold/50 bg-bg-paper px-3 py-2 text-[11px] text-ink-dark placeholder:text-ink-muted/40 resize-none focus:outline-none focus:border-gold-primary/40 transition-colors"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 pt-3 border-t border-border-pale/50"
                    >
                      <p className="text-[10px] text-ink-muted leading-relaxed">
                        <span className="text-amber-600 font-bold mr-1">参考：</span>
                        {mod.interactiveExercise.explanation}
                      </p>
                    </motion.div>
                  </div>
                )}

                {/* Build type */}
                {mod.interactiveExercise.type === "build" && mod.interactiveExercise.options && (
                  <div className="space-y-1.5">
                    {mod.interactiveExercise.options.map((opt, oi) => {
                      const isCorrect = oi === mod.interactiveExercise.correctIndex;
                      const isSelected = exercise.selectedAnswer === oi;
                      let bgClass = "bg-bg-paper hover:bg-gold-pale/30 border-border-gold/50";
                      if (exercise.showFeedback) {
                        if (isCorrect) bgClass = "bg-emerald-100 border-emerald-300";
                        else if (isSelected) bgClass = "bg-red-100 border-red-300";
                        else bgClass = "bg-bg-paper/50 border-border-gold/30 opacity-60";
                      }
                      return (
                        <button
                          key={oi}
                          type="button"
                          onClick={() => {
                            if (!exercise.showFeedback) {
                              setExercise((prev) => ({ ...prev, selectedAnswer: oi, showFeedback: true }));
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded border text-[11px] transition-all cursor-pointer ${bgClass}`}
                        >
                          <span className="font-song text-ink-dark">{opt}</span>
                          {exercise.showFeedback && isCorrect && (
                            <span className="ml-2 text-emerald-600">✓ 正确</span>
                          )}
                          {exercise.showFeedback && isSelected && !isCorrect && (
                            <span className="ml-2 text-red-500">✗</span>
                          )}
                        </button>
                      );
                    })}
                    {exercise.showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-border-pale/50"
                      >
                        <p className="text-[10px] text-ink-muted leading-relaxed">
                          <span className="text-amber-600 font-bold mr-1">解析：</span>
                          {mod.interactiveExercise.explanation}
                        </p>
                        <button
                          type="button"
                          onClick={handleQuizReset}
                          className="mt-2 font-sans text-[9px] text-gold-primary hover:underline cursor-pointer"
                        >
                          重新作答
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Classic reference + Case study (existing compact view) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-md border border-border-gold/50 bg-bg-paper/60 p-3">
                  <h4 className="font-sans text-[10px] tracking-[2px] text-gold-primary mb-1.5">
                    ◈ 原文经典
                  </h4>
                  <p className="font-song text-xs text-ink-muted leading-relaxed italic">
                    {mod.classicRef}
                  </p>
                </div>

                <div className="rounded-md border border-border-gold/50 bg-bg-paper/60 p-3">
                  <h4 className="font-sans text-[10px] tracking-[2px] text-gold-primary mb-1.5">
                    ◈ 真实案例
                  </h4>
                  <p className="font-song text-xs text-ink-muted leading-relaxed">
                    {mod.caseStudy}
                  </p>
                </div>
              </div>

              {/* Expanded Case Study (deep) */}
              <div className="rounded-md border border-blue-200/60 bg-blue-50/30 p-4">
                <h4 className="font-sans text-[10px] tracking-[2px] text-blue-700 mb-3 flex items-center gap-1.5">
                  <span className="text-xs">💼</span> 深度案例分析
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center font-sans text-[9px] text-blue-600 mt-0.5">
                      景
                    </span>
                    <div>
                      <span className="font-sans text-[9px] text-blue-600/70 tracking-[1px]">背景</span>
                      <p className="text-[11px] text-ink-muted leading-relaxed mt-0.5">
                        {mod.expandedCase.context}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center font-sans text-[9px] text-amber-600 mt-0.5">
                      战
                    </span>
                    <div>
                      <span className="font-sans text-[9px] text-amber-600/70 tracking-[1px]">挑战</span>
                      <p className="text-[11px] text-ink-muted leading-relaxed mt-0.5">
                        {mod.expandedCase.challenge}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-gold-primary/15 flex items-center justify-center font-sans text-[9px] text-gold-primary mt-0.5">
                      应
                    </span>
                    <div>
                      <span className="font-sans text-[9px] text-gold-primary/70 tracking-[1px]">易经应用</span>
                      <p className="text-[11px] text-ink-muted leading-relaxed mt-0.5">
                        {mod.expandedCase.application}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-sans text-[9px] text-emerald-600 mt-0.5">
                      果
                    </span>
                    <div>
                      <span className="font-sans text-[9px] text-emerald-600/70 tracking-[1px]">结果</span>
                      <p className="text-[11px] text-ink-muted leading-relaxed mt-0.5">
                        {mod.expandedCase.outcome}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-border-pale/50">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-ink-dark/5 flex items-center justify-center font-sans text-[9px] text-ink-dark mt-0.5">
                      悟
                    </span>
                    <div>
                      <span className="font-sans text-[9px] text-ink-dark/60 tracking-[1px]">启示</span>
                      <p className="text-[11px] text-ink-dark/80 leading-relaxed mt-0.5 font-song">
                        {mod.expandedCase.lesson}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
