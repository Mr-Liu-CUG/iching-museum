---
name: rag-knowledge-base
description: Manage the I Ching knowledge base with hybrid search (vector + keyword), structured content indexing, and semantic retrieval. Trigger when the user asks to search knowledge, index content, find relevant hexagrams, query the I Ching database, or set up retrieval-augmented generation pipelines.
---

# RAG Knowledge Base for I Ching Digital Museum

Build and query a structured knowledge base of I Ching content — hexagram data, classical texts, modern interpretations, case studies, and philosophical concepts.

## Knowledge Base Architecture

### Content Sources
```
data/
├── hexagrams-data.js       ← 64 hexagrams, 30+ fields each
├── zhouyi-enriched.json    ← Enriched structured data
├── content-en.js           ← English translations
├── content-ja.js           ← Japanese translations
└── 易经入门_utf8.csv        ← I Ching introduction data
```

### Indexing Strategy
1. **Structural fields** (exact match): binary, kingWen, palace, element, direction, trigrams
2. **Semantic fields** (vector search): guaci, tuan, xiang, yaoci explanations, modern interpretations
3. **Keyword fields** (BM25/full-text): names, pinyin, Chinese text content

## Query Patterns

### 1. Hexagram Lookup
```
Input: "乾卦" or "qian" or "111111" or "第1卦"
Output: Full hexagram data with all fields
```

### 2. Concept Search
```
Input: "leadership during crisis"
Output: Relevant hexagrams ranked by semantic similarity, with explanations
Method: Vector similarity on modern interpretation fields
```

### 3. Cross-Reference
```
Input: hexagram binary "111111"
Output: cuo卦(000000), zong卦(111111), hu卦(...), related by element, related by palace
```

### 4. Life Situation Matching
```
Input: "I'm considering a career change but feel uncertain"
Output: Top-3 relevant hexagrams with tailored explanations
Method: Semantic matching + pre-defined category mapping
```

## Retrieval Implementation

### Option A: File-Based (No Server Required)
For `file://` protocol compatibility:
- Load `hexagrams-data.js` into memory
- Build inverted index for keyword search (name, pinyin, trigrams)
- Use simple TF-IDF or Jaccard similarity for text matching
- Store pre-computed relationship maps

```javascript
// In-memory search index (from hexagrams-data.js)
class IChingIndex {
  constructor() {
    this.byKingWen = {};    // 1-64 → data
    this.byBinary = {};     // "111111" → data
    this.byName = {};       // "乾为天" → data
    this.byTrigram = {};    // "乾" → [hexagrams]
    this.byPalace = {};     // "乾宫" → [hexagrams]
    this.byElement = {};    // "金" → [hexagrams]
  }
  search(query) { /* keyword + semantic matching */ }
  getRelations(binary) { /* cuo, zong, hu, bian */ }
  recommend(situation) { /* situation → hexagram mapping */ }
}
```

### Option B: External Vector DB (Server Required)
For full RAG capabilities:
- **Pinecone**: managed vector DB with `claude plugin install pinecone`
- **ccrag**: local RAG with tree-sitter chunking + LanceDB (`pip install ccrag`)
- **memory-search**: hybrid search (vector 70% + BM25 30%) (`bunx skills add rjyo/memory-search`)

## Content Chunking Strategy

For vector-based retrieval, chunk hexagram content by:
1. **Hexagram-level**: guaci + tuan + xiang as one chunk
2. **Yao-level**: each yao's text + explanation as separate chunks
3. **Interpretation-level**: each school's interpretation as separate chunks
4. **Topic-level**: modern interpretations chunked by dimension (career/wealth/love/health/interpersonal)

## AI Tutor Integration

The knowledge base powers the AI I Ching Tutor:
1. User describes situation → vector search finds top-3 matching hexagrams
2. Retrieve full hexagram data for those matches
3. AI synthesizes a personalized response using hexagram wisdom
4. AI recommends further exploration paths

## Query Examples for Testing

```javascript
// Hexagram by name
IChingIndex.search("乾")  → [{binary: "111111", name: "乾为天", ...}]

// Hexagrams by trigram combination
IChingIndex.search("天风")  → [{name: "天风姤", binary: "111110", ...}]

// Hexagrams by element
IChingIndex.byElement["金"]  → [乾, 兑, 天风姤, 泽天夬, ...]

// Concept search
IChingIndex.search("leadership perseverance")  → top matches by semantic relevance

// Get all relations for a hexagram
IChingIndex.getRelations("111111")
// → { cuo: "坤为地", zong: "乾为天", hu: "乾为天", bians: [...] }
```
