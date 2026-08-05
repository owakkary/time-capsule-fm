import { EMPIRES, EmpireId, EpochId, ContentType, UserInterestProfile, getEmpire } from '@/types';
import { KEY_FIGURES } from '@/lib/seed-data/figures';
import { KEY_MOMENTS } from '@/lib/seed-data/moments';
import { PERSPECTIVES } from '@/lib/seed-data/perspectives';
import { isEmpireAvailable } from '@/lib/availability';
import { getContentLibraryItemId } from '@/lib/content-library';

export interface CatalogItem {
  id: string;
  empire: EmpireId;
  epoch: EpochId;
  contentType: ContentType;
  contentId?: string;
}

/**
 * The full catalog of content library items, derived from the same static
 * seed data the batch generation script uses. No Claude call involved —
 * this is pure lookup/scoring logic.
 */
export function getContentCatalog(): CatalogItem[] {
  const items: CatalogItem[] = [];

  for (const empire of EMPIRES) {
    items.push({
      id: getContentLibraryItemId('overview', empire.id),
      empire: empire.id,
      epoch: empire.epochId,
      contentType: 'overview',
    });
  }
  for (const figure of KEY_FIGURES) {
    items.push({
      id: getContentLibraryItemId('figure', figure.empire, figure.id),
      empire: figure.empire,
      epoch: getEmpire(figure.empire)!.epochId,
      contentType: 'figure',
      contentId: figure.id,
    });
  }
  for (const moment of KEY_MOMENTS) {
    items.push({
      id: getContentLibraryItemId('moment', moment.empire, moment.id),
      empire: moment.empire,
      epoch: getEmpire(moment.empire)!.epochId,
      contentType: 'moment',
      contentId: moment.id,
    });
  }
  for (const perspective of PERSPECTIVES) {
    items.push({
      id: getContentLibraryItemId('perspective', perspective.empire, perspective.id),
      empire: perspective.empire,
      epoch: getEmpire(perspective.empire)!.epochId,
      contentType: 'perspective',
      contentId: perspective.id,
    });
  }

  // Never recommend an episode the UI won't let the user open.
  return items.filter((item) => isEmpireAvailable(item.empire));
}

/**
 * Deterministic scoring: balance familiar territory (empires/epochs the
 * user already listens to) with discovery (empires they haven't tried),
 * and cap how many of one content type appear together for variety.
 * Replaces what used to be an Anthropic call per dashboard load.
 */
export function scoreRecommendations(
  profile: UserInterestProfile,
  catalog: CatalogItem[],
  count: number
): CatalogItem[] {
  const completed = new Set(profile.completedEpisodeIds);
  const candidates = catalog.filter((item) => !completed.has(item.id));

  const scored = candidates.map((item) => {
    const empireFamiliarity = profile.empireCounts[item.empire] || 0;
    const epochFamiliarity = profile.epochCounts[item.epoch] || 0;
    const isNewEmpire = empireFamiliarity === 0;
    const score =
      empireFamiliarity * 2 +
      epochFamiliarity +
      (isNewEmpire ? 3 : 0) +
      Math.random(); // jitter so ties don't resolve identically every time
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Greedily pick while capping same-content-type repeats for variety
  const picked: CatalogItem[] = [];
  const typeCounts: Partial<Record<ContentType, number>> = {};
  for (const { item } of scored) {
    const typeCount = typeCounts[item.contentType] || 0;
    if (typeCount >= 2) continue;
    picked.push(item);
    typeCounts[item.contentType] = typeCount + 1;
    if (picked.length >= count) break;
  }

  return picked;
}

const HOST_PITCH_TEMPLATES: Record<ContentType, (title: string, empireName: string) => string> = {
  overview: (_title, empireName) =>
    `A sweeping tour through ${empireName} — the rise, the peak, and the fascinating weirdness in between.`,
  figure: (title, empireName) => `Meet the person behind the legend: ${title}, from ${empireName}.`,
  moment: (title, empireName) => `Step into "${title}" — one of ${empireName}'s defining chapters.`,
  perspective: (title, _empireName) => `Live a day in someone else's shoes: "${title}," told in the first person.`,
};

export function getHostPitch(contentType: ContentType, title: string, empireName: string): string {
  return HOST_PITCH_TEMPLATES[contentType](title, empireName);
}

export function getReason(item: CatalogItem, profile: UserInterestProfile, empireName: string): string {
  const empireFamiliarity = profile.empireCounts[item.empire] || 0;
  if (empireFamiliarity === 0) {
    return 'A new civilization to discover.';
  }
  return `Because you've been exploring ${empireName}.`;
}

export function getWelcomeBack(profile: UserInterestProfile): string {
  const topEmpireId = Object.entries(profile.empireCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topEmpire = topEmpireId ? getEmpire(topEmpireId as EmpireId) : null;

  if (topEmpire) {
    return `Welcome back — ready to continue your journey through ${topEmpire.name}, or explore somewhere new?`;
  }
  return 'Welcome back — your journey through history continues.';
}
