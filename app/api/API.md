# app/api/ Directory

> Next.js API routes for backend logic

---

## Purpose

Server-side API endpoints using Next.js Route Handlers. All routes use Firebase Admin SDK and require authentication.

---

## Contents

There is deliberately no live content-generation route — all episodes are pre-generated once by `scripts/generate-content-library.ts` (see root `CLAUDE.md`) and read directly from the public `contentLibrary` Firestore collection, mostly via the client SDK rather than an API route.

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/recommend` | GET | Deterministic, free "what to listen to next" scoring (no AI calls) |
| `/api/events` | POST | Record engagement events, updates free interest-profile counters |
| `/api/empires` | GET | List all empires |
| `/api/empires/[id]` | GET | Single empire with content |
| `/api/epochs` | GET | List all epochs |
| `/api/figures` | GET | List historical figures |
| `/api/figures/[id]` | GET | Single figure details |
| `/api/moments` | GET | List historical moments |
| `/api/moments/[id]` | GET | Single moment details |
| `/api/perspectives` | GET | List first-person perspectives |
| `/api/perspectives/[id]` | GET | Single perspective |

---

## Rules & Constraints

### MUST

- Verify auth token on ALL protected routes
- Return proper HTTP status codes (401, 400, 500)
- Use `NextResponse.json()` for responses
- Import from `@/lib/firebase-admin` for server operations
- Handle errors with try/catch

### MUST NOT

- Import client Firebase SDK (`@/lib/firebase`)
- Trust user input without validation
- Expose internal error details in production
- Skip auth verification on protected endpoints

---

## What Belongs Here

- Data fetching/mutation endpoints
- Third-party API integrations (Claude, ElevenLabs)
- Server-side business logic

## What Does NOT Belong Here

- React components
- Client-side code
- Static data (use `types/` or `lib/seed-data/`)

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Route folder | kebab-case | `api/episodes/` |
| Route file | Always `route.ts` | `route.ts` |
| Dynamic params | `[param]` folder | `[id]/route.ts` |

---

## Code Patterns

### Standard Auth Check

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = await verifyAuthToken(authHeader);

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // token.uid contains the user ID
  const userId = token.uid;

  // ... rest of handler
}
```

### POST with Body Validation

```typescript
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = await verifyAuthToken(authHeader);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate required fields
  const { empire, durationMinutes } = body;
  if (!empire || !durationMinutes) {
    return NextResponse.json(
      { error: 'Missing required fields: empire, durationMinutes' },
      { status: 400 }
    );
  }

  try {
    const result = await processData(body, token.uid);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Dynamic Route Parameter

```typescript
// app/api/figures/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const figureId = params.id;

  // Fetch by ID...
}
```

### Query Parameters

```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const empireId = searchParams.get('empire');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Filter by empire if provided
  const results = empireId
    ? await getByEmpire(empireId)
    : await getAll();

  return NextResponse.json(results.slice(0, limit));
}
```

---

## API Reference

### GET /api/recommend

Returns 3-4 personalized "what to listen to next" suggestions using free, deterministic scoring over the user's engagement counters (`lib/recommendations.ts`) — no Anthropic call. Cached in-memory per user for 60s. Returns `{ recommendations: [], welcomeBack: '', isNewUser: true }` until the user has started at least 3 episodes.

**Response:**
```json
{
  "recommendations": [
    {
      "id": "figure-cleopatra",
      "empire": "ancient-egypt",
      "epoch": "bronze-age",
      "contentType": "figure",
      "contentId": "cleopatra",
      "title": "The Last Pharaoh",
      "hostPitch": "Meet the person behind the legend: The Last Pharaoh, from Ancient Egypt.",
      "reason": "A new civilization to discover.",
      "confidence": 0.7
    }
  ],
  "welcomeBack": "Welcome back — ready to continue your journey through Ancient Egypt, or explore somewhere new?",
  "isNewUser": false
}
```

`recommendation.id` is the exact `contentLibrary` document id — the frontend links straight to `/episode/{id}`.

### POST /api/events

Records an engagement event (`episode_started`, `episode_completed`, `episode_abandoned`, `episode_replayed`, `recommendation_clicked`, `recommendation_skipped`) and atomically updates the free interest-profile counters that power `/api/recommend`.

---

## Gotchas

1. **Auth Header Format**: Expects `Bearer {token}` format. The `verifyAuthToken` helper handles extraction.

2. **No live generation path**: `contentLibrary` items are written only by `scripts/generate-content-library.ts` via the Admin SDK (Firestore rules block all client writes to that collection). Don't add a route that writes to it.

3. **Storage URLs**: Audio URLs are public (`content-library/{itemId}.mp3`). Playback requires no auth — only the surrounding app pages are login-gated.

4. **Firestore Timestamps**: Convert `Timestamp` to ISO string / `Date` before returning:
   ```typescript
   createdAt: doc.data().createdAt?.toDate().toISOString()
   ```

5. **Word Count**: every content library item is generated once at a fixed ~1200 words / ~10 minutes (`TARGET_WORD_COUNT` in `lib/content-generation.ts`) — there is no per-request duration choice.

---

## Related Documentation

- [LIB.md](../../lib/LIB.md) — Firebase Admin helpers
- [TYPES.md](../../types/TYPES.md) — Request/response types
- [TIMECAPSULE.md](../../TIMECAPSULE.md) — Project overview
