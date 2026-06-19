const TABS = [
  { key: "history", label: "易道渊源" },
  { key: "method", label: "揲蓍求卦" },
  { key: "masters", label: "历代圣贤" },
  { key: "modern", label: "现代启示" },
];

interface Props {
  active: string;
  onChange: (tab: string) => void;
}

export default function PrologueTabs({ active, onChange }: Props) {
  return (
    <nav className="flex flex-nowrap gap-1 overflow-x-auto pb-1" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onChange(tab.key)}
          className={`shrink-0 px-4 py-2 rounded-md font-song text-sm tracking-[1px] transition-all cursor-pointer ${
            active === tab.key
              ? "bg-gold-primary/15 text-gold-primary border border-gold-primary/30"
              : "bg-transparent text-ink-muted border border-transparent hover:border-border-gold"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
