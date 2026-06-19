"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import { searchHexagrams } from "@/lib/utils";
import type { Hexagram } from "@/lib/types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchHexagrams>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setHexagram = useAppStore((s) => s.setHexagram);
  const getData = useAppStore((s) => s.getData);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const data = getData() as Hexagram[];
      setResults(searchHexagrams(value, data));
      setIsOpen(true);
      setSelectedIdx(-1);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (binary: string) => {
    setHexagram(binary);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && selectedIdx >= 0) {
      handleSelect(results[selectedIdx].binary);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.trim() && setIsOpen(true)}
        placeholder="搜索卦名 / 拼音 / 上卦下卦…"
        className="w-full px-4 py-2.5 rounded-md border border-border-gold bg-bg-paper/90 font-sans text-sm text-ink-dark placeholder:text-ink-light focus:outline-none focus:border-gold-primary/50 focus:ring-1 focus:ring-gold-primary/20 transition-all"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border-gold bg-card-bg-solid shadow-md z-50 max-h-[300px] overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={r.binary}
              type="button"
              onClick={() => handleSelect(r.binary)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gold-pale/10 transition-colors ${
                i === selectedIdx ? "bg-gold-pale/15" : ""
              }`}
            >
              <span className="text-xl select-none">{r.symbol}</span>
              <div>
                <span className="font-song text-sm text-ink-dark">{r.name}</span>
                <span className="font-sans text-xs text-ink-muted ml-2">{r.pinyin}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border-gold bg-card-bg-solid shadow-md z-50 p-4 text-center text-ink-muted text-sm">
          无匹配结果
        </div>
      )}
    </div>
  );
}
