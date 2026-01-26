# app/ Directory

> Next.js App Router pages, layouts, and nested routes

---

## Purpose

Contains all page components, layouts, and API routes using Next.js 14 App Router conventions.

---

## Contents

| Path | Type | Description |
|------|------|-------------|
| `layout.tsx` | Layout | Root layout with fonts, metadata |
| `globals.css` | Styles | Tailwind base + custom classes |
| `page.tsx` | Page | Home/landing page |
| `dashboard/page.tsx` | Page | Main authenticated dashboard |
| `login/page.tsx` | Page | Email/Google sign-in |
| `signup/page.tsx` | Page | User registration |
| `episodes/page.tsx` | Page | User's episode list |
| `episode/[id]/page.tsx` | Page | Single episode detail |
| `explore/page.tsx` | Page | Browse all content |
| `figures/page.tsx` | Page | Historical figures list |
| `moments/page.tsx` | Page | Historical moments list |
| `collections/page.tsx` | Page | User's favorites |
| `api/` | Directory | Backend API routes (see API.md) |
| `components/` | Directory | Shared components (see COMPONENTS.md) |

---

## Rules & Constraints

### MUST

- Use `'use client'` directive for components with hooks, state, or browser APIs
- Protect authenticated pages by checking `useAuth()` and redirecting
- Import from `@/` path alias (configured in tsconfig.json)
- Use the vintage design system colors and fonts

### MUST NOT

- Import Firebase Admin SDK in client components (server only)
- Use `useState`/`useEffect` without `'use client'` directive
- Hardcode colors—use Tailwind theme tokens
- Create API logic in page files (use `api/` routes)

---

## What Belongs Here

- Page components (`page.tsx`)
- Layout components (`layout.tsx`)
- Loading states (`loading.tsx`)
- Error boundaries (`error.tsx`)
- Route-specific components (in route folder)

## What Does NOT Belong Here

- Reusable components → `app/components/`
- Custom hooks → `hooks/`
- Utility functions → `lib/`
- Type definitions → `types/`

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Folders | kebab-case | `episode/[id]/` |
| Page files | Always `page.tsx` | `dashboard/page.tsx` |
| Layout files | Always `layout.tsx` | `layout.tsx` |
| Dynamic routes | `[param]` brackets | `[id]/page.tsx` |

---

## Code Patterns

### Protected Page

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen bg-parchment flex items-center justify-center">
      <div className="animate-spin-slow">Loading...</div>
    </div>;
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-parchment">
      {/* Page content */}
    </main>
  );
}
```

### Page with Data Fetching

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function DataPage() {
  const { user, getIdToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const token = await getIdToken();
      const res = await fetch('/api/endpoint', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    fetchData();
  }, [user, getIdToken]);

  // ... render
}
```

### Root Layout Pattern

```typescript
import { Crimson_Pro, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const display = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-display'
});

const body = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body'
});

export const metadata = {
  title: 'Time Capsule FM',
  description: 'AI-powered historical podcasts',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-parchment text-ink">
        {children}
      </body>
    </html>
  );
}
```

---

## Gotchas

1. **Server vs Client**: Next.js 14 components are Server Components by default. Add `'use client'` if you use hooks, state, effects, or browser APIs.

2. **Font Loading**: Fonts are loaded in `layout.tsx` via CSS variables. Use `font-display` and `font-body` Tailwind classes.

3. **Auth Redirect Loop**: Always check `loading` state before redirecting to prevent flicker:
   ```typescript
   if (!loading && !user) router.push('/login');
   ```

4. **Metadata**: Only Server Components can export `metadata`. For dynamic metadata, use `generateMetadata()`.

5. **Dynamic Routes**: `[id]` folder creates dynamic segment. Access via `params.id` in the page component.

---

## Related Documentation

- [API.md](./api/API.md) — API routes
- [COMPONENTS.md](./components/COMPONENTS.md) — Shared components
- [HOOKS.md](../hooks/HOOKS.md) — React hooks
- [TIMECAPSULE.md](../TIMECAPSULE.md) — Project overview
