import type { Hexagram, HexagramRelation, YaoNetworkItem, HexagramsData } from "./types";

export function flipYao(binary: string, index: number): string {
  const arr = binary.split("");
  arr[index] = arr[index] === "1" ? "0" : "1";
  return arr.join("");
}

export function getCuo(binary: string): string {
  return binary
    .split("")
    .map((b) => (b === "1" ? "0" : "1"))
    .join("");
}

export function getZong(binary: string): string {
  return binary.split("").reverse().join("");
}

export function getHu(binary: string): string {
  return binary[1] + binary[2] + binary[3] + binary[2] + binary[3] + binary[4];
}

export function getYaoName(binary: string, index: number): string {
  return binary[index] === "1" ? `九${5 - index}` : `六${5 - index}`;
}

export function findHexagram(binary: string, data: HexagramsData): Hexagram {
  return data[parseInt(binary, 2)];
}

export function buildKingWenLookup(data: HexagramsData): Record<number, string> {
  const map: Record<number, string> = {};
  for (const h of data) {
    map[h.kingWen] = h.binary;
  }
  return map;
}

export function computeRelationGraph(
  benBinary: string,
  currentBinary: string,
  data: HexagramsData
): HexagramRelation {
  const ben = data[parseInt(benBinary, 2)];
  const cuo = data[parseInt(getCuo(benBinary), 2)];
  const zong = data[parseInt(getZong(benBinary), 2)];
  const hu = data[parseInt(getHu(benBinary), 2)];

  const hasChange = currentBinary !== benBinary;
  const bian = hasChange ? data[parseInt(currentBinary, 2)] : null;

  return {
    ben: { binary: benBinary, name: ben.shortName, symbol: ben.symbol },
    bian: bian ? { binary: currentBinary, name: bian.shortName, symbol: bian.symbol } : null,
    cuo: { binary: cuo.binary, name: cuo.shortName, symbol: cuo.symbol },
    zong: { binary: zong.binary, name: zong.shortName, symbol: zong.symbol },
    hu: { binary: hu.binary, name: hu.shortName, symbol: hu.symbol },
  };
}

export function computeYaoNetwork(
  baseBinary: string,
  currentBinary: string,
  data: HexagramsData
): YaoNetworkItem[] {
  return Array.from({ length: 6 }, (_, i) => {
    const toBinary = flipYao(baseBinary, i);
    const target = data[parseInt(toBinary, 2)];
    return {
      position: i,
      yaoName: getYaoName(baseBinary, i),
      fromBinary: baseBinary,
      toBinary,
      targetName: target.shortName,
      targetSymbol: target.symbol,
      isChanged: baseBinary[i] !== currentBinary[i],
    };
  });
}
