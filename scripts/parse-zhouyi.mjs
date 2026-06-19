/* ============================================================
   parse-zhouyi.mjs — 解析 zhouyi-main/docs 下 64 个 markdown 文件
   策略: 按爻辞标记分割文件 → 独立解析每个区块
   输出: data/zhouyi-enriched.json (keyed by hexagram binary decimal index)
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..', 'zhouyi-main', 'docs');
const DATA_DIR = join(__dirname, '..', 'data');
const EXISTING_DATA = join(DATA_DIR, 'hexagrams-data.js');
const OUTPUT_PATH = join(DATA_DIR, 'zhouyi-enriched.json');

// ---- Load existing hexagram data for kw→binary mapping ----
function loadExistingMapping() {
  const src = readFileSync(EXISTING_DATA, 'utf8');
  const match = src.match(/const\s+HEXAGRAMS_DATA\s*=\s*(\[[\s\S]*\]);/);
  if (!match) { console.error('Cannot parse existing data'); process.exit(1); }
  const data = new Function('return ' + match[1])();
  const kwMap = {}, nameMap = {};
  data.forEach(h => {
    kwMap[h.kingWen] = { binary: h.binary, idx: parseInt(h.binary, 2), name: h.name };
    nameMap[h.name.replace(/\s+/g, '')] = { binary: h.binary, idx: parseInt(h.binary, 2) };
    // Also add shortName lookup
    nameMap[h.shortName] = { binary: h.binary, idx: parseInt(h.binary, 2) };
  });
  return { kwMap, nameMap };
}

// ---- Yao name to index ----
const YAO_IDX = { '初九':0,'初六':0, '九二':1,'六二':1, '九三':2,'六三':2,
                   '九四':3,'六四':3, '九五':4,'六五':4, '上九':5,'上六':5 };

// ---- Regex patterns ----
const RE_YAO_START = /^\*\*(初[九六]|[九六][二三四五]|上[九六])爻辭\*\*$/;
const RE_YAO_TEXT = /^\*\*(初[九六]|[九六][二三四五]|上[九六])[。，]?\*\*\s*(.+)/;

// ---- Parse hexagram-level sections ----
function parseTopSection(lines, startIdx, endIdx) {
  const text = lines.slice(startIdx, endIdx).join('\n');
  const result = { guaciExplain: '', xiang: '', xiangExplain: '', shaoYong: null, fuPeirong: null, traditional: null, zhangMingren: null };

  // Extract xiang
  for (let i = startIdx; i < Math.min(startIdx + 12, endIdx); i++) {
    const t = lines[i].trim();
    if (t.startsWith('象曰')) {
      result.xiang = t.replace(/^象曰[：:]/, '').trim();
      break;
    }
  }

  // Split by top-level section markers
  const sections = splitByMarkers(text, [
    { re: /\n\*\*白話文解釋\*\*\s*\n/, key: 'baihua' },
    { re: /\n\*\*邵雍河洛理數解卦\*\*\s*\n/, key: 'shaoyong' },
    { re: /\n\*\*傅佩榮解卦手冊\*\*\s*\n/, key: 'fupeirong' },
    { re: /\n\*\*傳統解卦\*\*\s*\n/, key: 'traditional' },
    { re: /\n\*\*传统解卦\*\*\s*\n/, key: 'traditional' },
    { re: /\n\*\*台灣張銘仁解卦\*\*\s*\n/, key: 'zhangmingren' },
    { re: /\n\*\*台湾张铭仁解卦\*\*\s*\n/, key: 'zhangmingren' },
  ]);

  if (sections.baihua) {
    const parts = sections.baihua.split(/\n(?=《象辭》|《象辞》)/);
    result.guaciExplain = parts[0].trim();
    result.xiangExplain = (parts[1] || '').trim();
  }
  if (sections.shaoyong) {
    result.shaoYong = parseAssessment(sections.shaoyong);
  }
  if (sections.fupeirong) {
    result.fuPeirong = parseKeyValue(sections.fupeirong);
  }
  if (sections.traditional) {
    result.traditional = parseKeyValue(sections.traditional);
  }
  if (sections.zhangmingren) {
    result.zhangMingren = parseKeyValue(sections.zhangmingren);
  }

  return result;
}

// ---- Parse a single yao section ----
function parseYaoSection(lines, startIdx, endIdx, nameMap) {
  const text = lines.slice(startIdx, endIdx).join('\n');
  const result = { name: '', text: '', explain: '', shaoYong: null, fuPeirong: null, biangua: '', bianguaKingWen: 0, bianguaBinary: '' };

  // Extract yao name and text from the first few lines
  for (let i = startIdx; i < Math.min(startIdx + 6, endIdx); i++) {
    const t = lines[i].trim();
    // Yao section header: **初九爻辭**
    const secMatch = t.match(RE_YAO_START);
    if (secMatch) { result.name = secMatch[1]; continue; }
    // Yao text: **初九。** 潛龍勿用。
    const textMatch = t.match(RE_YAO_TEXT);
    if (textMatch) { result.text = textMatch[2].trim(); continue; }
  }

  // Split by sub-section markers
  const sections = splitByMarkers(text, [
    { re: /\n\*\*白話文解釋\*\*\s*\n/, key: 'baihua' },
    { re: /\n\*\*邵雍河洛理數爻辭解釋\*\*\s*\n/, key: 'shaoYong' },
    { re: /\n\*\*邵雍河洛理数爻辞解释\*\*\s*\n/, key: 'shaoYong' },
    { re: /\n\*\*傅佩榮解卦手冊\*\*\s*\n/, key: 'fuPeirong' },
    { re: /\n\*\*傅佩荣解卦手册\*\*\s*\n/, key: 'fuPeirong' },
    { re: /\n\*\*(初[九六]|[九六][二三四五]|上[九六])變卦\*\*\s*\n/, key: 'biangua' },
    { re: /\n\*\*(初[九六]|[九六][二三四五]|上[九六])变卦\*\*\s*\n/, key: 'biangua' },
  ]);

  if (sections.baihua) result.explain = sections.baihua.trim();
  if (sections.shaoYong) result.shaoYong = parseAssessment(sections.shaoYong);
  if (sections.fuPeirong) result.fuPeirong = parseKeyValue(sections.fuPeirong);
  if (sections.biangua) {
    const bgInfo = parseBiangua(sections.biangua, nameMap);
    if (bgInfo) {
      result.biangua = bgInfo.name;
      result.bianguaKingWen = bgInfo.kw;
      result.bianguaBinary = bgInfo.binary;
    }
  }

  return result;
}

// ---- Utility: split text by marker strings ----
function splitByMarkers(text, markers) {
  const result = {};
  const boundaries = [];

  // Prepend newline to help find markers at start of text
  const haystack = '\n' + text;

  for (const m of markers) {
    // Search for marker pattern like "**白話文解釋**" preceded by newline
    // The regex should match "\n**MARKER**" with optional trailing whitespace
    const re = m.re;  // regex already has \n prefix
    const match = re.exec(haystack);
    if (match) {
      // Position in original text (accounting for the added \n)
      boundaries.push({ pos: match.index, len: match[0].length, key: m.key });
    }
  }

  boundaries.sort((a, b) => a.pos - b.pos);

  for (let i = 0; i < boundaries.length; i++) {
    // start after the marker line (including the leading \n we added)
    const start = boundaries[i].pos + boundaries[i].len;
    const end = i + 1 < boundaries.length ? boundaries[i + 1].pos : haystack.length;
    result[boundaries[i].key] = haystack.substring(start, end).trim();
  }

  return result;
}

// ---- Parse assessment block (邵雍格式) ----
function parseAssessment(text) {
  const m = text.match(/^\*\*(.{1,15})。?\*\*\s*(.*)/s);
  if (m) return { assessment: m[1].trim(), text: m[2].trim() };
  // Fallback: take first line as assessment
  const firstLine = text.split('\n')[0].replace(/\*\*/g, '').trim();
  return { assessment: firstLine, text };
}

