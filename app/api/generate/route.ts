import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { verifyAuthToken, getAdminDb, getFigure, getMoment, getPerspective, getOverview } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { ContentType, EmpireId, EpochId, getEmpire, EMPIRE_TO_EPOCH } from '@/types';
import {
  XP_REWARDS,
  calculateLevelFromXP,
  getTierFromLevel,
  getAvatarFromTier,
  getTitleFromTier,
  shouldUpdateStreak,
} from '@/lib/xp';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const WORD_COUNTS: Record<number, number> = {
  5: 600,
  10: 1200,
  15: 1800,
};

// ============================================
// PROMPT BUILDERS
// ============================================

function buildPromptForOverview(empireId: EmpireId, wordCount: number): string {
  const empire = getEmpire(empireId);
  const overview = getOverview(empireId);

  if (!empire) throw new Error(`Empire not found: ${empireId}`);

  const themes = overview?.keyThemes.join(', ') || empire.keyThemes.join(', ');

  return `You're a history enthusiast giving an engaging introduction to ${empire.name} (${empire.years}) to a friend over drinks. Be casual, conversational, and witty—throw in current references and jokes where they fit naturally. But you KNOW your stuff deeply.

Context: ${empire.description}
Key themes to weave in: ${themes}

Generate approximately ${wordCount} words of engaging history content. Structure it like a podcast monologue:
- Start with a hook that grabs attention (maybe a wild fact or unexpected comparison)
- Provide a sweeping overview of this civilization/era
- Weave through 2-3 fascinating stories or facts that capture the essence of ${empire.name}
- Connect historical events to modern life where it makes sense
- End with something that'll stick in their brain

No headers, bullet points, or formatting—just flowing, spoken-word style content. Write like you're actually talking, with natural pauses, rhetorical questions, and personality.`;
}

function buildPromptForFigure(figureId: string, wordCount: number): string {
  const figure = getFigure(figureId);
  if (!figure) throw new Error(`Figure not found: ${figureId}`);

  const empire = getEmpire(figure.empire);

  return `You're a history enthusiast telling a friend about ${figure.name} (${figure.years}), ${figure.title} from ${empire?.name || figure.empire}. Be casual, conversational, and witty—throw in current references and jokes where they fit naturally. But you KNOW your stuff deeply.

Context: ${figure.description}
Why they matter: ${figure.significance}

Generate approximately ${wordCount} words of engaging history content. Structure it like a podcast monologue:
- Start with a hook that grabs attention (maybe a wild fact or unexpected comparison about this person)
- Tell their story—the key moments, the dramatic turning points, the human elements
- What drove them? What were their flaws? What made them exceptional?
- Connect their legacy to modern life where it makes sense
- End with something that'll stick in their brain

No headers, bullet points, or formatting—just flowing, spoken-word style content. Write like you're actually talking, with natural pauses, rhetorical questions, and personality.`;
}

function buildPromptForMoment(momentId: string, wordCount: number): string {
  const moment = getMoment(momentId);
  if (!moment) throw new Error(`Moment not found: ${momentId}`);

  const empire = getEmpire(moment.empire);

  return `You're a history enthusiast telling a friend about "${moment.name}" (${moment.year}) from ${empire?.name || moment.empire}. Be casual, conversational, and witty—throw in current references and jokes where they fit naturally. But you KNOW your stuff deeply.

Context: ${moment.description}
Why it matters: ${moment.significance}

Generate approximately ${wordCount} words of engaging history content. Structure it like a podcast monologue:
- Start with a hook that grabs attention (set the scene, the tension, the stakes)
- Walk through what actually happened—the drama, the players, the twists
- What led to this moment? What were the immediate consequences?
- Connect this historical event to modern life where it makes sense
- End with something that'll stick in their brain

No headers, bullet points, or formatting—just flowing, spoken-word style content. Write like you're actually talking, with natural pauses, rhetorical questions, and personality.`;
}

