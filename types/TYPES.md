# types/ Directory

> TypeScript type definitions and constants

---

## Purpose

Centralized TypeScript types, interfaces, and constants for the entire application. Single source of truth for data structures.

---

## Contents

| Export | Category | Description |
|--------|----------|-------------|
| `UserProfile` | Interface | User account data |
| `Episode` | Interface | Generated episode data |
| `Epoch` | Interface | Historical time period (Ancient/Revolutionary) |
| `Empire` | Interface | Civilization within an epoch |
| `KeyFigure` | Interface | Historical person |
| `KeyMoment` | Interface | Historical event |
| `Perspective` | Interface | First-person viewpoint |
| `ContentType` | Type | `'overview' \| 'figure' \| 'moment' \| 'perspective'` |
| `EpochId` | Type | `'ancient-world' \| 'revolutionary-period'` |
| `EmpireId` | Type | Union of all empire IDs |
| `EPOCHS` | Constant | Array of epoch definitions |
| `EMPIRES` | Constant | Array of empire definitions |
| `DURATIONS` | Constant | Episode duration options |

---

## Rules & Constraints

### MUST

- Export all types from `index.ts`
- Use strict TypeScript (no `any`)
- Document complex types with JSDoc
- Keep types in sync with Firestore schema

### MUST NOT

- Include runtime logic (types only, constants OK)
- Import from other directories (types are foundational)
- Use `any` type (use `unknown` if needed)
- Create circular dependencies

---

## What Belongs Here

- TypeScript interfaces and types
- Type unions and aliases
- Constant arrays used for type inference
- Utility types

## What Does NOT Belong Here

- React components
- Functions with logic
- API response handlers
- Firebase operations

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Interfaces | PascalCase | `UserProfile`, `Episode` |
| Type aliases | PascalCase | `ContentType`, `EmpireId` |
| Constants | SCREAMING_SNAKE | `EPOCHS`, `DURATIONS` |
| Enums | PascalCase | `Status` (if used) |

---

## Key Types Reference

### User & Auth

```typescript
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Episodes

```typescript
interface Episode {
  id: string;
  userId: string;
  epoch: EpochId;
  empire: EmpireId;
  contentType: ContentType;
  contentId?: string;           // ID of figure/moment/perspective
  durationMinutes: number;      // 5, 10, or 15
  title: string;
  content: string;              // Generated text
  audioUrl: string | null;      // Firebase Storage URL
  audioDurationSeconds: number | null;
  createdAt: Date;
  timePeriod?: string;          // Legacy field for migration
}

type ContentType = 'overview' | 'figure' | 'moment' | 'perspective';
```

### Historical Data

```typescript
type EpochId = 'ancient-world' | 'revolutionary-period';

interface Epoch {
  id: EpochId;
  name: string;
  years: string;              // e.g., "3100 BCE – 476 CE"
  description: string;
  color: string;              // Tailwind color class
}

type EmpireId =
  | 'egypt' | 'persian' | 'greece' | 'rome'        // Ancient
  | 'british' | 'french' | 'spanish' | 'qing' | 'united-states'; // Revolutionary

interface Empire {
  id: EmpireId;
  epochId: EpochId;
  name: string;
  emoji: string;              // e.g., "🏛️"
  years: string;
  color: string;              // Theme color
  description: string;
  keyThemes: string[];
  mapRegion?: {
    path: string;             // SVG path data
    viewBox: string;
  };
}
```

### Content Types

```typescript
interface KeyFigure {
  id: string;
  name: string;
  empire: EmpireId;
  title: string;              // e.g., "Last Pharaoh of Egypt"
  years: string;              // e.g., "69 BCE - 30 BCE"
  description: string;
  significance: string;
  tags: string[];
}

interface KeyMoment {
  id: string;
  name: string;
  empire: EmpireId;
  year: string;               // e.g., "44 BCE"
  description: string;
  significance: string;
  tags: string[];
}

