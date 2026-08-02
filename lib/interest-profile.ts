import { FieldValue } from 'firebase-admin/firestore';
import { EngagementEvent, UserInterestProfile } from '@/types';

/**
 * Atomically update interest profile counters based on an engagement event.
 * Creates the document if it doesn't exist (merge: true).
 */
export async function updateInterestProfileCounters(
  db: FirebaseFirestore.Firestore,
  userId: string,
  event: EngagementEvent
): Promise<void> {
  const profileRef = db.doc(`users/${userId}/explorer/profile/interests/current`);

  const updates: Record<string, FirebaseFirestore.FieldValue | string[]> = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  // Increment empire counter
  if (event.empire) {
    updates[`empireCounts.${event.empire}`] = FieldValue.increment(1);
  }

  // Increment epoch counter
  if (event.epoch) {
    updates[`epochCounts.${event.epoch}`] = FieldValue.increment(1);
  }

  // Increment content type counter
  if (event.contentType) {
    updates[`contentTypeCounts.${event.contentType}`] = FieldValue.increment(1);
  }

  // Track completed episodes
  if (event.eventType === 'episode_completed' && event.episodeId) {
    updates['completedEpisodeIds'] = FieldValue.arrayUnion(event.episodeId);
    updates['totalEpisodesCompleted'] = FieldValue.increment(1);
  }

  // Track started episodes
  if (event.eventType === 'episode_started') {
    updates['totalEpisodesStarted'] = FieldValue.increment(1);
  }

  await profileRef.set(updates, { merge: true });
}

/**
 * Read the user's interest profile counters (empire/epoch/content-type
 * counts, completed episodes). Returns null if the user has no profile yet.
 */
export async function getInterestProfile(
  db: FirebaseFirestore.Firestore,
  userId: string
): Promise<UserInterestProfile | null> {
  const profileRef = db.doc(`users/${userId}/explorer/profile/interests/current`);
  const doc = await profileRef.get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data()!;

  return {
    empireCounts: data.empireCounts || {},
    epochCounts: data.epochCounts || {},
    contentTypeCounts: data.contentTypeCounts || {},
    tagCounts: data.tagCounts || {},
    completedEpisodeIds: data.completedEpisodeIds || [],
    totalEpisodesStarted: data.totalEpisodesStarted || 0,
    totalEpisodesCompleted: data.totalEpisodesCompleted || 0,
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}
