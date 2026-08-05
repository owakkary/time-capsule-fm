# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Time Capsule FM is a history exploration app: a guided audio journey through historical empires, figures, moments, and perspectives. Users progress through epochs (Bronze Age, Classical, Hellenistic-Roman, Revolutionary) exploring 21 different empires and earning badges for their achievements.

All 189 episodes (21 overviews + 42 figures + 63 moments + 63 perspectives) are **pre-generated once** into a shared, public `contentLibrary` Firestore collection + Storage audio files — the deployed app never calls Claude or ElevenLabs at request time. This keeps marginal cost at zero regardless of user count. See "Content Library" below.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom color palette (parchment, brass, sepia theme)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Content generation**: one-time offline batch script (`scripts/generate-content-library.ts`) using Claude (Sonnet) + ElevenLabs — not called by the deployed app
- **Hosting**: Vercel (https://time-capsule-fm.vercel.app)
- **Package Manager**: npm

## Key Commands

```bash
# Development
npm run dev

# Build
npm run build

# Deploy to Vercel (production)
vercel --prod

# Deploy Firestore rules
firebase deploy --only firestore:rules --project time-capsule-fm

# Preview the one-time content library batch job (no API calls, free)
npm run generate-library:dry-run

# Run the batch job for real (spends Anthropic + ElevenLabs credits, idempotent/resumable)
npm run generate-library
```

## Project Structure

```
app/
├── accolades/           # Profile/badges page
├── api/                 # API routes (recommend, progress, events, catalog reads)
├── components/
│   ├── accolades/       # Badge, avatar, specialization components
│   ├── layout/          # Header, navigation
│   └── maps/            # Geographic map components
├── empire/[id]/         # Individual empire pages
├── epoch/[id]/          # Epoch overview pages
├── episode/[id]/        # Episode player page (reads contentLibrary/{id})
└── ...

hooks/
├── useAuth.ts           # Firebase authentication
├── useEventLogger.ts    # Fire-and-forget engagement event dispatch
└── useExplorerProgress.ts  # User progress tracking

lib/
├── badges.ts              # Badge definitions and utilities
├── content-generation.ts  # Shared prompt-building logic (used only by the batch script)
├── content-library.ts     # Deterministic contentLibrary item id scheme
├── interest-profile.ts    # Free counter-based interest profile (no AI calls)
├── recommendations.ts     # Deterministic scoring + host-pitch templates (no AI calls)
├── seed-data/              # Static content (figures, moments, perspectives)
├── voice-mapping.ts       # TTS voice selection by content type
└── xp.ts                  # XP/leveling calculations

scripts/
└── generate-content-library.ts  # One-time batch job: pre-generates all 189 episodes

public/
├── avatars/             # 6 explorer avatar images (PNG)
├── badges/              # 27 badge images (PNG)
└── empires/             # 21 empire icons (PNG)

types/
└── index.ts             # All TypeScript types, EPOCHS, EMPIRES constants
```

## Design Guidelines

### Color Palette
- **Parchment**: Light beige backgrounds (#F5E6D3, #FAF6F0)
- **Brass/Gold**: Accents and highlights (#C9A66B, #B87333)
- **Sepia**: Text colors (#5C4033, #8B7355)
- **Ink**: Dark text (#2C1810)

### Visual Style
- Vintage/antique aesthetic with warm amber/golden tones
- 8-bit pixel art style for badges and empire icons (Age of Empires inspired)
- Vintage illustration style for avatars
- Minimal emoji usage - prefer SVG icons or images
- All generated images should have warm parchment backgrounds (#F5E6D3) to blend with the site

### Image Generation (Nano Banana Pro)
When generating images for this project:
- Always specify "warm parchment beige background (#F5E6D3)"
- Add "NO transparent or checkered background" to prompts
- Use "8-bit pixel art style" and "Age of Empires 2 aesthetic" for badges/icons
- Use "vintage illustration" style for avatars

## Content Library

`contentLibrary/{itemId}` is a public-read, write-only-by-batch-script Firestore collection holding one pre-generated episode per content item — `itemId` is a deterministic slug from `lib/content-library.ts` (`overview-{empireId}`, `figure-{figureId}`, `moment-{momentId}`, `perspective-{perspectiveId}`). Audio lives at Storage path `content-library/{itemId}.mp3` (public read). To regenerate/extend it, edit the prompt logic in `lib/content-generation.ts` and re-run `npm run generate-library` — it's idempotent and skips items that already exist.

### Schema drift and backfilling

That skip-if-exists rule is what makes the job cheap to resume, but it also means **adding a field to `ContentLibraryItem` never reaches items already in the collection** — a normal re-run will not touch them. So new fields must be optional in `types/index.ts` and read through the helpers in `lib/content-library.ts` (`getAudioProvider`, `getQuiz`, `hasQuiz`), which give legacy items sane defaults. This matters most for `quiz`: XP and badges are gated on passing a quiz, so an item with no quiz would be uncompletable and its XP unreachable — `getQuiz`/`hasQuiz` let the episode page fall back to "finishing it completes it".

```bash
npm run audit-library            # read-only: which docs are missing which fields
npm run backfill-library:dry-run # preview the repair, no API calls
npm run backfill-library         # repair in place
```

`--backfill` only fills in what's missing, reusing the script already stored in Firestore: one cheap Claude call per stale doc for the quiz, and **no ElevenLabs call**, so it never re-pays for narration.

**Long runs:** a full `generate-library` run takes ~2.5h and is killed if its parent shell dies. Launch it detached (`nohup npm run generate-library >> /tmp/gen.log 2>&1 & disown`) so a closing terminal or session can't take it down mid-run.

## Empire Availability Gate

Only the empires in `AVAILABLE_EMPIRES` (`lib/availability.ts`) are shown: **Ancient Egypt, Classical Greece, Roman Empire**. They're the only ones with real ElevenLabs narration — the other 18 would fall back to the browser's robotic Web Speech voice, which oversells them as finished content.

This is a gate, not a deletion. Seed data and generated episodes for the other empires stay in place; widening the app is a one-line change to that array. `scripts/generate-content-library.ts` imports the same list for `FULL_AUDIO_EMPIRES`, so "has narration" and "is visible" can't drift apart.

What it filters, all derived from that one array:

- **Epochs** — an epoch is shown only if it still has an available empire, so the **Revolutionary Age is hidden entirely** (it has none). 4 epochs → 3.
- **Pages** — `/empire/[id]`, `/epoch/[id]`, `/figure/[id]`, `/moment/[id]`, `/perspective/[id]`, and `/episode/[id]` resolve to "not found" for hidden empires, so direct links can't reach them.
- **Lists** — `/figures`, `/moments`, and My Journey history filter by available empire.
- **Maps** — `getEmpireFeatures()` in `app/utils/geoData.ts` drops hidden territories; it's the single choke point every map draws through, covering territories, labels, and legend.
- **API + recommendations** — the catalog readers in `lib/firebase-admin.ts` and `getContentCatalog()` are scoped, so nothing recommends an episode the UI won't open.
- **Badges** — `EARNABLE_BADGES` hides badges that can't be earned under the current gate (**12 of 27 visible**). Earnability is computed from `BADGE_REQUIREMENTS` against real content counts, so it re-derives automatically when the allowlist changes. `getBadgeById()` still searches all definitions so a previously earned badge keeps rendering.

Reachable content is **27 of 189 episodes** (3 overviews, 6 figures, 9 moments, 9 perspectives). Run `npx tsx scripts/verify-availability.ts` to print exactly what's exposed and which badges dropped out.

## Data Model

### Firestore Structure
```
contentLibrary/{itemId}                 # Pre-generated episodes, public read, written only by the batch script
listeningHistory/{userId}_{itemId}      # Per-user play history (deterministic doc id), powers the "My Journey" page

users/{userId}/
└── explorer/
    └── profile/
        ├── empires/{empireId}    # EmpireProgress
        ├── epochs/{epochId}      # EpochProgress
        ├── badges/{badgeId}      # EarnedBadge
        ├── events/{auto-id}      # EngagementEvent (adaptive content engine)
        └── interests             # UserInterestProfile (single doc; free counters, no AI calls)
```

### Key Types
- `ExplorerProfile`: User level, XP, streaks, stats
- `EmpireProgress`: Completion %, rank, discovered content per empire
- `EpochProgress`: Completion % per epoch
- `EarnedBadge`: Unlock status, progress, pinned state
- `EngagementEvent`: Tracks episode_started/completed/abandoned/replayed, recommendation clicks/skips
- `UserInterestProfile`: Counters (empire/epoch/contentType/tag) + Claude-analyzed fields (inferredInterests, knowledgeGaps, etc.)
- `Recommendation` / `RecommendationResponse`: Personalized episode suggestions with host-voice pitches

## Common Issues & Solutions

### Firestore Collection Paths
Read and write operations must use consistent paths:
```typescript
// Correct path (includes 'profile' segment)
collection(db, 'users', userId, 'explorer', 'profile', 'empires')

// Wrong path (missing 'profile')
collection(db, 'users', userId, 'explorer', 'empires')
```

### Empire Display Names
Use short names to avoid confusion with epoch names:
- "Classical Greece" → "Greece" (not "Classical")
- "United States" → "USA"
- "Roman Empire" → "Rome"
- See `SpecializationCard.tsx` for full mapping

## Assets

### Avatars (6 stages)
Explorer progression stages with diverse characters:
- Wanderer (Asian man)
- Cartographer (white woman)
- Archaeologist (Black man)
- Chronicler (white woman)
- Antiquarian (white man)
- Timekeeper (white elderly woman)

### Badges (27 total)
Categories: Milestone (8), Discovery (5), Mastery (7), Streak (3), Special (4)

### Empire Icons (21 total)
One icon per empire across 4 epochs, each with civilization-specific imagery.

## Content Generation

All content is pre-generated once via `npm run generate-library` (see "Content Library" above) — there is no live generation path in the deployed app.

### Host Persona (System Prompt)
The Time Capsule FM host voice is defined in `lib/content-generation.ts` via `SYSTEM_PROMPT`:
- Intellectually rigorous but casually irreverent
- Opening pattern: dramatic weight + sarcastic deflation
- Absurdist observations about weird/human/petty historical details
- Closing: historical significance + wry reframing
- No textbook tone, no modern partisan stances, levity every 2-3 paragraphs

Perspective episodes use a separate `PERSPECTIVE_SYSTEM_PROMPT` (first-person immersive narration).

### TTS Voices (ElevenLabs)
Voice selection is in `lib/voice-mapping.ts`. Model: `eleven_multilingual_v2`.

| Voice | ID | Used For |
|-------|----|----------|
| Adam | `pNInz6obpgDQGcFmaJgB` | Host — overviews, figures, moments |
| Antoni | `ErXwobaYiN019PkySvjV` | Male perspective characters |
| Bella | `EXAVITQu4vr4xnSDxMaL` | Female perspective characters |

Voices are premade ElevenLabs voices available on the free API plan — the previous British trio (Julian/George/Lily) were library voices that return `402 payment_required` without a paid ElevenLabs plan.

Female perspectives (5): `temple-priestess`, `mycenaean-queen`, `carthaginian-priestess`, `roman-matron`, `daughters-liberty`. All other 58 perspectives use male voice.

`scripts/generate-content-library.ts` passes `contentType` and `contentId` to `getVoiceId()` so the correct voice is selected for each pre-generated item.

## Leaflet Map Architecture

### Key Files
- `app/components/maps/LeafletMap.tsx` — Main map component (react-leaflet)
- `app/globals.css` — Leaflet CSS overrides in `LEAFLET MAP OVERRIDES` section
- `app/utils/geoData.ts` — GeoJSON loading/filtering with caching
- `app/utils/mapProjection.ts` — Per-epoch map configs (`LEAFLET_CONFIGS`, `EPOCH_BOUNDS`)
- `public/geo/*.json` — GeoJSON data per epoch (bronze-age, classical, hellenistic-roman, revolutionary)
- `scripts/generate_territories.py` — Generates pre-clip GeoJSON with waypoint-based borders
- `scripts/clip_to_coastline.py` — Clips territories to Natural Earth 50m land boundaries

### GeoJSON Feature Properties
Empire features have: `id`, `name`, `type` ("empire"), `color` (hex), `interactive` (bool), `labelPosition` ([lng, lat])

### Map Components (inside MapContainer)
- `LegendControl` — Top-right legend with empire colors + Esri credit
- `CompassRoseControl` — Bottom-right compass rose
- `EmpireLabelsControl` — Permanent empire name labels at `labelPosition` coordinates using `L.divIcon`
- `EmpireTooltip` — Hover tooltip positioned relative to container

### Territory Styling
- Base: `fillOpacity: 0.7`, `weight: 3`, darker stroke via `darkenHex()` (30% darker than fill)
- Hover: `fillOpacity: 0.85`, `weight: 4`
- Attribution disabled on MapContainer; Esri credit in legend instead
- `.leaflet-interactive { cursor: pointer }` in globals.css
- `.empire-label` styled with Georgia serif, sepia color, parchment text-shadow

### Tile Layer
Esri World Physical Map tiles (terrain/topography only, no political borders). CSS filter: `sepia(40%) saturate(70%) brightness(108%)` via `.leaflet-tile-pane`.

### GeoJSON Generation Pipeline
Two-step process to create realistic territory borders:

1. **Generate** (`scripts/generate_territories.py`):
   - Defines territory shapes using waypoints that follow geographic features (mountains, rivers, desert edges)
   - Gaussian perturbation between waypoints for natural-looking border irregularity
   - Coastal territories use oversized simple shapes (clipping handles coastlines)
   - Inland territories use detailed waypoints following geographic features
   - Amplitude settings: MOUNTAIN=0.25, RIVER=0.12, DESERT=0.18
   - Random seed 42 for reproducibility

2. **Clip** (`scripts/clip_to_coastline.py`):
   - Downloads Natural Earth 50m land polygon data (`ne_50m_land.shp` from naciscdn.org)
   - Intersects each territory with land polygon so coastal edges follow real geography
   - Buffer: 0.02° (just enough for coastline coverage — larger values round inland borders)
   - Simplifies result (tolerance 0.015°), removes tiny fragments (area < 0.005 sq deg)
   - Rounds coordinates to 2 decimal places
   - Dependencies: `shapely`, `pyshp`

**To regenerate territories**: `python scripts/generate_territories.py && python scripts/clip_to_coastline.py`
