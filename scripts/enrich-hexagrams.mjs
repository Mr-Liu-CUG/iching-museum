import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");

const hexagrams = JSON.parse(
  readFileSync(join(dataDir, "hexagrams-data.json"), "utf-8")
);

// ─── Parser for 爻辞解释_utf8.csv ───────────────────────────────
// Sequential: each hexagram ~12 lines, in King Wen order
function parseYaoCishu() {
  const raw = readFileSync(join(dataDir, "爻辞解释_utf8.csv"), "utf-8");
  const lines = raw.split("\n");

  const result = {}; // keyed by King Wen index (1-64)
  let currentKw = null;

  for (const line of lines) {
    const cols = line.split(",");
    const firstCol = (cols[0] || "").trim();

    if (!firstCol) continue;

    // Detect hexagram name: starts with Chinese numeral + 、(not 釋)
    if (/^[一二三四五六七八九十]+、/.test(firstCol) && !firstCol.startsWith("釋")) {
      currentKw = currentKw === null ? 1 : currentKw + 1;
      if (!result[currentKw]) {
        result[currentKw] = { explain: "", fortuneScripture: "" };
      }
      continue;
    }

    if (currentKw === null) continue;

    // General explanation: "釋：..."
    if (firstCol.startsWith("釋：") || firstCol.startsWith("釋:")) {
      result[currentKw].explain = firstCol.replace(/^釋[：:]/, "").trim();
      continue;
    }

    // Fortune scripture
    if (firstCol.startsWith("五路財神經")) {
      result[currentKw].fortuneScripture = firstCol.trim();
    }
  }

  return result;
}

// ─── Parser for 易经入门_utf8.csv ───────────────────────────────
// 64-column CSV: Row 0=names+shortDesc, Row 1=explain, Rows 2-7=yao lines
function parseYijingRumen() {
  const raw = readFileSync(join(dataDir, "易经入门_utf8.csv"), "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  if (lines.length < 8) return {};

  const nameRow = lines[0].split(",");
  const explainRow = lines[1].split(",");
  const yaoRows = [];
  for (let i = 2; i <= 7; i++) {
    if (lines[i]) yaoRows.push(lines[i].split(","));
  }

  // CSV has leading empty column; data starts at column 1
  const offset = nameRow[0].trim() === "" ? 1 : 0;

  const result = {};
  for (let i = 0; i < 64; i++) {
    const kwIndex = i + 1;
    const col = i + offset;
    const nameCell = (nameRow[col] || "").trim();
    const nameMatch = nameCell.match(/[一二三四五六七八九十]+、(.+?)──(.+)/);
    const shortDesc = nameMatch ? nameMatch[2].trim() : "";
    const explain = (explainRow[col] || "").trim();

    result[kwIndex] = {
      shortDesc,
      explain,
      yaoExplains: yaoRows.map((row) => (row[col] || "").trim()),
    };
  }

  return result;
}

// ─── Enrichment ──────────────────────────────────────────────────
function enrich() {
  const yaoData = parseYaoCishu();
  const rumenData = parseYijingRumen();

  console.log("Parsed 爻辞解释:", Object.keys(yaoData).length, "hexagrams");
  console.log("Parsed 易经入门:", Object.keys(rumenData).length, "hexagrams");

  let stats = { tuanExplain: 0, xiangExplain: 0, mnemonic: 0, fortuneScripture: 0 };

  for (const h of hexagrams) {
    const kw = h.kingWen;
    const yd = yaoData[kw];
    const rd = rumenData[kw];

    // 1. tuanExplain — prioritise 爻辞解释 explain
    if ((!h.tuanExplain || h.tuanExplain.trim() === "") && yd?.explain) {
      h.tuanExplain = yd.explain;
      stats.tuanExplain++;
    } else if ((!h.tuanExplain || h.tuanExplain.trim() === "") && rd?.explain) {
      h.tuanExplain = rd.explain;
      stats.tuanExplain++;
    }

    // 2. xiangExplain — fix missing ones
    if ((!h.xiangExplain || h.xiangExplain === "（数据收录中）") && rd?.explain) {
      h.xiangExplain = `《象辭》說：${rd.explain}`;
      stats.xiangExplain++;
    }

    // 3. mnemonic — force reset all and use shortDesc from 易经入门
    // (previous runs may have set wrong data due to column offset bug)
    const prevMnemonic = h.mnemonic;
    if (rd?.shortDesc) {
      h.mnemonic = rd.shortDesc;
    } else if (yd?.explain) {
      h.mnemonic = yd.explain;
    }
    if (h.mnemonic !== prevMnemonic) stats.mnemonic++;

    // 4. fortuneScripture — expand truncated entries
    if (h.fortuneScripture === "五路財神經：" && yd?.fortuneScripture) {
      h.fortuneScripture = yd.fortuneScripture;
      stats.fortuneScripture++;
    }
  }

  // Report
  const missing = { tuanExplain: [], xiangExplain: [], mnemonic: [] };
  for (const h of hexagrams) {
    if (!h.tuanExplain || h.tuanExplain.trim() === "")
      missing.tuanExplain.push(h.name);
    if (!h.xiangExplain || h.xiangExplain === "（数据收录中）")
      missing.xiangExplain.push(h.name);
    if (!h.mnemonic || h.mnemonic.trim() === "")
      missing.mnemonic.push(h.name);
  }

  console.log("\nEnrichment stats:", stats);
  console.log("tuanExplain missing:", missing.tuanExplain.length);
  console.log("xiangExplain missing:", missing.xiangExplain.length);
  console.log("mnemonic missing:", missing.mnemonic.length);

  // Show sample mnemonics
  console.log("\nSample mnemonics (KW 1-8):");
  for (let kw = 1; kw <= 8; kw++) {
    const h = hexagrams.find((x) => x.kingWen === kw);
    console.log(`  ${kw}. ${h.name}: ${(h.mnemonic || "(empty)").substring(0, 50)}`);
  }

  writeFileSync(
    join(dataDir, "hexagrams-data.json"),
    JSON.stringify(hexagrams, null, 2),
    "utf-8"
  );
  console.log("\nhexagrams-data.json updated.");
}

enrich();
