---
name: markdown-content-generator
description: Generate structured markdown documentation, blog posts, learning articles, and content pages for the I Ching Digital Museum. Trigger when the user asks to write docs, draft posts, generate content, create learning materials, or produce any markdown output.
---

# Markdown Content Generator

Generate clean, well-structured markdown content for the I Ching Digital Museum website.

## Project Context

- Next.js + TypeScript + TailwindCSS + Shadcn UI
- Content-driven website with educational focus
- Multi-language support: zh-CN, zh-TW, en, ja
- Design language: Song Dynasty aesthetics, ink-wash, generous whitespace

## Content Workflow

1. **Confirm requirements** — topic, audience, target length, language
2. **Create outline** — H2/H3 structure before writing
3. **Draft section by section** — review each before proceeding
4. **Add metadata** — SEO title, description, keywords, reading time
5. **Include visuals** — note where diagrams/charts should be inserted
6. **Cross-reference** — link to related hexagrams, concepts, case studies

## Document Types

### Blog Post / Article
```markdown
---
title: ""
description: ""
date: YYYY-MM-DD
author: ""
readingTime: X min
tags: []
hexagrams: []
---

## Key Takeaways
- ...
- ...

## Body
[Content with H2/H3 structure]

## Related Resources
- [links]
```

### Learning Module
```markdown
---
title: ""
module: beginner | intermediate | advanced
order: N
prerequisites: []
hexagrams: []
estimatedTime: X min
---

## Learning Objectives
- ...

## Prerequisites
- ...

## Core Content
[Structured sections]

## Knowledge Check
[3-5 review questions]

## Next Steps
[Link to next module]
```

### Hexagram Entry
```markdown
---
hexagramNumber: N
hexagramName: ""
binary: "XXXXXX"
kingWen: N
palace: ""
---

## ䷀ [Hexagram Name]

### 💡 One-Sentence Wisdom
[Core insight]

### 📜 Gua Ci (卦辞)
> [Original text]

**白话**: [Modern Chinese]

### 🔍 Analysis
[2-3 paragraphs]
```

## Writing Standards

- **Clarity over erudition** — explain classical concepts in plain language
- **Scannable structure** — use headings, lists, callouts for easy reading
- **Multilingual ready** — mark strings that need translation with `<!-- i18n -->`
- **SEO conscious** — include target keywords naturally in H2s and first paragraph
- **Mobile-first reading** — keep paragraphs under 4 sentences, use plenty of line breaks

## Forbidden
- Wall-of-text without structure
- Classical Chinese without modern paraphrase
- Jargon without explanation
- Claims of supernatural powers or fortune-telling
- Medical, legal, or financial advice
