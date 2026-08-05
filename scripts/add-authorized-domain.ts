// Adds a domain to Firebase Auth's authorized-domains list, so OAuth
// providers (Google sign-in) accept requests from it. Needed once per new
// hostname — e.g. the stable Vercel preview alias. Uses the same service
// account as the batch script; idempotent.
//
// Usage: npx tsx scripts/add-authorized-domain.ts <domain>

import { config } from 'dotenv';
config({ path: '.env.local' });

import { JWT } from 'google-auth-library';

async function main() {
  const domain = process.argv[2];
  if (!domain) {
    console.error('usage: npx tsx scripts/add-authorized-domain.ts <domain>');
    process.exit(1);
  }

  const client = new JWT({
    email: process.env.FIREBASE_CLIENT_EMAIL,
    key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const url = `https://identitytoolkit.googleapis.com/admin/v2/projects/${process.env.FIREBASE_PROJECT_ID}/config`;

  const current = await client.request<{ authorizedDomains?: string[] }>({ url });
  const domains = current.data.authorizedDomains ?? [];
  console.log('current:', domains.join(', '));

  if (domains.includes(domain)) {
    console.log(`already authorized: ${domain}`);
    return;
  }

  await client.request({
    url: `${url}?updateMask=authorizedDomains`,
    method: 'PATCH',
    data: { authorizedDomains: [...domains, domain] },
  });
  console.log(`added: ${domain}`);
}

main().catch((error) => {
  console.error(error.response?.data ?? error);
  process.exit(1);
});
