import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { verifyAuthToken, getAdminDb } from '@/lib/firebase-admin';
import { analyzeInterestProfile } from '@/lib/interest-profile';
import {
  buildContentCatalog,
  buildSystemPrompt,
  buildUserPrompt,
} from '@/lib/recommendations';
import { Recommendation, RecommendationResponse } from '@/types';

export const maxDuration = 30;

// Simple in-memory rate limiting + caching
const cache = new Map<
  string,
  { lastRequest: number; cachedResponse: RecommendationResponse }
>();

const CACHE_TTL_MS = 60 * 1000; // 60 seconds

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

  // Get analyzed interest profile
  const profile = await analyzeInterestProfile(db, userId);

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

  // Build prompts
  const catalog = buildContentCatalog();
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(profile, catalog);

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse JSON - handle potential markdown code blocks
    const jsonStr = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    const recommendations: Recommendation[] = (
      parsed.recommendations || []
    ).map((rec: Recommendation) => ({
      id: rec.id || `rec-${Date.now()}`,
      empire: rec.empire,
      epoch: rec.epoch,
      contentType: rec.contentType,
      contentId: rec.contentId,
      title: rec.title,
      hostPitch: rec.hostPitch,
      reason: rec.reason,
      confidence: rec.confidence ?? 0.7,
    }));

    const result: RecommendationResponse = {
      recommendations,
      welcomeBack: parsed.welcomeBack || '',
      isNewUser: false,
    };

    // Cache the result
    cache.set(userId, {
      lastRequest: Date.now(),
      cachedResponse: result,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Recommendation generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
