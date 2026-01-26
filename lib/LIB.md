# lib/ Directory

> Firebase utilities and seed data

---

## Purpose

Contains Firebase SDK initialization (client and admin) plus static seed data for historical content.

---

## Contents

| File | Type | Description |
|------|------|-------------|
| `firebase.ts` | Client SDK | Browser-side Firebase init |
| `firebase-admin.ts` | Admin SDK | Server-side Firebase + helpers |
| `seed-data/index.ts` | Data | Export helpers |
| `seed-data/figures.ts` | Data | Historical figures |
| `seed-data/moments.ts` | Data | Historical moments |
| `seed-data/perspectives.ts` | Data | First-person perspectives |
| `seed-data/overviews.ts` | Data | Empire overview content |

---

## Rules & Constraints

### MUST

- Use `firebase.ts` in client components (`'use client'`)
- Use `firebase-admin.ts` in API routes only
- Lazy-initialize Admin SDK (avoids cold start issues)
- Keep seed data as static TypeScript objects

### MUST NOT

- Import `firebase-admin.ts` in client code (breaks build)
- Import `firebase.ts` in API routes (use admin)
- Store secrets in seed data files
- Modify seed data at runtime (read-only)

---

## What Belongs Here

- Firebase initialization
- Database helper functions
- Static content data
- Utility functions for Firebase operations

## What Does NOT Belong Here

- React components → `app/components/`
- React hooks → `hooks/`
- Type definitions → `types/`
- API route logic → `app/api/`

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Firebase files | Descriptive | `firebase.ts`, `firebase-admin.ts` |
| Seed data files | Plural noun | `figures.ts`, `moments.ts` |
| Helper functions | camelCase | `getEmpireById()` |

---

## Code Patterns

### Client Firebase (firebase.ts)

```typescript
// Only import in 'use client' components
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
```

**Usage in components:**
```typescript
'use client';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
```

### Admin Firebase (firebase-admin.ts)

```typescript
// Only import in API routes
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Lazy initialization
let adminApp;

function getAdminApp() {
  if (!adminApp && getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return adminApp || getApps()[0];
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
```

### Auth Token Verification

```typescript
// In firebase-admin.ts
export async function verifyAuthToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
```

**Usage in API routes:**
```typescript
import { verifyAuthToken, getAdminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const token = await verifyAuthToken(request.headers.get('authorization'));
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminDb();
  // ... query database
}
```

### Data Access Helpers

```typescript
// In firebase-admin.ts

export async function getEmpires(epochId?: string) {
  const db = getAdminDb();
  let query = db.collection('empires');

  if (epochId) {
    query = query.where('epochId', '==', epochId);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getEmpireById(empireId: string) {
  const db = getAdminDb();
  const doc = await db.collection('empires').doc(empireId).get();

  if (!doc.exists) return null;

  // Also fetch related content
  const [figures, moments, perspectives] = await Promise.all([
    getFigures(empireId),
    getMoments(empireId),
    getPerspectives(empireId),
  ]);

  return {
    id: doc.id,
    ...doc.data(),
    figures,
    moments,
    perspectives,
  };
}
```

### Seed Data Structure

```typescript
// seed-data/figures.ts
import type { KeyFigure } from '@/types';

export const KEY_FIGURES: KeyFigure[] = [
  {
    id: 'cleopatra',
    name: 'Cleopatra VII',
    empire: 'egypt',
    title: 'Last Pharaoh of Egypt',
    years: '69 BCE - 30 BCE',
    description: 'The last active ruler of the Ptolemaic Kingdom...',
    significance: 'Her death marked the end of Ptolemaic rule...',
    tags: ['royalty', 'politics', 'diplomacy'],
  },
  // ... more figures
];

export function getFigureById(id: string): KeyFigure | undefined {
  return KEY_FIGURES.find(f => f.id === id);
}

export function getFiguresByEmpire(empireId: string): KeyFigure[] {
  return KEY_FIGURES.filter(f => f.empire === empireId);
}
```

---

## Client vs Admin Decision Tree

```
Need to access Firebase?
├── In a component with 'use client'?
│   └── Use firebase.ts (client SDK)
├── In an API route (app/api/)?
│   └── Use firebase-admin.ts (admin SDK)
└── In a Server Component (no 'use client')?
    └── Use firebase-admin.ts (admin SDK)
```

---

## Gotchas

1. **Private Key Newlines**: The `FIREBASE_PRIVATE_KEY` env var has `\n` as literal characters. Replace them:
   ```typescript
   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
   ```

2. **Client Hydration**: Client Firebase only initializes in browser. Check `typeof window !== 'undefined'` if needed.

3. **Cold Starts**: Lazy initialization prevents "already initialized" errors in serverless.

4. **Seed Data vs Firestore**: Currently using in-memory seed data. To migrate to Firestore, use the `seedXxxToFirestore()` functions once.

5. **Storage Bucket**: Same bucket name used in both client and admin config. Set in both places.

6. **Token Refresh**: Client tokens expire after 1 hour. `getIdToken()` from useAuth handles refresh automatically.

---

## Related Documentation

- [API.md](../app/api/API.md) — Uses firebase-admin
- [HOOKS.md](../hooks/HOOKS.md) — Uses firebase client
- [TYPES.md](../types/TYPES.md) — Type definitions
- [FIREBASE.md](../firebase/FIREBASE.md) — Security rules
