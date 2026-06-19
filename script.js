/* ============================================================
   易经六十四卦交互可视化 — 核心控制系统
   宋韵美学·数字博物版 v2.0
   新增: i18n多语言 / 诸家解卦Tab / 变卦网络 / 爻变导航
   ============================================================ */

// ---- I18n Module ----
const I18n = {
  current: 'zh-CN',
  packs: {},
  fallbackKeys: {},

  init() {
    // LANG is declared var (globally) by data/lang/zh-CN.js
    const defaultPack = (typeof LANG !== 'undefined' ? LANG : null) || {};
    this.packs['zh-CN'] = defaultPack;
    this.fallbackKeys = defaultPack;
    const saved = (() => { try { return localStorage.getItem('i18n_lang'); } catch(e) { return null; } })();
    const lang = saved || 'zh-CN';
    this.apply(lang);
    // Pre-check if content pack is available (for saved language)
    if (lang !== 'zh-CN') this.loadContentPack(lang);
  },

  t(key) {
    const pack = this.packs[this.current];
    return (pack && pack[key]) || this.fallbackKeys[key] || `[${key}]`;
  },

  // Content translation lookup: I18n.content(hexagram, 'guaciExplain')
  // For zh-CN: returns source data directly
  // For en/ja: looks up CONTENT_EN/CONTENT_JA translation table
  // For zh-TW: returns source data auto-converted via toTraditional()
  content(hexagram, path) {
    if (this.current === 'zh-CN') {
      return resolvePath(hexagram, path);
    }
    // zh-TW: use source data + character conversion
    if (this.current === 'zh-TW') {
      const val = resolvePath(hexagram, path);
      if (typeof val === 'string' && window.toTraditional) {
        return window.toTraditional(val);
      }
      return val;
    }
    // en/ja: look up translation table
    const varName = 'CONTENT_' + this.current.toUpperCase();
    const tx = window[varName];
    const decimal = hexagram ? parseInt(hexagram.binary, 2) : -1;
    if (tx && tx[decimal] !== undefined) {
      const val = resolvePath(tx[decimal], path);
      if (val != null && val !== '') return val;
    }
    // Fallback to Chinese source data
    return resolvePath(hexagram, path);
  },

  apply(lang) {
    this.current = lang || this.current;
    try { localStorage.setItem('i18n_lang', this.current); } catch(e) {}
    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });
    // Update placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-ph'));
    });
    // Update lang attribute
    document.documentElement.lang = this.current === 'zh-TW' ? 'zh-Hant' :
      this.current === 'ja' ? 'ja' : this.current === 'en' ? 'en' : 'zh-Hans';
    // Update active lang button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === this.current);
    });
  },

  async loadLang(lang) {
    if (this.packs[lang]) { this.apply(lang); this.loadContentPack(lang); return; }
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'data/lang/' + lang + '.js';
      s.onload = () => {
        this.packs[lang] = (typeof LANG !== 'undefined' ? LANG : null) || this.fallbackKeys;
        this.apply(lang);
        this.loadContentPack(lang).then(() => resolve());
      };
      s.onerror = () => {
        console.warn('Failed to load language pack: ' + lang);
        this.apply(lang);
        resolve();
      };
      document.head.appendChild(s);
    });
  },

  // Load content translation file dynamically
  async loadContentPack(lang) {
    if (lang === 'zh-CN') return; // zh-CN uses source data directly
    const varName = lang === 'zh-TW' ? 'CONTENT_ZH_TW'
      : 'CONTENT_' + lang.toUpperCase();
    if (window[varName]) return; // Already loaded
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'data/content-' + lang + '.js';
      s.onload = () => { resolve(); };
      s.onerror = () => { resolve(); }; // Silent fail — use fallback
      document.head.appendChild(s);
    });
  }
};

