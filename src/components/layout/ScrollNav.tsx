"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/use-translation";

const NAV_IDS = [
  "hero", "daily-hexagram", "what-is-iching", "bagua-nav",
  "learning-path", "wisdom-topics", "ai-tutor", "hexagram-explorer",
] as const;

const NAV_KEY_MAP: Record<string, string> = {
  hero: "nav.home",
  "daily-hexagram": "nav.daily",
  "what-is-iching": "nav.whatIs",
  "bagua-nav": "nav.bagua",
  "learning-path": "nav.learning",
  "wisdom-topics": "nav.wisdom",
  "ai-tutor": "nav.aiTutor",
  "hexagram-explorer": "nav.explore",
};

export default function ScrollNav() {
  const { t } = useTranslation();
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    for (const id of NAV_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="py-6 px-4">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex items-center justify-center gap-1 overflow-x-auto bg-bg-paper/50 rounded-lg border border-border-gold/60 py-2.5 px-3">
          {NAV_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className={`shrink-0 px-3 py-1.5 rounded-md font-song text-xs tracking-[1px] transition-colors cursor-pointer ${
                active === id
                  ? "bg-gold-primary/15 text-gold-primary"
                  : "text-ink-muted hover:text-ink-dark hover:bg-gold-pale/10"
              }`}
            >
              {t(NAV_KEY_MAP[id])}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
