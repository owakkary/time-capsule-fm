# Time Capsule FM - Development Guide

## 🎯 Project Overview

You have a **solid backend foundation** with:
- ✅ Firebase config (client + admin)
- ✅ API routes (generate, TTS, episodes)
- ✅ Auth hooks (useAuth)
- ✅ TypeScript types
- ✅ Security rules

**What you need to build**: Frontend UI components and pages

---

## 📁 Current Project Structure

```
time-capsule-fm/
├── app/
│   └── api/
│       ├── generate/route.ts      ✅ Claude API integration
│       ├── tts/route.ts            ✅ ElevenLabs TTS
│       └── episodes/route.ts       ✅ Fetch user episodes
├── lib/
│   ├── firebase.ts                 ✅ Client-side Firebase
│   └── firebase-admin.ts           ✅ Server-side Firebase
├── hooks/
│   └── useAuth.ts                  ✅ Auth hook ready
├── types/
│   └── index.ts                    ✅ All types defined
└── firebase/
    ├── firestore.rules             ✅ Security rules
    └── storage.rules               ✅ Storage rules
```

---

## 🚀 Step-by-Step Development Plan

### **PHASE 1: Foundation & Auth (Days 1-2)**

#### Step 1.1: Add Missing Dependencies
```bash
npm install
npm install lucide-react  # For icons
npm install tailwindcss @tailwindcss/forms postcss autoprefixer
npx tailwindcss init -p
```

#### Step 1.2: Create App Layout
**File to create**: `app/layout.tsx`
- Basic HTML structure
- Global styles
- Font imports
- Auth provider context

#### Step 1.3: Create Auth Pages
**Files to create**:
- `app/login/page.tsx` - Login form with email/password + Google
- `app/signup/page.tsx` - Signup form
- `app/components/AuthForm.tsx` - Reusable auth form component

#### Step 1.4: Create Protected Route Wrapper
**File to create**: `app/components/ProtectedRoute.tsx`
- Checks if user is authenticated
- Redirects to login if not
- Shows loading state

---

### **PHASE 2: Main App Interface (Days 3-5)**

#### Step 2.1: Create Dashboard/Home Page
**File to create**: `app/dashboard/page.tsx`
- Hero section with app description
- Era selector grid
- Recent episodes list
- Navigation header

#### Step 2.2: Create Era Selector Component
**File to create**: `app/components/EraSelector.tsx`
- Grid of time period cards
- Each card shows emoji, name, years, color
- Click to select era
- Visual feedback for selection

#### Step 2.3: Create Duration Selector Component
**File to create**: `app/components/DurationSelector.tsx`
- Radio buttons or cards for 5/10/15 min
- Shows description (Quick hit, Coffee break, Deep dive)

#### Step 2.4: Create Generate Episode Flow
**File to create**: `app/components/EpisodeGenerator.tsx`
- Combines EraSelector + DurationSelector
- "Generate Episode" button
- Loading state with fun history facts
- Error handling
- Calls `/api/generate` endpoint

#### Step 2.5: Create Loading Component
**File to create**: `app/components/LoadingSpinner.tsx`
- Animated spinner or skeleton
- Random history facts that cycle during generation

---

### **PHASE 3: Audio Playback (Days 6-7)**

#### Step 3.1: Create Audio Player Component
**File to create**: `app/components/AudioPlayer.tsx`
- HTML5 audio element wrapper
- Play/pause button
- Progress bar (current time / total duration)
- Playback speed control (0.75x, 1x, 1.25x, 1.5x)
- Volume control
- Updates Firestore listening history

#### Step 3.2: Create Episode Card Component
**File to create**: `app/components/EpisodeCard.tsx`
- Displays episode title, time period, duration
- Shows audio player if episode has audioUrl
- Shows "Generating audio..." if audioUrl is null
- Click to play

#### Step 3.3: Create Episode Page
**File to create**: `app/episode/[id]/page.tsx`
- Full-page view of single episode
- Large audio player
- Transcript display (the content)
- Back button

#### Step 3.4: Create Episodes List Page
**File to create**: `app/episodes/page.tsx`
- Fetches from `/api/episodes`
- Grid of EpisodeCard components
- Filter by time period (optional)
- Sort by date

---

### **PHASE 4: Polish & UX (Days 8-10)**

#### Step 4.1: Error Handling
- Create `app/components/ErrorMessage.tsx`
- Add error boundaries
- Toast notifications for API errors

#### Step 4.2: Empty States
- "No episodes yet" message
- "Generate your first episode" CTA
- Nice illustrations or emojis

#### Step 4.3: Responsive Design
- Test on mobile, tablet, desktop
- Adjust grid layouts
- Optimize audio player for mobile

#### Step 4.4: Loading Skeletons
- Skeleton for episode cards
- Skeleton for audio player
- Smooth transitions

