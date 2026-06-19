const MASTERS = [
  {
    name: "王弼（226–249）",
    school: "魏晋玄学 · 扫象阐理",
    body: "天才少年，二十四岁注《周易》，开启「义理易学」的先河。王弼的核心方法论是「得意忘象，得象忘言」——卦象只是工具，真正的智慧在于领会象背后的「意」。他批评汉代象数之学繁琐支离，力主回归卦爻辞本身的义理内涵，将《周易》从神秘主义的象数牢笼中解放出来。",
  },
  {
    name: "邵雍（1011–1077）",
    school: "北宋先天学 · 以数算天",
    body: "字尧夫，谥康节。开创「先天易学」体系，以「伏羲六十四卦方圆图」为中心，认为宇宙万物皆在阴阳数轴的演变之中——「数学易」的始祖。他的先天卦序以二进制排列，后经传教士白晋传入欧洲，直接启发了莱布尼茨对二进制的系统研究。",
  },
  {
    name: "朱熹（1130–1200）",
    school: "南宋理学 · 集大成者",
    body: "南宋理学集大成者，著《周易本义》，力主「易本卜筮之书」——这不是贬损《易》，而是回归它的本来面目。朱熹认为，伏羲画卦、文王系辞，本来就是为了教人「占卜以决嫌疑」。但占卜不是迷信：在诚敬专注的占卜过程中，人得以「格物致知」，通过卦象反观自心。",
  },
  {
    name: "傅佩荣（1950–）",
    school: "现代哲学国学 · 东西会通",
    body: "当代华人世界最具影响力的国学传播者之一，台湾大学哲学系教授。傅佩荣融合西方哲学（现象学、存在主义）与心理学（荣格共时性原理），将《易经》从古代占卜工具转化为现代人的「理性决策辅助系统」与「自我觉察的心理地图」。",
  },
];

export default function MastersTab() {
  return (
    <div>
      <p className="text-sm text-ink-muted leading-relaxed mb-5 text-justify">
        历代圣贤解《易》，不出「义理」与「象数」两宗。义理一派重在阐发卦爻辞蕴含的人生哲理；象数一派重在探究卦象符号背后的宇宙数理结构。以下四位大师，代表了易学发展史上最重要的思想范式。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MASTERS.map((m) => (
          <div
            key={m.name}
            className="rounded-lg border border-border-gold bg-bg-paper/60 p-4 transition-colors hover:bg-gold-pale/5"
          >
            <h3 className="font-song text-sm text-ink-dark mb-1">{m.name}</h3>
            <p className="font-sans text-[11px] text-gold-primary tracking-[1px] mb-2">
              {m.school}
            </p>
            <p className="text-xs text-ink-muted leading-relaxed text-justify">{m.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
