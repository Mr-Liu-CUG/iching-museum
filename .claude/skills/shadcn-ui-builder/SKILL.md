---
name: shadcn-ui-builder
description: Build UI components with shadcn/ui + Radix UI + TailwindCSS for the I Ching Digital Museum. Trigger when the user asks to create UI components, build shadcn/ui elements, or implement component-based interfaces.
---

# Shadcn UI Builder

Build production-quality UI components using shadcn/ui for the I Ching Digital Museum.

## Project Stack
- **Framework**: Next.js + TypeScript
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui (Radix UI primitives)
- **Animation**: Framer Motion

## shadcn/ui Component Catalog

Prioritize these components for the museum:

### Layout
- `Card`, `CardHeader`, `CardContent`, `CardFooter` — hexagram detail cards
- `Sheet` — mobile slide-out navigation
- `Dialog` — hexagram deep-dive modals
- `Accordion` — yao line expandable sections
- `Tabs` — school interpretations switcher
- `ScrollArea` — long classical text scroll zones

### Navigation
- `NavigationMenu` — main site navigation
- `Breadcrumb` — learning path breadcrumbs
- `Pagination` — hexagram browsing

### Data Display
- `Table` — hexagram comparison tables
- `Badge` — palace/element labels
- `Tooltip` — term explanations on hover
- `HoverCard` — hexagram preview on hover

### Forms
- `Input` — search hexagrams
- `Select` — palace/element filters
- `Slider` — hexagram sequence navigation
- `Toggle` / `ToggleGroup` — yin/yang, language switches

### Feedback
- `Skeleton` — loading states for hexagram content
- `Toast` / `Sonner` — action confirmations
- `Progress` — learning path completion

## Component Patterns

### Hexagram Card
```tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HexagramCardProps {
  name: string
  symbol: string
  kingWen: number
  palace: string
  element: string
}

export function HexagramCard({ name, symbol, kingWen, palace, element }: HexagramCardProps) {
  return (
    <Card className="border-gold/20 bg-paper">
      <CardHeader>
        <span className="text-4xl">{symbol}</span>
        <h3 className="text-ink font-serif">{name}</h3>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">{palace}</Badge>
        <Badge variant="outline">{element}</Badge>
      </CardContent>
    </Card>
  )
}
```

## Design System Integration

### Tailwind Config Extensions
```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      gold: {
        primary: '#b08d57',
        pale: '#e8dcc8',
        bright: '#d4af37',
      },
      ink: {
        dark: '#2c2c2c',
        muted: '#6a655c',
      },
      paper: '#f5f1e8',
      red: { palace: '#8a2b2b' },
    },
    fontFamily: {
      serif: ['Noto Serif SC', 'serif'],
      sans: ['Noto Sans SC', 'sans-serif'],
    },
  },
}
```

## Quality Standards
- Fully typed with TypeScript (no `any`)
- Responsive — test at 375px, 768px, 1024px, 1440px
- Accessible — keyboard navigation, screen reader labels, ARIA attributes
- Dark mode compatible (future)
- Animation — subtle, Song Dynasty elegant (150-300ms transitions)
- No generic AI aesthetic — avoid default shadcn look, apply museum design tokens

## shadcn CLI Commands
```bash
npx shadcn@latest add button card dialog tabs accordion badge tooltip
npx shadcn@latest add sheet navigation-menu breadcrumb pagination
npx shadcn@latest add table hover-card select slider toggle
npx shadcn@latest add skeleton sonner progress scroll-area
```
