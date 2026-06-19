import type { TrigramInfo } from "./types";

export const TRIGRAM_MAP: Record<string, TrigramInfo> = {
  "111": { name: "乾", symbol: "☰", element: "金", direction: "西北" },
  "110": { name: "兑", symbol: "☱", element: "金", direction: "西" },
  "101": { name: "离", symbol: "☲", element: "火", direction: "南" },
  "100": { name: "震", symbol: "☳", element: "木", direction: "东" },
  "011": { name: "巽", symbol: "☴", element: "木", direction: "东南" },
  "010": { name: "坎", symbol: "☵", element: "水", direction: "北" },
  "001": { name: "艮", symbol: "☶", element: "土", direction: "东北" },
  "000": { name: "坤", symbol: "☷", element: "土", direction: "西南" },
};

export const MATRIX_ORDER: string[] = [
  "111", "110", "101", "100", "011", "010", "001", "000",
];

export const PALACE_EN: Record<string, string> = {
  "乾宫": "Qian Palace",
  "兑宫": "Dui Palace",
  "离宫": "Li Palace",
  "震宫": "Zhen Palace",
  "巽宫": "Xun Palace",
  "坎宫": "Kan Palace",
  "艮宫": "Gen Palace",
  "坤宫": "Kun Palace",
};

export const YAO_POSITIONS = [
  "panel.yao.upper",
  "panel.yao.fifth",
  "panel.yao.fourth",
  "panel.yao.third",
  "panel.yao.second",
  "panel.yao.initial",
] as const;

export const YAO_CHINESE_PREFIXES = ["上", "五", "四", "三", "二", "初"] as const;
export const YAO_YANG_NAMES = ["上九", "九五", "九四", "九三", "九二", "初九"] as const;
export const YAO_YIN_NAMES = ["上六", "六五", "六四", "六三", "六二", "初六"] as const;

export const NUM_TO_CHINESE: Record<number, string> = {
  1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 7: "七", 8: "八", 9: "九", 10: "十",
  11: "十一", 12: "十二", 13: "十三", 14: "十四", 15: "十五", 16: "十六", 17: "十七", 18: "十八",
  19: "十九", 20: "二十", 21: "二十一", 22: "二十二", 23: "二十三", 24: "二十四", 25: "二十五",
  26: "二十六", 27: "二十七", 28: "二十八", 29: "二十九", 30: "三十", 31: "三十一", 32: "三十二",
  33: "三十三", 34: "三十四", 35: "三十五", 36: "三十六", 37: "三十七", 38: "三十八", 39: "三十九",
  40: "四十", 41: "四十一", 42: "四十二", 43: "四十三", 44: "四十四", 45: "四十五", 46: "四十六",
  47: "四十七", 48: "四十八", 49: "四十九", 50: "五十", 51: "五十一", 52: "五十二", 53: "五十三",
  54: "五十四", 55: "五十五", 56: "五十六", 57: "五十七", 58: "五十八", 59: "五十九", 60: "六十",
  61: "六十一", 62: "六十二", 63: "六十三", 64: "六十四",
};
