# hooks/ Directory

> Custom React hooks for auth and state management

---

## Purpose

Reusable React hooks that encapsulate complex state logic, Firebase auth, and Firestore interactions.

---

## Contents

| Hook | Returns | Description |
|------|---------|-------------|
| `useAuth.ts` | `{ user, loading, signIn*, signOut, getIdToken }` | Authentication state and methods |
| `useFavorites.ts` | `{ favorites, toggleFigure, toggleMoment, isFavorite* }` | User favorites management |

---

## Rules & Constraints

### MUST

- Use in `'use client'` components only
- Follow `use` naming prefix convention
- Return stable references (useCallback for functions)
- Handle loading and error states

### MUST NOT

- Call hooks conditionally (React rules)
- Mutate state directly
- Import in Server Components or API routes
- Skip cleanup in useEffect

---

## What Belongs Here

- Custom React hooks
- State management logic
- Firebase listener subscriptions
- Complex effect orchestration

## What Does NOT Belong Here

- UI components → `app/components/`
- Utility functions (non-hooks) → `lib/`
- Type definitions → `types/`
- API logic → `app/api/`

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| File | camelCase with `use` prefix | `useAuth.ts` |
| Hook function | camelCase with `use` prefix | `export function useAuth()` |
| Return methods | camelCase verbs | `signInWithEmail`, `toggleFavorite` |

---

## Code Patterns

### useAuth Hook

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create/update user profile in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    return firebaseSignOut(auth);
  }, []);

  const getIdToken = useCallback(async () => {
    if (!user) return null;
    return user.getIdToken();
  }, [user]);

  return {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    getIdToken,
  };
}
```

**Usage:**
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { user, loading, signInWithEmail, signInWithGoogle } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) redirect('/dashboard');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signInWithEmail(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### useFavorites Hook

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

interface Favorites {
  figures: string[];
  moments: string[];
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorites>({
    figures: [],
    moments: [],
  });
  const [loading, setLoading] = useState(true);

  // Load favorites from Firestore
  useEffect(() => {
    if (!user) {
      setFavorites({ figures: [], moments: [] });
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      const favRef = doc(db, 'users', user.uid, 'preferences', 'favorites');
      const favSnap = await getDoc(favRef);

      if (favSnap.exists()) {
        setFavorites(favSnap.data() as Favorites);
      }
      setLoading(false);
    };

    loadFavorites();
  }, [user]);

  // Save favorites to Firestore
  const saveFavorites = useCallback(async (newFavorites: Favorites) => {
    if (!user) return;
    const favRef = doc(db, 'users', user.uid, 'preferences', 'favorites');
    await setDoc(favRef, newFavorites);
  }, [user]);

  const toggleFigureFavorite = useCallback(async (figureId: string) => {
    const newFavorites = { ...favorites };

    if (newFavorites.figures.includes(figureId)) {
      newFavorites.figures = newFavorites.figures.filter(id => id !== figureId);
    } else {
      newFavorites.figures = [...newFavorites.figures, figureId];
    }

    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const toggleMomentFavorite = useCallback(async (momentId: string) => {
    const newFavorites = { ...favorites };

    if (newFavorites.moments.includes(momentId)) {
      newFavorites.moments = newFavorites.moments.filter(id => id !== momentId);
    } else {
      newFavorites.moments = [...newFavorites.moments, momentId];
    }

    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const isFigureFavorite = useCallback((figureId: string) => {
    return favorites.figures.includes(figureId);
  }, [favorites.figures]);

  const isMomentFavorite = useCallback((momentId: string) => {
    return favorites.moments.includes(momentId);
  }, [favorites.moments]);

  return {
    favorites,
    loading,
    toggleFigureFavorite,
    toggleMomentFavorite,
    isFigureFavorite,
    isMomentFavorite,
  };
}
```

**Usage:**
```typescript
'use client';

import { useFavorites } from '@/hooks/useFavorites';

export default function FigureCard({ figure }) {
  const { isFigureFavorite, toggleFigureFavorite } = useFavorites();
  const isFavorite = isFigureFavorite(figure.id);

  return (
    <div>
      <h3>{figure.name}</h3>
      <button onClick={() => toggleFigureFavorite(figure.id)}>
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

### Custom Hook Template

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseMyHookOptions {
  initialValue?: string;
}

interface UseMyHookReturn {
  value: string;
  loading: boolean;
  error: Error | null;
  setValue: (v: string) => void;
  reset: () => void;
}

export function useMyHook(options: UseMyHookOptions = {}): UseMyHookReturn {
  const { initialValue = '' } = options;

  const [value, setValueState] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setValue = useCallback((newValue: string) => {
    setValueState(newValue);
  }, []);

  const reset = useCallback(() => {
    setValueState(initialValue);
    setError(null);
  }, [initialValue]);

  return {
    value,
    loading,
    error,
    setValue,
    reset,
  };
}
```

---

## Gotchas

1. **Auth State Timing**: `user` is null during initial load. Always check `loading` before assuming no user:
   ```typescript
   if (loading) return <Spinner />;
   if (!user) redirect('/login');
   ```

2. **Token Expiration**: Firebase tokens expire after 1 hour. `getIdToken()` automatically refreshes. Always call it fresh before API requests.

3. **Favorites Without Auth**: `useFavorites` returns empty arrays if no user. Components should handle this gracefully.

4. **Firestore Path**: Favorites stored at `users/{uid}/preferences/favorites`. Nested document, not a subcollection.

5. **Callback Stability**: Return functions wrapped in `useCallback` to prevent infinite re-renders when used in dependency arrays.

6. **Cleanup on Unmount**: The `onAuthStateChanged` listener is cleaned up via returned unsubscribe function. Never skip the cleanup.

---

## Related Documentation

- [LIB.md](../lib/LIB.md) — Firebase client SDK
- [COMPONENTS.md](../app/components/COMPONENTS.md) — Components using these hooks
- [TYPES.md](../types/TYPES.md) — Type definitions
