import type { Hexagram } from "./types";

export function validateHexagrams(data: Hexagram[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (data.length !== 64) {
    errors.push(`Expected 64 hexagrams, got ${data.length}`);
  }

  const seen = new Set<number>();
  const seenKw = new Set<number>();

  for (const h of data) {
    if (seen.has(h.id)) {
      errors.push(`Duplicate id: ${h.id}`);
    }
    seen.add(h.id);

    if (seenKw.has(h.kingWen)) {
      errors.push(`Duplicate kingWen: ${h.kingWen}`);
    }
    seenKw.add(h.kingWen);

    if (h.binary.length !== 6) {
      errors.push(`Invalid binary for ${h.name}: ${h.binary}`);
    }

    if (!h.yaoci || h.yaoci.length !== 6) {
      errors.push(`${h.name}: expected 6 yao lines, got ${h.yaoci?.length ?? 0}`);
    }

    for (const yao of h.yaoci || []) {
      if (yao.bianguaBinary) {
        const target = data.find((d) => d.binary === yao.bianguaBinary);
        if (!target) {
          errors.push(`${h.name} yao ${yao.position}: invalid biangua binary ${yao.bianguaBinary}`);
        }
      }
    }

    if (h.upperBinary.length !== 3 || h.lowerBinary.length !== 3) {
      errors.push(`${h.name}: invalid trigram binaries`);
    }

    if (!h.guaci || h.guaci.trim().length === 0) {
      errors.push(`${h.name}: missing guaci (卦辞)`);
    }
  }

  if (seen.size !== 64) {
    const missing = Array.from({ length: 64 }, (_, i) => i).filter((i) => !seen.has(i));
    errors.push(`Missing hexagram ids: ${missing}`);
  }

  if (seenKw.size !== 64) {
    const missingKw = Array.from({ length: 64 }, (_, i) => i + 1).filter(
      (i) => !seenKw.has(i)
    );
    errors.push(`Missing kingWen: ${missingKw}`);
  }

  return { valid: errors.length === 0, errors };
}

export function verifyAll(): { valid: boolean; errors: string[]; stats: Record<string, number> } {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require("@/data/hexagrams-data.json") as Hexagram[];
    const result = validateHexagrams(data);

    const stats = {
      total: data.length,
      withTuanExplain: data.filter((h) => h.tuanExplain && h.tuanExplain.trim().length > 0).length,
      withXiangExplain: data.filter((h) => h.xiangExplain && h.xiangExplain.trim().length > 0 && h.xiangExplain !== "（数据收录中）").length,
      withMnemonic: data.filter((h) => h.mnemonic && h.mnemonic.trim().length > 0).length,
      withPoetry: data.filter((h) => h.poetry && h.poetry.trim().length > 0).length,
      totalYaoLines: data.reduce((sum, h) => sum + (h.yaoci?.length ?? 0), 0),
    };

    return {
      valid: result.valid,
      errors: result.errors,
      stats,
    };
  } catch (e) {
    return {
      valid: false,
      errors: [(e as Error).message],
      stats: { total: 0, withTuanExplain: 0, withXiangExplain: 0, withMnemonic: 0, withPoetry: 0, totalYaoLines: 0 },
    };
  }
}
