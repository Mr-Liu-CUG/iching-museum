import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
const dataPath = join(dataDir, "hexagrams-data.json");

const data = JSON.parse(readFileSync(dataPath, "utf-8"));

// Targeted 干→乾 fix: only restore when 干 represents the Qian trigram/hexagram
// Legitimate 干 usages (from 干/幹/乾-gān) MUST be preserved:
//   埋头苦干, 干扰, 干涸, 才干, 外强中干, 有何干, 什么也没有干

let fixCount = 0;

function fixField(obj, key) {
  if (typeof obj[key] !== "string") return;

  // === Structural fields: always about the trigram ===
  if (key === "name" || key === "shortName" || key === "upper" || key === "lower" || key === "palace") {
    if (obj[key] === "干") { obj[key] = "乾"; fixCount++; return; }
    obj[key] = obj[key].replace(/干为天/g, "乾为天");
    obj[key] = obj[key].replace(/^干宫$/, "乾宫");
    return;
  }

  // === palaceBagua: contains 干宫 pattern ===
  if (key === "palaceBagua") {
    const before = obj[key];
    obj[key] = obj[key].replace(/干宫/g, "乾宫");
    if (obj[key] !== before) fixCount++;
    return;
  }

  // === Text fields: only fix contextual patterns ===
  let s = obj[key];

  // These patterns are definitely about the Qian trigram
  s = s.replace(/上卦为干([，,;；])/g, "上卦为乾$1");
  s = s.replace(/上卦为干。/g, "上卦为乾。");
  s = s.replace(/上卦为干/g, "上卦为乾");
  s = s.replace(/下卦为干([，,;；])/g, "下卦为乾$1");
  s = s.replace(/下卦为干/g, "下卦为乾");
  s = s.replace(/为干，干为/g, "为乾，乾为");
  s = s.replace(/干为天/g, "乾为天");
  s = s.replace(/干天升于/g, "乾天升于");
  s = s.replace(/干刚/g, "乾刚");
  s = s.replace(/干健/g, "乾健");
  s = s.replace(/干道/g, "乾道");
  s = s.replace(/干德/g, "乾德");
  s = s.replace(/干元/g, "乾元");
  s = s.replace(/干始/g, "乾始");
  s = s.replace(/干造/g, "乾造");
  s = s.replace(/干行/g, "乾行");
  // Standalone 干 referring to the hexagram in guaci
  if (key === "guaci") s = s.replace(/^干：/g, "乾：");
  // 终日干干 → 终日乾乾
  s = s.replace(/终日干干/g, "终日乾乾");
  // 上干 → 上乾 (in compounds like 上乾下离)
  s = s.replace(/上干下/g, "上乾下");

  if (s !== obj[key]) {
    obj[key] = s;
    fixCount++;
  }
}

function walkObject(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      fixField(obj, key);
    } else if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        walkObject(item);
      }
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      walkObject(obj[key]);
    }
  }
}

for (const h of data) {
  walkObject(h);
}

console.log(`Fixed ${fixCount} fields: 干→乾 (Qian trigram restoration)`);

// Verify
const qian = data.find(h => h.binary === "111111");
console.log("乾卦 name:", qian?.name);
console.log("乾卦 guaci:", qian?.guaci?.substring(0, 20));
console.log("乾卦 upper:", qian?.upper);
console.log("乾卦 palace:", qian?.palace);

// Verify legitimate 干 preserved
let legitGan = [];
for (const h of data) {
  const str = JSON.stringify(h);
  const patterns = ["埋头苦干", "干扰", "干涸", "才干", "外强中干", "有何干", "没有什么干", "没有干"];
  for (const p of patterns) {
    if (str.includes(p)) legitGan.push(`${h.name}: ${p}`);
  }
}
console.log(`\nLegitimate 干 preserved (${legitGan.length} instances):`);
legitGan.forEach(g => console.log("  ✓", g));

writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
console.log("\nhexagrams-data.json updated.");
