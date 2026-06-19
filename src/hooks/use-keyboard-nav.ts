"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";

export function useKeyboardNav() {
  const navigateHexagram = useAppStore((s) => s.navigateHexagram);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateHexagram(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateHexagram(1);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigateHexagram]);
}
