export type Language = "zh-CN" | "zh-TW" | "en" | "ja";

export interface SchoolAssessment {
  assessment: string;
  text: string;
}

export interface FuPeirongEntry {
  shiyun: string;
  caiyun: string;
  jiazhai: string;
  shenti: string;
}

export interface TraditionalEntry {
  daxiang: string;
  yunshi: string;
  shiye: string;
  jingshang: string;
  qiuming: string;
  hunlian: string;
  juece: string;
}

export interface ZhangMingrenEntry {
  explanation: string;
  characteristics: string;
  yunshi: string;
  jiayun: string;
  jibing: string;
  taiyun: string;
  zinv: string;
  zhouzhuan: string;
  maimai: string;
  dengren: string;
  xunren: string;
  shiwu: string;
  waichu: string;
  kaoshi: string;
  susong: string;
  qiushi: string;
  gaihang: string;
  kaiye: string;
}

export interface ModernInterpretation {
  career: string;
  wealth: string;
  love: string;
  health: string;
  interpersonal: string;
}

export interface YaoLine {
  position: number;
  name: string;
  text: string;
  explain: string;
  explainShort: string;
  shaoYong: SchoolAssessment;
  fuPeirong: FuPeirongEntry;
  biangua: string;
  bianguaKingWen: number;
  bianguaBinary: string;
}

export interface Hexagram {
  id: number;
  binary: string;
  name: string;
  shortName: string;
  pinyin: string;
  symbol: string;
  upper: string;
  lower: string;
  upperBinary: string;
  lowerBinary: string;
  upperSymbol: string;
  lowerSymbol: string;
  element: string;
  direction: string;
  kingWen: number;
  palace: string;
  guaci: string;
  guaciExplain: string;
  tuan: string;
  tuanExplain: string;
  xiang: string;
  xiangExplain: string;
  yaoci: YaoLine[];
  shaoYong: SchoolAssessment;
  fuPeirong: FuPeirongEntry;
  traditional: TraditionalEntry;
  zhangMingren: ZhangMingrenEntry;
  interpretation: ModernInterpretation;
  mnemonic: string;
  fortuneScripture: string;
  poetry: string;
  tianshiPoem: string;
  palaceBagua: string;
}

export type HexagramsData = Hexagram[];

export interface TrigramInfo {
  name: string;
  symbol: string;
  element: string;
  direction: string;
}

export interface HexagramRelation {
  ben: { binary: string; name: string; symbol: string };
  bian: { binary: string; name: string; symbol: string } | null;
  cuo: { binary: string; name: string; symbol: string };
  zong: { binary: string; name: string; symbol: string };
  hu: { binary: string; name: string; symbol: string };
}

export interface YaoNetworkItem {
  position: number;
  yaoName: string;
  fromBinary: string;
  toBinary: string;
  targetName: string;
  targetSymbol: string;
  isChanged: boolean;
}

export type UiTranslations = Record<string, string>;

export interface ContentTranslationMap {
  [hexagramId: number]: {
    name?: string;
    shortName?: string;
    guaci?: string;
    guaciExplain?: string;
    tuan?: string;
    tuanExplain?: string;
    xiang?: string;
    xiangExplain?: string;
    mnemonic?: string;
    poetry?: string;
    yaoci?: Array<{
      name?: string;
      text?: string;
      explain?: string;
      explainShort?: string;
    }>;
    interpretation?: Partial<ModernInterpretation>;
    shaoYong?: { assessment?: string; text?: string };
    modern?: Partial<ModernInterpretation>;
  };
}
