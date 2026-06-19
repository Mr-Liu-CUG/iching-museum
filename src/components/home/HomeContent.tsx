import HeroSection from "./HeroSection";
import ScrollNav from "@/components/layout/ScrollNav";
import DailyHexagram from "./DailyHexagram";
import WhatIsIChing from "./WhatIsIChing";
import BaguaNavSection from "./BaguaNavSection";
import LearningPathSection from "./LearningPathSection";
import WisdomTopics from "./WisdomTopics";
import AITutorEntry from "./AITutorEntry";

export default function HomeContent() {
  return (
    <>
      <HeroSection />
      <ScrollNav />
      <DailyHexagram />
      <WhatIsIChing />
      <BaguaNavSection />
      <LearningPathSection />
      <WisdomTopics />
      <AITutorEntry />
    </>
  );
}
