import type { Hexagram } from "@/lib/types";

let s2tConverter: ((text: string) => string) | null = null;
const s2tCache = new Map<string, string>();

async function loadS2T(): Promise<(text: string) => string> {
  if (!s2tConverter) {
    const mod = await import("opencc-js");
    s2tConverter = mod.Converter({ from: "cn", to: "twp" });
  }
  return s2tConverter;
}

function toTraditionalSync(text: string): string {
  if (!text) return text;
  const cached = s2tCache.get(text);
  if (cached) return cached;
  if (!s2tConverter) return text;
  const result = s2tConverter(text);
  s2tCache.set(text, result);
  return result;
}

export async function ensureConverter(): Promise<void> {
  await loadS2T();
}

export function isConverterReady(): boolean {
  return s2tConverter !== null;
}

const HEX_TEXT_FIELDS = [
  "name", "shortName", "guaci", "guaciExplain",
  "tuan", "tuanExplain", "xiang", "xiangExplain",
  "mnemonic", "poetry",
] as const;

const YAO_TEXT_FIELDS = ["text", "explain", "explainShort"] as const;

export function convertHexagramSync(hex: Hexagram): Hexagram {
  if (!s2tConverter) return hex;

  const convert = toTraditionalSync;
  const result = { ...hex } as Record<string, unknown>;

  // Top-level text fields
  for (const field of HEX_TEXT_FIELDS) {
    const val = hex[field];
    if (typeof val === "string") result[field] = convert(val);
  }

  // Yao lines
  if (Array.isArray(hex.yaoci)) {
    result.yaoci = hex.yaoci.map((yao) => {
      const c = { ...yao } as Record<string, unknown>;
      for (const field of YAO_TEXT_FIELDS) {
        const val = yao[field as keyof typeof yao];
        if (typeof val === "string") c[field] = convert(val);
      }
      // Convert school interpretations within yao
      for (const school of ["shaoYong", "fuPeirong"] as const) {
        const sd = yao[school];
        if (sd && typeof sd === "object") {
          const sc = { ...sd } as Record<string, unknown>;
          for (const [k, v] of Object.entries(sc)) {
            if (typeof v === "string") sc[k] = convert(v);
          }
          c[school] = sc;
        }
      }
      return c as unknown as typeof yao;
    });
  }

  // School interpretations
  for (const school of ["shaoYong", "fuPeirong", "traditional", "zhangMingren"] as const) {
    const sd = hex[school];
    if (sd && typeof sd === "object") {
      const sc = { ...sd } as Record<string, unknown>;
      for (const [k, v] of Object.entries(sc)) {
        if (typeof v === "string") sc[k] = convert(v);
      }
      result[school] = sc;
    }
  }

  // Modern interpretation
  if (hex.interpretation && typeof hex.interpretation === "object") {
    const mi = { ...hex.interpretation } as Record<string, unknown>;
    for (const [k, v] of Object.entries(mi)) {
      if (typeof v === "string") mi[k] = convert(v);
    }
    result.interpretation = mi;
  }

  return result as unknown as Hexagram;
}
