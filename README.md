# 易经数字博物馆 · I Ching Digital Museum

> **三千年前的智慧，今天依然在回答人生问题。**
>
> 以宋韵美学为骨，以现代 Web 技术为翼 —— 一座可以在浏览器中深度探索的易经数字博物馆。

![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Languages](https://img.shields.io/badge/languages-3-brightgreen)

---

## 项目定位

这不是算命网站，不是风水网站，也不是六十四卦查询工具。

这是一座**面向现代人的易经数字学习平台**，目标是在浏览器中构建完整的博物馆观展体验：

- **Story First**：先讲故事激发兴趣，再传递知识，避免一上来就堆砌古文
- **哲学导向**：强调变化规律与认知提升，不做吉凶断言和命运预测
- **AI 辅助**：接入 DeepSeek 大模型，以易经哲学导师身份提供思考框架

---

## 展厅导览

### 首页 · 博物馆大堂

页面以**连续滚动博物馆**的形式组织，用户自上而下穿越各个展馆：

| 展区 | 模块 | 说明 |
|------|------|------|
| **Hero** | `HeroSection` | 全屏大"易"字、博物馆标题、探索入口 |
| **今日一卦** | `DailyHexagram` | 基于日期确定性生成每日卦象，智慧箴言 + 行动建议 |
| **易经是什么** | `WhatIsIChing` | 伏羲→文王→孔子→现代 四张时间线卡片 |
| **八卦导航** | `BaguaNavSection` | ☰☱☲☳☴☵☶☷ 八卦 4×2 网格，点击跳转对应宫 |
| **学习路径** | `LearningPathSection` | 6 级成长体系 × 18 个深度学习模块，含互动练习与历史案例 |
| **人生智慧** | `WisdomTopics` | 10 大主题 · 47 个人生场景，问题→卦象→案例→建议 |
| **AI 导师** | `AITutorEntry` | 基于 DeepSeek 的实时对话，哲学引导而非占卜 |
| **序厅** | `PrologueSection` | 易道渊源 / 揲蓍求卦 / 历代圣贤 / 现代启示 |
| **六十四卦** | `HexagramExplorer` | 核心展厅：卦象交互、诸家解卦、关系图谱、全景矩阵 |
| **页脚** | `Footer` | 版权声明、乾卦坤卦大象辞 |

### 核心展厅 · 六十四卦交互

- **六爻点击变卦**：点击任意爻线，阴阳互变，即时生成变卦
- **卦序滑块**：按周文王通行卦序（1–64）快速浏览
- **模糊搜索**：支持卦名、拼音、上下卦组合
- **键盘导航**：← → 键按伏羲先天序切换卦象

### 经文阐释

每卦包含：卦辞本义、彖传阐释、大象传、六爻爻辞（可折叠手风琴）、诸家解卦（四 Tab）、现代五维生活之思、口诀记忆

### 卦象关系图谱

本卦→变卦 / 错卦 / 综卦 / 互卦 / 六爻变卦网络（D3.js 可视化）

### 全景矩阵

8×8 伏羲先天方阵，64 格每格为一个卦，点击跳转

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16（App Router） |
| 语言 | TypeScript 5.8 |
| 样式 | TailwindCSS v4 |
| 动画 | Framer Motion v12 |
| 状态管理 | Zustand v5 |
| 可视化 | D3.js v7 |
| 国际化 | 自研 `useTranslation` Hook |
| AI | DeepSeek API（SSE 流式） |
| Markdown | react-markdown + remark-gfm |

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量（AI 导师功能需要）
# 创建 .env.local，写入：
#   DEEPSEEK_API_KEY=你的DeepSeek密钥

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开
# http://localhost:3000
```

```bash
# 生产构建
npm run build
npm start
```

---

## 项目结构

```
易经/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局
│   │   ├── page.tsx                # 首页 · 展厅组装
│   │   ├── globals.css             # 全局样式 + Tailwind
│   │   └── api/chat/route.ts      # DeepSeek API 路由（SSE 流式）
│   │
│   ├── components/
│   │   ├── home/                   # 首页 8 个展厅模块
│   │   │   ├── HeroSection.tsx     #   Hero 大屏
│   │   │   ├── DailyHexagram.tsx   #   今日一卦
│   │   │   ├── WhatIsIChing.tsx    #   易经是什么
│   │   │   ├── BaguaNavSection.tsx #   八卦导航
│   │   │   ├── LearningPathSection.tsx  # 学习路径（18 模块）
│   │   │   ├── WisdomTopics.tsx    #   人生智慧（47 场景）
│   │   │   ├── AITutorEntry.tsx    #   AI 导师对话
│   │   │   ├── HomeContent.tsx     #   展厅编排
│   │   │   └── MarkdownRenderer.tsx #  Markdown 渲染
│   │   │
│   │   ├── hexagram/               # 卦象核心展厅（14 组件）
│   │   │   ├── HexagramView.tsx    #   主视图容器
│   │   │   ├── YaoLinesContainer.tsx # 六爻交互
│   │   │   ├── YaoLine.tsx         #   单爻线
│   │   │   ├── YaoAccordion.tsx    #   爻辞折叠面板
│   │   │   ├── GuaciSection.tsx    #   卦辞
│   │   │   ├── TuanSection.tsx     #   彖传
│   │   │   ├── XiangSection.tsx    #   大象传
│   │   │   ├── SchoolTabs.tsx      #   诸家解卦
│   │   │   ├── ModernInterpretations.tsx # 现代五维
│   │   │   ├── MnemonicSection.tsx #   口诀记忆
│   │   │   ├── MetaGrid.tsx        #   元数据
│   │   │   ├── RelationGraph.tsx   #   D3 关系图谱
│   │   │   └── ...
│   │   │
│   │   ├── layout/                 # 布局组件
│   │   │   ├── Header.tsx          #   标题栏 + 语言切换
│   │   │   ├── ScrollNav.tsx       #   滚动导航栏
│   │   │   ├── SearchNavBar.tsx    #   搜索 + 卦序滑块
│   │   │   ├── InkBackground.tsx   #   水墨背景
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── matrix/                 # 64 卦矩阵
│   │   └── prologue/               # 序厅五模块
│   │
│   ├── i18n/
│   │   ├── use-translation.ts      # 翻译 Hook
│   │   ├── locales.ts              # 语言定义
│   │   └── dictionaries/           # zh-CN / zh-TW / ja
│   │
│   ├── lib/
│   │   ├── types.ts                # TypeScript 类型定义
│   │   ├── constants.ts            # 常量
│   │   ├── utils.ts                # 工具函数
│   │   ├── hexagram-utils.ts       # 卦序 / 变卦 / 错综互卦
│   │   ├── curriculum.ts           # 18 个学习模块数据
│   │   ├── wisdom-topics.ts        # 10 主题 · 47 场景数据
│   │   ├── daily-utils.ts          # 每日一卦算法
│   │   ├── animations.ts           # Framer Motion 动画变体
│   │   └── verification.ts         # 数据完整性验证
│   │
│   ├── stores/
│   │   └── app-store.ts            # Zustand 全局状态
│   │
│   └── hooks/
│       └── use-keyboard-nav.ts     # 键盘导航 Hook
│
├── data/
│   └── hexagrams-data.json         # 64 卦完整数据（~30 字段/卦）
│
├── scripts/                        # 数据构建脚本
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## 国际化

支持三种语言，通过 Header 下拉菜单切换：

| 语言 | 覆盖范围 |
|------|---------|
| 简体中文（zh-CN） | 完整内容，从源数据直接渲染 |
| 繁體中文（zh-TW） | 完整繁体词典 |
| 日本語（ja） | 完整日语词典 |

所有翻译键约 94 条，覆盖导航、展厅标题、按钮、占位符等 UI 文案。卦象数据本身保留中文原文。

---

## AI 导师

基于 DeepSeek API，以**科学哲学导向**回答用户问题：

- **不做算命**：不预测未来、不断言吉凶、不替用户决策
- **哲学引导**：推荐相关卦象 → 解释变化规律 → 提供思考框架
- **结构回答**：理解问题 → 对应卦象 → 经典智慧 → 哲学思考 → 开放式提问
- **流式输出**：SSE 实时渲染 Markdown

---

## 设计体系

### 色彩

| Token | 色值 | 语义 |
|-------|------|------|
| `bg-paper` | `#f5f1e8` | 手工宣纸米白基调 |
| `gold-primary` | `#b08d57` | 故宫鎏金主色 |
| `gold-pale` | `#e8dcc8` | 淡金 — 分隔线 |
| `ink-dark` | `#2c2c2c` | 松烟墨色 — 正文 |
| `ink-muted` | `#6a655c` | 淡墨 — 辅助文字 |

### 动画

遵循**缓慢、优雅、自然**原则，duration 不低于 500ms，ease 曲线 `[0.16, 1, 0.3, 1]`（expo-out）。所有入场动画 `viewport.once = true`。

---

## 数据索引

卦象数据使用**伏羲先天二进制序**作为主索引，`kingWen` 字段维护周文王通行卦序（1–64）。

---

## 数据来源

- **卦辞 / 彖传 / 象传 / 爻辞**：《周易》原文（王弼本）
- **邵雍解卦**：《梅花易数》体系
- **傅佩荣解卦**：傅佩荣《易经》系列著作
- **传统解卦**：综合历代注疏
- **张铭仁解卦**：《易经占卜大全》
- **现代五维之思**：原创编撰（哲学视角，非运势预测）
- **序厅文案**：综合易学史研究成果

---

## 声明

本项目为**易经哲学可视化研究**作品：

- 以数字技术呈现《周易》的文化深度与哲学智慧
- 探索东方传统美学与现代 Web 交互的融合
- 提供多语言环境下易学知识的无障碍访问

本项目**不含**算命、风水改运、投资建议等玄学营销内容。

---

## 许可

MIT License © 2026

---

> **天行健，君子以自强不息。地势坤，君子以厚德载物。**
