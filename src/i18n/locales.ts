export type Locale = "zh-CN" | "zh-TW" | "en" | "ja";

export const LOCALES: { key: Locale; label: string; nativeLabel: string }[] = [
  { key: "zh-CN", label: "简体中文", nativeLabel: "简体中文" },
  { key: "zh-TW", label: "繁體中文", nativeLabel: "繁體中文" },
  { key: "en", label: "English", nativeLabel: "English" },
  { key: "ja", label: "日本語", nativeLabel: "日本語" },
];

export const DEFAULT_LOCALE: Locale = "zh-CN";
