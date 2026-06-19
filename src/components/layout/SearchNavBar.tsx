import SearchBar from "./SearchBar";
import HexagramSlider from "./HexagramSlider";
import { useTranslation } from "@/i18n/use-translation";

export default function SearchNavBar() {
  const { t, lang } = useTranslation();
  // Only show keyboard hint for CJK locales
  const isCJK = lang === "zh-CN" || lang === "zh-TW" || lang === "ja";
  return (
    <nav className="sticky top-3 z-50 mb-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-bg-paper/90 backdrop-blur-sm rounded-lg border border-border-gold px-4 py-3 shadow-sm">
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>
        <div className="shrink-0 sm:max-w-[280px] w-full sm:w-auto">
          <HexagramSlider />
        </div>
        {isCJK && (
          <span className="hidden lg:block font-sans text-[10px] text-ink-muted whitespace-nowrap">
            ← → 键切换卦象
          </span>
        )}
      </div>
    </nav>
  );
}