// Helper: resolve 'traditional.shiye' or 'yaoci.0.explain' path on an object
function resolvePath(obj, path) {
  if (!obj || !path) return obj;
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

// Helper: convert number 1-64 to Chinese numeral
function numToChinese(n) {
  const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const tens = ['', '十', '二十', '三十', '四十', '五十', '六十'];
  if (n < 1 || n > 64) return String(n);
  if (n <= 10) return digits[n];
  if (n < 20) return '十' + (n % 10 === 0 ? '' : digits[n % 10]);
  const t = Math.floor(n / 10);
  const u = n % 10;
  return tens[t] + (u === 0 ? '' : digits[u]);
}

// ---- Constants ----
const TRIGRAM_MAP = {
  '111': { name: '乾', symbol: '☰', element: '金', direction: '西北' },
  '011': { name: '兑', symbol: '☱', element: '金', direction: '西' },
  '101': { name: '离', symbol: '☲', element: '火', direction: '南' },
  '001': { name: '震', symbol: '☳', element: '木', direction: '东' },
  '110': { name: '巽', symbol: '☴', element: '木', direction: '东南' },
  '010': { name: '坎', symbol: '☵', element: '水', direction: '北' },
  '100': { name: '艮', symbol: '☶', element: '土', direction: '东北' },
  '000': { name: '坤', symbol: '☷', element: '土', direction: '西南' }
};

const MATRIX_ORDER = ['111','011','101','001','110','010','100','000'];

// Palace name translations for non-CJK languages
const PALACE_EN = {
  '乾宫': 'Qian House',
  '兑宫': 'Dui House',
  '离宫': 'Li House',
  '震宫': 'Zhen House',
  '巽宫': 'Xun House',
  '坎宫': 'Kan House',
  '艮宫': 'Gen House',
  '坤宫': 'Kun House',
};

// ---- State ----
let currentBinary = '111111';
let baseBinary = '111111';

// ---- King Wen Index (1-64) → binary decimal lookup ----
let _kwToDecimal = null;
function kwLookup(kw) {
  if (!_kwToDecimal) {
    _kwToDecimal = {};
    for (let i = 0; i < 64; i++) {
      if (HEXAGRAMS_DATA[i]) _kwToDecimal[HEXAGRAMS_DATA[i].kingWen] = i;
    }
  }
  return _kwToDecimal[kw];
}

// ---- DOM Cache ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let DOM = {};

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
  if (typeof HEXAGRAMS_DATA === 'undefined') {
    document.body.innerHTML = '<div style="text-align:center;padding:60px;font-size:18px;">⚠️ 数据加载失败，请确保 data/hexagrams-data.js 存在。</div>';
    return;
  }

  I18n.init();
  cacheDOM();
  buildMatrix();
  initTabs();
  initPrologue();
  synchronizeSystem('111111', true);
  bindEvents();
});

function cacheDOM() {
  DOM.slider = $('#guaSlider');
  DOM.sliderVal = $('#sliderVal');
  DOM.searchInput = $('#guaSearchInput');
  DOM.searchDropdown = $('#searchDropdown');
  DOM.guaName = $('#mainGuaName');
  DOM.guaSymbol = $('#mainGuaSymbols');
  DOM.kwBadge = $('#kwBadge');
  DOM.yaoLinesBox = $('#hexagramLinesBox');
  DOM.attrUpper = $('#attrUpper');
  DOM.attrLower = $('#attrLower');
  DOM.attrElement = $('#attrElement');
  DOM.attrDirection = $('#attrDirection');
  DOM.textGuaci = $('#textGuaci');
  DOM.textGuaciExplain = $('#textGuaciExplain');
  DOM.textTuan = $('#textTuan');
  DOM.textTuanExplain = $('#textTuanExplain');
  DOM.textXiang = $('#textXiang');
  DOM.textXiangExplain = $('#textXiangExplain');
  DOM.yaociAccordion = $('#yaociAccordion');
  DOM.interCareer = $('#interCareer');
  DOM.interWealth = $('#interWealth');
  DOM.interLove = $('#interLove');
  DOM.interHealth = $('#interHealth');
  DOM.interInterpersonal = $('#interInterpersonal');
  DOM.mnemonicContent = $('#mnemonicContent');
  DOM.nodeBen = $('#nodeBen');
  DOM.nodeBian = $('#nodeBiangua');
  DOM.nodeHu = $('#nodeHu');
  DOM.nodeCuo = $('#nodeCuo');
  DOM.nodeZong = $('#nodeZong');
  DOM.matrixGrid = $('#matrixGrid');
  // New elements
  DOM.yaoNetworkGrid = $('#yaoNetworkGrid');
  DOM.tabShaoyong = $('#tabShaoyong');
  DOM.tabFupeirong = $('#tabFupeirong');
  DOM.tabTraditional = $('#tabTraditional');
  DOM.tabZhangmingren = $('#tabZhangmingren');
}

