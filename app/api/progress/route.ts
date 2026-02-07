import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getAdminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import {
  ExplorerProfile,
  EmpireProgress,
  EpochProgress,
  EarnedBadge,
  XPEventType,
  EmpireId,
  EpochId,
  ContentType,
  EPOCHS,
  EMPIRES,
} from '@/types';
import {
  XP_REWARDS,
  calculateLevelFromXP,
  getTierFromLevel,
  getAvatarFromTier,
  getTitleFromTier,
  createInitialExplorerProfile,
  shouldUpdateStreak,
} from '@/lib/xp';
import { BADGES, checkBadgeUnlocks, calculateBadgeProgress, createEarnedBadge } from '@/lib/badges';

// GET /api/progress - Get user's explorer profile and progress
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const decodedToken = await verifyAuthToken(authHeader);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const db = getAdminDb();

    // Get profile
    const profileRef = db.doc(`users/${userId}/explorer/profile`);
    const profileSnap = await profileRef.get();

    let profile: ExplorerProfile;
    if (profileSnap.exists) {
      const data = profileSnap.data();
      profile = {
        ...data,
        lastActivityDate: data?.lastActivityDate?.toDate() || null,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as ExplorerProfile;
    } else {
      // Create initial profile
      profile = createInitialExplorerProfile(userId);
      await profileRef.set({
        ...profile,
        lastActivityDate: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Get empire progress
    const empiresSnap = await db.collection(`users/${userId}/explorer/profile/empires`).get();
    const empireProgress: EmpireProgress[] = [];
    empiresSnap.forEach((doc) => {
      const data = doc.data();
      empireProgress.push({
        ...data,
        firstExploredAt: data.firstExploredAt?.toDate() || null,
        lastExploredAt: data.lastExploredAt?.toDate() || null,
      } as EmpireProgress);
    });

    // Get epoch progress
    const epochsSnap = await db.collection(`users/${userId}/explorer/profile/epochs`).get();
    const epochProgress: EpochProgress[] = [];
    epochsSnap.forEach((doc) => {
      const data = doc.data();
      epochProgress.push({
        ...data,
        firstExploredAt: data.firstExploredAt?.toDate() || null,
        lastExploredAt: data.lastExploredAt?.toDate() || null,
      } as EpochProgress);
    });

    // Get badges
    const badgesSnap = await db.collection(`users/${userId}/explorer/profile/badges`).get();
    const badges: EarnedBadge[] = [];
    badgesSnap.forEach((doc) => {
      const data = doc.data();
      badges.push({
        ...data,
        unlockedAt: data.unlockedAt?.toDate() || null,
      } as EarnedBadge);
    });

    // Initialize missing badges
    const existingBadgeIds = badges.map(b => b.badgeId);
    const missingBadges = BADGES.filter(b => !existingBadgeIds.includes(b.id));

    if (missingBadges.length > 0) {
      const batch = db.batch();
      for (const badge of missingBadges) {
        const newBadge = createEarnedBadge(badge.id, badge.targetProgress);
        const badgeRef = db.doc(`users/${userId}/explorer/profile/badges/${badge.id}`);
        batch.set(badgeRef, newBadge);
        badges.push(newBadge);
      }
      await batch.commit();
    }

    return NextResponse.json({
      profile,
      empireProgress,
      epochProgress,
      badges,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 });
  }
}

// POST /api/progress - Record activity and award XP
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const decodedToken = await verifyAuthToken(authHeader);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const db = getAdminDb();

    const body = await request.json();
    const {
      action,
      empireId,
      epochId,
      contentType,
      contentId,
      listeningMinutes,
    } = body;

    // Get current profile
    const profileRef = db.doc(`users/${userId}/explorer/profile`);
    const profileSnap = await profileRef.get();

    if (!profileSnap.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profileData = profileSnap.data();
    const profile: ExplorerProfile = {
      ...profileData,
      lastActivityDate: profileData?.lastActivityDate?.toDate() || null,
      createdAt: profileData?.createdAt?.toDate() || new Date(),
      updatedAt: profileData?.updatedAt?.toDate() || new Date(),
    } as ExplorerProfile;

    const result: {
      xpGained: number;
      levelUp: boolean;
      newLevel?: number;
      newTier?: string;
      newBadges: string[];
      streakUpdated: boolean;
      newStreak?: number;
    } = {
      xpGained: 0,
      levelUp: false,
      newBadges: [],
      streakUpdated: false,
    };

    // Handle different actions
    if (action === 'episode_generated' && empireId && epochId) {
      // Award XP for generating episode
      result.xpGained += XP_REWARDS.episode_generated;

      // Update profile stats
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
          // Award streak bonus
          if (newStreak === 7) {
            result.xpGained += XP_REWARDS.streak_weekly;
          }
          if (newStreak === 30) {
            result.xpGained += XP_REWARDS.streak_monthly;
          }
        } else {
          updates.currentDailyStreak = 1;
          result.newStreak = 1;
        }
      }

      // Award content-specific XP
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

      let isFirstEmpire = false;
      if (empireSnap.exists) {
        const empireData = empireSnap.data() as EmpireProgress;
        const empireUpdates: Record<string, unknown> = {
          totalEpisodes: (empireData.totalEpisodes || 0) + 1,
          lastExploredAt: FieldValue.serverTimestamp(),
        };

        if (contentType === 'figure' && contentId && !empireData.figuresDiscovered.includes(contentId)) {
          empireUpdates.figuresDiscovered = [...empireData.figuresDiscovered, contentId];
        } else if (contentType === 'moment' && contentId && !empireData.momentsDiscovered.includes(contentId)) {
          empireUpdates.momentsDiscovered = [...empireData.momentsDiscovered, contentId];
        } else if (contentType === 'perspective' && contentId && !empireData.perspectivesExperienced.includes(contentId)) {
          empireUpdates.perspectivesExperienced = [...empireData.perspectivesExperienced, contentId];
        } else if (contentType === 'overview') {
          empireUpdates.overviewCompleted = true;
        }

        await empireRef.update(empireUpdates);
      } else {
        // First time exploring this empire
        const empiresSnap = await db.collection(`users/${userId}/explorer/profile/empires`).get();
        isFirstEmpire = empiresSnap.empty;

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
        const epochData = epochSnap.data() as EpochProgress;
        const epochUpdates: Record<string, unknown> = {
          totalEpisodes: (epochData.totalEpisodes || 0) + 1,
          lastExploredAt: FieldValue.serverTimestamp(),
        };

        if (!epochData.empiresExplored.includes(empireId)) {
          epochUpdates.empiresExplored = [...epochData.empiresExplored, empireId];
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

      // Check for new badges (simplified - just mark the IDs)
      // Full badge checking happens client-side for better UX
    } else if (action === 'episode_completed') {
      result.xpGained = XP_REWARDS.episode_completed;

      await profileRef.update({
        currentXP: profile.currentXP + result.xpGained,
        episodesCompleted: profile.episodesCompleted + 1,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const newLevel = calculateLevelFromXP(profile.currentXP + result.xpGained);
      if (newLevel > profile.currentLevel) {
        result.levelUp = true;
        result.newLevel = newLevel;
      }
    } else if (action === 'listening_time' && listeningMinutes) {
      await profileRef.update({
        totalListeningMinutes: profile.totalListeningMinutes + listeningMinutes,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Post progress error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
