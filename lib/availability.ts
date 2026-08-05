// Which empires are actually shippable, and everything derived from that.
//
// Only these empires get real ElevenLabs narration; every other empire's
// episodes would fall back to the browser's robotic Web Speech voice, which
// oversells them as finished content. So the UI shows only these, and the
// generation script uses the same list to decide where to spend TTS credits.
//
// This is a gate, not a deletion: the seed data and generated scripts for the
// other 18 empires stay put. Widening the app is a one-line change here.

import { EMPIRES, EPOCHS, EmpireId, EpochId } from '@/types';
import { KEY_FIGURES } from './seed-data/figures';
import { KEY_MOMENTS } from './seed-data/moments';
import { PERSPECTIVES } from './seed-data/perspectives';

export const AVAILABLE_EMPIRES: EmpireId[] = [
  'ancient-egypt',
  'classical-greece',
  'roman-empire',
];

// The product frame for the current allowlist: a bounded catalog presented as
// a season, not a limitation. Copy should say "Season 1" wherever it would
// otherwise have to apologize for scope.
export const SEASON = {
  number: 1,
  title: 'The Ancient Mediterranean',
  tagline: 'Egypt, Greece, and Rome — the three civilizations everything else answers to.',
} as const;

export function isEmpireAvailable(empireId: string | null | undefined): boolean {
  return !!empireId && (AVAILABLE_EMPIRES as string[]).includes(empireId);
}

// An epoch is shown only if it still has at least one available empire.
// With the current list that hides the Revolutionary Age entirely.
export const AVAILABLE_EPOCHS: EpochId[] = EPOCHS
  .filter((epoch) => epoch.empires.some((e) => isEmpireAvailable(e)))
  .map((epoch) => epoch.id);

export function isEpochAvailable(epochId: string | null | undefined): boolean {
  return !!epochId && (AVAILABLE_EPOCHS as string[]).includes(epochId);
}

export function getAvailableEmpires() {
  return EMPIRES.filter((e) => isEmpireAvailable(e.id));
}

export function getAvailableEpochs() {
  return EPOCHS.filter((e) => isEpochAvailable(e.id));
}

// Empires listed on an epoch, narrowed to the ones actually available.
export function getAvailableEmpiresForEpoch(epochId: string) {
  return getAvailableEmpires().filter((e) => e.epochId === epochId);
}

export function filterByAvailableEmpire<T extends { empire: string }>(items: T[]): T[] {
  return items.filter((item) => isEmpireAvailable(item.empire));
}

// How much content the allowlist actually reaches. Used to decide which
// count-based badges are still possible to earn.
export const AVAILABLE_CONTENT = {
  empires: AVAILABLE_EMPIRES.length,
  epochs: AVAILABLE_EPOCHS.length,
  overviews: AVAILABLE_EMPIRES.length,
  figures: filterByAvailableEmpire(KEY_FIGURES).length,
  moments: filterByAvailableEmpire(KEY_MOMENTS).length,
  perspectives: filterByAvailableEmpire(PERSPECTIVES).length,
};

export const AVAILABLE_EPISODE_COUNT =
  AVAILABLE_CONTENT.overviews +
  AVAILABLE_CONTENT.figures +
  AVAILABLE_CONTENT.moments +
  AVAILABLE_CONTENT.perspectives;

// Every episode is generated at this length, so this bounds the total
// listening time a user could possibly accumulate.
const MINUTES_PER_EPISODE = 10;
const AVAILABLE_LISTENING_MINUTES = AVAILABLE_EPISODE_COUNT * MINUTES_PER_EPISODE;

