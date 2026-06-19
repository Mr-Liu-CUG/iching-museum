import type { Hexagram } from "@/lib/types";
import GuaciSection from "./GuaciSection";
import TuanSection from "./TuanSection";
import XiangSection from "./XiangSection";
import YaoAccordion from "./YaoAccordion";
import SchoolTabs from "./SchoolTabs";
import ModernInterpretations from "./ModernInterpretations";
import MnemonicSection from "./MnemonicSection";

interface Props {
  hexagram: Hexagram;
  onNavigateBiangua: (binary: string) => void;
}

export default function HexagramContent({ hexagram, onNavigateBiangua }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <GuaciSection hexagram={hexagram} index={0} />
      <TuanSection hexagram={hexagram} index={1} />
      <XiangSection hexagram={hexagram} index={2} />
      <YaoAccordion hexagram={hexagram} onNavigateBiangua={onNavigateBiangua} index={3} />
      <SchoolTabs hexagram={hexagram} index={4} />
      <ModernInterpretations hexagram={hexagram} index={5} />
      <MnemonicSection hexagram={hexagram} index={6} />
    </div>
  );
}