// ---- Core: Synchronize System ----
function synchronizeSystem(binaryStr, updateSlider = true) {
  currentBinary = binaryStr;
  const decimal = parseInt(binaryStr, 2);
  const hexagram = HEXAGRAMS_DATA[decimal];

  if (!hexagram) return;

  // 1. Update title & symbol
  DOM.guaName.textContent = I18n.content(hexagram, 'name') || hexagram.name;
  DOM.guaSymbol.textContent = hexagram.symbol;
  // kwBadge: Chinese numerals for CJK, Arabic for English
  // Palace name translated for English; zh-TW routed through toTraditional if available
  const kwNum = (I18n.current === 'en') ? hexagram.kingWen : numToChinese(hexagram.kingWen);
  let palaceName = hexagram.palace;
  if (I18n.current === 'en') {
    palaceName = PALACE_EN[hexagram.palace] || hexagram.palace;
  } else if (I18n.current === 'zh-TW' && window.toTraditional) {
    palaceName = window.toTraditional(hexagram.palace);
  }
  DOM.kwBadge.textContent = (I18n.current === 'en')
    ? `Hexagram ${kwNum} · ${palaceName}`
    : `第${kwNum}卦 · ${palaceName}`;

  // 2. Render yao lines
  renderYaoLines(binaryStr);

  // 3. Update slider (display King Wen number 1–64, Chinese numerals for CJK)
  if (updateSlider) {
    DOM.slider.value = hexagram.kingWen;
    DOM.sliderVal.textContent = (I18n.current === 'en')
      ? hexagram.kingWen
      : numToChinese(hexagram.kingWen);
  }

  // 4. Update meta attributes
  DOM.attrUpper.textContent = hexagram.upper + ' ' + hexagram.upperSymbol;
  DOM.attrLower.textContent = hexagram.lower + ' ' + hexagram.lowerSymbol;
  DOM.attrElement.textContent = hexagram.element;
  DOM.attrDirection.textContent = hexagram.direction;

  // 5. Update text content (with content translation)
  DOM.textGuaci.textContent = hexagram.guaci || I18n.t('collecting');
  DOM.textGuaciExplain.textContent = I18n.content(hexagram, 'guaciExplain') || hexagram.guaciExplain || I18n.t('collecting');
  DOM.textTuan.textContent = hexagram.tuan || I18n.t('collecting');
  DOM.textTuanExplain.textContent = I18n.content(hexagram, 'tuanExplain') || hexagram.tuanExplain || I18n.t('collecting');
  DOM.textXiang.textContent = hexagram.xiang || I18n.t('collecting');
  DOM.textXiangExplain.textContent = I18n.content(hexagram, 'xiangExplain') || hexagram.xiangExplain || I18n.t('collecting');

  // 6. Render yao accordion (enhanced)
  renderYaoAccordion(hexagram);

  // 7. Update interpretations (enriched with traditional + zhangMingren data)
  renderModernInterpretations(hexagram);

  // 8. Update mnemonic
  const mnemonicText = hexagram.mnemonic || hexagram.poetry || hexagram.tianshiPoem || hexagram.fortuneScripture || '';
  DOM.mnemonicContent.textContent = mnemonicText || I18n.t('collecting');

  // 9. Compute & render relation graph
  renderRelationGraph(binaryStr);

  // 10. Highlight matrix
  highlightMatrixCell(binaryStr);

  // 11. Render school interpretation tabs
  renderInterpretationTabs(hexagram);

  // 12. Render yao network grid
  renderYaoNetwork(hexagram);

  // 13. Trigger entrance animations
  triggerCardAnimations();
}

