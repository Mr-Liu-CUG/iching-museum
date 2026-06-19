"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAppStore } from "@/stores/app-store";
import { ensureConverter, isConverterReady, convertHexagramSync } from "./convert-data";
import type { Hexagram } from "@/lib/types";
import type { Locale } from "./locales";

const hexCache = new Map<string, Hexagram>();
const textCache = new Map<string, string>();

export function useHexagramLocalizer() {
  const lang = useAppStore((s) => s.lang) as Locale;
  const [ready, setReady] = useState(() => isConverterReady() || lang === "zh-CN");
  const lastLang = useRef(lang);

  useEffect(() => {
    if (lang !== lastLang.current) {
      hexCache.clear();
      textCache.clear();
      lastLang.current = lang;
    }
    if (lang === "zh-CN") {
      setReady(true);
      return;
    }
    let cancelled = false;
    ensureConverter().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, [lang]);

  const localize = useCallback(
    (hex: Hexagram): Hexagram => {
      if (lang === "zh-CN") return hex;
      const key = `${lang}:${hex.binary}`;
      const cached = hexCache.get(key);
      if (cached) return cached;
      // For zh-TW and ja, convert Simplified → Traditional (Japanese kanji ≈ Traditional)
      const result = convertHexagramSync(hex);
      hexCache.set(key, result);
      return result;
    },
    [lang]
  );

  const localizeText = useCallback(
    (text: string): string => {
      if (lang === "zh-CN" || !text || !isConverterReady()) return text;
      const key = `${lang}:${text}`;
      const cached = textCache.get(key);
      if (cached) return cached;
      const result = convertHexagramSync({ name: text, shortName: text } as Hexagram);
      const converted = result.name || text;
      textCache.set(key, converted);
      return converted;
    },
    [lang]
  );

  return { localize, localizeText, ready, lang };
}