interface Perspective {
  id: string;
  name: string;               // e.g., "A Roman Legionary"
  empire: EmpireId;
  archetype: string;          // e.g., "soldier", "merchant"
  description: string;
  tags: string[];
}
```

### Constants

```typescript
const EPOCHS: Epoch[] = [
  {
    id: 'ancient-world',
    name: 'Ancient World',
    years: '3100 BCE – 476 CE',
    description: 'From the first civilizations to the fall of Rome',
    color: 'ancient',
  },
  {
    id: 'revolutionary-period',
    name: 'Revolutionary Period',
    years: '1600 – 1912',
    description: 'Age of empires, revolutions, and transformation',
    color: 'revolutionary',
  },
];

const EMPIRES: Empire[] = [
  {
    id: 'egypt',
    epochId: 'ancient-world',
    name: 'Ancient Egypt',
    emoji: '🏛️',
    years: '3100 BCE - 30 BCE',
    color: 'ancient',
    description: 'Land of pharaohs, pyramids, and the Nile',
    keyThemes: ['monarchy', 'religion', 'architecture'],
  },
  // ... 8 more empires
];

const DURATIONS = [
  { minutes: 5, label: '5 min', description: 'Quick hit' },
  { minutes: 10, label: '10 min', description: 'Coffee break' },
  { minutes: 15, label: '15 min', description: 'Deep dive' },
] as const;
```

### Helper Types

```typescript
// Extract duration values
type DurationMinutes = typeof DURATIONS[number]['minutes']; // 5 | 10 | 15

// Empire lookup helpers
function getEmpireById(id: EmpireId): Empire | undefined {
  return EMPIRES.find(e => e.id === id);
}

function getEmpiresByEpoch(epochId: EpochId): Empire[] {
  return EMPIRES.filter(e => e.epochId === epochId);
}

function getEpochById(id: EpochId): Epoch | undefined {
  return EPOCHS.find(e => e.id === id);
}
```

---

## Code Patterns

### Import Types

```typescript
// In components/API routes
import type { Episode, Empire, KeyFigure } from '@/types';
import { EPOCHS, EMPIRES, DURATIONS } from '@/types';
```

### Type Guards

```typescript
function isValidEmpireId(id: string): id is EmpireId {
  return EMPIRES.some(e => e.id === id);
}

function isValidContentType(type: string): type is ContentType {
  return ['overview', 'figure', 'moment', 'perspective'].includes(type);
}
```

### Generic Component Props

```typescript
interface CardProps<T> {
  item: T;
  onClick?: (item: T) => void;
  selected?: boolean;
}

function Card<T extends { id: string; name: string }>({
  item,
  onClick,
  selected,
}: CardProps<T>) {
  // ...
}
```

---

## Gotchas

1. **`as const` for Constants**: Use `as const` on DURATIONS to preserve literal types:
   ```typescript
   const DURATIONS = [...] as const;
   ```

2. **Legacy `timePeriod`**: Old episodes have `timePeriod` string instead of `empire`/`epoch`. Check for both when loading.

3. **Date vs Timestamp**: Firestore returns `Timestamp`. Convert with `.toDate()`:
   ```typescript
   createdAt: doc.data().createdAt?.toDate()
   ```

4. **Optional Fields**: `contentId` and `audioUrl` can be null/undefined. Always check before using.

5. **Empire Colors**: Colors reference Tailwind theme (e.g., `'ancient'`). Map to actual classes:
   ```typescript
   className={`bg-${empire.color}`} // ❌ Won't work (dynamic)
   className="bg-ancient"           // ✓ Works (static)
   ```

6. **Circular Imports**: Types file should not import from other project files. Keep it foundational.

---

## Related Documentation

- [LIB.md](../lib/LIB.md) — Seed data uses these types
- [API.md](../app/api/API.md) — Request/response shapes
- [COMPONENTS.md](../app/components/COMPONENTS.md) — Component props