// ---- Render Yao Lines ----
function renderYaoLines(binaryStr) {
  DOM.yaoLinesBox.querySelectorAll('.yao-row').forEach(el => el.remove());

  const labels = [I18n.t('panel.yao.upper'), I18n.t('panel.yao.fifth'), I18n.t('panel.yao.fourth'),
                  I18n.t('panel.yao.third'), I18n.t('panel.yao.second'), I18n.t('panel.yao.initial')];

  for (let displayIdx = 0; displayIdx < 6; displayIdx++) {
    const binaryIdx = 5 - displayIdx;
    const bit = binaryStr[binaryIdx];

    const row = document.createElement('div');
    row.className = 'yao-row';
    if (bit === '0') row.classList.add('yin');
    row.setAttribute('data-index', binaryIdx);
    row.setAttribute('data-bit', bit);

    row.innerHTML = `
      <span class="yao-label">${labels[displayIdx]}</span>
      <div class="yao-line"></div>
    `;

    row.addEventListener('click', (e) => {
      handleYaoClick(binaryIdx, row, e);
    });

    DOM.yaoLinesBox.appendChild(row);
  }
}

// ---- Handle Yao Click ----
function handleYaoClick(index, rowElement, event) {
  let codeArr = currentBinary.split('');
  codeArr[index] = codeArr[index] === '1' ? '0' : '1';
  const newCode = codeArr.join('');

  // Ink ripple effect
  const ripple = document.createElement('div');
  ripple.className = 'yao-ripple';
  ripple.style.left = (event.offsetX || 50) + 'px';
  ripple.style.top = (event.offsetY || 10) + 'px';
  rowElement.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);

  // Scale pulse
  rowElement.style.transform = 'scaleX(0.94)';
  setTimeout(() => { rowElement.style.transform = 'scaleX(1)'; }, 160);

  synchronizeSystem(newCode, true);
}

// ---- Render Yao Accordion (Enhanced with school interpretations + biangua) ----
function renderYaoAccordion(hexagram) {
  DOM.yaociAccordion.innerHTML = '';

  hexagram.yaoci.forEach((yao, index) => {
    const item = document.createElement('div');
    item.className = `yao-acc-item ${index === 0 ? 'open' : ''}`;

    const explainText = I18n.content(hexagram, 'yaoci.' + index + '.explain') || yao.explain || yao.explainShort || I18n.t('collecting');

    // Build school interpretation snippets
    let schoolHTML = '';
    if (yao.shaoYong && yao.shaoYong.text) {
      const sa = yao.shaoYong.assessment || '';
      const saClass = sa.includes('吉') ? 'ji' : sa.includes('凶') ? 'xiong' : 'ping';
      schoolHTML += `<div class="school-entry">
        <span class="school-label">${I18n.t('yao.shaoYong')}</span>
        ${sa ? `<span class="school-assessment ${saClass}">${sa}</span>` : ''}
        <p class="school-yao-text">${yao.shaoYong.text}</p>
      </div>`;
    }
    if (yao.fuPeirong && Object.keys(yao.fuPeirong).length > 0) {
      const fp = yao.fuPeirong;
      const fpItems = [];
      if (fp.shiyun) fpItems.push(`<span class="fp-mini"><b>${I18n.t('school.shiyun')}:</b> ${fp.shiyun}</span>`);
      if (fp.caiyun) fpItems.push(`<span class="fp-mini"><b>${I18n.t('school.caiyun')}:</b> ${fp.caiyun}</span>`);
      if (fp.jiazhai) fpItems.push(`<span class="fp-mini"><b>${I18n.t('school.jiazhai')}:</b> ${fp.jiazhai}</span>`);
      if (fp.shenti) fpItems.push(`<span class="fp-mini"><b>${I18n.t('school.shenti')}:</b> ${fp.shenti}</span>`);
      if (fpItems.length) {
        schoolHTML += `<div class="school-entry"><span class="school-label">${I18n.t('yao.fuPeirong')}</span>
          <div class="fp-mini-grid">${fpItems.join('')}</div></div>`;
      }
    }

    // Biangua badge
    let bgHTML = '';
    if (yao.biangua) {
      bgHTML = `<span class="yao-biangua-badge" data-bg-name="${yao.biangua}" data-bg-binary="${yao.bianguaBinary || ''}" data-bg-kw="${yao.bianguaKingWen || 0}">
        ${I18n.t('yao.biangua')} ${yao.biangua}
      </span>`;
    }

    item.innerHTML = `
      <button class="yao-acc-trigger">
        <span class="trigger-left">
          <span class="yao-name">${yao.name}</span>
          <span class="yao-text-preview">${yao.text || ''}</span>
        </span>
        ${bgHTML}
        <span class="trigger-arrow">▼</span>
      </button>
      <div class="yao-acc-content">
        <div class="yao-acc-inner">
          <div class="yao-explain-text">${explainText}</div>
          ${schoolHTML}
        </div>
      </div>
    `;

    // Bind trigger click
    item.querySelector('.yao-acc-trigger').addEventListener('click', (e) => {
      // Don't toggle if clicking biangua badge
      if (e.target.closest('.yao-biangua-badge')) return;
      item.classList.toggle('open');
    });

    // Bind biangua badge click
    const bgBadge = item.querySelector('.yao-biangua-badge');
    if (bgBadge) {
      bgBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        const bgBinary = bgBadge.getAttribute('data-bg-binary');
        let targetBinary = bgBinary;
        // Fallback: search by name
        if (!targetBinary) {
          const bgName = bgBadge.getAttribute('data-bg-name');
          for (let i = 0; i < 64; i++) {
            if (HEXAGRAMS_DATA[i] && HEXAGRAMS_DATA[i].name === bgName) {
              targetBinary = HEXAGRAMS_DATA[i].binary;
              break;
            }
          }
        }
        if (targetBinary) {
          baseBinary = targetBinary;
          synchronizeSystem(targetBinary, true);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      });
    }

    DOM.yaociAccordion.appendChild(item);
  });
}

