// One-time batch job: pre-generates the entire static content library
// (script + audio for every empire overview/figure/moment/perspective)
// so the deployed app never has to call Claude/ElevenLabs at request time.
//
// Idempotent: skips any item that already has a contentLibrary doc, so a
// failed run can just be re-run without re-paying for completed items.
//
// Usage: npm run generate-library

import { config } from 'dotenv';
config({ path: '.env.local' });

import Anthropic from '@anthropic-ai/sdk';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

import { EMPIRES, EMPIRE_TO_EPOCH, ContentType, EmpireId } from '../types';
import { KEY_FIGURES } from '../lib/seed-data/figures';
import { KEY_MOMENTS } from '../lib/seed-data/moments';
import { PERSPECTIVES } from '../lib/seed-data/perspectives';
import { getVoiceId } from '../lib/voice-mapping';
import { getContentLibraryItemId } from '../lib/content-library';
import {
  SYSTEM_PROMPT,
  PERSPECTIVE_SYSTEM_PROMPT,
  TARGET_DURATION_MINUTES,
  TARGET_WORD_COUNT,
  buildPromptForOverview,
  buildPromptForFigure,
  buildPromptForMoment,
  buildPromptForPerspective,
  buildTitlePrompt,
} from '../lib/content-generation';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

const db = getFirestore(app);
const storage = getStorage(app);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// --dry-run: builds the worklist and checks Firestore for existing items
// (both free) but skips every paid Claude/ElevenLabs call, so you can
// preview exactly what a real run would do before spending anything.
const DRY_RUN = process.argv.includes('--dry-run');

interface WorkItem {
  contentType: ContentType;
  contentId: string | null;
  empireId: EmpireId;
}

function buildWorklist(): WorkItem[] {
  const items: WorkItem[] = [];

  for (const empire of EMPIRES) {
    items.push({ contentType: 'overview', contentId: null, empireId: empire.id });
  }
  for (const figure of KEY_FIGURES) {
    items.push({ contentType: 'figure', contentId: figure.id, empireId: figure.empire });
  }
  for (const moment of KEY_MOMENTS) {
    items.push({ contentType: 'moment', contentId: moment.id, empireId: moment.empire });
  }
  for (const perspective of PERSPECTIVES) {
    items.push({ contentType: 'perspective', contentId: perspective.id, empireId: perspective.empire });
  }

  return items;
}

function buildPrompt(item: WorkItem): string {
  switch (item.contentType) {
    case 'overview':
      return buildPromptForOverview(item.empireId, TARGET_WORD_COUNT);
    case 'figure':
      return buildPromptForFigure(item.contentId!, TARGET_WORD_COUNT);
    case 'moment':
      return buildPromptForMoment(item.contentId!, TARGET_WORD_COUNT);
    case 'perspective':
      return buildPromptForPerspective(item.contentId!, TARGET_WORD_COUNT);
  }
}

async function generateOne(item: WorkItem, itemId: string) {
  const prompt = buildPrompt(item);
  const systemPrompt = item.contentType === 'perspective' ? PERSPECTIVE_SYSTEM_PROMPT : SYSTEM_PROMPT;

  const scriptMessage = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 4000,
    thinking: { type: 'disabled' },
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });
  const script = scriptMessage.content[0].type === 'text' ? scriptMessage.content[0].text : '';

  const titleMessage = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 50,
    thinking: { type: 'disabled' },
    messages: [{ role: 'user', content: buildTitlePrompt(item.contentType, script) }],
  });
  const title = titleMessage.content[0].type === 'text'
    ? titleMessage.content[0].text.trim().replace(/"/g, '')
    : 'History Episode';

  const voiceId = getVoiceId(item.contentType, item.contentId ?? undefined);
  const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      Accept: 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text: script,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true },
    }),
  });

  if (!ttsResponse.ok) {
    const errorText = await ttsResponse.text();
    throw new Error(`ElevenLabs error (${ttsResponse.status}): ${errorText}`);
  }

  const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
  const bucket = storage.bucket();
  const fileName = `content-library/${itemId}.mp3`;
  const file = bucket.file(fileName);
  await file.save(audioBuffer, { metadata: { contentType: 'audio/mpeg' } });
  await file.makePublic();
  const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  await db.collection('contentLibrary').doc(itemId).set({
    id: itemId,
    contentType: item.contentType,
    contentId: item.contentId,
    empireId: item.empireId,
    epochId: EMPIRE_TO_EPOCH[item.empireId],
    title,
    script,
    durationMinutes: TARGET_DURATION_MINUTES,
    voiceId,
    audioUrl,
    audioDurationSeconds: null,
    wordCount: script.split(/\s+/).length,
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function main() {
  const worklist = buildWorklist();
  console.log(`Content library worklist: ${worklist.length} items${DRY_RUN ? ' (DRY RUN — no API calls will be made)' : ''}`);

  let created = 0;
  let skipped = 0;
  let failed = 0;
  let wouldCreate = 0;

  for (let index = 0; index < worklist.length; index++) {
    const item = worklist[index];
    const itemId = getContentLibraryItemId(item.contentType, item.empireId, item.contentId);
    const progress = `[${index + 1}/${worklist.length}]`;

    const existing = await db.collection('contentLibrary').doc(itemId).get();
    if (existing.exists) {
      console.log(`${progress} skip (already exists): ${itemId}`);
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`${progress} would generate: ${itemId}`);
      wouldCreate++;
      continue;
    }

    try {
      await generateOne(item, itemId);
      console.log(`${progress} done: ${itemId}`);
      created++;
    } catch (error) {
      console.error(`${progress} FAILED: ${itemId}`, error);
      failed++;
    }
  }

  if (DRY_RUN) {
    console.log(`\nDry run complete. Would create ${wouldCreate}, would skip ${skipped} (already exist).`);
    return;
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped} (already existed), failed ${failed}.`);
  if (failed > 0) {
    console.log('Re-run this script to retry only the failed items.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
