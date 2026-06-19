/* ============================================================
   merge-data.mjs — 合并 zhouyi-enriched.json 到 hexagrams-data.js
   策略: 填空（现有为空时用zhouyi填充）+ 追加新字段
   ============================================================ */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const EXISTING_PATH = join(DATA_DIR, 'hexagrams-data.js');
const ZHOUYI_PATH = join(DATA_DIR, 'zhouyi-enriched.json');
const OUTPUT_PATH = join(DATA_DIR, 'hexagrams-data.js');

// ---- Load existing data ----
function loadExisting() {
  const src = readFileSync(EXISTING_PATH, 'utf8');
  const match = src.match(/const\s+HEXAGRAMS_DATA\s*=\s*(\[[\s\S]*\]);/);
  if (!match) throw new Error('Cannot parse HEXAGRAMS_DATA');
  return new Function('return ' + match[1])();
}

// ---- Merge logic ----
function merge(hexagrams, zhouyiData) {
  let fillGuaciExplain = 0, fillXiang = 0, fillXiangExplain = 0;
  let addShaoYong = 0, addFuPeirong = 0, addTraditional = 0, addZhangMingren = 0;
  let yaoAddShaoYong = 0, yaoAddFuPeirong = 0, yaoAddBiangua = 0;

  for (let i = 0; i < hexagrams.length; i++) {
    const h = hexagrams[i];
    const binary = h.binary;
    const dec = parseInt(binary, 2);
    const z = zhouyiData[String(dec)];

    if (!z) {
      console.warn(`   ⚠ No zhouyi data for hexagram idx=${dec} (${h.name})`);
      continue;
    }

    // ---- Hexagram-level fills ----
    // guaciExplain: fill if empty or too short
    if ((!h.guaciExplain || h.guaciExplain.length < 15) && z.guaciExplain) {
      h.guaciExplain = z.guaciExplain;
      fillGuaciExplain++;
    }

    // xiang: fill if empty
    if ((!h.xiang || h.xiang.length < 3) && z.xiang) {
      h.xiang = z.xiang;
      fillXiang++;
    }

    // xiangExplain: fill if empty
    if ((!h.xiangExplain || h.xiangExplain.length < 5) && z.xiangExplain) {
      h.xiangExplain = z.xiangExplain;
      fillXiangExplain++;
    }

    // ---- Add new hexagram-level fields ----
    if (z.shaoYong && z.shaoYong.text) {
      h.shaoYong = z.shaoYong;
      addShaoYong++;
    }
    if (z.fuPeirong && Object.keys(z.fuPeirong).length > 0) {
      h.fuPeirong = z.fuPeirong;
      addFuPeirong++;
    }
    if (z.traditional && Object.keys(z.traditional).length > 0) {
      h.traditional = z.traditional;
      addTraditional++;
    }
    if (z.zhangMingren && Object.keys(z.zhangMingren).length > 0) {
      h.zhangMingren = z.zhangMingren;
      addZhangMingren++;
    }

    // ---- Yao-level merge ----
    for (let j = 0; j < 6; j++) {
      if (!h.yaoci[j] || !z.yaoci[j]) continue;
      const hy = h.yaoci[j];
      const zy = z.yaoci[j];

      // Yao explain: fill if empty
      if ((!hy.explain || hy.explain.length < 10) && zy.explain) {
        hy.explain = zy.explain;
      }

      // Yao shaoYong
      if (!hy.shaoYong && zy.shaoYong && zy.shaoYong.text) {
        hy.shaoYong = zy.shaoYong;
        yaoAddShaoYong++;
      }

      // Yao fuPeirong
      if (!hy.fuPeirong && zy.fuPeirong && Object.keys(zy.fuPeirong).length > 0) {
        hy.fuPeirong = zy.fuPeirong;
        yaoAddFuPeirong++;
      }

      // Yao biangua
      if (!hy.biangua && zy.biangua) {
        hy.biangua = zy.biangua;
        hy.bianguaKingWen = zy.bianguaKingWen || 0;
        hy.bianguaBinary = zy.bianguaBinary || '';
        yaoAddBiangua++;
      }
    }
  }

  return {
    fillGuaciExplain, fillXiang, fillXiangExplain,
    addShaoYong, addFuPeirong, addTraditional, addZhangMingren,
    yaoAddShaoYong, yaoAddFuPeirong, yaoAddBiangua
  };
}

