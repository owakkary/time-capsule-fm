// Sanity check for the availability gate: prints exactly what the UI will
// now expose, and which badges dropped out. Pure computation, no I/O.

import { BADGES, EARNABLE_BADGES } from '../lib/badges';
import {
  AVAILABLE_EMPIRES,
  AVAILABLE_EPOCHS,
  AVAILABLE_CONTENT,
  AVAILABLE_EPISODE_COUNT,
  getAvailableEmpires,
  getAvailableEpochs,
  isBadgeEarnable,
} from '../lib/availability';
import { getContentCatalog } from '../lib/recommendations';
import { getFigures, getMoments, getPerspectives, getEmpires } from '../lib/firebase-admin';

console.log('empires :', getAvailableEmpires().map((e) => e.id).join(', '));
console.log('epochs  :', getAvailableEpochs().map((e) => e.id).join(', '));
console.log('content :', JSON.stringify(AVAILABLE_CONTENT));
console.log('episodes:', AVAILABLE_EPISODE_COUNT);

console.log('\n-- API/catalog readers --');
console.log('getEmpires()       ', getEmpires().length);
console.log('getFigures()       ', getFigures().length);
console.log('getMoments()       ', getMoments().length);
console.log('getPerspectives()  ', getPerspectives().length);
console.log('recommend catalog  ', getContentCatalog().length);
console.log('getFigures(hidden) ', getFigures('persian-empire' as never).length, '(expect 0)');

console.log('\n-- badges --');
console.log(`visible ${EARNABLE_BADGES.length} of ${BADGES.length}`);
const hidden = BADGES.filter((b) => !isBadgeEarnable(b.id));
for (const b of hidden) console.log(`  hidden: ${b.id.padEnd(22)} ${b.description}`);

const leaks = getContentCatalog().filter((i) => !AVAILABLE_EMPIRES.includes(i.empire));
console.log('\ncatalog leaks (expect 0):', leaks.length);
console.log('epoch leak (revolutionary hidden):', !AVAILABLE_EPOCHS.includes('revolutionary' as never));
