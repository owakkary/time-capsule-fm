// Read-only audit of the contentLibrary collection. Makes no API calls and
// writes nothing — it just reports which pre-generated items are missing the
// fields added by later schema changes (quiz, audioProvider).
//
// Usage: npx tsx scripts/audit-library.ts

import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
  const snap = await db.collection('contentLibrary').get();
  console.log(`contentLibrary docs: ${snap.size}\n`);

  const missingQuiz: string[] = [];
  const emptyQuiz: string[] = [];
  const missingProvider: string[] = [];
  const missingAudioUrl: string[] = [];

  snap.forEach((doc) => {
    const d = doc.data();
    if (d.quiz === undefined) missingQuiz.push(doc.id);
    else if (!Array.isArray(d.quiz) || d.quiz.length === 0) emptyQuiz.push(doc.id);
    if (d.audioProvider === undefined) missingProvider.push(doc.id);
    if (!d.audioUrl) missingAudioUrl.push(doc.id);
  });

  console.log(`missing quiz field entirely : ${missingQuiz.length}`);
  console.log(`quiz present but empty      : ${emptyQuiz.length}`);
  console.log(`missing audioProvider       : ${missingProvider.length}`);
  console.log(`no audioUrl                 : ${missingAudioUrl.length}`);

  if (missingQuiz.length) console.log(`\nmissing quiz: ${missingQuiz.join(', ')}`);
  if (missingProvider.length) console.log(`missing audioProvider: ${missingProvider.join(', ')}`);

  console.log('\n--- per-doc ---');
  const rows: string[] = [];
  snap.forEach((doc) => {
    const d = doc.data();
    rows.push(
      [
        doc.id.padEnd(38),
        `quiz=${Array.isArray(d.quiz) ? String(d.quiz.length).padStart(2) : '--'}`,
        `provider=${(d.audioProvider ?? 'MISSING').padEnd(14)}`,
        `audio=${d.audioUrl ? 'yes' : 'no '}`,
        `words=${d.wordCount ?? '?'}`,
      ].join('  ')
    );
  });
  rows.sort().forEach((r) => console.log(r));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
