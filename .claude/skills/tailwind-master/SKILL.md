---
name: tailwind-master
description: Master TailwindCSS v4 styling for the I Ching Digital Museum. Trigger when the user asks for Tailwind styling, CSS design, responsive layout, or custom design tokens.
---

# Tailwind Master

Apply expert-level TailwindCSS v4 styling aligned with the I Ching Digital Museum's Song Dynasty design system.

## Design Tokens

Always reference semantic tokens. Never hardcode color values.

```css
@theme {
  /* Backgrounds */
  --color-bg-paper: #f5f1e8;        /* 宣纸米白 */
  --color-bg-warm: #ede4d3;          /* 暖色底纹 */
  --color-bg-dark: #1a1814;          /* 深色背景 (dark mode) */

  /* Gold hierarchy */
  --color-gold-primary: #b08d57;     /* 故宫鎏金 */
  --color-gold-pale: #e8dcc8;        /* 淡金 — 分隔线 */
  --color-gold-bright: #d4af37;      /* 亮金 — 强调 */
  --color-gold-border: rgba(176, 141, 87, 0.25); /* 描金边框 */

  /* Ink hierarchy */
  --color-ink-dark: #2c2c2c;        /* 松烟墨 — 正文 */
  --color-ink-muted: #6a655c;        /* 淡墨 — 辅助 */
  --color-ink-light: #9a958c;        /* 更淡 — disabled */

  /* Accent */
  --color-red-palace: #8a2b2b;       /* 朱砂红 */
  --color-jade: #6b8e6b;             /* 玉绿 — positive */
  --color-bronze: #8b5a2b;           /* 青铜 — secondary */

  /* Typography */
  --font-serif: 'Noto Serif SC', 'KaiTi', 'STSong', serif;
  --font-sans: 'Noto Sans SC', 'PingFang SC', sans-serif;
  --font-jp: 'Noto Serif JP', serif;

  /* Spacing */
  --spacing-gua: 2rem;               /* 卦间距 */
  --spacing-card: 1.5rem;            /* 卡片内边距 */
  --spacing-section: 4rem;           /* 区块间距 */

  /* Borders */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-ink: 0 2px 8px rgba(44, 44, 44, 0.08);
  --shadow-card: 0 4px 24px rgba(176, 141, 87, 0.06);
}
```

## Layout Patterns

### Museum Page Layout
```html
<div class="min-h-screen bg-paper">
  <!-- Header -->
  <header class="sticky top-0 z-50 border-b border-gold-border bg-paper/95 backdrop-blur-sm">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">...</nav>
  </header>

  <!-- Hero -->
  <section class="relative overflow-hidden py-20 lg:py-32">
    <div class="mx-auto max-w-4xl text-center">...</div>
  </section>

  <!-- Content -->
  <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">...</div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-gold-border bg-ink-dark text-paper">...</footer>
</div>
```

### Hexagram Grid
```html
<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-3">
  <!-- Each cell -->
  <button class="aspect-square rounded-md border border-gold-border
                 bg-paper hover:bg-gold-pale/30 transition-colors
                 duration-200 ease-out flex flex-col items-center
                 justify-center p-1">
    <span class="text-lg sm:text-xl">䷀</span>
    <span class="text-xs text-ink-muted mt-0.5">乾</span>
  </button>
</div>
```

### Card with Gold Border
```html
<div class="rounded-lg border border-gold-border bg-paper p-6
            shadow-card hover:shadow-md transition-shadow
            duration-300 ease-out">
  <div class="flex items-center gap-3 mb-4">
    <span class="text-gold-primary" aria-hidden="true">❖</span>
    <h3 class="text-lg font-serif text-ink-dark">Title</h3>
  </div>
  <p class="text-ink-muted leading-relaxed text-justify">Content...</p>
</div>
```

## Typography Scale
```css
.text-display   { @apply text-4xl lg:text-6xl font-serif font-bold tracking-wide; }    /* Hero */
.text-heading   { @apply text-2xl lg:text-3xl font-serif font-medium; }                /* Section */
.text-subtitle  { @apply text-lg lg:text-xl font-sans text-ink-muted; }                /* Subtitle */
.text-body      { @apply text-base leading-relaxed text-ink-dark; }                    /* Body */
.text-small     { @apply text-sm text-ink-muted; }                                      /* Caption */
.text-classical { @apply text-base font-serif text-ink-dark tracking-wider; }          /* Classical Chinese */
```

## Responsive Breakpoints
| Breakpoint | Usage |
|------------|-------|
| `sm` (640px) | Mobile landscape |
| `md` (768px) | Tablet — stack panels |
| `lg` (1024px) | Desktop — side-by-side |
| `xl` (1280px) | Wide — 8-column matrix |
| `2xl` (1536px) | Max content width |

## Animation Utilities
```css
.animate-enter   { @apply opacity-0 translate-y-4; }
.animate-visible { @apply opacity-100 translate-y-0 transition-all duration-500 ease-out; }
.animate-stagger > * { @apply animate-enter; }
.animate-stagger > *:nth-child(1) { transition-delay: 0ms; }
.animate-stagger > *:nth-child(2) { transition-delay: 100ms; }
.animate-stagger > *:nth-child(3) { transition-delay: 200ms; }
```

## Forbidden Patterns
- Never use generic blue/purple gradients
- Never use Inter font (use Noto Serif SC / Noto Sans SC)
- Never use default shadcn rounded corners without adjusting to 4-8px
- Never use heavy box-shadows (>8px blur)
- Never use opacity-based overlays over gold elements