// ---- Render Modern Interpretations (with content translation) ----
function renderModernInterpretations(hexagram) {
  // Career
  DOM.interCareer.textContent = I18n.content(hexagram, 'modern.career') ||
    hexagram.traditional?.shiye ||
    (hexagram.interpretation && hexagram.interpretation.career) ||
    I18n.t('noData');

  // Wealth
  let wealthText = I18n.content(hexagram, 'modern.wealth') || hexagram.traditional?.jingshang || '';
  if (!I18n.content(hexagram, 'modern.wealth') && hexagram.zhangMingren?.maimai) {
    wealthText = wealthText ? wealthText + ' ' + hexagram.zhangMingren.maimai : hexagram.zhangMingren.maimai;
  }
  DOM.interWealth.textContent = wealthText ||
    (hexagram.interpretation && hexagram.interpretation.wealth) ||
    I18n.t('noData');

  // Love
  DOM.interLove.textContent = I18n.content(hexagram, 'modern.love') ||
    hexagram.traditional?.hunlian ||
    (hexagram.interpretation && hexagram.interpretation.love) ||
    I18n.t('noData');

  // Health
  let healthText = I18n.content(hexagram, 'modern.health') || hexagram.zhangMingren?.jibing || '';
  if (!I18n.content(hexagram, 'modern.health') && hexagram.fuPeirong?.shenti && hexagram.fuPeirong.shenti !== healthText) {
    healthText = healthText ? healthText + ' ' + hexagram.fuPeirong.shenti : hexagram.fuPeirong.shenti;
  }
  DOM.interHealth.textContent = healthText ||
    (hexagram.interpretation && hexagram.interpretation.health) ||
    I18n.t('noData');

  // Interpersonal
  let interpText = I18n.content(hexagram, 'modern.interpersonal') || hexagram.traditional?.juece || '';
  if (!I18n.content(hexagram, 'modern.interpersonal') && hexagram.zhangMingren?.yunshi && hexagram.zhangMingren.yunshi !== interpText) {
    interpText = interpText ? interpText + ' ' + hexagram.zhangMingren.yunshi : hexagram.zhangMingren.yunshi;
  }
  DOM.interInterpersonal.textContent = interpText ||
    (hexagram.interpretation && hexagram.interpretation.interpersonal) ||
    I18n.t('noData');
}

