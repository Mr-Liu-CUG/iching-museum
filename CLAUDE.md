# CLAUDE.md

## 项目名称

易经数字博物馆（I Ching Digital Museum）

---

# 项目目标

构建一个兼具：

* 中国传统文化传播
* 易经系统学习
* 可视化知识展示
* AI辅助学习
* 现代Web交互体验

的高品质网站。

项目定位：

不是算命网站。

不是风水网站。

不是六十四卦查询工具。

而是：

"面向现代人的易经数字学习平台"

目标用户：

* 完全不了解易经的小白
* 国学爱好者
* 大学生
* 历史文化爱好者
* 企业管理者
* 哲学爱好者

---

# 核心设计理念

遵循：

Story First

而非：

Knowledge First

用户应该先产生兴趣，再学习知识。

避免一上来展示大量卦辞和古文。

采用：

故事
↓
案例
↓
动画
↓
知识

的学习路径。

---

# 整体风格

参考：

* 故宫博物院数字展馆
* 中国国家典籍博物馆
* Apple官网
* 国家地理杂志
* 高端艺术展览官网

关键词：

东方美学

水墨

留白

高级感

沉浸感

探索感

神秘感

现代极简

---

# UI设计规范

主色：

#b08d57

辅色：

#8b5a2b

背景：

#f5f1e8

文字：

#2c2c2c

强调色：

#d4af37

---

# 动画规范

优先使用：

CSS Animation

Framer Motion

GSAP

---

动画风格：

缓慢

优雅

自然

禁止：

炫酷赛博风

强闪烁

复杂粒子特效

过度动画

---

# 页面架构

## 首页

展示：

三千年前的智慧

今天依然在回答人生问题

模块：

1. Hero区域
2. 今日一卦
3. 易经是什么
4. 八卦导航
5. 学习路径
6. 人生智慧专题
7. AI导师入口

---

# 第一馆：易经是什么

目标：

5分钟了解易经

内容：

* 易经起源
* 伏羲八卦
* 周文王六十四卦
* 孔子十翼
* 易经现代价值

展示形式：

时间轴

动画

信息图

不要大段文字。

---

# 第二馆：阴阳与八卦

目标：

理解易经基础逻辑

内容：

阴阳

四象

八卦

五行

河图

洛书

展示形式：

交互动画

动态图解

点击探索

---

# 第三馆：六十四卦探索馆

核心模块。

必须实现：

64卦完整数据库。

每卦包含：

* 卦名
* 卦象
* 卦辞
* 彖传
* 象传
* 六爻爻辞
* 白话翻译
* 现代解读

---

额外内容：

历史案例

企业案例

人生案例

现代应用

例如：

乾卦

案例：

任正非

马云

曾国藩

刘邦

分析其符合乾卦精神的原因。

---

# 第四馆：人生智慧馆

目标：

让用户发现易经与现实生活相关。

分类：

职场

创业

投资

领导力

家庭

婚姻

成长

情绪管理

决策思维

---

每个主题推荐相关卦象。

采用卡片浏览模式。

---

# 第五馆：今日一卦

每日自动随机。

展示：

卦名

一句话智慧

今日建议

宜

忌

现代启示

---

支持：

分享图片

生成海报

---

# 第六馆：易经实验室

重点打造。

包含：

## 变卦模拟器

点击任意爻。

实时生成：

本卦

变卦

变化解释

---

## 互卦生成器

---

## 错卦生成器

---

## 综卦生成器

---

## 卦象关系图谱

知识网络图

支持缩放。

---

# AI国学导师

用户输入问题。

例如：

我是否应该换工作？

AI不得：

预测未来

保证结果

替用户决策

---

AI应该：

推荐相关卦象

解释哲学思想

提供决策参考

给出学习建议

---

定位：

智慧顾问

不是算命先生

---

# 学习系统

设计成长体系。

等级：

易学新人

阴阳学徒

八卦学徒

六十四卦学者

象数研究员

易学导师

---

成就系统：

完成八卦学习

完成64卦学习

连续学习7天

完成100次推演

---

# 风水模块

允许存在。

但必须放入：

传统文化扩展区

内容：

河图

洛书

九宫

八宅

飞星

风水历史

文化背景

---

禁止：

风水发财秘籍

风水改运秘籍

快速暴富

玄学营销

---

# 算命内容规范

禁止：

预测寿命

预测疾病

预测投资收益

预测婚姻结果

预测彩票

预测未来

---

允许：

易经决策推演

人生启发

哲学思考

文化研究

历史案例分析

---

# 技术栈

优先：

Next.js

TypeScript

TailwindCSS

Shadcn UI

Framer Motion

D3.js

ECharts

React Query

Zustand

---

# 数据结构

采用：

/data

目录管理。

数据分离。

禁止硬编码。

---

# 开发原则

每次开发：

先设计

再编码

先组件化

再页面化

优先可维护性

优先用户体验

优先视觉品质

避免代码重复

保持模块解耦

所有功能必须支持移动端。

---

# Claude Code执行原则

每次开始开发前：

1. 先分析现有项目结构
2. 制定实施计划
3. 拆分任务
4. 分步骤提交修改
5. 保持代码整洁
6. 保证TypeScript类型完整
7. 所有组件可复用
8. 所有页面响应式适配
9. 保持高质量UI设计
10. 不允许为了实现功能而牺牲视觉品质

---

# Skill 调度规则

## 何时调用 Skill

按任务类型匹配对应 Skill（通过 `/skill-name` 或 Skill 工具调用）：

### 内容生成类

