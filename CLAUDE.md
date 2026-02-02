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
- **AI**: Claude API for episode generation, ElevenLabs for TTS
- **Package Manager**: npm

## Key Commands

```bash
# Development
npm run dev

# Build
npm run build

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
└── useExplorerProgress.ts  # User progress tracking

lib/
├── badges.ts            # Badge definitions and utilities
├── seed-data/           # Static content (figures, moments, perspectives)
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
│       └── badges/{badgeId}      # EarnedBadge
└── episodes/{episodeId}          # Generated episodes
```

### Key Types
- `ExplorerProfile`: User level, XP, streaks, stats
- `EmpireProgress`: Completion %, rank, discovered content per empire
- `EpochProgress`: Completion % per epoch
- `EarnedBadge`: Unlock status, progress, pinned state

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