// ---- Render School Interpretation Tabs ----
function renderInterpretationTabs(hexagram) {
  // Shao Yong tab
  if (hexagram.shaoYong) {
    const sa = hexagram.shaoYong.assessment || '';
    const saClass = sa.includes('吉') ? 'ji' : sa.includes('凶') ? 'xiong' : 'ping';
    DOM.tabShaoyong.innerHTML = `
      <div class="school-card">
        ${sa ? `<span class="school-assessment ${saClass}">${sa}</span>` : ''}
        <div class="school-text">${hexagram.shaoYong.text || ''}</div>
      </div>`;
  } else {
    DOM.tabShaoyong.innerHTML = `<p class="no-data-msg">${I18n.t('collecting')}</p>`;
  }

  // Fu Peirong tab
  if (hexagram.fuPeirong) {
    const fp = hexagram.fuPeirong;
    const items = [];
    if (fp.shiyun) items.push(`<div class="fp-item"><span class="fp-label">${I18n.t('school.shiyun')}</span><span class="fp-value">${fp.shiyun}</span></div>`);
    if (fp.caiyun) items.push(`<div class="fp-item"><span class="fp-label">${I18n.t('school.caiyun')}</span><span class="fp-value">${fp.caiyun}</span></div>`);
    if (fp.jiazhai) items.push(`<div class="fp-item"><span class="fp-label">${I18n.t('school.jiazhai')}</span><span class="fp-value">${fp.jiazhai}</span></div>`);
    if (fp.shenti) items.push(`<div class="fp-item"><span class="fp-label">${I18n.t('school.shenti')}</span><span class="fp-value">${fp.shenti}</span></div>`);
    DOM.tabFupeirong.innerHTML = `<div class="fp-grid">${items.join('')}</div>`;
  } else {
    DOM.tabFupeirong.innerHTML = `<p class="no-data-msg">${I18n.t('collecting')}</p>`;
  }

  // Traditional tab
  if (hexagram.traditional) {
    const tr = hexagram.traditional;
    const items = [];
    const trLabels = ['daxiang','yunshi','shiye','jingshang','qiuming','hunlian','juece'];
    const trI18n = ['school.daxiang','school.yunshi','school.shiye','school.jingshang','school.qiuming','school.hunlian','school.juece'];
    trLabels.forEach((k, i) => {
      if (tr[k]) items.push(`<div class="trad-item"><span class="trad-label">${I18n.t(trI18n[i])}</span><span class="trad-value">${tr[k]}</span></div>`);
    });
    DOM.tabTraditional.innerHTML = `<div class="trad-list">${items.join('')}</div>`;
  } else {
    DOM.tabTraditional.innerHTML = `<p class="no-data-msg">${I18n.t('collecting')}</p>`;
  }

  // Zhang Mingren tab (full compass: 18 categories)
  if (hexagram.zhangMingren) {
    const zm = hexagram.zhangMingren;
    const items = [];
    const zmKeys = [
      'explanation','characteristics','yunshi','jiayun','jibing','taiyun','zinv',
      'zhouzhuan','maimai','dengren','xunren','shiwu','waichu','kaoshi','susong','qiushi','gaihang','kaiye'
    ];
    zmKeys.forEach(k => {
      if (zm[k]) items.push(`<div class="zhang-item"><span class="zhang-label">${I18n.t('school.' + k)}</span><span class="zhang-value">${zm[k]}</span></div>`);
    });
    DOM.tabZhangmingren.innerHTML = `<div class="zhang-grid">${items.join('')}</div>`;
  } else {
    DOM.tabZhangmingren.innerHTML = `<p class="no-data-msg">${I18n.t('collecting')}</p>`;
  }
}

// ---- Render Yao Network Grid (6 moving lines → target hexagrams) ----
function renderYaoNetwork(hexagram) {
  DOM.yaoNetworkGrid.innerHTML = '';

  hexagram.yaoci.forEach((yao, index) => {
    const item = document.createElement('div');
    item.className = 'yao-net-item';
    // Highlight if this yao has been changed
    const yaoBit = currentBinary[index];
    const baseBit = baseBinary[index];
    if (yaoBit !== baseBit) item.classList.add('active');

    const targetName = yao.biangua || '---';
    item.innerHTML = `
      <span class="yao-net-label">${yao.name} ${I18n.t('yaoNet.each')}</span>
      <span class="yao-net-target">${targetName}</span>
    `;

    if (yao.bianguaBinary) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        baseBinary = yao.bianguaBinary;
        synchronizeSystem(yao.bianguaBinary, true);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      });
    } else if (yao.biangua) {
      // Try to find by name
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        for (let i = 0; i < 64; i++) {
          if (HEXAGRAMS_DATA[i] && HEXAGRAMS_DATA[i].name === yao.biangua) {
            baseBinary = HEXAGRAMS_DATA[i].binary;
            synchronizeSystem(HEXAGRAMS_DATA[i].binary, true);
            window.scrollTo({ top: 120, behavior: 'smooth' });
            return;
          }
        }
      });
    }

    DOM.yaoNetworkGrid.appendChild(item);
  });
}

