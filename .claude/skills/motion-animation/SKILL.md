---
name: motion-animation
description: Design and implement elegant animations for the I Ching Digital Museum using Framer Motion, GSAP, and CSS animations. Trigger when the user asks for animations, page transitions, scroll effects, micro-interactions, or motion design.
---

# Motion & Animation

Create slow, graceful animations that embody Song Dynasty aesthetics — scroll-driven reveals, yao line transformations, hexagram transitions, and breathing ink-wash effects.

## Animation Philosophy

**Core principle**: Motion should feel like turning pages of an ancient book, not clicking through a modern app.

| Quality | Implementation |
|---------|---------------|
| **Slow** | Durations 500ms–1200ms (not 200ms) |
| **Graceful** | Ease-out curves, no bounce unless intentional |
| **Natural** | Spring physics, not linear interpolation |
| **Restrained** | One animation at a time, staggered reveals |

## Animation Catalog

### 1. Page Entrance — "Scroll Unfolding"
```tsx
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
>
  {content}
</motion.div>
```

### 2. Hexagram Change — "Yao Flip"
```css
/* CSS — yin/yang transformation */
.yao-line {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.6s ease;
}
.yao-line.flipping {
  transform: scaleX(0.4);
  background-color: var(--gold-pale);
}
```

### 3. Staggered Card Reveal
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {cards.map(card => (
    <motion.div key={card.id} variants={item}>{card.content}</motion.div>
  ))}
</motion.div>
```

### 4. Ink Wash Background Breathing
```css
.ink-bg {
  animation: inkBreathe 8s ease-in-out infinite;
}
@keyframes inkBreathe {
  0%, 100% { opacity: 0.03; transform: scale(1); }
  50% { opacity: 0.06; transform: scale(1.02); }
}
```

### 5. Gold Border Drawing (SVG)
```css
.gold-border-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawBorder 2s ease-out forwards;
}
@keyframes drawBorder {
  to { stroke-dashoffset: 0; }
}
```

### 6. Yao Line Ripple Effect
```css
.yao-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(176, 141, 87, 0.3);
  animation: ripple 0.6s ease-out forwards;
}
@keyframes ripple {
  from { width: 0; height: 0; opacity: 0.6; }
  to { width: 200px; height: 200px; opacity: 0; }
}
```

### 7. Scroll-Triggered Timeline
```tsx
// GSAP + ScrollTrigger
gsap.fromTo(".timeline-item",
  { opacity: 0, x: -30 },
  {
    opacity: 1, x: 0,
    duration: 0.8,
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".timeline-container",
      start: "top 80%",
    }
  }
);
```

### 8. Hexagram Matrix Hover
```css
.matrix-cell {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
}
.matrix-cell:hover {
  transform: scale(1.08);
  box-shadow: 0 0 0 2px var(--gold-primary), 0 8px 24px rgba(176, 141, 87, 0.15);
}
```

## Easing Curves

```css
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);     /* Button hover, scale */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);       /* Page entrance */
--ease-out-quint: cubic-bezier(0.22, 0.61, 0.36, 1);   /* Fade in */
--ease-ink: cubic-bezier(0.4, 0, 0.2, 1);              /* Subtle movement */
```

## Duration Scale
| Context | Duration |
|---------|----------|
| Micro-interaction (hover, click) | 150–200ms |
| Element transition (toggle, switch) | 300–400ms |
| Card/panel entrance | 500–800ms |
| Page/section reveal | 800–1200ms |
| Ambient/background | 6000–10000ms |

## Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Forbidden
- Flash/blink effects
- Continuous spin/rotate animations
- Aggressive parallax (subtle only)
- More than 2 simultaneous animations on screen
- Any animation faster than 100ms
- Neon glow, cyberpunk, particle explosions
