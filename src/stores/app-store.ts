import { create } from "zustand";
import type { Hexagram, HexagramRelation, YaoNetworkItem } from "@/lib/types";
import { computeRelationGraph, computeYaoNetwork, flipYao } from "@/lib/hexagram-utils";
import hexagramsData from "@/data/hexagrams-data.json";

interface AppState {
  currentBinary: string;
  baseBinary: string;
  searchQuery: string;
  isPrologueOpen: boolean;
  activePrologueTab: string;
  activeSchoolTab: string;
  lang: string;

  setHexagram: (binary: string) => void;
  flipYaoAt: (index: number) => void;
  navigateHexagram: (direction: 1 | -1) => void;
  navigateKingWen: (kw: number) => void;
  setSearchQuery: (query: string) => void;
  togglePrologue: () => void;
  setPrologueTab: (tab: string) => void;
  setSchoolTab: (tab: string) => void;
  setLang: (lang: string) => void;

  currentHexagram: () => Hexagram | undefined;
  baseHexagram: () => Hexagram | undefined;
  relationGraph: () => HexagramRelation;
  yaoNetwork: () => YaoNetworkItem[];
  getData: () => Hexagram[];
}

export const useAppStore = create<AppState>((set, get) => ({
  currentBinary: "111111",
  baseBinary: "111111",
  searchQuery: "",
  isPrologueOpen: false,
  activePrologueTab: "history",
  activeSchoolTab: "shaoYong",
  lang: "zh-CN",

  setHexagram: (binary) => set({ currentBinary: binary, baseBinary: binary }),

  flipYaoAt: (index) => {
    const { baseBinary, currentBinary } = get();
    const flipped = flipYao(currentBinary, index);
    set({ currentBinary: flipped, baseBinary: baseBinary });
  },

  navigateHexagram: (direction) => {
    const { currentBinary } = get();
    const next = (parseInt(currentBinary, 2) + direction + 64) % 64;
    const binary = next.toString(2).padStart(6, "0");
    set({ currentBinary: binary, baseBinary: binary });
  },

  navigateKingWen: (kw) => {
    const arr = hexagramsData as unknown as Hexagram[];
    const hex = arr.find((h) => h.kingWen === kw);
    if (hex) set({ currentBinary: hex.binary, baseBinary: hex.binary });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  togglePrologue: () => set((s) => ({ isPrologueOpen: !s.isPrologueOpen })),
  setPrologueTab: (tab) => set({ activePrologueTab: tab }),
  setSchoolTab: (tab) => set({ activeSchoolTab: tab }),
  setLang: (lang) => set({ lang }),

  currentHexagram: () => {
    const arr = hexagramsData as unknown as Hexagram[];
    return arr[parseInt(get().currentBinary, 2)];
  },
  baseHexagram: () => {
    const arr = hexagramsData as unknown as Hexagram[];
    return arr[parseInt(get().baseBinary, 2)];
  },
  relationGraph: () => {
    const { baseBinary, currentBinary } = get();
    return computeRelationGraph(baseBinary, currentBinary, hexagramsData as unknown as Hexagram[]);
  },
  yaoNetwork: () => {
    const { baseBinary, currentBinary } = get();
    return computeYaoNetwork(baseBinary, currentBinary, hexagramsData as unknown as Hexagram[]);
  },
  getData: () => hexagramsData as Hexagram[],
}));
