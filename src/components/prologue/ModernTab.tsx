const CARDS = [
  {
    title: "阴阳与二进制",
    body: "阳爻（—）为 1，阴爻（- -）为 0——六十四卦正是六位二进制数的全部排列组合。1703年，莱布尼茨读到白晋神父寄来的邵雍《六十四卦方圆图》后，惊叹「这和我发明的二进制算术完全一致！」他于1705年正式发表二进制论文，奠定了现代计算机科学的最底层逻辑。",
  },
  {
    title: "荣格与共时性原理",
    body: "瑞士心理学家荣格（C.G. Jung）在深入研究《易经》后，提出了「共时性」（Synchronicity）概念来替代西方传统的因果律。他认为：你掷出的铜钱正反组合看似随机，实则与你此刻的心理状态存在有意义的非因果关联。荣格将《易经》视为探索「无意识心灵结构」的终极工具。",
  },
  {
    title: "危机管理与居安思危",
    body: "《周易》六十四卦中，处处可见对「危机管理」的深刻洞见。否卦泰卦的相互转化揭示「否极泰来」与「泰极否至」的辩证法则。剥卦提醒盛极必衰，复卦鼓舞冬尽春回。六十四卦，本质上是一部关于「如何在不确定中保持清醒」的生存智慧百科全书。",
  },
];

export default function ModernTab() {
  return (
    <div>
      <p className="text-sm text-ink-muted leading-relaxed mb-5 text-justify">
        《周易》虽成书于三千年前，其核心思想——阴阳消长、变通趋时、絜矩之道——在现代科学与生活中焕发出惊人的预言力量。以下三个维度，展现最深邃的古今对话。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-border-gold bg-bg-paper/60 p-4 transition-colors hover:bg-gold-pale/5"
          >
            <h3 className="font-song text-sm text-ink-dark mb-2">{card.title}</h3>
            <p className="text-xs text-ink-muted leading-relaxed text-justify">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
