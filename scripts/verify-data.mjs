import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");

const data = JSON.parse(
  readFileSync(join(dataDir, "hexagrams-data.json"), "utf-8")
);

const errors = [];

// 1. Count check
if (data.length !== 64) {
  errors.push(`Expected 64 hexagrams, got ${data.length}`);
}

// 2. Unique IDs and King Wen
const seenId = new Set();
const seenKw = new Set();
const seenBinary = new Set();

for (const h of data) {
  if (seenId.has(h.id)) errors.push(`Duplicate id: ${h.id} (${h.name})`);
  seenId.add(h.id);

  if (seenKw.has(h.kingWen)) errors.push(`Duplicate kingWen: ${h.kingWen} (${h.name})`);
  seenKw.add(h.kingWen);

  if (seenBinary.has(h.binary)) errors.push(`Duplicate binary: ${h.binary} (${h.name})`);
  seenBinary.add(h.binary);

  if (h.binary.length !== 6) errors.push(`${h.name}: invalid binary length`);
  if (h.upperBinary.length !== 3) errors.push(`${h.name}: invalid upperBinary`);
  if (h.lowerBinary.length !== 3) errors.push(`${h.name}: invalid lowerBinary`);
  if (!h.yaoci || h.yaoci.length !== 6) errors.push(`${h.name}: expected 6 yao lines`);
  if (!h.guaci || h.guaci.trim() === "") errors.push(`${h.name}: missing guaci`);
}

// 3. Biangua reference validation
for (const h of data) {
  for (const yao of h.yaoci || []) {
    if (yao.bianguaBinary) {
      const target = data.find((d) => d.binary === yao.bianguaBinary);
      if (!target) errors.push(`${h.name} yao ${yao.position}: invalid biangua ${yao.bianguaBinary}`);
    }
  }
}

// 4. Content completeness
const stats = {
  total: data.length,
  guaci: data.filter((h) => h.guaci && h.guaci.trim().length > 0).length,
  guaciExplain: data.filter((h) => h.guaciExplain && h.guaciExplain.trim().length > 0 && h.guaciExplain !== "（数据收录中）").length,
  tuanExplain: data.filter((h) => h.tuanExplain && h.tuanExplain.trim().length > 0).length,
  xiang: data.filter((h) => h.xiang && h.xiang.trim().length > 0).length,
  xiangExplain: data.filter((h) => h.xiangExplain && h.xiangExplain.trim().length > 0 && h.xiangExplain !== "（数据收录中）").length,
  mnemonic: data.filter((h) => h.mnemonic && h.mnemonic.trim().length > 0).length,
  poetry: data.filter((h) => h.poetry && h.poetry.trim().length > 0).length,
  fortuneScripture: data.filter((h) => h.fortuneScripture && h.fortuneScripture !== "五路財神經：").length,
  tianshiPoem: data.filter((h) => h.tianshiPoem && h.tianshiPoem.trim().length > 0).length,
  yaoLines: data.reduce((sum, h) => sum + (h.yaoci?.length ?? 0), 0),
  shaoYong: data.filter((h) => h.shaoYong?.assessment || h.shaoYong?.text).length,
  fuPeirong: data.filter((h) => h.fuPeirong?.shiyun).length,
  traditional: data.filter((h) => h.traditional?.daxiang).length,
  zhangMingren: data.filter((h) => h.zhangMingren?.explanation).length,
  interpretation: data.filter((h) => h.interpretation?.career).length,
};

console.log("=== I Ching Data Verification ===\n");
console.log("Hexagrams: " + stats.total);
console.log("");

console.log("Content Completeness:");
for (const [key, val] of Object.entries(stats)) {
  const pct = key === "yaoLines" ? `${val}/384` : `${val}/64`;
  console.log(`  ${key.padEnd(20)}: ${String(val).padStart(3)} / ${key === "yaoLines" ? "384" : " 64"}  (${pct})`);
}

console.log("");
if (errors.length === 0) {
  console.log("ALL CHECKS PASSED ✓");
} else {
  console.log(`${errors.length} ERRORS FOUND:`);
  for (const e of errors) console.log("  ✗ " + e);
}
