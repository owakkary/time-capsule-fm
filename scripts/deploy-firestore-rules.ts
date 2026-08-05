// Deploys firebase/firestore.rules via the Firebase Rules REST API, using the
// same service account as the batch script. Exists because this project has
// no local firebase-tools install, and rules that live only in the repo don't
// protect (or permit) anything.
//
//   npx tsx scripts/deploy-firestore-rules.ts            # show deployed rules
//   npx tsx scripts/deploy-firestore-rules.ts --deploy   # publish the repo's

import { config } from 'dotenv';
config({ path: '.env.local' });

import { readFileSync } from 'fs';
import { JWT } from 'google-auth-library';

const PROJECT = process.env.FIREBASE_PROJECT_ID!;
const RULES_PATH = 'firebase/firestore.rules';
const DEPLOY = process.argv.includes('--deploy');

async function main() {
  const client = new JWT({
    email: process.env.FIREBASE_CLIENT_EMAIL,
    key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/firebase'],
  });

  // What's live right now.
  const release = await client.request<{ rulesetName: string }>({
    url: `https://firebaserules.googleapis.com/v1/projects/${PROJECT}/releases/cloud.firestore`,
  });
  const liveName = release.data.rulesetName;
  const live = await client.request<{ source: { files: { content: string }[] } }>({
    url: `https://firebaserules.googleapis.com/v1/${liveName}`,
  });
  const liveSource = live.data.source.files[0].content;

  const localSource = readFileSync(RULES_PATH, 'utf8');
  const identical = liveSource.trim() === localSource.trim();

  console.log(`live ruleset: ${liveName}`);
  console.log(`matches ${RULES_PATH}: ${identical}`);
  console.log(`live contentLibrary rule present: ${liveSource.includes('contentLibrary')}`);

  if (!DEPLOY) {
    console.log('\n--- live rules ---');
    console.log(liveSource);
    console.log('--- end ---\n(pass --deploy to publish the repo version)');
    return;
  }

  if (identical) {
    console.log('Already up to date; nothing to deploy.');
    return;
  }

  const created = await client.request<{ name: string }>({
    url: `https://firebaserules.googleapis.com/v1/projects/${PROJECT}/rulesets`,
    method: 'POST',
    data: { source: { files: [{ name: RULES_PATH, content: localSource }] } },
  });
  console.log(`created ruleset: ${created.data.name}`);

  // Releases are updated with PATCH and a wrapped `release` body; PUT 404s.
  await client.request({
    url: `https://firebaserules.googleapis.com/v1/projects/${PROJECT}/releases/cloud.firestore`,
    method: 'PATCH',
    data: {
      release: {
        name: `projects/${PROJECT}/releases/cloud.firestore`,
        rulesetName: created.data.name,
      },
    },
  });
  console.log('released to cloud.firestore');
}

main().catch((error) => {
  console.error(error.response?.data ?? error);
  process.exit(1);
});
