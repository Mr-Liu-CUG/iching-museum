---
name: d3-knowledge-graph
description: Generate interactive D3.js knowledge graphs and network visualizations for the I Ching Digital Museum — hexagram relationship networks, Bagua maps, philosophical concept graphs, and historical lineage diagrams. Trigger when the user asks for knowledge graphs, network diagrams, relationship visualizations, force-directed graphs, or D3.js interactive charts.
---

# D3.js Knowledge Graph & Network Visualization

Generate publication-quality, interactive D3.js visualizations for the I Ching Digital Museum.

## I Ching Visualization Types

### 1. Hexagram Relationship Network (Force-Directed Graph)
- Nodes: 64 hexagrams
- Edges: cuo (错卦), zong (综卦), hu (互卦) relationships
- Node size: based on number of relationships (degree centrality)
- Node color: by palace (乾宫/坤宫/etc.) or by element (金木水火土)
- Interaction: drag nodes, hover for details, click to navigate

### 2. Bagua Interactive Map (Radial/Sunburst)
- Center: Taiji (太极)
- Ring 1: Yin-Yang (两仪)
- Ring 2: Four Images (四象)
- Ring 3: Eight Trigrams (八卦) with element/direction/meaning
- Interaction: click to expand, rotate

### 3. Philosophical Concept Graph
- Nodes: key I Ching concepts (阴阳, 刚柔, 变化, 时位, 中正)
- Edges: conceptual relationships (opposes, complements, derives-from, applies-to)
- Clustered by theme: cosmology, ethics, divination, strategy

### 4. Historical Lineage Tree (Hierarchical)
- Root: Fuxi (伏羲)
- Branches: King Wen → Confucius → Wang Bi → Shao Yong → Zhu Xi → Modern scholars
- Leaves: key works and contributions
- Layout: top-down tree or left-right timeline

### 5. Hexagram Change Simulator (Sankey/Flow)
- Source: original hexagram
- Target: transformed hexagram after yao change
- Flow thickness: probability/frequency of specific yao changes
- Interaction: click a yao to see the transformation

## Technical Standards

### D3.js Version
- Use D3.js v7.x (latest stable)
- Prefer ES module imports: `import * as d3 from "d3"`

### Output Format
- **Standalone HTML file** — self-contained with inline CSS and JS
- No external dependencies except D3 CDN
- Works in `file://` protocol (no fetch required)
- The `<script>` tag loads D3 from CDN: `<script src="https://d3js.org/d3.v7.min.js"></script>`

### Code Structure
```html
<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Chart Title]</title>
  <style>
    /* Song Dynasty aesthetic */
    :root {
      --bg: #f5f1e8;
      --gold: #b08d57;
      --ink: #2c2c2c;
      --red: #8a2b2b;
    }
    body { background: var(--bg); font-family: 'Noto Serif SC', serif; }
    /* ... */
  </style>
</head>
<body>
  <svg id="viz"></svg>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script>
    // D3 visualization code
  </script>
</body>
</html>
```

### Interaction Standards
- Tooltips on hover with hexagram name and key info
- Click to navigate (if in museum context)
- Smooth transitions (duration: 750-1000ms)
- Zoom and pan for large graphs (d3.zoom)
- Responsive SVG (viewBox, resize listener)

### Accessibility
- Keyboard navigable nodes (tabindex, arrow keys)
- Screen reader labels (aria-label on interactive elements)
- Color-blind safe palette (supplement color with shape/pattern)
- `prefers-reduced-motion` respected

## Design Constraints
- **Song Dynasty aesthetic** — use the project color palette (#b08d57 gold, #f5f1e8 paper, #2c2c2c ink)
- **Elegant, not flashy** — subtle animations, no neon or cyberpunk effects
- **Chinese typography** — Noto Serif SC for labels, fallback to system serif
- **Clean and spacious** — generous padding, clear hierarchy
- **8×8 matrix** and **radial layouts** are the preferred spatial metaphors for I Ching

## Data Integration
- Read hexagram data from `data/hexagrams-data.js` or `data/zhouyi-enriched.json`
- For static HTML output, inline a minimal JSON dataset (name, binary, kingWen, palace, relations)
- Use hexagram Unicode symbols (䷀ ䷁ etc.) when space is tight
