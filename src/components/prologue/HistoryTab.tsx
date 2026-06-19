const ERAS = [
  {
    era: "上古",
    title: "伏羲氏：一画开天",
    body: "仰观天文，俯察地理，近取诸身，远取诸物。始作八卦，以通神明之德，以类万物之情。伏羲画卦，奠定了中华文明「天人合一」的宇宙观根基——八卦不仅是符号系统，更是先民对自然界八种根本力量的抽象概括：天（☰）、泽（☱）、火（☲）、雷（☳）、风（☴）、水（☵）、山（☶）、地（☷）。",
  },
  {
    era: "中古",
    title: "文王周公：羑里演易",
    body: "殷商末年，西伯姬昌（周文王）被商纣囚于羑里七年。囹圄之中，他将伏羲八卦重为六十四卦，并为每卦系以卦辞；其子周公旦继之为三百八十四爻系以爻辞。至此，《周易》由「不可言说」的符号系统升华为一部涵盖宇宙、社会、人生的哲理全书。",
  },
  {
    era: "近古",
    title: "孔子与十翼：义理阐发",
    body: "春秋末年，孔子晚年好《易》，「韦编三绝」——捆竹简的牛皮绳断了三次。孔子及其弟子为《周易》作传七种十篇，合称「十翼」。孔子将《易》从占筮彻底提升到哲学高度，以「观象玩辞」的方法论，把六十四卦解读为修身、齐家、治国、平天下的人生教科书。",
  },
  {
    era: "宋明",
    title: "理学鼎盛：象数与义理的合流",
    body: "北宋五子（周敦颐、邵雍、张载、程颢、程颐）将《易》学推向新高峰。邵雍以先天象数学开创「数学易」体系——六十四卦方圆图用二进制排列揭示宇宙演化的数理规律（后启发了莱布尼茨的二进制研究）。南宋朱熹集大成，以「易本卜筮之书」回归本原。明清之际，王夫之《周易外传》以气学解易，将《易》还原为「天地万物变化之道」的实学。",
  },
];

export default function HistoryTab() {
  return (
    <div className="relative pl-8">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gold-pale" />
      {ERAS.map((item, i) => (
        <div key={i} className="relative pb-6 last:pb-0">
          <span className="absolute -left-[26px] top-1 w-[14px] h-[14px] rounded-full border-2 border-gold-primary bg-bg-paper z-10" />
          <span className="inline-block font-sans text-[10px] tracking-[2px] px-2 py-0.5 rounded bg-gold-pale/30 text-ink-muted mb-2">
            {item.era}
          </span>
          <h3 className="font-song text-base text-ink-dark mt-1 mb-2">{item.title}</h3>
          <p className="text-sm text-ink-muted leading-[1.9] text-justify">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