// ---- Validate ----
function validate(hexagrams) {
  const stats = {
    total: hexagrams.length,
    hasGuaciExplain: 0, hasXiang: 0, hasXiangExplain: 0,
    hasShaoYong: 0, hasFuPeirong: 0, hasTraditional: 0, hasZhangMingren: 0,
    yaoHasExplain: 0, yaoHasShaoYong: 0, yaoHasFuPeirong: 0, yaoHasBiangua: 0,
    totalYaos: 0
  };

  for (const h of hexagrams) {
    if (h.guaciExplain && h.guaciExplain.length > 10) stats.hasGuaciExplain++;
    if (h.xiang && h.xiang.length > 3) stats.hasXiang++;
    if (h.xiangExplain && h.xiangExplain.length > 5) stats.hasXiangExplain++;
    if (h.shaoYong && h.shaoYong.text) stats.hasShaoYong++;
    if (h.fuPeirong && Object.keys(h.fuPeirong).length > 0) stats.hasFuPeirong++;
    if (h.traditional && Object.keys(h.traditional).length > 0) stats.hasTraditional++;
    if (h.zhangMingren && Object.keys(h.zhangMingren).length > 0) stats.hasZhangMingren++;

    for (const y of h.yaoci) {
      stats.totalYaos++;
      if (y.explain && y.explain.length > 10) stats.yaoHasExplain++;
      if (y.shaoYong && y.shaoYong.text) stats.yaoHasShaoYong++;
      if (y.fuPeirong && Object.keys(y.fuPeirong).length > 0) stats.yaoHasFuPeirong++;
      if (y.biangua && y.biangua.length > 0) stats.yaoHasBiangua++;
    }
  }

  return stats;
}

// ---- Main ----
function main() {
  console.log('🔍 Loading existing hexagrams-data.js...');
  const hexagrams = loadExisting();
  console.log(`   Loaded ${hexagrams.length} hexagrams`);

  console.log('🔍 Loading zhouyi-enriched.json...');
  if (!existsSync(ZHOUYI_PATH)) {
    console.error('❌ zhouyi-enriched.json not found! Run parse-zhouyi.mjs first.');
    process.exit(1);
  }
  const zhouyiData = JSON.parse(readFileSync(ZHOUYI_PATH, 'utf8'));
  console.log(`   Loaded ${Object.keys(zhouyiData).length} enriched entries`);

  console.log('\n🔄 Merging...');
  const counts = merge(hexagrams, zhouyiData);
  console.log('   Hexagram-level fills:');
  console.log(`     guaciExplain: ${counts.fillGuaciExplain}/64`);
  console.log(`     xiang: ${counts.fillXiang}/64`);
  console.log(`     xiangExplain: ${counts.fillXiangExplain}/64`);
  console.log('   New hexagram-level fields:');
  console.log(`     shaoYong: ${counts.addShaoYong}/64`);
  console.log(`     fuPeirong: ${counts.addFuPeirong}/64`);
  console.log(`     traditional: ${counts.addTraditional}/64`);
  console.log(`     zhangMingren: ${counts.addZhangMingren}/64`);
  console.log('   Yao-level additions:');
  console.log(`     shaoYong: ${counts.yaoAddShaoYong}/384`);
  console.log(`     fuPeirong: ${counts.yaoAddFuPeirong}/384`);
  console.log(`     biangua: ${counts.yaoAddBiangua}/384`);

  // ---- Generate output ----
  console.log('\n📝 Generating hexagrams-data.js...');
  const jsonStr = JSON.stringify(hexagrams, null, 2);
  const output = `/* ============================================================
 *  易经六十四卦完整数据库
 *  Generated by scripts/merge-data.mjs
 *  Sources: CSV (爻辞解释/易经入门/记忆口诀) + zhouyi-main docs
 *  Fields: 64 hexagrams × 30+ fields each
 *  Hexagram-level: id, binary, name, shortName, pinyin, symbol,
 *    upper/lower/upperBinary/lowerBinary/upperSymbol/lowerSymbol,
 *    element, direction, kingWen, palace,
 *    guaci, guaciExplain, tuan, tuanExplain, xiang, xiangExplain,
 *    shaoYong, fuPeirong, traditional, zhangMingren,
 *    interpretation, mnemonic, fortuneScripture, poetry, tianshiPoem, palaceBagua
 *  Yao-level (×6): name, text, explain, shaoYong, fuPeirong,
 *    biangua, bianguaKingWen, bianguaBinary
 * ============================================================ */

const HEXAGRAMS_DATA = ${jsonStr};
`;

  writeFileSync(OUTPUT_PATH, output, 'utf8');
  const sizeKB = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(1);
  console.log(`   Output: ${OUTPUT_PATH} (${sizeKB} KB)`);

  // ---- Validate ----
  console.log('\n🔬 Validating...');
  const stats = validate(hexagrams);
  console.log(`   Hexagrams: ${stats.total}/64`);
  console.log(`   guaciExplain: ${stats.hasGuaciExplain}/64`);
  console.log(`   xiang: ${stats.hasXiang}/64`);
  console.log(`   xiangExplain: ${stats.hasXiangExplain}/64`);
  console.log(`   shaoYong: ${stats.hasShaoYong}/64`);
  console.log(`   fuPeirong: ${stats.hasFuPeirong}/64`);
  console.log(`   traditional: ${stats.hasTraditional}/64`);
  console.log(`   zhangMingren: ${stats.hasZhangMingren}/64`);
  console.log(`   Yao explain: ${stats.yaoHasExplain}/${stats.totalYaos}`);
  console.log(`   Yao shaoYong: ${stats.yaoHasShaoYong}/${stats.totalYaos}`);
  console.log(`   Yao fuPeirong: ${stats.yaoHasFuPeirong}/${stats.totalYaos}`);
  console.log(`   Yao biangua: ${stats.yaoHasBiangua}/${stats.totalYaos}`);

  console.log('\n✅ Merge complete!');
}

main();
