// Read-only: cross-references contentLibrary doc ids against the ids the
// batch worklist would produce, to surface docs whose seed-data item no
// longer exists (renamed/removed) and worklist items not yet generated.

import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { EMPIRES } from '../types';
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
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

const db = getFirestore(app);

async function main() {
  const expected = new Set<string>();
  for (const e of EMPIRES) expected.add(getContentLibraryItemId('overview', e.id, null));
  for (const f of KEY_FIGURES) expected.add(getContentLibraryItemId('figure', f.empire, f.id));
  for (const m of KEY_MOMENTS) expected.add(getContentLibraryItemId('moment', m.empire, m.id));
  for (const p of PERSPECTIVES) expected.add(getContentLibraryItemId('perspective', p.empire, p.id));

  const snap = await db.collection('contentLibrary').get();
  const actual = new Set<string>();
  snap.forEach((d) => actual.add(d.id));

  const orphans = Array.from(actual).filter((id) => !expected.has(id));

  console.log(`expected (worklist) ids : ${expected.size}`);
  console.log(`actual contentLibrary   : ${actual.size}`);
  console.log(`orphans (doc not in worklist): ${orphans.length}`);
  orphans.forEach((o) => console.log(`  ORPHAN  ${o}`));

  console.log(`\nseed-data counts: figures=${KEY_FIGURES.length} moments=${KEY_MOMENTS.length} perspectives=${PERSPECTIVES.length} empires=${EMPIRES.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