// ---- Parse key-value bold blocks ----
function parseKeyValue(text) {
  const obj = {};
  const keyMap = {
    '時運':'shiyun','时运':'shiyun','財運':'caiyun','财运':'caiyun',
    '家宅':'jiazhai','身體':'shenti','身体':'shenti',
    '解釋':'explanation','解释':'explanation','特性':'characteristics',
    '運勢':'yunshi','运势':'yunshi','家運':'jiayun','家运':'jiayun',
    '疾病':'jibing','胎孕':'taiyun','子女':'zinv',
    '周轉':'zhouzhuan','周转':'zhouzhuan','買賣':'maimai','买卖':'maimai',
    '等人':'dengren','尋人':'xunren','寻人':'xunren','失物':'shiwu',
    '外出':'waichu','考試':'kaoshi','考试':'kaoshi',
    '訴訟':'susong','诉讼':'susong','求事':'qiushi','改行':'gaihang','開業':'kaiye','开业':'kaiye',
    '大象':'daxiang','事業':'shiye','事业':'shiye','經商':'jingshang','经商':'jingshang',
    '求名':'qiuming','婚戀':'hunlian','婚恋':'hunlian','決策':'juece','决策':'juece'
  };
  const lines = text.split('\n');
  for (const line of lines) {
    const m = line.match(/^\*\*(.+?)[：:]\s*\*\*\s*(.*)/);
    if (m) {
      const key = m[1].trim(), value = m[2].trim();
      obj[keyMap[key] || key.toLowerCase()] = value;
    }
  }
  return Object.keys(obj).length ? obj : null;
}