// What each badge needs, declared so earnability follows from the allowlist
// instead of a hand-maintained list that silently rots when it changes.
// 'unbounded' = time/streak based, always reachable.
type BadgeRequirement =
  | { kind: 'unbounded' }
  | { kind: 'empire'; empireId: EmpireId }
  | { kind: 'epoch'; epochId: EpochId }
  | { kind: 'epochCount'; n: number }
  | { kind: 'empireCount'; n: number }
  | { kind: 'episodes'; n: number }
  | { kind: 'listeningMinutes'; n: number }
  | { kind: 'figures'; n: number }
  | { kind: 'moments'; n: number }
  | { kind: 'perspectives'; n: number }
  | { kind: 'overviews'; n: number };

const BADGE_REQUIREMENTS: Record<string, BadgeRequirement> = {
  // Milestone — bounded by how many episodes exist to play.
  'first-steps': { kind: 'episodes', n: 1 },
  'curious-mind': { kind: 'episodes', n: 5 },
  'dedicated-scholar': { kind: 'episodes', n: 25 },
  'history-devotee': { kind: 'episodes', n: 50 },
  'master-historian': { kind: 'episodes', n: 100 },
  'attentive-listener': { kind: 'episodes', n: 1 },
  'deep-listener': { kind: 'listeningMinutes', n: 600 },
  'marathon-listener': { kind: 'listeningMinutes', n: 3000 },

  // Discovery
  'ancient-initiate': { kind: 'epoch', epochId: 'bronze-age' },
  'revolutionary-spirit': { kind: 'epoch', epochId: 'revolutionary' },
  'dual-era-explorer': { kind: 'epoch', epochId: 'revolutionary' },
  'epoch-explorer': { kind: 'epochCount', n: 4 },
  'world-historian': { kind: 'empireCount', n: 21 },

  // Empire mastery
  'keeper-of-the-nile': { kind: 'empire', empireId: 'ancient-egypt' },
  'persian-scholar': { kind: 'empire', empireId: 'persian-empire' },
  'hellenic-sage': { kind: 'empire', empireId: 'classical-greece' },
  'roman-consul': { kind: 'empire', empireId: 'roman-empire' },
  'silk-road-merchant': { kind: 'empire', empireId: 'han-china' },
  'british-scholar': { kind: 'empire', empireId: 'british-empire' },
  'founding-father': { kind: 'empire', empireId: 'united-states' },

  // Streak — depends on calendar days, not content.
  'weekly-wanderer': { kind: 'unbounded' },
  'monthly-master': { kind: 'unbounded' },
  'century-seeker': { kind: 'unbounded' },

  // Special — the collection badges target all of the season's content
  // (mirroring their definitions in lib/badges.ts), so they're earnable by
  // construction at any allowlist width.
  'perspective-seeker': { kind: 'perspectives', n: 5 },
  'figure-finder': { kind: 'figures', n: AVAILABLE_CONTENT.figures },
  'moment-maven': { kind: 'moments', n: AVAILABLE_CONTENT.moments },
  'overview-collector': { kind: 'overviews', n: AVAILABLE_CONTENT.overviews },
};

export function isBadgeEarnable(badgeId: string): boolean {
  const req = BADGE_REQUIREMENTS[badgeId];
  // A badge with no declared requirement is left visible rather than being
  // hidden by accident — failing open is the safer default here.
  if (!req) return true;

  switch (req.kind) {
    case 'unbounded': return true;
    case 'empire': return isEmpireAvailable(req.empireId);
    case 'epoch': return isEpochAvailable(req.epochId);
    case 'epochCount': return AVAILABLE_CONTENT.epochs >= req.n;
    case 'empireCount': return AVAILABLE_CONTENT.empires >= req.n;
    case 'episodes': return AVAILABLE_EPISODE_COUNT >= req.n;
    case 'listeningMinutes': return AVAILABLE_LISTENING_MINUTES >= req.n;
    case 'figures': return AVAILABLE_CONTENT.figures >= req.n;
    case 'moments': return AVAILABLE_CONTENT.moments >= req.n;
    case 'perspectives': return AVAILABLE_CONTENT.perspectives >= req.n;
    case 'overviews': return AVAILABLE_CONTENT.overviews >= req.n;
  }
}
