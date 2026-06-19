import type { HexagramsData, Language } from "./types";
import { NUM_TO_CHINESE } from "./constants";

export function resolvePath(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return "";
    }
  }
  return typeof current === "string" ? current : "";
}

export function numToChinese(n: number): string {
  return NUM_TO_CHINESE[n] || String(n);
}

export function kwLookup(kw: number, data: HexagramsData): string {
  for (const h of data) {
    if (h.kingWen === kw) return h.binary;
  }
  return "111111";
}

export function binaryToKw(binary: string, data: HexagramsData): number {
  const hex = data[parseInt(binary, 2)];
  return hex?.kingWen ?? 1;
}

export function clampBinary(val: number): number {
  return Math.max(0, Math.min(63, val));
}

export function navigateBinary(current: string, direction: 1 | -1): string {
  const next = parseInt(current, 2) + direction;
  return clampBinary(next).toString(2).padStart(6, "0");
}

export function searchHexagrams(
  query: string,
  data: HexagramsData
): Array<{ binary: string; name: string; pinyin: string; symbol: string }> {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return data
    .filter((h) => {
      return (
        h.name.includes(q) ||
        h.shortName.includes(q) ||
        h.pinyin.toLowerCase().includes(q) ||
        h.binary.includes(q) ||
        (h.upper + h.lower).includes(q)
      );
    })
    .slice(0, 8)
    .map((h) => ({
      binary: h.binary,
      name: h.name,
      pinyin: h.pinyin,
      symbol: h.symbol,
    }));
}

export function getLangLabel(lang: Language): string {
  const labels: Record<Language, string> = {
    "zh-CN": "简",
    "zh-TW": "繁",
    en: "EN",
    ja: "日",
  };
  return labels[lang];
}