// ---- Parse biangua text ----
function parseBiangua(text, nameMap) {
  // Pattern: "初九爻動變得周易第44卦：天風姤。..."
  // Or simpler patterns
  const patterns = [
    /爻動變得周易第(\d+)\s*卦\s*[：:]\s*(.+?)(?:[。，]|這個卦|$)/,
    /周易第(\d+)\s*卦\s*[：:]\s*(.+?)(?:[。，]|$)/,
    /第(\d+)\s*卦\s*[：:]\s*(.+?)(?:[。，]|$)/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const kw = parseInt(m[1], 10);
      let name = m[2].trim().replace(/[。，\s]+$/, '');
      // Try to find binary from name
      const cleanName = name.replace(/\s+/g, '');
      const info = nameMap[cleanName];
      return { name, kw, binary: info ? info.binary : '' };
    }
  }
  // Fallback: try the first line
  const firstLine = text.split('\n')[0].replace(/\*\*/g, '').trim();
  const numMatch = firstLine.match(/(\d+)\s*卦\s*[：:]/);
  if (numMatch) {
    const kw = parseInt(numMatch[1], 10);
    const nameMatch = firstLine.match(/[：:]\s*(.+)/);
    if (nameMatch) {
      let name = nameMatch[1].trim().replace(/[。，\s]+$/, '');
      const info = nameMap[name.replace(/\s+/g, '')];
      return { name, kw, binary: info ? info.binary : '' };
    }
  }
  return null;
}

// ---- Find yao boundaries in the markdown ----
function findYaoBoundaries(lines) {
  // Find all lines matching **XX爻辭**
  const boundaries = [];
  for (let i = 0; i < lines.length; i++) {
    if (RE_YAO_START.test(lines[i].trim())) {
      boundaries.push(i);
    }
  }
  return boundaries;
}

// ---- Main parse for one hexagram ----
function parseOne(folderName, nameMap, kwMap) {
  const mdPath = join(DOCS_DIR, folderName, 'index.md');
  if (!existsSync(mdPath)) return null;

  const content = readFileSync(mdPath, 'utf8');
  const lines = content.split('\n');

  const kwMatch = folderName.match(/^(\d{2})\./);
  const kingWen = kwMatch ? parseInt(kwMatch[1], 10) : 0;
  const kwInfo = kwMap[kingWen];
  if (!kwInfo) return null;

  // Find yao boundaries
  const yaoLines = findYaoBoundaries(lines);
  if (yaoLines.length !== 6) {
    console.warn(`   ⚠ ${folderName}: expected 6 yao sections, found ${yaoLines.length}`);
  }

  // Parse top section (from start to first yao)
  const topEnd = yaoLines.length > 0 ? yaoLines[0] : lines.length;
  const topData = parseTopSection(lines, 0, topEnd);

  // Parse each yao section
  const yaoci = [];
  for (let i = 0; i < 6; i++) {
    const start = yaoLines[i] || topEnd;
    const end = (i < 5 && yaoLines[i + 1]) ? yaoLines[i + 1] : lines.length;
    yaoci.push(parseYaoSection(lines, start, end, nameMap));
  }

  return {
    _source: folderName, _kw: kingWen, _binary: kwInfo.binary,
    guaciExplain: topData.guaciExplain,
    xiang: topData.xiang,
    xiangExplain: topData.xiangExplain,
    shaoYong: topData.shaoYong,
    fuPeirong: topData.fuPeirong,
    traditional: topData.traditional,
    zhangMingren: topData.zhangMingren,
    yaoci
  };
}

// ---- Main ----
function main() {
  console.log('🔍 Loading existing mapping...');
  const { kwMap, nameMap } = loadExistingMapping();
  console.log(`   Mapped ${Object.keys(kwMap).length} hexagrams`);

  const folders = readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{2}\./.test(d.name))
    .map(d => d.name).sort();

  console.log(`🔍 Parsing ${folders.length} markdown files...\n`);

  const output = {};
  let totalBg = 0;

  for (const folder of folders) {
    const parsed = parseOne(folder, nameMap, kwMap);
    if (!parsed) continue;

    const dec = parseInt(parsed._binary, 2);
    output[dec] = parsed;

    const yaoCount = parsed.yaoci.filter(y => y && y.name).length;
    const bgCount = parsed.yaoci.filter(y => y && y.biangua).length;
    totalBg += bgCount;

    const m = [];
    if (parsed.guaciExplain) m.push('G');
    if (parsed.xiang) m.push('X');
    if (parsed.shaoYong) m.push('S');
    if (parsed.fuPeirong) m.push('F');
    if (parsed.traditional) m.push('T');
    if (parsed.zhangMingren) m.push('Z');

    console.log(`   ✅ [${String(parsed._kw).padStart(2)}] ${folder.padEnd(14)} → idx=${String(dec).padStart(2)} | yaos=${yaoCount}/6 bg=${bgCount}/6 | ${m.join('')}`);
  }

  console.log(`\n📊 ${Object.keys(output).length}/64 hexagrams | ${totalBg}/384 biangua links`);

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  console.log(`💾 ${OUTPUT_PATH}`);
  console.log('✅ Done!');
}

main();
