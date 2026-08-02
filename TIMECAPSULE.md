# Time Capsule FM

> A guided audio journey through history — pre-generated chapters, zero live-generation cost

---

## Quick Reference

| Category | Details |
|----------|---------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.3 |
| **Styling** | Tailwind CSS 3.4 |
| **Auth & DB** | Firebase (Auth, Firestore, Storage) |
| **Content library** | Pre-generated once via `npm run generate-library` (Anthropic Claude Sonnet 4 + ElevenLabs) — not called at request time |
| **Fonts** | Crimson Pro (display), Source Serif 4 (body) |

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `parchment` | `#F7F3E9` / `#EDE6D6` | Background |
| `sepia` | `#5C4033` / `#8B7355` | Secondary text |
| `brass` | `#C9A959` / `#E5D4A1` | Accent, interactive |
| `burgundy` | `#722F37` / `#A64D54` | Errors, highlights |
| `ink` | `#2C1810` / `#4A3728` | Primary text |
| `ancient` | `#D4A574` / `#E8D5C4` | Ancient epoch |
| `revolutionary` | `#4A6FA5` / `#B8C9DC` | Revolutionary epoch |

### Key Classes

```css
bg-parchment text-ink         /* Default page */
text-sepia                    /* Secondary text */
bg-brass text-ink             /* Buttons, accents */
shadow-antiquarian            /* Card shadows */
animate-fade-in-up            /* Entry animations */
```

---

## Recent Updates

### 2025-01-25
- Documentation reorganization to directory-based guides

### 2025-01-23
- Interactive map component added
- Figure/Moment cards with favorites

### 2025-01-22
- Empire/Epoch data model migration
- Legacy `timePeriod` compatibility layer

### 2025-01-19
- Phase 1 Foundation complete
- Auth, episode generation, TTS working

---

## Current Roadmap

### Phase 1: Foundation & Auth (COMPLETE)
- [x] Firebase Auth (email + Google)
- [x] Firestore data model
- [x] Claude content generation
- [x] ElevenLabs TTS integration
- [x] Basic dashboard

### Phase 2: Main App Interface (IN PROGRESS)
- [x] Empire/Epoch selector
- [x] Duration selector
- [x] Episode generation flow
- [x] Figures & Moments pages
- [ ] Audio Player component
- [ ] Episode detail page polish
- [ ] Mobile responsive pass

### Phase 3: Audio Playback
- [ ] Custom audio player
- [ ] Progress persistence
- [ ] Playback speed controls
- [ ] Queue management

### Phase 4: Polish & UX
- [ ] Error boundaries
- [ ] Loading skeletons
- [ ] Offline support
- [ ] PWA manifest

---

## Architecture Overview

### Data Flow: Batch Content Generation (one-time, offline)

```
npm run generate-library
        ↓
scripts/generate-content-library.ts iterates all 189 seed-data items
        ↓
lib/content-generation.ts builds each prompt
        ↓
Claude generates script + title  →  ElevenLabs → MP3
        ↓
Upload MP3 to Storage (content-library/{itemId}.mp3)
        ↓
Write contentLibrary/{itemId} doc (public read)
```

### Data Flow: Playback (every real request, zero cost)

```
User clicks "Start Listening" on an empire/figure/moment/perspective page
        ↓
Link navigates straight to /episode/{itemId}  (itemId is deterministic, no fetch needed)
        ↓
Client reads contentLibrary/{itemId} directly (public Firestore read)
        ↓
<audio> plays audioUrl; on start/complete, useExplorerProgress awards XP
  and a listeningHistory/{userId}_{itemId} doc is upserted
```

### Domain Model

```
Epoch (ancient-world, revolutionary-period)
  └── Empire (egypt, rome, british, etc.)
        ├── KeyFigure[]
        ├── KeyMoment[]
        ├── Perspective[]
        └── Overview

ContentLibraryItem (shared, public — one per content item, pre-generated)

User
  ├── ListeningHistory[] (which contentLibrary items they've played)
  └── Favorites { figures[], moments[] }
```

### Directory Structure

```
time-capsule-fm/
├── app/              → Pages & API routes (see APP.md)
│   ├── api/          → Backend endpoints (see API.md)
│   └── components/   → React components (see COMPONENTS.md)
├── lib/              → Firebase & utilities (see LIB.md)
├── hooks/            → React hooks (see HOOKS.md)
├── types/            → TypeScript definitions (see TYPES.md)
└── firebase/         → Security rules (see FIREBASE.md)
```

---

## AI Assistant Prompts

### For Claude Code

**Start a session:**
```
Read TIMECAPSULE.md and the relevant directory .md file for context before starting.
```

**Add a new component:**
```
Create a new component in app/components/. Follow patterns in COMPONENTS.md.
Use the vintage design system: parchment bg, brass accents, animate-fade-in-up.
```

**Add an API route:**
```
Add an API route to app/api/. Follow the pattern in API.md:
1. Verify auth token
2. Parse & validate request
3. Process with try/catch
4. Return NextResponse.json()
```

**Debug an issue:**
```
Check: Is it a client or server component issue?
- Client: useAuth hook, useState timing
- Server: Firebase admin init, env vars
```

### Context Tips

- Always check if component needs `'use client'` directive
- API routes use Firebase Admin SDK, components use client SDK
- Legacy `timePeriod` field exists for backward compatibility
- Seed data is in-memory in `/lib/seed-data/`, not Firestore

---

## Coding Conventions

### Component Structure

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { ComponentProps } from '@/types';

interface Props {
  onAction: (value: string) => void;
}

export default function MyComponent({ onAction }: Props) {
  const { user } = useAuth();
  const [state, setState] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Content */}
    </div>
  );
}
```

### API Route Structure

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  // 1. Auth
  const authHeader = request.headers.get('authorization');
  const token = await verifyAuthToken(authHeader);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse
  const body = await request.json();

  // 3. Validate
  if (!body.requiredField) {
    return NextResponse.json({ error: 'Missing field' }, { status: 400 });
  }

  // 4. Process
  try {
    const result = await doWork();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `EpisodeCard.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| Types | PascalCase | `Episode`, `UserProfile` |
| API routes | kebab-case folders | `app/api/episodes/route.ts` |
| CSS classes | kebab-case | `card-antiquarian` |

### Color System Usage

```tsx
// Backgrounds
<div className="bg-parchment">        // Main background
<div className="bg-parchment-dark">   // Cards, sections

// Text
<p className="text-ink">              // Primary text
<p className="text-sepia">            // Secondary text
<p className="text-sepia-light">      // Tertiary text

// Interactive
<button className="bg-brass text-ink hover:bg-brass-light">
<a className="text-brass hover:text-brass-light">

// Status
<span className="text-burgundy">      // Errors
<span className="text-ancient">       // Ancient epoch badge
<span className="text-revolutionary"> // Revolutionary epoch badge
```

---

## External Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [ElevenLabs API](https://elevenlabs.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Environment Variables

Create `.env.local` with:

```bash
# Firebase Client (NEXT_PUBLIC_ prefix for browser access)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Content library batch script only (npm run generate-library) —
# not required for the deployed app itself, only for regenerating content
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** `FIREBASE_PRIVATE_KEY` must include `\n` for newlines and be quoted.

---

## Quick Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Production build
npm run lint       # ESLint check
firebase deploy    # Deploy Firestore/Storage rules
```
