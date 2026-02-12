import { FieldValue } from 'firebase-admin/firestore';
import Anthropic from '@anthropic-ai/sdk';
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
  const profileRef = db.doc(`users/${userId}/explorer/profile/interests`);

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
 * Read and optionally analyze the user's interest profile.
 * Returns raw counters if < 3 episodes started.
 * Lazily re-analyzes with Claude if cached analysis is > 24h old.
 */
export async function analyzeInterestProfile(
  db: FirebaseFirestore.Firestore,
  userId: string
): Promise<UserInterestProfile | null> {
  const profileRef = db.doc(`users/${userId}/explorer/profile/interests`);
  const doc = await profileRef.get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data()!;

  const profile: UserInterestProfile = {
    empireCounts: data.empireCounts || {},
    epochCounts: data.epochCounts || {},
    contentTypeCounts: data.contentTypeCounts || {},
    tagCounts: data.tagCounts || {},
    completedEpisodeIds: data.completedEpisodeIds || [],
    totalEpisodesStarted: data.totalEpisodesStarted || 0,
    totalEpisodesCompleted: data.totalEpisodesCompleted || 0,
    inferredInterests: data.inferredInterests || [],
    knowledgeGaps: data.knowledgeGaps || [],
    personalityNotes: data.personalityNotes || '',
    explorationStyle: data.explorationStyle || '',
    lastAnalyzedAt: data.lastAnalyzedAt?.toDate() || null,
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };

  // Not enough data to analyze
  if (profile.totalEpisodesStarted < 3) {
    return profile;
  }

  // Check if cached analysis is still fresh (< 24h)
  if (profile.lastAnalyzedAt) {
    const hoursSinceAnalysis =
      (Date.now() - profile.lastAnalyzedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceAnalysis < 24) {
      return profile;
    }
  }

  // Run Claude analysis
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const userPrompt = `Analyze this Time Capsule FM user's engagement data and return ONLY valid JSON.

Engagement counters:
- Empire counts: ${JSON.stringify(profile.empireCounts)}
- Epoch counts: ${JSON.stringify(profile.epochCounts)}
- Content type counts: ${JSON.stringify(profile.contentTypeCounts)}
- Episodes started: ${profile.totalEpisodesStarted}
- Episodes completed: ${profile.totalEpisodesCompleted}
- Completed episode IDs: ${profile.completedEpisodeIds.length} episodes

Return JSON with these fields:
{
  "inferredInterests": ["string array of 3-5 inferred historical interests"],
  "knowledgeGaps": ["string array of 2-4 areas/empires they haven't explored"],
  "personalityNotes": "one sentence about their exploration personality",
  "explorationStyle": "one of: deep-diver, broad-explorer, completionist, casual-listener"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system:
        'You are an interest profiler for Time Capsule FM, a history exploration app. Analyze engagement patterns and provide insights. Return ONLY valid JSON.',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text);

    const analysisUpdate = {
      inferredInterests: parsed.inferredInterests || [],
      knowledgeGaps: parsed.knowledgeGaps || [],
      personalityNotes: parsed.personalityNotes || '',
      explorationStyle: parsed.explorationStyle || '',
      lastAnalyzedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await profileRef.set(analysisUpdate, { merge: true });

    // Return updated profile
    return {
      ...profile,
      inferredInterests: parsed.inferredInterests || [],
      knowledgeGaps: parsed.knowledgeGaps || [],
      personalityNotes: parsed.personalityNotes || '',
      explorationStyle: parsed.explorationStyle || '',
      lastAnalyzedAt: new Date(),
    };
  } catch (error) {
    console.error('Interest profile analysis failed:', error);
    // Return profile without updated analysis on failure
    return profile;
  }
}
