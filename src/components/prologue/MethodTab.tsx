export default function MethodTab() {
  return (
    <div>
      <p className="text-sm text-ink-muted leading-relaxed mb-6 text-justify">
        《易》之交互，在乎动静之间。无事则澄心静虑，有事则依理起卦。以下两种方法，皆为古今通用的正宗起卦法门。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Great Expansion Method */}
        <div className="rounded-lg border border-border-gold bg-bg-paper/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-song text-base text-ink-dark">大衍筮法（揲蓍法）</h3>
            <span className="font-sans text-[10px] px-2 py-0.5 rounded bg-red-palace/10 text-red-palace">
              传统正宗
            </span>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mb-3">
            「大衍之数五十，其用四十有九。」取五十根蓍草，抽出一根不用（象征太极），余四十九根经分二（天地）、挂一（人）、揲四（四时）、归奇（闰月）四营为一变。三变而成一爻，十八变而成一卦。
          </p>
          <ol className="text-xs text-ink-muted space-y-1 pl-4 list-decimal">
            <li>分而为二以象两</li>
            <li>挂一以象三</li>
            <li>揲之以四以象四时</li>
            <li>归奇于扐以象闰</li>
          </ol>
        </div>

        {/* Coin Method */}
        <div className="rounded-lg border border-border-gold bg-bg-paper/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-song text-base text-ink-dark">金钱卦（三钱法）</h3>
            <span className="font-sans text-[10px] px-2 py-0.5 rounded bg-gold-pale/30 text-gold-primary">
              现代通行
            </span>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mb-3">
            准备三枚相同的古钱（或硬币）。双手合扣，心中澄澈专注所问之事，摇荡掷出，共六次。自下而上记录初爻至上爻。
          </p>
          <div className="text-xs text-ink-muted space-y-1">
            <p><span className="text-ink-dark font-medium">一背两正（少阳⚊）：</span>记为阳爻，静爻</p>
            <p><span className="text-ink-dark font-medium">两背一正（少阴⚋）：</span>记为阴爻，静爻</p>
            <p><span className="text-ink-dark font-medium">三背（老阳☯）：</span>记为阳爻，动爻（变爻）</p>
            <p><span className="text-ink-dark font-medium">三正（老阴☯）：</span>记为阴爻，动爻（变爻）</p>
          </div>
        </div>
      </div>
    </div>
  );
}