// ---- Relation Graph Computation ----
function renderRelationGraph(benCode) {
  const benData = findHexagram(benCode);

  DOM.nodeBen.querySelector('.r-name').textContent = benData ? benData.name : '---';

  if (benCode === baseBinary) {
    DOM.nodeBian.classList.remove('active');
    DOM.nodeBian.querySelector('.r-name').textContent = I18n.t('relation.noBian');
  } else {
    DOM.nodeBian.classList.add('active');
    const bianData = findHexagram(baseBinary);
    DOM.nodeBian.querySelector('.r-name').textContent = bianData ? bianData.name : '---';
  }

  let cuoCode = '';
  for (let i = 0; i < 6; i++) {
    cuoCode += benCode[i] === '1' ? '0' : '1';
  }
  const cuoData = findHexagram(cuoCode);
  DOM.nodeCuo.querySelector('span').textContent = cuoData ? cuoData.name : '---';

  const zongCode = benCode.split('').reverse().join('');
  const zongData = findHexagram(zongCode);
  DOM.nodeZong.querySelector('span').textContent = zongData ? zongData.name : '---';

  const huLower = benCode.substring(1, 4);
  const huUpper = benCode.substring(2, 5);
  const huCode = huLower + huUpper;
  const huData = findHexagram(huCode);
  DOM.nodeHu.querySelector('span').textContent = huData ? huData.name : '---';

  bindRelationClicks(benCode, cuoCode, zongCode, huCode);
}

function bindRelationClicks(benCode, cuoCode, zongCode, huCode) {
  DOM.nodeBian.onclick = () => {
    if (currentBinary !== baseBinary) {
      synchronizeSystem(baseBinary, true);
    }
  };

  DOM.nodeCuo.onclick = () => { baseBinary = cuoCode; synchronizeSystem(cuoCode, true); };
  DOM.nodeZong.onclick = () => { baseBinary = zongCode; synchronizeSystem(zongCode, true); };
  DOM.nodeHu.onclick = () => { baseBinary = huCode; synchronizeSystem(huCode, true); };

  DOM.nodeBen.onclick = () => {
    baseBinary = benCode;
    synchronizeSystem(benCode, true);
  };
}

// ---- 8x8 Matrix ----
function buildMatrix() {
  DOM.matrixGrid.innerHTML = '';

  for (let u = 0; u < 8; u++) {
    for (let l = 0; l < 8; l++) {
      const upperBits = MATRIX_ORDER[u];
      const lowerBits = MATRIX_ORDER[l];
      const binary = lowerBits + upperBits;
      const decimal = parseInt(binary, 2);
      const data = HEXAGRAMS_DATA[decimal];

      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      cell.setAttribute('data-code', binary);
      cell.innerHTML = `
        <span class="m-sym">${data ? data.symbol : '?'}</span>
        <span class="m-name">${data ? data.shortName : '?'}</span>
      `;

      cell.addEventListener('click', () => {
        baseBinary = binary;
        synchronizeSystem(binary, true);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      });

      DOM.matrixGrid.appendChild(cell);
    }
  }
}

function highlightMatrixCell(binaryStr) {
  DOM.matrixGrid.querySelectorAll('.matrix-cell').forEach(cell => {
    cell.classList.toggle('active', cell.getAttribute('data-code') === binaryStr);
  });
}

// ---- Tab Switching (with ARIA) ----
function initTabs() {
  const tabNav = document.querySelector('#schoolTabs .tab-nav');
  if (!tabNav) return;

  tabNav.addEventListener('click', (e) => {
    const btn = e.target.closest('[role="tab"]');
    if (!btn) return;

    const tabId = btn.getAttribute('data-tab');

    // Update active button with ARIA
    tabNav.querySelectorAll('[role="tab"]').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Show corresponding tab panel
    const container = btn.closest('.tabs-container');
    container.querySelectorAll('[role="tabpanel"]').forEach(c => c.classList.remove('active'));
    const targetMap = {
      'shaoyong': 'tabShaoyong',
      'fupeirong': 'tabFupeirong',
      'traditional': 'tabTraditional',
      'zhangmingren': 'tabZhangmingren'
    };
    const targetEl = document.getElementById(targetMap[tabId]);
    if (targetEl) targetEl.classList.add('active');
  });
}

