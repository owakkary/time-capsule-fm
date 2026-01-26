# firebase/ Directory

> Firebase security rules and configuration

---

## Purpose

Contains Firestore and Storage security rules that protect user data. Rules are deployed to Firebase and enforced server-side.

---

## Contents

| File | Description |
|------|-------------|
| `firestore.rules` | Firestore database access rules |
| `storage.rules` | Cloud Storage access rules |
| `firestore.indexes.json` | Composite index definitions |

---

## Rules & Constraints

### MUST

- Test rules locally before deploying
- Require authentication for user data
- Validate ownership (userId matches auth.uid)
- Keep rules simple and readable

### MUST NOT

- Allow public write access
- Trust client-provided data without validation
- Skip auth checks on sensitive operations
- Deploy without testing

---

## What Belongs Here

- Firestore security rules
- Storage security rules
- Index configurations
- Firebase-specific configs

## What Does NOT Belong Here

- Application code
- Environment variables
- Firebase Admin SDK code → `lib/`
- Type definitions → `types/`

---

## Security Rules

### Firestore Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ==================
    // User Profiles
    // ==================
    match /users/{userId} {
      // Users can only read/write their own profile
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;

      // Nested preferences (favorites, settings)
      match /preferences/{docId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }
    }

    // ==================
    // Episodes
    // ==================
    match /episodes/{episodeId} {
      // Users can read their own episodes
      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;

      // Users can create episodes with their userId
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;

      // Users can update/delete their own episodes
      allow update, delete: if request.auth != null
                            && resource.data.userId == request.auth.uid;
    }

    // ==================
    // Listening History
    // ==================
    match /listeningHistory/{historyId} {
      allow read, write: if request.auth != null
                         && resource.data.userId == request.auth.uid;

      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
    }

    // ==================
    // Read-Only Content
    // ==================
    // Public content (empires, figures, etc.) - if migrated to Firestore
    match /empires/{empireId} {
      allow read: if true;
      allow write: if false;  // Admin only via Admin SDK
    }

    match /figures/{figureId} {
      allow read: if true;
      allow write: if false;
    }

    match /moments/{momentId} {
      allow read: if true;
      allow write: if false;
    }

    match /perspectives/{perspectiveId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Storage Rules (`storage.rules`)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // ==================
    // Episode Audio
    // ==================
    match /episodes/{userId}/{episodeId}.mp3 {
      // Anyone can read (for playback)
      allow read: if true;

      // Only owner can write
      allow write: if request.auth != null
                   && request.auth.uid == userId;
    }

    // ==================
    // User Files
    // ==================
    match /users/{userId}/{allPaths=**} {
      // Only owner can read/write
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // ==================
    // Default: Deny
    // ==================
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Deployment

### Deploy Rules Only

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy both
firebase deploy --only firestore:rules,storage:rules
```

### Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

### Full Firebase Deploy

```bash
firebase deploy
```

---

## Testing Rules Locally

### Firebase Emulator

```bash
# Start emulators
firebase emulators:start

# Run with specific project
firebase emulators:start --project=your-project-id
```

### Rules Playground

1. Go to Firebase Console → Firestore → Rules
2. Click "Rules Playground"
3. Simulate reads/writes with different auth states

### Unit Testing (Advanced)

```typescript
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

// Test that user can read own episode
await assertSucceeds(
  userDb.collection('episodes').doc('episode1').get()
);

// Test that user cannot read other's episode
await assertFails(
  userDb.collection('episodes').doc('otherUserEpisode').get()
);
```

---

## Index Configuration

`firestore.indexes.json` defines composite indexes for complex queries:

```json
{
  "indexes": [
    {
      "collectionGroup": "episodes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "episodes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "epoch", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## Code Patterns

### Validating Document Fields

```javascript
// Ensure episode has required fields
allow create: if request.auth != null
              && request.resource.data.userId == request.auth.uid
              && request.resource.data.keys().hasAll(['title', 'content', 'empire'])
              && request.resource.data.durationMinutes in [5, 10, 15];
```

### Time-Based Rules

```javascript
// Only allow updates within 24 hours of creation
allow update: if request.auth != null
              && request.auth.uid == resource.data.userId
              && request.time < resource.data.createdAt + duration.value(24, 'h');
```

### Size Limits

```javascript
// Limit content length
allow create: if request.resource.data.content.size() < 50000;
```

---

## Gotchas

1. **Rules Don't Filter**: Security rules allow/deny access but don't filter queries. If you query without a `where` clause, you'll get a permission error even if some docs are allowed.

2. **Cascading Denies**: If a parent path denies access, child paths won't be checked. Order rules carefully.

3. **Admin SDK Bypasses Rules**: Firebase Admin SDK (used in API routes) bypasses all security rules. Rules only apply to client SDK access.

4. **Timestamp Validation**: `request.time` is server time. Use it for time-based validation instead of client timestamps.

5. **Index Required Error**: Complex queries may fail without indexes. Check Firebase Console for auto-generated index suggestions.

6. **Storage vs Firestore**: Different rule syntax. Storage uses `request.auth.uid`, Firestore uses `request.auth.uid` but different path matching.

---

## Related Documentation

- [LIB.md](../lib/LIB.md) — Firebase Admin SDK (bypasses rules)
- [API.md](../app/api/API.md) — Server-side data access
- [TYPES.md](../types/TYPES.md) — Data schema types
- [Firebase Security Rules Docs](https://firebase.google.com/docs/rules)
