"use client";

import { useState } from "react";
import type { Hexagram } from "@/lib/types";
import DetailCard from "./DetailCard";

const SCHOOLS = [
  { key: "shaoYong", label: "邵雍" },
  { key: "fuPeirong", label: "傅佩榮" },
  { key: "traditional", label: "传统" },
  { key: "zhangMingren", label: "張銘仁" },
] as const;

const TRADITIONAL_LABELS: Record<string, string> = {
  daxiang: "大象",
  yunshi: "运势",
  shiye: "事业",
  jingshang: "经商",
  qiuming: "求名",
  hunlian: "婚恋",
  juece: "决策",
};

const ZHANGMINGREN_LABELS: Record<string, string> = {
  explanation: "卦解",
  characteristics: "特性",
  yunshi: "运势",
  jiayun: "家运",
  jibing: "疾病",
  taiyun: "胎运",
  zinv: "子女",
  zhouzhuan: "周转",
  maimai: "买卖",
  dengren: "等人",
  xunren: "寻人",
  shiwu: "失物",
  waichu: "外出",
  kaoshi: "考试",
  susong: "诉讼",
  qiushi: "求事",
  gaihang: "改行",
  kaiye: "开业",
};

function stripMarkdown(s: string): string {
  return s.replace(/\*\*/g, "").replace(/\*/g, "");
}

interface Props {
  hexagram: Hexagram;
  index?: number;
}

export default function SchoolTabs({ hexagram, index = 4 }: Props) {
  const [active, setActive] = useState<string>("shaoYong");

  return (
    <DetailCard icon="◆" title="诸家解卦" index={index}>
      <div className="flex flex-wrap gap-1 mb-4">
        {SCHOOLS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(s.key)}
            className={`font-song text-sm px-4 py-1.5 rounded-md transition-colors cursor-pointer ${
              active === s.key
                ? "bg-gold-primary/15 text-gold-primary border border-gold-primary/30"
                : "bg-bg-paper/50 text-ink-muted border border-transparent hover:border-border-gold"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <SchoolContent hexagram={hexagram} school={active} />
      <p className="font-song text-[10px] text-ink-muted mt-4 pt-3 border-t border-border-pale leading-relaxed">
        以上为历代易学家对卦象的解读，反映不同时代的文化视角，仅供哲学与文化研究参考。
      </p>
    </DetailCard>
  );
}

function SchoolContent({ hexagram, school }: { hexagram: Hexagram; school: string }) {
  switch (school) {
    case "shaoYong":
      return (
        <div className="text-sm text-ink-muted leading-relaxed">
          <p className="font-medium text-ink-dark mb-1">
            {stripMarkdown(hexagram.shaoYong?.assessment || "")}
          </p>
          <p className="whitespace-pre-line">{stripMarkdown(hexagram.shaoYong?.text || "暂无数据")}</p>
        </div>
      );
    case "fuPeirong":
      return (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="font-sans text-xs text-ink-muted">时运</span><p className="text-ink-dark">{hexagram.fuPeirong?.shiyun || "—"}</p></div>
          <div><span className="font-sans text-xs text-ink-muted">财富</span><p className="text-ink-dark">{hexagram.fuPeirong?.caiyun || "—"}</p></div>
          <div><span className="font-sans text-xs text-ink-muted">家庭</span><p className="text-ink-dark">{hexagram.fuPeirong?.jiazhai || "—"}</p></div>
          <div><span className="font-sans text-xs text-ink-muted">健康</span><p className="text-ink-dark">{hexagram.fuPeirong?.shenti || "—"}</p></div>
        </div>
      );
    case "traditional":
      return (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(hexagram.traditional || {}).map(([k, v]) => (
            <div key={k}>
              <span className="font-sans text-xs text-ink-muted">{TRADITIONAL_LABELS[k] || k}</span>
              <p className="text-ink-dark">{v as string || "—"}</p>
            </div>
          ))}
        </div>
      );
    case "zhangMingren":
      return (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(hexagram.zhangMingren || {}).slice(0, 12).map(([k, v]) => (
            <div key={k}>
              <span className="font-sans text-xs text-ink-muted">{ZHANGMINGREN_LABELS[k] || k}</span>
              <p className="text-ink-dark">{v as string || "—"}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}
