import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");

const data = JSON.parse(
  readFileSync(join(dataDir, "hexagrams-data.json"), "utf-8")
);

// Philosophical guidance text for each interpretation category
// These replace fortune-telling content with philosophical reflections
const philosophicalGuidance = {
  career: [
    "天道刚健，君子当效法天之精神，自强不息。本卦提示在事业中保持进取之心，同时审时度势。",
    "地势柔顺，承载万物。事业当以厚德载物，包容稳重，以柔克刚，以静制动。",
    "阴阳交替，变通趋时。事业发展需要把握时机，当进则进，当退则退，不可固执一端。",
  ],
  wealth: [
    "富有之谓大业，日新之谓盛德。财富之道在于创造价值，而非单纯追逐利益。君子爱财，取之有道。",
    "损上益下，民说无疆。财富的意义在于流通与分享，独享则寡，众享则丰。",
    "节以制度，不伤财，不害民。理财之道贵在中正节度，知止不殆，可以长久。",
  ],
  love: [
    "天地感而万物化生。情感之道在于真诚相感，以心交心。柔顺处下，方能水到渠成。",
    "二人同心，其利断金。真挚的情感建立在相互理解与尊重之上，同心之言，其臭如兰。",
    "家人有严君焉，父母之谓也。情感关系需要责任与包容，内外各正其位，方能长久和谐。",
  ],
  health: [
    "君子以慎言语，节饮食。身心健康之道在于节制与平衡，不过不及，守中为正。",
    "天行健，君子以自强不息。保持身心活力贵在有恒，起居有常，不妄作劳，形与神俱。",
  ],
  interpersonal: [
    "君子以朋友讲习。人际交往贵在诚信与谦逊，以文会友，以友辅仁。",
    "同声相应，同气相求。人与人相处，志同道合者自然亲近。保持中正平和之心，方能广结善缘。",
  ],
};

// Hexagram descriptions for fortuneScripture replacement
const hexagramDescriptions = {
  // Palace-based descriptions for each hexagram
};

function cleanInterpretation(h, idx) {
  const fields = ["career", "wealth", "love", "health", "interpersonal"];

  for (const field of fields) {
    const old = h.interpretation?.[field] || "";
    // Check if the content is fortune-telling text
    const isFortune =
      old.includes("天師") ||
      old.includes("財神經") ||
      old.includes("请参考卦辞综合判断") ||
      old.length < 5;

    if (isFortune) {
      const guidances = philosophicalGuidance[field];
      // Pick guidance based on hexagram characteristics
      // Use the hexagram's element/moral to pick appropriate text
      const hasQian = h.name.includes("乾") || h.binary === "111111";
      const hasKun = h.name.includes("坤") || h.binary === "000000";
      const isYang = h.binary.split("1").length - 1 >= 3;

      let guidance;
      if (field === "career") {
        guidance = hasQian
          ? guidances[0]
          : hasKun
            ? guidances[1]
            : guidances[2];
      } else if (field === "wealth") {
        guidance = guidances[idx % 3];
      } else if (field === "love") {
        guidance = guidances[idx % 3];
      } else if (field === "health") {
        guidance = guidances[idx % 2];
      } else {
        guidance = guidances[idx % 2];
      }

      if (!h.interpretation) h.interpretation = {};
      h.interpretation[field] = guidance;
    }
  }
}

function cleanFortuneScripture(h, idx) {
  const old = h.fortuneScripture || "";
  if (old.includes("五路財神經")) {
    // Replace with the short mnemonic or a neutral description
    h.fortuneScripture = h.mnemonic
      ? `${h.name}：${h.mnemonic}`
      : `${h.name}卦`;
  }
}

function cleanTianshiPoem(h, idx) {
  const old = h.tianshiPoem || "";
  if (old.includes("天師")) {
    // Use the poetry field if available, otherwise use the mnemonic
    if (h.poetry && !h.poetry.includes("天師")) {
      h.tianshiPoem = h.poetry;
    } else {
      // Use hexagram guaciExplain or empty
      h.tianshiPoem = "";
    }
  }
}

let stats = {
  interpretationCleaned: 0,
  fortuneScriptureCleaned: 0,
  tianshiPoemCleaned: 0,
};

data.forEach((h, idx) => {
  // Clean each field
  const interpFields = ["career", "wealth", "love", "health", "interpersonal"];
  for (const field of interpFields) {
    const old = h.interpretation?.[field] || "";
    if (
      old.includes("天師") ||
      old.includes("財神經") ||
      old.includes("请参考卦辞综合判断") ||
      old.length < 5
    ) {
      cleanInterpretation(h, idx);
      stats.interpretationCleaned++;
      break; // count once per hexagram
    }
  }

  if ((h.fortuneScripture || "").includes("五路財神經")) {
    cleanFortuneScripture(h, idx);
    stats.fortuneScriptureCleaned++;
  }

  if ((h.tianshiPoem || "").includes("天師")) {
    cleanTianshiPoem(h, idx);
    stats.tianshiPoemCleaned++;
  }
});

console.log("=== Fortune Content Cleanup ===");
console.log("interpretation fields cleaned:", stats.interpretationCleaned);
console.log("fortuneScripture cleaned:", stats.fortuneScriptureCleaned);
console.log("tianshiPoem cleaned:", stats.tianshiPoemCleaned);

// Verify no fortune content remains
let remaining = { fortuneScripture: 0, tianshiPoem: 0, interpretation: 0 };
data.forEach((h) => {
  if ((h.fortuneScripture || "").includes("五路財神經"))
    remaining.fortuneScripture++;
  if ((h.tianshiPoem || "").includes("天師")) remaining.tianshiPoem++;
  for (const field of Object.values(h.interpretation || {})) {
    if ((field || "").includes("天師") || (field || "").includes("財神經"))
      remaining.interpretation++;
  }
});

console.log("\nRemaining fortune references:");
console.log("  fortuneScripture:", remaining.fortuneScripture);
console.log("  tianshiPoem:", remaining.tianshiPoem);
console.log("  interpretation:", remaining.interpretation);

if (remaining.fortuneScripture + remaining.tianshiPoem + remaining.interpretation === 0) {
  console.log("\nALL FORTUNE CONTENT CLEANED ✓");
} else {
  console.log("\nWARNING: Some fortune content remains");
}

writeFileSync(
  join(dataDir, "hexagrams-data.json"),
  JSON.stringify(data, null, 2),
  "utf-8"
);
console.log("hexagrams-data.json updated.");
