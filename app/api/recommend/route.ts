import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getAdminDb } from '@/lib/firebase-admin';
import { getInterestProfile } from '@/lib/interest-profile';
import {
  getContentCatalog,
  scoreRecommendations,
  getHostPitch,
  getReason,
  getWelcomeBack,
} from '@/lib/recommendations';
import { getEmpire, Recommendation, RecommendationResponse } from '@/types';

// Simple in-memory rate limiting + caching
const cache = new Map<
  string,
  { lastRequest: number; cachedResponse: RecommendationResponse }
>();

const CACHE_TTL_MS = 60 * 1000; // 60 seconds
const RECOMMENDATION_COUNT = 4;
// Ask for a few extra candidates in case some aren't in the content library yet
const CANDIDATE_POOL_SIZE = RECOMMENDATION_COUNT + 3;

export async function GET(request: NextRequest) {
  // Auth
  const authHeader = request.headers.get('authorization');
  const decodedToken = await verifyAuthToken(authHeader);
  if (!decodedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = decodedToken.uid;

  // Check cache / rate limit
  const cached = cache.get(userId);
  if (cached && Date.now() - cached.lastRequest < CACHE_TTL_MS) {
    return NextResponse.json(cached.cachedResponse);
  }

  const db = getAdminDb();

  const profile = await getInterestProfile(db, userId);

  if (!profile || profile.totalEpisodesStarted < 3) {
    const newUserResponse: RecommendationResponse = {
      recommendations: [],
      welcomeBack: '',
      isNewUser: true,
    };
    cache.set(userId, {
      lastRequest: Date.now(),
      cachedResponse: newUserResponse,
    });
    return NextResponse.json(newUserResponse);
  }

  const catalog = getContentCatalog();
  const candidates = scoreRecommendations(profile, catalog, CANDIDATE_POOL_SIZE);

  // Only recommend items that actually exist in the content library yet
  const recommendations: Recommendation[] = [];
  for (const candidate of candidates) {
    if (recommendations.length >= RECOMMENDATION_COUNT) break;

    const itemSnap = await db.collection('contentLibrary').doc(candidate.id).get();
    if (!itemSnap.exists) continue;

    const item = itemSnap.data()!;
    const empireName = getEmpire(candidate.empire)?.name || candidate.empire;

    recommendations.push({
      id: candidate.id,
      empire: candidate.empire,
      epoch: candidate.epoch,
      contentType: candidate.contentType,
      contentId: candidate.contentId,
      title: item.title,
      hostPitch: getHostPitch(candidate.contentType, item.title, empireName),
      reason: getReason(candidate, profile, empireName),
      confidence: 0.7,
    });
  }

  const result: RecommendationResponse = {
    recommendations,
    welcomeBack: getWelcomeBack(profile),
    isNewUser: false,
  };

  cache.set(userId, {
    lastRequest: Date.now(),
    cachedResponse: result,
  });

  return NextResponse.json(result);
}