| 任务 | 调用 Skill | 说明 |
|------|-----------|------|
| 卦辞解读、历史案例、现代应用 | `iching-content-generator` | 64卦深度内容，须遵循 Story First 原则 |
| 博客文章、学习模块文档 | `markdown-content-generator` | 结构化 markdown，含 SEO 元数据 |
| 网站文案、页面标题、CTA | `content-and-copy` | SEO 友好的文案写作 |
| 内容策略、编辑日历 | `content-strategy` | 内容矩阵规划 |

### 视觉与设计类

| 任务 | 调用 Skill | 说明 |
|------|-----------|------|
| TailwindCSS 样式、设计 Token | `tailwind-master` | 宋韵美学，禁止硬编码颜色值 |
| shadcn/ui 组件开发 | `shadcn-ui-builder` | 博物馆设计系统集成 |
| 动画实现（Framer Motion / CSS） | `motion-animation` | 缓慢优雅风格，duration 500ms+ |
| 品牌视觉、Logo、VI 系统 | `ckm:brand` | 品牌一致性审查 |
| 设计系统 Token 架构 | `ckm:design-system` | 三级 Token 体系 |
| 幻灯片/演示文稿 | `ckm:slides` | 战略级 HTML 演示 |
| Banner / 社交媒体素材 | `ckm:banner-design` | 22种风格可选 |
| UI/UX 模式与交互设计 | `ui-ux-pro-max` | 高级 UI 设计模式 |

### 可视化类

| 任务 | 调用 Skill | 说明 |
|------|-----------|------|
| D3.js 知识图谱、网络图 | `d3-knowledge-graph` | 卦象关系网络、八卦图、Sankey流图 |
| 数据图表、趋势图 | `mviz` | 统计图表（折线、柱状、雷达图） |

### SEO 与发布类

| 任务 | 调用 Skill | 说明 |
|------|-----------|------|
| 关键词研究 | `seo-keyword` | 搜索意图分类 |
| 页面级 SEO 优化 | `seo-onpage` | title/meta/结构优化 |
| 技术 SEO 审计 | `seo-technical` | Core Web Vitals, schema |
| 全站健康审计 | `seo-site-health-audit` | 抓取、索引、可访问性 |
| 竞品分析 | `seo-competitor` | 内容缺口分析 |
| 流量诊断 | `seo-traffic-diagnosis` | GA/GSC 数据解读 |
| 内容审计 | `seo-content-audit` | 内容质量与去重 |
| AEO/GEO 优化 | `seo-aeo-geo` | AI 引擎优化、LLMs.txt |
| 程序化 SEO | `programmatic-seo` | 规模化页面生成 |

### 知识库类

| 任务 | 调用 Skill | 说明 |
|------|-----------|------|
| 卦象检索、语义搜索 | `rag-knowledge-base` | 混合检索（向量+关键词），支持情境匹配 |
| 知识库索引构建 | `rag-knowledge-base` | 文件级索引（无服务器方案） |

---

# Agent 调度规则

## 何时用 Agent

当任务涉及 **多文件修改、独立决策、需要隔离上下文** 时，使用 Agent 工具调度专业 Agent。

项目自定义 Agent 位于 `.claude/agents/` 目录：

| Agent | 触发场景 | 典型任务 |
|-------|---------|---------|
| `ui-designer` | 设计任何视觉组件、评估配色/间距/排版 | 创建页面布局、审查 UI、CSS 重构 |
| `frontend-architect` | 涉及 3+ 文件的技术架构决策 | 设计路由、组件拆分、状态管理方案 |
| `content-curator` | 撰写/审查文本内容、设计学习路径 | 卦辞白话翻译、案例研究、多语言内容 |
| `data-engineer` | 数据文件处理、CSV 脚本、构建流程 | 修改 hexagram schema、新增数据源、编码修复 |
| `visualization-expert` | D3.js/ECharts 图表、交互动画 | 卦象关系图、八卦地图、时间轴可视化 |
| `ai-tutor-designer` | AI 导师对话流、Prompt 设计 | 推荐算法、伦理边界设定、对话模板 |

### 调度原则

1. **Agent 任务描述必须自包含** — 包含源文件路径、行号范围、输出格式、约束条件、验收标准
2. **独立任务可并行** — 互不依赖的 Agent 任务同时启动（如同时翻译多语言）
3. **验证 Agent 产出** — Agent 完成后检查实际文件变更，不盲目信任摘要
4. **Agent 不替代 Skill** — 单文件简单操作直接使用 Skill，多文件复杂决策使用 Agent

### Agent 与 Skill 的选用决策

```
单文件样式调整     → tailwind-master (Skill)
整站视觉改版       → ui-designer (Agent) + tailwind-master (Skill)

单卦内容编写       → iching-content-generator (Skill)
全64卦案例重构     → content-curator (Agent) + iching-content-generator (Skill)

单图D3.js实现      → d3-knowledge-graph (Skill)
六馆全部可视化     → visualization-expert (Agent) + d3-knowledge-graph (Skill)

组件代码生成       → shadcn-ui-builder (Skill)
博物馆架构重构     → frontend-architect (Agent) + shadcn-ui-builder (Skill)
```

---

# 项目配置文件

- `.claude/settings.json` — 项目级权限、hooks、Agent 注册
- `.claude/settings.local.json` — 本地权限覆盖（不提交 Git）
- `.claude/agents/` — 6 个自定义 Agent 定义
- `skills-lock.json` — 已安装 Skill 锁定版本
- `.gitignore` — Git 忽略规则
