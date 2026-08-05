// Read-only: does every episode the UI links to actually exist in the
// content library? Anything listed as MISSING renders "Episode Not Found"
// when a user taps it.

import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { AVAILABLE_EMPIRES, isContentTypeAvailable } from '../lib/availability';
import { KEY_FIGURES } from '../lib/seed-data/figures';
import { KEY_MOMENTS } from '../lib/seed-data/moments';
import { PERSPECTIVES } from '../lib/seed-data/perspectives';
import { getContentLibraryItemId } from '../lib/content-library';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

async function main() {
  const snap = await db.collection('contentLibrary').get();
  const have = new Set<string>();
  snap.forEach((d) => have.add(d.id));

  // Mirrors exactly what the UI links to: available empire AND available
  // content type. Anything MISSING here is a dead link a user can reach.
  const expected: { id: string; kind: string }[] = [];
  if (isContentTypeAvailable('overview')) {
    for (const e of AVAILABLE_EMPIRES) {
      expected.push({ id: getContentLibraryItemId('overview', e, null), kind: 'overview' });
    }
  }
  if (isContentTypeAvailable('figure')) {
    for (const f of KEY_FIGURES) {
      if (AVAILABLE_EMPIRES.includes(f.empire)) {
        expected.push({ id: getContentLibraryItemId('figure', f.empire, f.id), kind: 'figure' });
      }
    }
  }
  if (isContentTypeAvailable('moment')) {
    for (const m of KEY_MOMENTS) {
      if (AVAILABLE_EMPIRES.includes(m.empire)) {
        expected.push({ id: getContentLibraryItemId('moment', m.empire, m.id), kind: 'moment' });
      }
    }
  }
  if (isContentTypeAvailable('perspective')) {
    for (const p of PERSPECTIVES) {
      if (AVAILABLE_EMPIRES.includes(p.empire)) {
        expected.push({ id: getContentLibraryItemId('perspective', p.empire, p.id), kind: 'perspective' });
      }
    }
  }

  const missing = expected.filter((e) => !have.has(e.id));
  const present = expected.filter((e) => have.has(e.id));

  console.log(`Season 1 episodes the UI links to: ${expected.length}`);
  console.log(`  present: ${present.length}`);
  console.log(`  MISSING: ${missing.length}\n`);

  const byKind: Record<string, { present: number; missing: number }> = {};
  for (const e of expected) {
    byKind[e.kind] ??= { present: 0, missing: 0 };
    if (have.has(e.id)) byKind[e.kind].present++;
    else byKind[e.kind].missing++;
  }
  for (const [kind, counts] of Object.entries(byKind)) {
    console.log(`  ${kind.padEnd(12)} ${counts.present} present / ${counts.missing} missing`);
  }

  if (missing.length) {
    console.log('\nMissing ids:');
    for (const m of missing) console.log(`  ${m.id}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
