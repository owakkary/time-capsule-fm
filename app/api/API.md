# app/api/ Directory

> Next.js API routes for backend logic

---

## Purpose

Server-side API endpoints using Next.js Route Handlers. All routes use Firebase Admin SDK and require authentication.

---

## Contents

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/generate` | POST | Generate episode content via Claude |
| `/api/tts` | POST | Convert text to speech via ElevenLabs |
| `/api/episodes` | GET, DELETE | List/delete user's episodes |
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

### POST /api/generate

Generate episode content using Claude AI.

**Request:**
```json
{
  "empire": "egypt",
  "contentType": "overview",
  "contentId": "cleopatra",
  "durationMinutes": 10
}
```

**Content Types:**
- `overview` — Empire introduction
- `figure` — Historical person biography
- `moment` — Historical event narrative
- `perspective` — First-person account

**Response:**
```json
{
  "episodeId": "abc123",
  "title": "The Last Pharaoh",
  "content": "...",
  "epoch": "ancient-world",
  "empire": "egypt"
}
```

### POST /api/tts

Convert episode text to audio.

**Request:**
```json
{
  "episodeId": "abc123",
  "text": "Episode content..."
}
```

**Response:**
```json
{
  "audioUrl": "https://storage.googleapis.com/.../abc123.mp3"
}
```

### GET /api/episodes

List user's episodes.

**Query params:** `?limit=20`

**Response:**
```json
{
  "episodes": [
    {
      "id": "abc123",
      "title": "The Last Pharaoh",
      "empire": "egypt",
      "durationMinutes": 10,
      "audioUrl": "...",
      "createdAt": "2025-01-25T..."
    }
  ]
}
```

### DELETE /api/episodes

Delete an episode.

**Request:**
```json
{
  "episodeId": "abc123"
}
```

---

## Gotchas

1. **Auth Header Format**: Expects `Bearer {token}` format. The `verifyAuthToken` helper handles extraction.

2. **Legacy `timePeriod` Field**: The generate endpoint accepts legacy `timePeriod` for backward compatibility. Maps to new `empire` internally.

3. **ElevenLabs Rate Limits**: TTS has rate limits. Consider adding queue or retry logic for production.

4. **Storage URLs**: Audio URLs are public. Episode ownership verified at generation time, not on playback.

5. **Firestore Timestamps**: Convert `Timestamp` to ISO string before returning:
   ```typescript
   createdAt: doc.data().createdAt?.toDate().toISOString()
   ```

6. **Word Count Formula**:
   - 5 min → ~600 words
   - 10 min → ~1200 words
   - 15 min → ~1800 words

---

## Related Documentation

- [LIB.md](../../lib/LIB.md) — Firebase Admin helpers
- [TYPES.md](../../types/TYPES.md) — Request/response types
- [TIMECAPSULE.md](../../TIMECAPSULE.md) — Project overview
