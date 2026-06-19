import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");

async function main() {
  const { Converter } = await import("opencc-js");
  const converter = Converter({ from: "tw", to: "cn" });

  const dataPath = join(dataDir, "hexagrams-data.json");
  const data = JSON.parse(readFileSync(dataPath, "utf-8"));

  const stringFields = [
    "name", "shortName", "pinyin", "upper", "lower", "element", "direction",
    "palace", "guaci", "guaciExplain", "tuan", "tuanExplain", "xiang",
    "xiangExplain", "mnemonic", "poetry", "palaceBagua",
    "fortuneScripture", "tianshiPoem",
  ];

  const schoolFields = ["assessment", "text"];
  const fuPeirongFields = ["shiyun", "caiyun", "jiazhai", "shenti"];
  const traditionalFields = ["daxiang", "yunshi", "shiye", "jingshang", "qiuming", "hunlian", "juece"];
  const interpFields = ["career", "wealth", "love", "health", "interpersonal"];

  let count = 0;

  for (const h of data) {
    for (const field of stringFields) {
      if (typeof h[field] === "string" && h[field].length > 0) {
        h[field] = converter(h[field]);
        count++;
      }
    }

    if (h.shaoYong) {
      for (const f of schoolFields) {
        if (typeof h.shaoYong[f] === "string" && h.shaoYong[f].length > 0) {
          h.shaoYong[f] = converter(h.shaoYong[f]);
          count++;
        }
      }
    }

    if (h.fuPeirong) {
      for (const f of fuPeirongFields) {
        if (typeof h.fuPeirong[f] === "string" && h.fuPeirong[f].length > 0) {
          h.fuPeirong[f] = converter(h.fuPeirong[f]);
          count++;
        }
      }
    }

    if (h.traditional) {
      for (const f of traditionalFields) {
        if (typeof h.traditional[f] === "string" && h.traditional[f].length > 0) {
          h.traditional[f] = converter(h.traditional[f]);
          count++;
        }
      }
    }

    if (h.interpretation) {
      for (const f of interpFields) {
        if (typeof h.interpretation[f] === "string" && h.interpretation[f].length > 0) {
          h.interpretation[f] = converter(h.interpretation[f]);
          count++;
        }
      }
    }

    if (h.zhangMingren) {
      for (const [k, v] of Object.entries(h.zhangMingren)) {
        if (typeof v === "string" && v.length > 0) {
          h.zhangMingren[k] = converter(v);
          count++;
        }
      }
    }

    if (h.yaoci) {
      for (const yao of h.yaoci) {
        for (const f of ["name", "text", "explain", "explainShort", "biangua"]) {
          if (typeof yao[f] === "string" && yao[f]?.length > 0) {
            yao[f] = converter(yao[f]);
            count++;
          }
        }
        if (yao.shaoYong) {
          for (const f of schoolFields) {
            if (typeof yao.shaoYong[f] === "string" && yao.shaoYong[f].length > 0) {
              yao.shaoYong[f] = converter(yao.shaoYong[f]);
              count++;
            }
          }
        }
        if (yao.fuPeirong) {
          for (const f of fuPeirongFields) {
            if (typeof yao.fuPeirong[f] === "string" && yao.fuPeirong[f].length > 0) {
              yao.fuPeirong[f] = converter(yao.fuPeirong[f]);
              count++;
            }
          }
        }
      }
    }
  }

  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Converted ${count} string fields in ${data.length} hexagrams (Traditional → Simplified)`);

  // Verify no Traditional Chinese remains
  const tcPattern = /[爲為體書時運財無來對動變陰陽傳經統師門間開關見說頭實東長過進氣業義賢貴風龍應靈讓問個從處極結國學萬難樂當還後會雲愛話電寶]/;
  let remaining = 0;
  for (const h of data) {
    const str = JSON.stringify(h);
    if (tcPattern.test(str)) remaining++;
  }
  if (remaining > 0) {
    console.log(`WARNING: ${remaining} hexagrams may still contain Traditional Chinese`);
  } else {
    console.log("All Traditional Chinese converted successfully ✓");
  }
}

main();
