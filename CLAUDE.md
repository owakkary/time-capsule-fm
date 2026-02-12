# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Time Capsule FM is a history exploration app that generates AI-powered podcast episodes about historical empires, figures, moments, and perspectives. Users progress through epochs (Bronze Age, Classical, Hellenistic-Roman, Revolutionary) exploring 21 different empires and earning badges for their achievements.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom color palette (parchment, brass, sepia theme)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Claude API (Sonnet) for episode generation, ElevenLabs for TTS
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
```

## Project Structure

```
app/
├── accolades/           # Profile/badges page
├── api/                 # API routes (generate, episodes, progress)
├── components/
│   ├── accolades/       # Badge, avatar, specialization components
│   ├── layout/          # Header, navigation
│   └── maps/            # Geographic map components
├── empire/[id]/         # Individual empire pages
├── epoch/[id]/          # Epoch overview pages
├── episode/[id]/        # Episode player page
└── ...

hooks/
├── useAuth.ts           # Firebase authentication
├── useEventLogger.ts    # Fire-and-forget engagement event dispatch (NEW)
└── useExplorerProgress.ts  # User progress tracking

lib/
├── badges.ts            # Badge definitions and utilities
├── interest-profile.ts  # Profile counters + Claude analysis (NEW)
├── recommendations.ts   # Recommendation prompt builders + catalog (NEW)
├── seed-data/           # Static content (figures, moments, perspectives)
├── voice-mapping.ts     # TTS voice selection by content type
└── xp.ts               # XP/leveling calculations

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

## Data Model

### Firestore Structure
```
users/{userId}/
├── explorer/
│   └── profile/
│       ├── empires/{empireId}    # EmpireProgress
│       ├── epochs/{epochId}      # EpochProgress
│       ├── badges/{badgeId}      # EarnedBadge
│       ├── events/{auto-id}      # EngagementEvent (NEW - adaptive content engine)
│       ├── interests             # UserInterestProfile (NEW - single doc)
│       └── rate-limits/recommend # Rate limit tracking (NEW)
└── episodes/{episodeId}          # Generated episodes (global collection)
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

### Host Persona (System Prompt)
The Time Capsule FM host voice is defined in `app/api/generate/route.ts` via `SYSTEM_PROMPT`:
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
| Julian (British) | `9IzcwKmvwJcw58h3KnlH` | Host — overviews, figures, moments |
| George (British, warm) | `JBFqnCBsd6RMkjVDRZzb` | Male perspective characters |
| Lily (British, warm) | `pFZP5JQG7iQjIQuC4Bku` | Female perspective characters |

Female perspectives (5): `temple-priestess`, `mycenaean-queen`, `carthaginian-priestess`, `roman-matron`, `daughters-liberty`. All other 58 perspectives use male voice.

Frontend pages pass `contentType` and `contentId` to `/api/tts` so the correct voice is selected.

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
