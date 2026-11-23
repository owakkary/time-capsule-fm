# Time Capsule FM

**Live app:** [time-capsule-fm.vercel.app](https://time-capsule-fm.vercel.app)

Time Capsule FM turns history into short podcast episodes, told the way a friend who's obsessed with history would explain it over drinks. You move through four eras (Bronze Age, Classical, Hellenistic-Roman, Revolutionary), explore 21 empires on an interactive map, and earn badges as you go.

There are 189 episodes in four formats:

- **Overviews** of each empire
- **Figures:** the people who shaped it
- **Moments:** the turning points
- **Perspectives:** a historical character tells their own story in first person

## How it works

Claude writes every script, and ElevenLabs narrates it. Each format has its own voice: one host voice for overviews, figures and moments, and separate male and female voices for the first-person perspectives.

Everything is generated once by an offline batch job (`npm run generate-library`), then stored in Firebase. The live app never calls Claude or ElevenLabs, so it costs nothing extra per listener. To keep narration costs fixed, Egypt, Greece and Rome get full ElevenLabs audio, and the other empires fall back to the browser's built-in speech.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Firebase Auth, Firestore and Storage
- Claude (Anthropic API) for scripts and quizzes
- ElevenLabs text-to-speech (`eleven_multilingual_v2`)
- Leaflet for the empire map
- Capacitor for the iOS build
- Hosted on Vercel

## Run it locally

```bash
npm install
cp .env.example .env.local   # add your Firebase keys
npm run dev
```

Regenerating content needs Anthropic and ElevenLabs keys as well. Preview a run for free with `npm run generate-library:dry-run`.