// ---- Prologue Toggle & Tabs ----
function initPrologue() {
  const btnToggle = document.getElementById('btnTogglePrologue');
  const content = document.getElementById('prologueContent');
  if (!btnToggle || !content) return;

  // Toggle expand/collapse
  btnToggle.addEventListener('click', () => {
    const isHidden = content.classList.toggle('hidden');
    btnToggle.setAttribute('aria-expanded', !isHidden);
    // Smooth scroll to prologue when opening
    if (!isHidden) {
      content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Prologue tab switching
  const tabNav = document.querySelector('.prologue-tabs');
  if (!tabNav) return;

  tabNav.addEventListener('click', (e) => {
    const btn = e.target.closest('[role="tab"]');
    if (!btn) return;

    const tabId = btn.getAttribute('data-p-tab');

    // Update active button with ARIA
    tabNav.querySelectorAll('[role="tab"]').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Show corresponding tab panel
    const panelsContainer = content;
    panelsContainer.querySelectorAll('.p-tab-panel').forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById('p-' + tabId);
    if (targetPanel) targetPanel.classList.add('active');
  });
}
// ---- Search & Events ----
function bindEvents() {
  // Slider (1–64 King Wen → binary lookup)
  DOM.slider.addEventListener('input', (e) => {
    const kw = parseInt(e.target.value);
    const dec = kwLookup(kw);
    if (dec === undefined) return;
    const hexagram = HEXAGRAMS_DATA[dec];
    if (!hexagram) return;
    baseBinary = hexagram.binary;
    synchronizeSystem(hexagram.binary, false);
    DOM.sliderVal.textContent = kw;
  });

  // Search
  DOM.searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      DOM.searchDropdown.style.display = 'none';
      return;
    }

    DOM.searchDropdown.innerHTML = '';
    let matches = 0;

    for (let i = 0; i < 64; i++) {
      const data = HEXAGRAMS_DATA[i];
      if (!data) continue;

      if (data.name.includes(query) ||
          data.pinyin.includes(query) ||
          data.shortName.includes(query) ||
          data.binary.includes(query) ||
          (data.upper + data.lower).includes(query)) {

        matches++;
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `<span class="sym">${data.symbol}</span><span class="nm">${data.name}</span>`;
        item.addEventListener('click', () => {
          baseBinary = data.binary;
          synchronizeSystem(data.binary, true);
          DOM.searchDropdown.style.display = 'none';
          DOM.searchInput.value = data.name;
        });
        DOM.searchDropdown.appendChild(item);
      }
    }

    DOM.searchDropdown.style.display = matches > 0 ? 'block' : 'none';
  });

  // Close search dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!DOM.searchInput.contains(e.target) && !DOM.searchDropdown.contains(e.target)) {
      DOM.searchDropdown.style.display = 'none';
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && !e.target.closest('input')) {
      const dec = Math.min(63, parseInt(currentBinary, 2) + 1);
      const binary = dec.toString(2).padStart(6, '0');
      baseBinary = binary;
      synchronizeSystem(binary, true);
    } else if (e.key === 'ArrowLeft' && !e.target.closest('input')) {
      const dec = Math.max(0, parseInt(currentBinary, 2) - 1);
      const binary = dec.toString(2).padStart(6, '0');
      baseBinary = binary;
      synchronizeSystem(binary, true);
    }
  });

  // Language switcher
  document.getElementById('langBar').addEventListener('click', async (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (lang === I18n.current) return;
    await I18n.loadLang(lang);
    // Content pack may have just loaded — refresh display
    synchronizeSystem(currentBinary, false);
  });
}

// ---- Trigger Card Animations ----
function triggerCardAnimations() {
  $$('.panel-right .detail-card').forEach(card => {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = '';
  });
}

// ---- Utility ----
function findHexagram(binaryStr) {
  const decimal = parseInt(binaryStr, 2);
  return HEXAGRAMS_DATA[decimal] || null;
}
