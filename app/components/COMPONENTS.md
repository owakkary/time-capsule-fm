# app/components/ Directory

> Reusable React components

---

## Purpose

Shared UI components used across multiple pages. All components follow the vintage "antiquarian" design system.

---

## Contents

| Component | Props | Description |
|-----------|-------|-------------|
| `EpisodeGenerator.tsx` | `onEpisodeGenerated(id)` | Main generation orchestrator |
| `EmpireSelector.tsx` | `onSelectEmpire(id)` | Two-level epoch→empire picker |
| `EraSelector.tsx` | `onSelectEra(id)` | Legacy era selector (deprecated) |
| `DurationSelector.tsx` | `selected`, `onSelect(min)` | Episode duration picker |
| `EmpireCard.tsx` | `empire`, `onClick` | Empire display card |
| `EpochCard.tsx` | `epoch`, `onClick` | Epoch display card |
| `FigureCard.tsx` | `figure`, `onClick?` | Historical figure with favorites |
| `MomentCard.tsx` | `moment`, `onClick?` | Historical moment card |
| `PerspectiveCard.tsx` | `perspective`, `onClick?` | First-person perspective |
| `HistoricalMap.tsx` | `empireId` | Static map display |
| `InteractiveMap.tsx` | `onSelectRegion(id)` | Clickable SVG regions |

---

## Rules & Constraints

### MUST

- Add `'use client'` directive (all components use hooks/state)
- Use design tokens: `parchment`, `brass`, `sepia`, `ink`
- Include `animate-fade-in-up` for entry animations
- Use TypeScript with explicit prop types
- Handle loading and error states

### MUST NOT

- Import Firebase Admin SDK (client-side only)
- Use hardcoded colors (use Tailwind theme)
- Fetch data directly—accept via props
- Skip accessibility (use semantic HTML, ARIA when needed)

---

## What Belongs Here

- Reusable UI components
- Components used on 2+ pages
- Interactive widgets

## What Does NOT Belong Here

- Page-specific components → keep in page folder
- Layout components → `app/layout.tsx`
- Utility functions → `lib/`
- Custom hooks → `hooks/`

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| File | PascalCase | `EpisodeGenerator.tsx` |
| Component | PascalCase | `export default function EpisodeGenerator` |
| Props interface | `{Name}Props` | `interface EpisodeGeneratorProps` |

---

## Code Patterns

### Basic Component Template

```typescript
'use client';

import { useState } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: (value: string) => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="bg-parchment-dark rounded-lg p-6 shadow-antiquarian animate-fade-in-up">
      <h2 className="font-display text-2xl text-ink mb-4">{title}</h2>
      <button
        onClick={() => onAction?.('clicked')}
        className="bg-brass text-ink px-4 py-2 rounded hover:bg-brass-light transition-colors"
      >
        Click me
      </button>
    </div>
  );
}
```

### Card Component Pattern

```typescript
'use client';

import Link from 'next/link';
import type { KeyFigure } from '@/types';

interface FigureCardProps {
  figure: KeyFigure;
  onClick?: () => void;
}

export default function FigureCard({ figure, onClick }: FigureCardProps) {
  const content = (
    <div className="bg-parchment-dark rounded-lg p-4 shadow-antiquarian hover:shadow-antiquarian-hover transition-shadow cursor-pointer">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-brass flex items-center justify-center mb-3">
        <span className="text-ink font-display text-xl">
          {figure.name.charAt(0)}
        </span>
      </div>

      {/* Content */}
      <h3 className="font-display text-lg text-ink">{figure.name}</h3>
      <p className="text-sepia text-sm">{figure.title}</p>
      <p className="text-sepia-light text-xs mt-1">{figure.years}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {figure.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs bg-parchment px-2 py-0.5 rounded text-sepia">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link href={`/figure/${figure.id}`}>{content}</Link>;
}
```

### Selector Pattern

```typescript
'use client';

import { DURATIONS } from '@/types';

interface DurationSelectorProps {
  selected: number | null;
  onSelect: (minutes: number) => void;
}

export default function DurationSelector({ selected, onSelect }: DurationSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {DURATIONS.map((duration, index) => (
        <button
          key={duration.minutes}
          onClick={() => onSelect(duration.minutes)}
          className={`
            p-4 rounded-lg border-2 transition-all
            animate-fade-in-up
            ${selected === duration.minutes
              ? 'border-brass bg-brass/10'
              : 'border-transparent bg-parchment-dark hover:border-brass/50'
            }
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="font-display text-2xl text-ink">{duration.label}</div>
          <div className="text-sepia text-sm">{duration.description}</div>
        </button>
      ))}
    </div>
  );
}
```

### Component with Loading State

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const LOADING_FACTS = [
  "Cleopatra lived closer to the Moon landing than to the building of the Great Pyramid.",
  "Oxford University is older than the Aztec Empire.",
  // ...
];

export default function EpisodeGenerator({ onEpisodeGenerated }) {
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  // Rotate facts during loading
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setFactIndex(i => (i + 1) % LOADING_FACTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin-slow w-12 h-12 border-4 border-brass border-t-transparent rounded-full mx-auto" />
        <p className="text-sepia mt-4 animate-fade-in-up">
          {LOADING_FACTS[factIndex]}
        </p>
      </div>
    );
  }

  // ... rest of component
}
```

---

## Styling Reference

### Standard Classes

```css
/* Card container */
bg-parchment-dark rounded-lg p-4 shadow-antiquarian

/* Card hover */
hover:shadow-antiquarian-hover transition-shadow

/* Heading */
font-display text-xl text-ink

/* Body text */
text-sepia text-sm

/* Secondary text */
text-sepia-light text-xs

/* Button primary */
bg-brass text-ink px-4 py-2 rounded hover:bg-brass-light

/* Button secondary */
border border-brass text-brass px-4 py-2 rounded hover:bg-brass/10

/* Tag/badge */
text-xs bg-parchment px-2 py-0.5 rounded text-sepia

/* Grid layouts */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4

/* Animation */
animate-fade-in-up
```

### Animation Stagger

```tsx
{items.map((item, index) => (
  <div
    key={item.id}
    className="animate-fade-in-up"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* content */}
  </div>
))}
```

---

## Gotchas

1. **Missing `'use client'`**: All components here use hooks. Forgetting the directive causes hydration errors.

2. **Animation Stagger**: Use inline `style={{ animationDelay }}` for staggered animations. CSS-only approach doesn't work well with dynamic lists.

3. **Favorites Hook**: `useFavorites()` only works after auth. Check `user` exists before calling.

4. **Link vs onClick**: If component has both, clicking triggers both. Use one or the other:
   ```tsx
   // Bad - double navigation
   <Link href="/x" onClick={handleClick}>

   // Good - conditional
   if (onClick) return <div onClick={onClick}>{content}</div>;
   return <Link href={href}>{content}</Link>;
   ```

5. **SVG Maps**: `InteractiveMap` uses inline SVG paths. Large file size. Consider lazy loading.

---

## Related Documentation

- [HOOKS.md](../../hooks/HOOKS.md) — useAuth, useFavorites
- [TYPES.md](../../types/TYPES.md) — Component prop types
- [TIMECAPSULE.md](../../TIMECAPSULE.md) — Design system