#### Step 4.5: Navigation Header
**File to create**: `app/components/Header.tsx`
- App logo/name
- Navigation links (Dashboard, Episodes)
- User menu with sign out

---

## 🎨 Suggested Tech Stack for UI

### Styling Options (Pick One)
1. **Tailwind CSS** (Recommended)
   - Fast development
   - Consistent design
   - Great for responsive
   
2. **Plain CSS Modules**
   - More control
   - Smaller bundle

### Icon Library
- **lucide-react** (already suggested)
- Clean, consistent icons
- Tree-shakeable

---

## 🔥 Key Implementation Details

### 1. Authentication Flow
```typescript
// In any page that needs auth
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) redirect('/login');
  
  return <YourContent />;
}
```

### 2. Calling API Routes with Auth
```typescript
const { getIdToken } = useAuth();

const token = await getIdToken();
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ timePeriod, durationMinutes }),
});
```

### 3. Handling TTS Generation
```typescript
// After episode is generated, automatically trigger TTS
const generateResponse = await fetch('/api/generate', { /* ... */ });
const episode = await generateResponse.json();

// Then call TTS endpoint
const ttsResponse = await fetch('/api/tts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    episodeId: episode.id,
    text: episode.content,
  }),
});

const { audioUrl } = await ttsResponse.json();
```

### 4. Audio Playback with State
```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const audioRef = useRef<HTMLAudioElement>(null);

const handlePlayPause = () => {
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }
};

useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;
  
  const updateTime = () => setCurrentTime(audio.currentTime);
  audio.addEventListener('timeupdate', updateTime);
  
  return () => audio.removeEventListener('timeupdate', updateTime);
}, []);
```

---

## 🎯 Recommended Order of Implementation

**Week 1: Core Functionality**
1. Set up Tailwind
2. Create app layout
3. Build login/signup pages
4. Create dashboard with era selector
5. Build episode generator (text only first)

**Week 2: Audio & Polish**
6. Integrate TTS in generator flow
7. Build audio player component
8. Create episodes list page
9. Add error handling and loading states
10. Responsive design and polish

---

## 🧪 Testing Checklist

- [ ] User can sign up with email
- [ ] User can sign in with Google
- [ ] User can select era and duration
- [ ] Episode generates successfully
- [ ] Audio generates successfully
- [ ] Audio plays in player
- [ ] User can see past episodes
- [ ] User can pause/resume playback
- [ ] Progress bar updates correctly
- [ ] Mobile responsive
- [ ] Error states display properly
- [ ] Loading states are smooth

---

## 📝 Environment Setup Reminder

Before running:
1. Copy `.env.example` to `.env.local`
2. Fill in all API keys:
   - Firebase credentials (both client and admin)
   - Anthropic API key
   - ElevenLabs API key + voice ID
3. Run `npm install`
4. Run `npm run dev`

---

## 🚨 Common Gotchas

1. **Firebase Admin vs Client**
   - Use `lib/firebase.ts` (client) in components
   - Use `lib/firebase-admin.ts` (admin) in API routes only

2. **Auth Token in API Calls**
   - Always include `Authorization: Bearer ${token}` header
   - Get token with `await getIdToken()`

3. **Next.js App Router**
   - Use `'use client'` for any component using React hooks
   - Server components by default (no hooks, async allowed)

4. **Audio Playback**
   - Audio URLs from Firebase Storage are public
   - Use HTML5 audio element, not external libraries
   - Handle loading/error states

5. **Firestore Timestamps**
   - Server returns timestamps as Firebase Timestamp objects
   - Convert to Date: `timestamp.toDate()`

---

## 🎨 Design Inspiration

**Color Palette** (from types):
- Ancient Egypt: `#D4A574` (sandy gold)
- Classical Greece: `#7BA3C9` (sky blue)
- Roman Empire: `#C9534D` (imperial red)
- Medieval Europe: `#6B5B73` (royal purple)
- Renaissance: `#8B9D77` (sage green)
- American Revolution: `#3D5A80` (colonial blue)

**Tone**: 
- Modern, clean, approachable
- Fun but not childish
- Educational but not stuffy
- Think: Spotify meets Duolingo meets a history podcast

---

## 🔗 Helpful Resources

- [Next.js 14 App Router Docs](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [HTML Audio API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)

---

## 📦 Next Steps with Claude Code

When working with Claude Code, be specific:

**Good prompts**:
- "Create the login page with email/password and Google sign in"
- "Build the EraSelector component with cards for each time period"
- "Add error handling to the episode generator"

**Include**:
- Which file you're working on
- What the component should do
- Any specific styling requirements

**Example**:
> "Create `app/dashboard/page.tsx` as a protected route. It should show a header with 'Time Capsule FM', the EraSelector component in a grid, and a list of recent episodes below. Use Tailwind CSS for styling."

---

## 🎉 You're Ready!

Your backend is solid. Now it's time to build the UI. Start with Phase 1, then move through each phase systematically. Good luck! 🚀
