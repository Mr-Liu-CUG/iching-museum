/**
 * 易经六十四卦数据构建脚本
 * 解析三个CSV文件，生成完整的 hexagrams-data.js
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'data');

// ============================================================
// 1. 定义六十四卦核心数据
// ============================================================

// 八卦：乾兑离震巽坎艮坤 (先天序)
const TRIGRAMS = {
  '111': { name: '乾', symbol: '☰', element: '金', direction: '西北' },
  '011': { name: '兑', symbol: '☱', element: '金', direction: '西' },
  '101': { name: '离', symbol: '☲', element: '火', direction: '南' },
  '001': { name: '震', symbol: '☳', element: '木', direction: '东' },
  '110': { name: '巽', symbol: '☴', element: '木', direction: '东南' },
  '010': { name: '坎', symbol: '☵', element: '水', direction: '北' },
  '100': { name: '艮', symbol: '☶', element: '土', direction: '东北' },
  '000': { name: '坤', symbol: '☷', element: '土', direction: '西南' }
};

// 六十四卦基础数据（按二进制序排列，与先天64卦序一致）
const HEXAGRAM_BASE = [
  { name: '坤为地', shortName: '坤', upper: '坤', lower: '坤', kingWen: 2, palace: '坤宫', pinyin: 'kun wei di' },
  { name: '山地剥', shortName: '剥', upper: '艮', lower: '坤', kingWen: 23, palace: '乾宫', pinyin: 'shan di bo' },
  { name: '水地比', shortName: '比', upper: '坎', lower: '坤', kingWen: 8, palace: '坤宫', pinyin: 'shui di bi' },
  { name: '风地观', shortName: '观', upper: '巽', lower: '坤', kingWen: 20, palace: '乾宫', pinyin: 'feng di guan' },
  { name: '雷地豫', shortName: '豫', upper: '震', lower: '坤', kingWen: 16, palace: '震宫', pinyin: 'lei di yu' },
  { name: '火地晋', shortName: '晋', upper: '离', lower: '坤', kingWen: 35, palace: '乾宫', pinyin: 'huo di jin' },
  { name: '泽地萃', shortName: '萃', upper: '兑', lower: '坤', kingWen: 45, palace: '兑宫', pinyin: 'ze di cui' },
  { name: '天地否', shortName: '否', upper: '乾', lower: '坤', kingWen: 12, palace: '乾宫', pinyin: 'tian di pi' },
  { name: '地山谦', shortName: '谦', upper: '坤', lower: '艮', kingWen: 15, palace: '兑宫', pinyin: 'di shan qian' },
  { name: '艮为山', shortName: '艮', upper: '艮', lower: '艮', kingWen: 52, palace: '艮宫', pinyin: 'gen wei shan' },
  { name: '水山蹇', shortName: '蹇', upper: '坎', lower: '艮', kingWen: 39, palace: '兑宫', pinyin: 'shui shan jian' },
  { name: '风山渐', shortName: '渐', upper: '巽', lower: '艮', kingWen: 53, palace: '艮宫', pinyin: 'feng shan jian' },
  { name: '雷山小过', shortName: '小过', upper: '震', lower: '艮', kingWen: 62, palace: '兑宫', pinyin: 'lei shan xiao guo' },
  { name: '火山旅', shortName: '旅', upper: '离', lower: '艮', kingWen: 56, palace: '离宫', pinyin: 'huo shan lv' },
  { name: '泽山咸', shortName: '咸', upper: '兑', lower: '艮', kingWen: 31, palace: '兑宫', pinyin: 'ze shan xian' },
  { name: '天山遁', shortName: '遁', upper: '乾', lower: '艮', kingWen: 33, palace: '乾宫', pinyin: 'tian shan dun' },
  { name: '地水师', shortName: '师', upper: '坤', lower: '坎', kingWen: 7, palace: '坎宫', pinyin: 'di shui shi' },
  { name: '山水蒙', shortName: '蒙', upper: '艮', lower: '坎', kingWen: 4, palace: '离宫', pinyin: 'shan shui meng' },
  { name: '坎为水', shortName: '坎', upper: '坎', lower: '坎', kingWen: 29, palace: '坎宫', pinyin: 'kan wei shui' },
  { name: '风水涣', shortName: '涣', upper: '巽', lower: '坎', kingWen: 59, palace: '离宫', pinyin: 'feng shui huan' },
  { name: '雷水解', shortName: '解', upper: '震', lower: '坎', kingWen: 40, palace: '震宫', pinyin: 'lei shui jie' },
  { name: '火水未济', shortName: '未济', upper: '离', lower: '坎', kingWen: 64, palace: '离宫', pinyin: 'huo shui wei ji' },
  { name: '泽水困', shortName: '困', upper: '兑', lower: '坎', kingWen: 47, palace: '兑宫', pinyin: 'ze shui kun' },
  { name: '天水讼', shortName: '讼', upper: '乾', lower: '坎', kingWen: 6, palace: '离宫', pinyin: 'tian shui song' },
  { name: '地风升', shortName: '升', upper: '坤', lower: '巽', kingWen: 46, palace: '震宫', pinyin: 'di feng sheng' },
  { name: '山风蛊', shortName: '蛊', upper: '艮', lower: '巽', kingWen: 18, palace: '巽宫', pinyin: 'shan feng gu' },
  { name: '水风井', shortName: '井', upper: '坎', lower: '巽', kingWen: 48, palace: '震宫', pinyin: 'shui feng jing' },
  { name: '巽为风', shortName: '巽', upper: '巽', lower: '巽', kingWen: 57, palace: '巽宫', pinyin: 'xun wei feng' },
  { name: '雷风恒', shortName: '恒', upper: '震', lower: '巽', kingWen: 32, palace: '震宫', pinyin: 'lei feng heng' },
  { name: '火风鼎', shortName: '鼎', upper: '离', lower: '巽', kingWen: 50, palace: '离宫', pinyin: 'huo feng ding' },
  { name: '泽风大过', shortName: '大过', upper: '兑', lower: '巽', kingWen: 28, palace: '震宫', pinyin: 'ze feng da guo' },
  { name: '天风姤', shortName: '姤', upper: '乾', lower: '巽', kingWen: 44, palace: '乾宫', pinyin: 'tian feng gou' },
  { name: '地雷复', shortName: '复', upper: '坤', lower: '震', kingWen: 24, palace: '坤宫', pinyin: 'di lei fu' },
  { name: '山雷颐', shortName: '颐', upper: '艮', lower: '震', kingWen: 27, palace: '巽宫', pinyin: 'shan lei yi' },
  { name: '水雷屯', shortName: '屯', upper: '坎', lower: '震', kingWen: 3, palace: '坎宫', pinyin: 'shui lei zhun' },
  { name: '风雷益', shortName: '益', upper: '巽', lower: '震', kingWen: 42, palace: '巽宫', pinyin: 'feng lei yi' },
  { name: '震为雷', shortName: '震', upper: '震', lower: '震', kingWen: 51, palace: '震宫', pinyin: 'zhen wei lei' },
  { name: '火雷噬嗑', shortName: '噬嗑', upper: '离', lower: '震', kingWen: 21, palace: '巽宫', pinyin: 'huo lei shi ke' },
  { name: '泽雷随', shortName: '随', upper: '兑', lower: '震', kingWen: 17, palace: '震宫', pinyin: 'ze lei sui' },
  { name: '天雷无妄', shortName: '无妄', upper: '乾', lower: '震', kingWen: 25, palace: '巽宫', pinyin: 'tian lei wu wang' },
  { name: '地火明夷', shortName: '明夷', upper: '坤', lower: '离', kingWen: 36, palace: '坎宫', pinyin: 'di huo ming yi' },
  { name: '山火贲', shortName: '贲', upper: '艮', lower: '离', kingWen: 22, palace: '艮宫', pinyin: 'shan huo ben' },
  { name: '水火既济', shortName: '既济', upper: '坎', lower: '离', kingWen: 63, palace: '坎宫', pinyin: 'shui huo ji ji' },
  { name: '风火家人', shortName: '家人', upper: '巽', lower: '离', kingWen: 37, palace: '巽宫', pinyin: 'feng huo jia ren' },
  { name: '雷火丰', shortName: '丰', upper: '震', lower: '离', kingWen: 55, palace: '坎宫', pinyin: 'lei huo feng' },
  { name: '离为火', shortName: '离', upper: '离', lower: '离', kingWen: 30, palace: '离宫', pinyin: 'li wei huo' },
  { name: '泽火革', shortName: '革', upper: '兑', lower: '离', kingWen: 49, palace: '坎宫', pinyin: 'ze huo ge' },
  { name: '天火同人', shortName: '同人', upper: '乾', lower: '离', kingWen: 13, palace: '离宫', pinyin: 'tian huo tong ren' },
  { name: '地泽临', shortName: '临', upper: '坤', lower: '兑', kingWen: 19, palace: '坤宫', pinyin: 'di ze lin' },
  { name: '山泽损', shortName: '损', upper: '艮', lower: '兑', kingWen: 41, palace: '艮宫', pinyin: 'shan ze sun' },
  { name: '水泽节', shortName: '节', upper: '坎', lower: '兑', kingWen: 60, palace: '坎宫', pinyin: 'shui ze jie' },
  { name: '风泽中孚', shortName: '中孚', upper: '巽', lower: '兑', kingWen: 61, palace: '艮宫', pinyin: 'feng ze zhong fu' },
  { name: '雷泽归妹', shortName: '归妹', upper: '震', lower: '兑', kingWen: 54, palace: '兑宫', pinyin: 'lei ze gui mei' },
  { name: '火泽睽', shortName: '睽', upper: '离', lower: '兑', kingWen: 38, palace: '艮宫', pinyin: 'huo ze kui' },
  { name: '兑为泽', shortName: '兑', upper: '兑', lower: '兑', kingWen: 58, palace: '兑宫', pinyin: 'dui wei ze' },
  { name: '天泽履', shortName: '履', upper: '乾', lower: '兑', kingWen: 10, palace: '艮宫', pinyin: 'tian ze lv' },
  { name: '地天泰', shortName: '泰', upper: '坤', lower: '乾', kingWen: 11, palace: '坤宫', pinyin: 'di tian tai' },
  { name: '山天大畜', shortName: '大畜', upper: '艮', lower: '乾', kingWen: 26, palace: '艮宫', pinyin: 'shan tian da chu' },
  { name: '水天需', shortName: '需', upper: '坎', lower: '乾', kingWen: 5, palace: '坤宫', pinyin: 'shui tian xu' },
  { name: '风天小畜', shortName: '小畜', upper: '巽', lower: '乾', kingWen: 9, palace: '巽宫', pinyin: 'feng tian xiao chu' },
  { name: '雷天大壮', shortName: '大壮', upper: '震', lower: '乾', kingWen: 34, palace: '坤宫', pinyin: 'lei tian da zhuang' },
  { name: '火天大有', shortName: '大有', upper: '离', lower: '乾', kingWen: 14, palace: '乾宫', pinyin: 'huo tian da you' },
  { name: '泽天夬', shortName: '夬', upper: '兑', lower: '乾', kingWen: 43, palace: '坤宫', pinyin: 'ze tian guai' },
  { name: '乾为天', shortName: '乾', upper: '乾', lower: '乾', kingWen: 1, palace: '乾宫', pinyin: 'qian wei tian' }
];

// 六十四卦符号 (Unicode)
const HEXAGRAM_SYMBOLS = [
  '䷁','䷖','䷇','䷓','䷏','䷢','䷬','䷋',
  '䷎','䷳','䷦','䷴','䷽','䷷','䷞','䷠',
  '䷆','䷃','䷜','䷺','䷧','䷿','䷮','䷅',
  '䷭','䷑','䷯','䷸','䷟','䷱','䷛','䷫',
  '䷗','䷚','䷂','䷩','䷲','䷔','䷐','䷘',
  '䷣','䷕','䷾','䷤','䷶','䷝','䷰','䷌',
  '䷒','䷨','䷻','䷼','䷵','䷥','䷹','䷉',
  '䷊','䷙','䷄','䷈','䷡','䷍','䷪','䷀'
];

// 经卦名称
const GUACI_TEXTS = {
  0: '坤：元，亨，利牝馬之貞。君子有攸往，先迷後得主，利。西南得朋，東北喪朋。安貞吉。',
  1: '剝：不利有攸往。',
  2: '比：吉。原筮，元永貞，无咎。不寧方來，後夫凶。',
  3: '觀：盥而不薦，有孚顒若。',
  4: '豫：利建侯行師。',
  5: '晉：康侯用錫馬蕃庶，晝日三接。',
  6: '萃：亨。王假有廟。利見大人，亨，利貞。用大牲吉，利有攸往。',
  7: '否：否之匪人，不利君子貞。大往小來。',
  8: '謙：亨，君子有終。',
  9: '艮：艮其背，不獲其身；行其庭，不見其人。无咎。',
  10: '蹇：利西南，不利東北。利見大人，貞吉。',
  11: '漸：女歸吉。利貞。',
  12: '小過：亨，利貞。可小事，不可大事。飛鳥遺之音，不宜上，宜下。大吉。',
  13: '旅：小亨。旅貞吉。',
  14: '咸：亨，利貞。取女吉。',
  15: '遯：亨。小利貞。',
  16: '師：貞，丈人吉，无咎。',
  17: '蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三瀆，瀆則不告。利貞。',
  18: '坎：習坎，有孚，維心亨，行有尚。',
  19: '渙：亨。王假有廟。利涉大川，利貞。',
  20: '解：利西南。无所往，其來復吉。有攸往，夙吉。',
  21: '未濟：亨。小狐汔濟，濡其尾。无攸利。',
  22: '困：亨。貞，大人吉，无咎。有言不信。',
  23: '訟：有孚，窒惕，中吉，終凶。利見大人。不利涉大川。',
  24: '升：元亨。用見大人，勿恤。南征吉。',
  25: '蠱：元亨。利涉大川。先甲三日，後甲三日。',
  26: '井：改邑不改井，无喪无得。往來井井。汔至，亦未繘井，羸其瓶，凶。',
  27: '巽：小亨。利有攸往。利見大人。',
  28: '恆：亨，无咎，利貞。利有攸往。',
  29: '鼎：元吉，亨。',
  30: '大過：棟橈。利有攸往，亨。',
  31: '姤：女壯，勿用取女。',
  32: '復：亨。出入无疾，朋來无咎。反復其道，七日來復。利有攸往。',
  33: '頤：貞吉。觀頤，自求口實。',
  34: '屯：元亨，利貞。勿用有攸往。利建侯。',
  35: '益：利有攸往。利涉大川。',
  36: '震：亨。震來虩虩，笑言啞啞。震驚百里，不喪匕鬯。',
  37: '噬嗑：亨。利用獄。',
  38: '隨：元亨，利貞。无咎。',
  39: '无妄：元亨，利貞。其匪正有眚，不利有攸往。',
  40: '明夷：利艱貞。',
  41: '賁：亨。小利有攸往。',
  42: '既濟：亨小，利貞。初吉終亂。',
  43: '家人：利女貞。',
  44: '豐：亨。王假之，勿憂，宜日中。',
  45: '離：利貞，亨。畜牝牛，吉。',
  46: '革：巳日乃孚。元亨，利貞。悔亡。',
  47: '同人：同人于野，亨。利涉大川，利君子貞。',
  48: '臨：元亨，利貞。至于八月有凶。',
  49: '損：有孚，元吉，无咎，可貞。利有攸往。曷之用，二簋可用享。',
  50: '節：亨。苦節不可貞。',
  51: '中孚：豚魚吉。利涉大川，利貞。',
  52: '歸妹：征凶，无攸利。',
  53: '睽：小事吉。',
  54: '兌：亨，利貞。',
  55: '履：履虎尾，不咥人，亨。',
  56: '泰：小往大來，吉亨。',
  57: '大畜：利貞。不家食吉。利涉大川。',
  58: '需：有孚，光亨，貞吉。利涉大川。',
  59: '小畜：亨。密雲不雨，自我西郊。',
  60: '大壯：利貞。',
  61: '大有：元亨。',
  62: '夬：揚于王庭，孚號有厲。告自邑，不利即戎。利有攸往。',
  63: '乾：元，亨，利，貞。'
};

// ============================================================
// 2. 解析CSV文件
// ============================================================

function parseCSV(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (!inQuotes && (ch === ',' || ch === '\n' || (ch === '\r' && text[i+1] === '\n'))) {
      rows.push(current.trim());
      current = '';
      if (ch === '\r') i++;
      continue;
    }
    if (ch === '\r' && text[i+1] !== '\n') { rows.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  if (current.trim()) rows.push(current.trim());
  return rows;
}

function readCSV(filename) {
  const text = fs.readFileSync(path.join(BASE, filename), 'utf-8');
  return parseCSV(text);
}

// 解析爻辞解释.csv
function parseYaoCi() {
  const rows = readCSV('爻辞解释_utf8.csv');
  const result = {}; // key: hexagram index, value: { explain, yaoci: [], fortune }

  let currentIndex = -1;
  let currentHex = { explain: '', yaoci: [], fortune: '' };
  let yaoPhase = false;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    // Match hexagram header like "一、乾為天" or "六十四、火水未濟"
    const headerMatch = row.match(/^([一二三四五六七八九十]+)、(.+)/);
    if (headerMatch) {
      if (currentIndex >= 0) result[currentIndex] = currentHex;
      const numStr = headerMatch[1];
      // Skip if it's a column duplicate
      if (row.split(',').length > 2) continue;
      // Convert King Wen number → binary index
      const kw = chineseNumToInt(numStr);
      const kwToIdx = {};
      for (let k = 0; k < HEXAGRAM_BASE.length; k++) { kwToIdx[HEXAGRAM_BASE[k].kingWen] = k; }
      currentIndex = kwToIdx[kw] !== undefined ? kwToIdx[kw] : kw - 1;
      currentHex = { explain: '', yaoci: [], fortune: '' };
      yaoPhase = false;
      continue;
    }

    if (currentIndex < 0) continue;

    if (row.startsWith('釋：') || row.startsWith('释：')) {
      currentHex.explain = row.replace(/^釋：|^释：/, '').split(',')[0].trim();
    } else if (row.startsWith('五路財神經卦解：') || row.startsWith('五路财神经卦解：')) {
      currentHex.fortune = row.replace(/^五路財神經卦解：|^五路财神经卦解：/, '').split(',')[0].trim();
    } else if (row.match(/^(初[六九]|九二|六二|九三|六三|九四|六四|九五|六五|上[九六])[：:]/)) {
      const parts = row.split(',');
      const nameText = parts[0].split(/[：:]/);
      currentHex.yaoci.push({
        name: nameText[0].trim(),
        text: '', // Will be filled from 易经入门
        explain: nameText[1] ? nameText[1].trim() : (parts[2] || '').trim()
      });
    }

    if (i === rows.length - 1 && currentIndex >= 0) {
      result[currentIndex] = currentHex;
    }
  }

  return result;
}

// 解析易经入门.csv (42行 x 65列，提取关键列)
function parseYiJingRuMen() {
  const text = fs.readFileSync(path.join(BASE, '易经入门_utf8.csv'), 'utf-8');
  const rows = text.split('\n').map(r => r.trim());

  function getColumns(row) {
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (!inQuotes && ch === ',') { cols.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    cols.push(current.trim());
    return cols;
  }

  const result = {};

  // Build King Wen → binary index mapping (CSV is in King Wen order!)
  const kingWenToIdx = {};
  for (let i = 0; i < HEXAGRAM_BASE.length; i++) {
    kingWenToIdx[HEXAGRAM_BASE[i].kingWen] = i;
  }

  function setByKingWen(col, field, value) {
    const idx = kingWenToIdx[col]; // col = King Wen number (1-64)
    if (idx === undefined) return;
    if (!result[idx]) result[idx] = {};
    result[idx][field] = value;
  }

  // Parse row 1 (释) for guaci translations
  if (rows.length > 1) {
    const cols = getColumns(rows[1]);
    for (let col = 1; col <= 64 && col < cols.length; col++) {
      setByKingWen(col, 'guaciExplain', cols[col] || '');
    }
  }

  // Parse rows 2-7 for yao line explanations
  for (let rowIdx = 2; rowIdx <= 7 && rowIdx < rows.length; rowIdx++) {
    const cols = getColumns(rows[rowIdx]);
    const yaoIdx = rowIdx - 2;
    for (let col = 1; col <= 64 && col < cols.length; col++) {
      const idx = kingWenToIdx[col];
      if (idx === undefined) continue;
      if (!result[idx]) result[idx] = {};
      if (!result[idx].yaoExplains) result[idx].yaoExplains = [];
      result[idx].yaoExplains[yaoIdx] = cols[col] || '';
    }
  }

  // Parse row 9 (五路财神经)
  if (rows.length > 9) {
    const cols = getColumns(rows[9]);
    for (let col = 1; col <= 64 && col < cols.length; col++) {
      setByKingWen(col, 'fortuneScripture', cols[col] || '');
    }
  }

  // Parse row 10 (卦宫八卦)
  if (rows.length > 10) {
    const cols = getColumns(rows[10]);
    for (let col = 1; col <= 64 && col < cols.length; col++) {
      setByKingWen(col, 'palaceBagua', cols[col] || '');
    }
  }

  // Parse row 13 (天师诗)
  if (rows.length > 13) {
    const cols = getColumns(rows[13]);
    for (let col = 1; col <= 64 && col < cols.length; col++) {
      setByKingWen(col, 'tianshiPoem', cols[col] || '');
    }
  }

  // Parse row 14 (诗词详解)
  if (rows.length > 14) {
    const cols = getColumns(rows[14]);
    for (let col = 1; col <= 64 && col < cols.length; col++) {
      setByKingWen(col, 'poetry', cols[col] || '');
    }
  }

  return result;
}

// 解析记忆口诀.csv
function parseMnemonic() {
  const text = fs.readFileSync(path.join(BASE, '记忆口诀_utf8.csv'), 'utf-8');
  const lines = text.split('\n');
  const result = {};

  // Build trigram-based name lookup
  const trigramShortNames = { '乾':'乾','兑':'兑','离':'離','震':'雷','巽':'風','坎':'水','艮':'山','坤':'地' };

  // Create a lookup from "卦名" abbreviation patterns to index
  // e.g., "水雷屯" → find hexagram with upper=坎(lower=震) and name containing 屯
  function findHexagramIndex(identifier) {
    // Try exact name match first
    for (let i = 0; i < HEXAGRAM_BASE.length; i++) {
      if (identifier.includes(HEXAGRAM_BASE[i].name)) return i;
    }
    // Try matching by trigram combination patterns
    // e.g., "水雷屯卦" → extract "水雷屯"
    const trigramMatch = identifier.match(/([天地水火雷風山澤])([天地水火雷風山澤])(\S+?)卦/);
    if (trigramMatch) {
      const upperElement = trigramMatch[2]; // Note: in "水雷屯", 水=upper, 雷=lower
      const lowerElement = trigramMatch[1];
      const rest = trigramMatch[3];

      // Convert element names to trigram names
      const elementToTrigram = { '天':'乾','地':'坤','水':'坎','火':'離','雷':'震','風':'巽','山':'艮','澤':'兑' };
      const upper = elementToTrigram[upperElement];
      const lower = elementToTrigram[lowerElement];

      for (let i = 0; i < HEXAGRAM_BASE.length; i++) {
        if (HEXAGRAM_BASE[i].upper === upper && HEXAGRAM_BASE[i].lower === lower) {
          return i;
        }
      }
    }
    // Try matching by "宫" pattern (palace mention)
    const palaceMatch = identifier.match(/([乾坤震巽坎离艮兑])(宮|宫)/);
    if (palaceMatch) {
      // Palace name indicates the upper trigram
      // Count how many times this palace appears and find the right one
    }
    return -1;
  }

  // Process each line - each line represents one hexagram
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === ',' || line === ',,') continue;

    // Parse columns properly
    const cols = [];
    let current = '';
    for (let j = 0; j < line.length; j++) {
      if (line[j] === ',') {
        cols.push(current.trim());
        current = '';
      } else {
        current += line[j];
      }
    }
    cols.push(current.trim());

    // Filter out empty/whitespace-only columns
    const validCols = cols.filter(c => c.length > 1);
    if (validCols.length < 2) continue;

    // The first meaningful column has the hexagram identifier
    const identifier = validCols[0];

    // Find hexagram index
    const idx = findHexagramIndex(identifier);
    if (idx < 0) continue;

    // Collect verse content from remaining columns
    const verses = [];
    for (let c = 1; c < validCols.length; c++) {
      const v = validCols[c];
      // Skip columns that are just the identifier repeated
      if (v === identifier) continue;
      // Clean up
      const clean = v.replace(/^　+|　+$/g, '').trim();
      if (clean.length > 2) {
        verses.push(clean);
      }
    }

    if (verses.length > 0) {
      result[idx] = verses.join('\n');
    }
  }

  return result;
}

// ============================================================
// 3. 辅助函数
// ============================================================

function chineseNumToInt(str) {
  const map = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,
    '十一':11,'十二':12,'十三':13,'十四':14,'十五':15,'十六':16,'十七':17,'十八':18,'十九':19,'二十':20,
    '二十一':21,'二十二':22,'二十三':23,'二十四':24,'二十五':25,'二十六':26,'二十七':27,'二十八':28,'二十九':29,'三十':30,
    '三十一':31,'三十二':32,'三十三':33,'三十四':34,'三十五':35,'三十六':36,'三十七':37,'三十八':38,'三十九':39,'四十':40,
    '四十一':41,'四十二':42,'四十三':43,'四十四':44,'四十五':45,'四十六':46,'四十七':47,'四十八':48,'四十九':49,'五十':50,
    '五十一':51,'五十二':52,'五十三':53,'五十四':54,'五十五':55,'五十六':56,'五十七':57,'五十八':58,'五十九':59,'六十':60,
    '六十一':61,'六十二':62,'六十三':63,'六十四':64
  };
  return map[str] || 0;
}

// ============================================================
// 4. 构建完整数据
// ============================================================

function buildCompleteData() {
  console.log('Parsing 爻辞解释.csv...');
  const yaoCiData = parseYaoCi();
  console.log('Parsing 易经入门.csv...');
  const ruMenData = parseYiJingRuMen();
  console.log('Parsing 记忆口诀.csv...');
  const mnemonicData = parseMnemonic();

  const hexagrams = [];

  for (let i = 0; i < 64; i++) {
    const base = HEXAGRAM_BASE[i];
    const binary = i.toString(2).padStart(6, '0');
    const lowerBits = binary.substring(0, 3);
    const upperBits = binary.substring(3, 6);

    const lowerTrig = TRIGRAMS[lowerBits];
    const upperTrig = TRIGRAMS[upperBits];

    const yaoCi = yaoCiData[i] || { explain: '', yaoci: [], fortune: '' };
    const ruMen = ruMenData[i] || {};
    const mnemonics = mnemonicData[i] || '';

    // Build yao lines
    const yaoLines = [];
    const yaoNames = getYaoNames(binary);
    for (let y = 0; y < 6; y++) {
      const yaoExplain = (ruMen.yaoExplains && ruMen.yaoExplains[y]) || '';
      const yaoCiExplain = (yaoCi.yaoci && yaoCi.yaoci[y]) ? yaoCi.yaoci[y].explain : '';
      yaoLines.push({
        position: y,
        name: yaoNames[y],
        text: getYaoText(base.name, yaoNames[y]),
        explain: yaoCiExplain || yaoExplain,
        explainShort: yaoExplain
      });
    }

    // Build interpretation
    const interpretation = {
      career: ruMen.tianshiPoem ? ruMen.tianshiPoem.substring(0, 50) : '请参考卦辞综合判断。',
      wealth: ruMen.fortuneScripture || '请参考卦辞综合判断。',
      love: ruMen.poetry ? ruMen.poetry.substring(0, 50) : '请参考卦辞综合判断。',
      health: '请参考卦辞综合判断。',
      interpersonal: '请参考卦辞综合判断。'
    };

    const hexagram = {
      id: i,
      binary: binary,
      name: base.name,
      shortName: base.shortName,
      pinyin: base.pinyin,
      symbol: HEXAGRAM_SYMBOLS[i],
      upper: base.upper,
      lower: base.lower,
      upperBinary: upperBits,
      lowerBinary: lowerBits,
      upperSymbol: upperTrig.symbol,
      lowerSymbol: lowerTrig.symbol,
      element: upperTrig.element,
      direction: upperTrig.direction,
      kingWen: base.kingWen,
      palace: base.palace,

      // 卦辞
      guaci: GUACI_TEXTS[i] || '',
      guaciExplain: ruMen.guaciExplain || yaoCi.explain || '',

      // 彖传 (simplified - full tuan text would need additional source)
      tuan: '',
      tuanExplain: '',

      // 象传
      xiang: getXiangText(base.name),
      xiangExplain: '',

      // 爻辞
      yaoci: yaoLines,

      // 生活解读
      interpretation: interpretation,

      // 记忆口诀
      mnemonic: mnemonics,

      // 五路财神经
      fortuneScripture: ruMen.fortuneScripture || yaoCi.fortune || '',

      // 诗词
      poetry: ruMen.poetry || '',
      tianshiPoem: ruMen.tianshiPoem || '',
      palaceBagua: ruMen.palaceBagua || ''
    };

    hexagrams.push(hexagram);
  }

  return hexagrams;
}

function getYaoNames(binary) {
  const posNames = ['初', '二', '三', '四', '五', '上'];
  const names = [];
  for (let i = 0; i < 6; i++) {
    const numName = binary[i] === '1' ? '九' : '六';
    // 初爻 and 上爻: 初九/初六, 上九/上六
    // 二到五爻: 九二/六二, 九三/六三, etc.
    if (i === 0 || i === 5) {
      names.push(posNames[i] + numName);
    } else {
      names.push(numName + posNames[i]);
    }
  }
  return names;
}

function getYaoText(hexName, yaoName) {
  // Standard yao texts for key hexagrams
  const texts = {
    '乾为天': { '初九': '潛龍勿用', '九二': '見龍在田，利見大人', '九三': '君子終日乾乾，夕惕若厲，无咎', '九四': '或躍在淵，无咎', '九五': '飛龍在天，利見大人', '上九': '亢龍有悔' },
    '坤为地': { '初六': '履霜，堅冰至', '六二': '直方大，不習无不利', '六三': '含章可貞，或從王事，无成有終', '六四': '括囊，无咎无譽', '六五': '黃裳，元吉', '上六': '龍戰于野，其血玄黃' },
    '水雷屯': { '初九': '磐桓，利居貞，利建侯', '六二': '屯如邅如，乘馬班如。匪寇婚媾，女子貞不字，十年乃字', '六三': '即鹿无虞，惟入于林中，君子幾不如舍，往吝', '六四': '乘馬班如，求婚媾，往吉，无不利', '九五': '屯其膏，小貞吉，大貞凶', '上六': '乘馬班如，泣血漣如' },
    '山水蒙': { '初六': '發蒙，利用刑人，用說桎梏，以往吝', '九二': '包蒙，吉。納婦，吉。子克家', '六三': '勿用取女，見金夫，不有躬，无攸利', '六四': '困蒙，吝', '六五': '童蒙，吉', '上九': '擊蒙，不利為寇，利禦寇' },
    '水天需': { '初九': '需于郊，利用恆，无咎', '九二': '需于沙，小有言，終吉', '九三': '需于泥，致寇至', '六四': '需于血，出自穴', '九五': '需于酒食，貞吉', '上六': '入于穴，有不速之客三人來，敬之終吉' },
    '天水讼': { '初六': '不永所事，小有言，終吉', '九二': '不克訟，歸而逋，其邑人三百戶，无眚', '六三': '食舊德，貞厲，終吉。或從王事，无成', '九四': '不克訟，復即命渝，安貞吉', '九五': '訟，元吉', '上九': '或錫之鞶帶，終朝三褫之' },
    '地水师': { '初六': '師出以律，否臧凶', '九二': '在師中，吉无咎，王三錫命', '六三': '師或輿尸，凶', '六四': '師左次，无咎', '六五': '田有禽，利執言，无咎。長子帥師，弟子輿尸，貞凶', '上六': '大君有命，開國承家，小人勿用' },
    '水地比': { '初六': '有孚比之，无咎。有孚盈缶，終來有它，吉', '六二': '比之自內，貞吉', '六三': '比之匪人', '六四': '外比之，貞吉', '九五': '顯比，王用三驅，失前禽。邑人不誡，吉', '上六': '比之无首，凶' },
    '风天小畜': { '初九': '復自道，何其咎，吉', '九二': '牽復，吉', '九三': '輿說輻，夫妻反目', '六四': '有孚，血去惕出，无咎', '九五': '有孚攣如，富以其鄰', '上九': '既雨既處，尚德載，婦貞厲。月幾望，君子征凶' },
    '天泽履': { '初九': '素履，往无咎', '九二': '履道坦坦，幽人貞吉', '六三': '眇能視，跛能履，履虎尾，咥人凶。武人為于大君', '九四': '履虎尾，愬愬終吉', '九五': '夬履，貞厲', '上九': '視履考祥，其旋元吉' },
    '地天泰': { '初九': '拔茅茹，以其彙，征吉', '九二': '包荒，用馮河，不遐遺，朋亡，得尚于中行', '九三': '无平不陂，无往不復，艱貞无咎。勿恤其孚，于食有福', '六四': '翩翩，不富以其鄰，不戒以孚', '六五': '帝乙歸妹，以祉元吉', '上六': '城復于隍，勿用師，自邑告命，貞吝' },
    '天地否': { '初六': '拔茅茹，以其彙，貞吉亨', '六二': '包承，小人吉，大人否亨', '六三': '包羞', '九四': '有命无咎，疇離祉', '九五': '休否，大人吉。其亡其亡，繫于苞桑', '上九': '傾否，先否後喜' },
    '天火同人': { '初九': '同人于門，无咎', '六二': '同人于宗，吝', '九三': '伏戎于莽，升其高陵，三歲不興', '九四': '乘其墉，弗克攻，吉', '九五': '同人，先號咷而後笑，大師克相遇', '上九': '同人于郊，无悔' },
    '火天大有': { '初九': '无交害，匪咎，艱則无咎', '九二': '大車以載，有攸往，无咎', '九三': '公用亨于天子，小人弗克', '九四': '匪其彭，无咎', '六五': '厥孚交如，威如，吉', '上九': '自天祐之，吉无不利' }
  };

  if (texts[hexName] && texts[hexName][yaoName]) {
    return texts[hexName][yaoName];
  }
  return '';
}

function getXiangText(hexName) {
  const texts = {
    '乾为天': '天行健，君子以自強不息。',
    '坤为地': '地勢坤，君子以厚德載物。',
    '水雷屯': '雲雷屯，君子以經綸。',
    '山水蒙': '山下出泉，蒙。君子以果行育德。',
    '水天需': '雲上於天，需。君子以飲食宴樂。',
    '天水讼': '天與水違行，訟。君子以作事謀始。',
    '地水师': '地中有水，師。君子以容民畜眾。',
    '水地比': '地上有水，比。先王以建萬國，親諸侯。',
    '风天小畜': '風行天上，小畜。君子以懿文德。',
    '天泽履': '上天下澤，履。君子以辨上下，定民志。',
    '地天泰': '天地交，泰。后以財成天地之道，輔相天地之宜，以左右民。',
    '天地否': '天地不交，否。君子以儉德辟難，不可榮以祿。',
    '天火同人': '天與火，同人。君子以類族辨物。',
    '火天大有': '火在天上，大有。君子以遏惡揚善，順天休命。',
    '地山谦': '地中有山，謙。君子以裒多益寡，稱物平施。',
    '雷地豫': '雷出地奮，豫。先王以作樂崇德，殷薦之上帝，以配祖考。',
    '泽雷随': '澤中有雷，隨。君子以嚮晦入宴息。',
    '山风蛊': '山下有風，蠱。君子以振民育德。',
    '地泽临': '澤上有地，臨。君子以教思无窮，容保民无疆。',
    '风地观': '風行地上，觀。先王以省方，觀民設教。',
    '火雷噬嗑': '雷電噬嗑。先王以明罰敕法。',
    '山火贲': '山下有火，賁。君子以明庶政，无敢折獄。',
    '山地剥': '山附於地，剝。上以厚下安宅。',
    '地雷复': '雷在地中，復。先王以至日閉關，商旅不行，后不省方。',
    '天雷无妄': '天下雷行，物與无妄。先王以茂對時育萬物。',
    '山天大畜': '天在山中，大畜。君子以多識前言往行，以畜其德。',
    '山雷颐': '山下有雷，頤。君子以慎言語，節飲食。',
    '泽风大过': '澤滅木，大過。君子以獨立不懼，遯世无悶。',
    '坎为水': '水洊至，習坎。君子以常德行，習教事。',
    '离为火': '明兩作，離。大人以繼明照于四方。',
  };
  return texts[hexName] || '';
}

// ============================================================
// 5. 生成输出文件
// ============================================================

function generate() {
  const data = buildCompleteData();

  // Statistics
  let withGuaci = 0, withMnemonic = 0, withYaoCi = 0, withPoetry = 0;
  data.forEach(h => {
    if (h.guaci) withGuaci++;
    if (h.mnemonic) withMnemonic++;
    if (h.yaoci.some(y => y.explain)) withYaoCi++;
    if (h.poetry) withPoetry++;
  });

  console.log(`\n=== Data Generation Complete ===`);
  console.log(`Total hexagrams: ${data.length}`);
  console.log(`With guaci: ${withGuaci}/64`);
  console.log(`With mnemonics: ${withMnemonic}/64`);
  console.log(`With yao explanations: ${withYaoCi}/64`);
  console.log(`With poetry: ${withPoetry}/64`);

  const output = `/**
 * 易经六十四卦完整数据
 * Auto-generated from CSV sources
 * DO NOT EDIT MANUALLY
 */
const HEXAGRAMS_DATA = ${JSON.stringify(data, null, 2)};
`;

  const outPath = path.join(__dirname, '..', 'data', 'hexagrams-data.js');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`\nWritten to: ${outPath}`);
  console.log(`File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
}

generate();