function buildPromptForPerspective(perspectiveId: string, wordCount: number): string {
  const perspective = getPerspective(perspectiveId);
  if (!perspective) throw new Error(`Perspective not found: ${perspectiveId}`);

  const empire = getEmpire(perspective.empire);

  return `You're narrating a first-person account from the perspective of "${perspective.name}" in ${empire?.name || perspective.empire}. This is immersive historical storytelling—make the listener FEEL what it was like to live in this time and place.

Character: ${perspective.archetype}
Setting: ${perspective.description}

Generate approximately ${wordCount} words of first-person narrative content. This should feel like a journal entry, a memoir, or a letter—intimate and personal:
- Start by grounding us in a specific moment or routine in this person's daily life
- What do they see, hear, smell? What are their worries, hopes, frustrations?
- Weave in historically accurate details about life in this era naturally
- Include interactions with others—superiors, peers, family
- Show us the worldview of someone in this role—what do they believe? What do they take for granted?
- End with a reflection that gives insight into this person's inner life

Write entirely in first person. No headers, bullet points, or modern narrator voice—just the character speaking directly to us. Make it vivid, sensory, and emotionally resonant while being historically grounded.`;
}

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const authHeader = request.headers.get('authorization');
    const decodedToken = await verifyAuthToken(authHeader);

    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // Parse and validate request
    const body = await request.json();
    const { empire, contentType, contentId, durationMinutes, timePeriod } = body;

    // Support legacy API format (timePeriod instead of empire)
    const empireId = (empire || timePeriod) as EmpireId;
    const type = (contentType || 'overview') as ContentType;

    if (!empireId || !durationMinutes) {
      return NextResponse.json(
        { error: 'Missing required fields: empire (or timePeriod), durationMinutes' },
        { status: 400 }
      );
    }

    if (![5, 10, 15].includes(durationMinutes)) {
      return NextResponse.json(
        { error: 'Invalid duration. Must be 5, 10, or 15 minutes.' },
        { status: 400 }
      );
    }

    // Validate empire exists
    const empireData = getEmpire(empireId);
    if (!empireData) {
      return NextResponse.json(
        { error: `Invalid empire: ${empireId}` },
        { status: 400 }
      );
    }

    const wordCount = WORD_COUNTS[durationMinutes];
    const epochId = EMPIRE_TO_EPOCH[empireId] as EpochId;

    // Build prompt based on content type
    let prompt: string;
    try {
      switch (type) {
        case 'overview':
          prompt = buildPromptForOverview(empireId, wordCount);
          break;
        case 'figure':
          if (!contentId) {
            return NextResponse.json(
              { error: 'contentId required for figure content type' },
              { status: 400 }
            );
          }
          prompt = buildPromptForFigure(contentId, wordCount);
          break;
        case 'moment':
          if (!contentId) {
            return NextResponse.json(
              { error: 'contentId required for moment content type' },
              { status: 400 }
            );
          }
          prompt = buildPromptForMoment(contentId, wordCount);
          break;
        case 'perspective':
          if (!contentId) {
            return NextResponse.json(
              { error: 'contentId required for perspective content type' },
              { status: 400 }
            );
          }
          prompt = buildPromptForPerspective(contentId, wordCount);
          break;
        default:
          return NextResponse.json(
            { error: `Invalid content type: ${type}` },
            { status: 400 }
          );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    // Generate content with Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Generate a title
    const titlePrompt = type === 'perspective'
      ? `Generate a short, evocative title (max 6 words) for this first-person historical narrative. Make it intriguing. Just the title, nothing else:\n\n${content.slice(0, 500)}`
      : `Generate a short, catchy podcast episode title (max 6 words) for this history content. Just the title, nothing else:\n\n${content.slice(0, 500)}`;

    const titleMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: titlePrompt,
      }],
    });

    const title = titleMessage.content[0].type === 'text'
      ? titleMessage.content[0].text.trim().replace(/"/g, '')
      : 'History Episode';

    // Save episode to Firestore
    const episodeRef = getAdminDb().collection('episodes').doc();
    const episodeData = {
      userId,
      epoch: epochId,
      empire: empireId,
      contentType: type,
      contentId: contentId || null,
      durationMinutes,
      title,
      content,
      audioUrl: null,
      audioDurationSeconds: null,
      createdAt: FieldValue.serverTimestamp(),
      // Legacy field for backward compatibility
      timePeriod: empireId,
    };

    await episodeRef.set(episodeData);

    // Track explorer progress
    let progressResult = null;
    try {
      progressResult = await trackEpisodeGeneration(userId, empireId, epochId, type, contentId);
    } catch (progressError) {
      console.error('Progress tracking error (non-fatal):', progressError);
    }

    return NextResponse.json({
      id: episodeRef.id,
      title,
      content,
      epoch: epochId,
      empire: empireId,
      contentType: type,
      durationMinutes,
      // Legacy field for backward compatibility
      timePeriod: empireId,
      // Progress data
      progress: progressResult,
    });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

// Helper function to track progress when episode is generated
async function trackEpisodeGeneration(
  userId: string,
  empireId: EmpireId,
  epochId: EpochId,
  contentType: ContentType,
  contentId?: string
): Promise<{
  xpGained: number;
  levelUp: boolean;
  newLevel?: number;
  newTier?: string;
  streakUpdated: boolean;
  newStreak?: number;
}> {
  const db = getAdminDb();

  // Get current profile
  const profileRef = db.doc(`users/${userId}/explorer/profile`);
  const profileSnap = await profileRef.get();

  let profile: {
    userId: string;
    currentXP: number;
    currentLevel: number;
    tier: string;
    avatarStage: string;
    currentTitle: string;
    totalEpisodesGenerated: number;
    totalListeningMinutes: number;
    episodesCompleted: number;
    currentDailyStreak: number;
    longestDailyStreak: number;
    lastActivityDate: Date | null;
  };

  if (!profileSnap.exists) {
    // Create initial profile
    profile = {
      userId,
      currentXP: 0,
      currentLevel: 1,
      tier: 'novice',
      avatarStage: 'wanderer',
      currentTitle: 'Curious Wanderer',
      totalEpisodesGenerated: 0,
      totalListeningMinutes: 0,
      episodesCompleted: 0,
      currentDailyStreak: 0,
      longestDailyStreak: 0,
      lastActivityDate: null,
    };
    await profileRef.set({
      ...profile,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    const data = profileSnap.data()!;
    profile = {
      userId: data.userId || userId,
      currentXP: data.currentXP || 0,
      currentLevel: data.currentLevel || 1,
      tier: data.tier || 'novice',
      avatarStage: data.avatarStage || 'wanderer',
      currentTitle: data.currentTitle || 'Curious Wanderer',
      totalEpisodesGenerated: data.totalEpisodesGenerated || 0,
      totalListeningMinutes: data.totalListeningMinutes || 0,
      episodesCompleted: data.episodesCompleted || 0,
      currentDailyStreak: data.currentDailyStreak || 0,
      longestDailyStreak: data.longestDailyStreak || 0,
      lastActivityDate: data.lastActivityDate?.toDate() || null,
    };
  }

  const result = {
    xpGained: XP_REWARDS.episode_generated,
    levelUp: false,
    newLevel: undefined as number | undefined,
    newTier: undefined as string | undefined,
    streakUpdated: false,
    newStreak: undefined as number | undefined,
  };

  // Profile updates
  const updates: Record<string, unknown> = {
    totalEpisodesGenerated: profile.totalEpisodesGenerated + 1,
    updatedAt: FieldValue.serverTimestamp(),
  };

  // Check streak
  const streakCheck = shouldUpdateStreak(profile.lastActivityDate);
  if (streakCheck.isNewDay) {
    updates.lastActivityDate = FieldValue.serverTimestamp();
    result.streakUpdated = true;

    if (streakCheck.continueStreak) {
      const newStreak = profile.currentDailyStreak + 1;
      updates.currentDailyStreak = newStreak;
      result.newStreak = newStreak;
      if (newStreak > profile.longestDailyStreak) {
        updates.longestDailyStreak = newStreak;
      }
      // Streak bonuses
      if (newStreak === 7) result.xpGained += XP_REWARDS.streak_weekly;
      if (newStreak === 30) result.xpGained += XP_REWARDS.streak_monthly;
    } else {
      updates.currentDailyStreak = 1;
      result.newStreak = 1;
    }
  }

  // Content-specific XP
  if (contentType === 'figure' && contentId) {
    result.xpGained += XP_REWARDS.figure_discovered;
  } else if (contentType === 'moment' && contentId) {
    result.xpGained += XP_REWARDS.moment_discovered;
  } else if (contentType === 'perspective' && contentId) {
    result.xpGained += XP_REWARDS.perspective_discovered;
  } else if (contentType === 'overview') {
    result.xpGained += XP_REWARDS.overview_completed;
  }

  // Update empire progress
  const empireRef = db.doc(`users/${userId}/explorer/profile/empires/${empireId}`);
  const empireSnap = await empireRef.get();

  if (empireSnap.exists) {
    const empireData = empireSnap.data();
    const empireUpdates: Record<string, unknown> = {
      totalEpisodes: (empireData?.totalEpisodes || 0) + 1,
      lastExploredAt: FieldValue.serverTimestamp(),
    };

    if (contentType === 'figure' && contentId && !empireData?.figuresDiscovered?.includes(contentId)) {
      empireUpdates.figuresDiscovered = [...(empireData?.figuresDiscovered || []), contentId];
    } else if (contentType === 'moment' && contentId && !empireData?.momentsDiscovered?.includes(contentId)) {
      empireUpdates.momentsDiscovered = [...(empireData?.momentsDiscovered || []), contentId];
    } else if (contentType === 'perspective' && contentId && !empireData?.perspectivesExperienced?.includes(contentId)) {
      empireUpdates.perspectivesExperienced = [...(empireData?.perspectivesExperienced || []), contentId];
    } else if (contentType === 'overview') {
      empireUpdates.overviewCompleted = true;
    }

    await empireRef.update(empireUpdates);
  } else {
    // First time exploring this empire
    const empiresSnap = await db.collection(`users/${userId}/explorer/profile/empires`).get();
    const isFirstEmpire = empiresSnap.empty;

    await empireRef.set({
      empireId,
      figuresDiscovered: contentType === 'figure' && contentId ? [contentId] : [],
      momentsDiscovered: contentType === 'moment' && contentId ? [contentId] : [],
      perspectivesExperienced: contentType === 'perspective' && contentId ? [contentId] : [],
      overviewCompleted: contentType === 'overview',
      completionPercentage: 25,
      rank: 'curious',
      totalEpisodes: 1,
      firstExploredAt: FieldValue.serverTimestamp(),
      lastExploredAt: FieldValue.serverTimestamp(),
    });

    if (isFirstEmpire) {
      result.xpGained += XP_REWARDS.first_empire;
    }
  }

  // Update epoch progress
  const epochRef = db.doc(`users/${userId}/explorer/profile/epochs/${epochId}`);
  const epochSnap = await epochRef.get();

  if (epochSnap.exists) {
    const epochData = epochSnap.data();
    const epochUpdates: Record<string, unknown> = {
      totalEpisodes: (epochData?.totalEpisodes || 0) + 1,
      lastExploredAt: FieldValue.serverTimestamp(),
    };

    if (!epochData?.empiresExplored?.includes(empireId)) {
      epochUpdates.empiresExplored = [...(epochData?.empiresExplored || []), empireId];
    }

    await epochRef.update(epochUpdates);
  } else {
    await epochRef.set({
      epochId,
      empiresExplored: [empireId],
      totalEpisodes: 1,
      completionPercentage: 0,
      firstExploredAt: FieldValue.serverTimestamp(),
      lastExploredAt: FieldValue.serverTimestamp(),
    });
  }

  // Calculate new XP and level
  const newXP = profile.currentXP + result.xpGained;
  const newLevel = calculateLevelFromXP(newXP);

  updates.currentXP = newXP;

  if (newLevel > profile.currentLevel) {
    result.levelUp = true;
    result.newLevel = newLevel;
    const newTier = getTierFromLevel(newLevel);
    result.newTier = newTier;
    updates.currentLevel = newLevel;
    updates.tier = newTier;
    updates.avatarStage = getAvatarFromTier(newTier);
    updates.currentTitle = getTitleFromTier(newTier);
  }

  await profileRef.update(updates);

  return result;
}
