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

import { EMPIRES, EMPIRE_TO_EPOCH, ContentType, EmpireId, QuizQuestion } from '../types';
import { KEY_FIGURES } from '../lib/seed-data/figures';
import { KEY_MOMENTS } from '../lib/seed-data/moments';
import { PERSPECTIVES } from '../lib/seed-data/perspectives';
import { getVoiceId } from '../lib/voice-mapping';
import { getContentLibraryItemId } from '../lib/content-library';
import { AVAILABLE_EMPIRES } from '../lib/availability';
import { QUIZ_QUESTION_COUNT } from '../lib/quiz';
import {
  SYSTEM_PROMPT,
  PERSPECTIVE_SYSTEM_PROMPT,
  TARGET_DURATION_MINUTES,
  TARGET_WORD_COUNT,
  QUIZ_OUTPUT_SCHEMA,
  buildPromptForOverview,
  buildPromptForFigure,
  buildPromptForMoment,
  buildPromptForPerspective,
  buildTitlePrompt,
  buildQuizPrompt,
} from '../lib/content-generation';

// Empires that get real ElevenLabs narration; every other empire's content
// still gets a script + quiz, but is narrated client-side via the free
// Web Speech API to keep TTS cost bounded to this fixed set.
//
// Same list the app ships, so "has real narration" and "is visible in the UI"
// can never drift apart — widening one widens the other.
const FULL_AUDIO_EMPIRES: EmpireId[] = AVAILABLE_EMPIRES;

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

// --limit=N: stop after generating N real items, for cheaply spot-checking
// a run (e.g. the quiz JSON shape) before committing to the full worklist.
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

// --backfill: repair existing docs instead of creating missing ones.
// Because a normal run skips any item that already has a doc, items written
// before a field was introduced would otherwise keep the old shape forever —
// and an item with no quiz can never be completed by a user, so its XP is
// unreachable. Backfill regenerates only the missing pieces from the script
// already stored in Firestore: one cheap Claude call for the quiz, and no
// ElevenLabs call at all, so it never re-pays for narration.
const BACKFILL = process.argv.includes('--backfill');

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

function parseQuiz(rawText: string): QuizQuestion[] {
  const parsed = JSON.parse(rawText) as { questions?: unknown[] };
  const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

  return questions
    .filter((q): q is QuizQuestion => {
      const c = q as Partial<QuizQuestion>;
      return typeof c.question === 'string'
        && Array.isArray(c.options) && c.options.length === 4
        && typeof c.correctIndex === 'number'
        && c.correctIndex >= 0 && c.correctIndex < 4;
    })
    .slice(0, QUIZ_QUESTION_COUNT);
}

// Generates a quiz from an already-written script. Shared by the create path
// and the --backfill path so both produce identically-shaped quizzes.
async function generateQuizForScript(script: string): Promise<QuizQuestion[]> {
  const quizMessage = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 1200,
    thinking: { type: 'disabled' },
    output_config: { format: { type: 'json_schema', schema: QUIZ_OUTPUT_SCHEMA } },
    messages: [{ role: 'user', content: buildQuizPrompt(script) }],
  });
  const quizText = quizMessage.content[0].type === 'text' ? quizMessage.content[0].text : '{}';
  return parseQuiz(quizText);
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

  const quiz = await generateQuizForScript(script);

  const voiceId = getVoiceId(item.contentType, item.contentId ?? undefined);
  const useElevenLabs = FULL_AUDIO_EMPIRES.includes(item.empireId);

  let audioUrl: string | null = null;
  if (useElevenLabs) {
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
    audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }

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
    audioProvider: useElevenLabs ? 'elevenlabs' : 'browser-speech',
    audioUrl,
    audioDurationSeconds: null,
    wordCount: script.split(/\s+/).length,
    quiz,
    createdAt: FieldValue.serverTimestamp(),
  });
}

// Repairs existing docs that predate a schema addition. Only ever fills in
// what's missing — it never rewrites a script, title, or audio file, so it
// costs at most one Claude call per stale doc and zero ElevenLabs credits.
async function runBackfill() {
  const snap = await db.collection('contentLibrary').get();
  console.log(`Backfill scan: ${snap.size} existing docs${DRY_RUN ? ' (DRY RUN — no API calls will be made)' : ''}`);

  const stale = snap.docs.filter((doc) => {
    const d = doc.data();
    const needsQuiz = !Array.isArray(d.quiz) || d.quiz.length === 0;
    const needsProvider = d.audioProvider === undefined;
    return needsQuiz || needsProvider;
  });

  if (stale.length === 0) {
    console.log('Nothing to backfill — every doc already has a quiz and an audioProvider.');
    return;
  }

  console.log(`${stale.length} doc(s) need backfilling.`);
  let repaired = 0;
  let failed = 0;

  for (let i = 0; i < stale.length; i++) {
    const doc = stale[i];
    const d = doc.data();
    const progress = `[${i + 1}/${stale.length}]`;
    const needsQuiz = !Array.isArray(d.quiz) || d.quiz.length === 0;
    // Docs written before audioProvider existed always had a real mp3, so an
    // existing audioUrl is the correct signal for how they should be played.
    const provider = d.audioProvider ?? (d.audioUrl ? 'elevenlabs' : 'browser-speech');

    if (DRY_RUN) {
      console.log(`${progress} would backfill: ${doc.id} (quiz=${needsQuiz ? 'yes' : 'no'}, provider=${provider})`);
      continue;
    }

    if (needsQuiz && typeof d.script !== 'string') {
      console.error(`${progress} SKIP (no stored script to build a quiz from): ${doc.id}`);
      failed++;
      continue;
    }

    try {
      const update: Record<string, unknown> = { audioProvider: provider };
      if (needsQuiz) update.quiz = await generateQuizForScript(d.script);
      await doc.ref.set(update, { merge: true });
      const n = Array.isArray(update.quiz) ? (update.quiz as QuizQuestion[]).length : 'unchanged';
      console.log(`${progress} backfilled: ${doc.id} (quiz=${n}, provider=${provider})`);
      repaired++;
    } catch (error) {
      console.error(`${progress} FAILED: ${doc.id}`, error);
      failed++;
    }
  }

  if (DRY_RUN) return;
  console.log(`\nBackfill done. Repaired ${repaired}, failed ${failed}.`);
  if (failed > 0) process.exit(1);
}

async function main() {
  if (BACKFILL) {
    await runBackfill();
    return;
  }

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

    if (created >= LIMIT) {
      console.log(`\nHit --limit=${LIMIT}, stopping early.`);
      break;
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
