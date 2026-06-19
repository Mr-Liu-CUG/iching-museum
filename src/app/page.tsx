"use client";

import InkBackground from "@/components/layout/InkBackground";
import Header from "@/components/layout/Header";
import ScrollNav from "@/components/layout/ScrollNav";
import Footer from "@/components/layout/Footer";
import HomeContent from "@/components/home/HomeContent";
import PrologueSection from "@/components/prologue/PrologueSection";
import SearchNavBar from "@/components/layout/SearchNavBar";
import HexagramExplorer from "@/components/hexagram/HexagramExplorer";
import MatrixSection from "@/components/matrix/MatrixSection";
import { useKeyboardNav } from "@/hooks/use-keyboard-nav";

export default function HomePage() {
  useKeyboardNav();

  return (
    <>
      <InkBackground />
      <Header />
      <ScrollNav />
      <div className="mx-auto max-w-[1320px] px-5 lg:px-6">
        <HomeContent />
        <PrologueSection />
        <main>
          <SearchNavBar />
          <div className="min-h-[60vh]">
            <HexagramExplorer />
          </div>
          <MatrixSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
