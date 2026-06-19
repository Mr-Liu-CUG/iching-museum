"use client";

import { useAppStore } from "@/stores/app-store";
import type { Locale } from "./locales";
import zhCN from "./dictionaries/zh-CN.json";
import zhTW from "./dictionaries/zh-TW.json";
import ja from "./dictionaries/ja.json";

type TranslationDict = typeof zhCN;

const DICT_MAP: Record<string, TranslationDict> = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ja,
};

export function useTranslation() {
  const lang = useAppStore((s) => s.lang) as Locale;
  const setLang = useAppStore((s) => s.setLang);

  const dict = DICT_MAP[lang] || zhCN;

  function t(path: string): string {
    const keys = path.split(".");
    let value: unknown = dict;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }
    return typeof value === "string" ? value : path;
  }

  return { t, lang, setLang };
}
