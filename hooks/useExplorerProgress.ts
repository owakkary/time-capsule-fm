'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  ExplorerProfile,
  EmpireProgress,
  EpochProgress,
  EarnedBadge,
  XPEventType,
  EmpireId,
  EpochId,
  ContentType,
  ProgressUpdateResult,
  BadgeUnlockResult,
  EMPIRES,
  EPOCHS,
} from '@/types';
import {
  XP_REWARDS,
  calculateLevelFromXP,
  getTierFromLevel,
  getAvatarFromTier,
  getTitleFromTier,
  createInitialExplorerProfile,
  shouldUpdateStreak,
  processXPGain,
  getLevelProgress,
  getXPForNextLevel,
} from '@/lib/xp';
import {
  BADGES,
  checkBadgeUnlocks,
  calculateBadgeProgress,
  createEarnedBadge,
  getAllBadgeIds,
} from '@/lib/badges';

interface UseExplorerProgressReturn {
  profile: ExplorerProfile | null;
  empireProgress: EmpireProgress[];
  epochProgress: EpochProgress[];
  badges: EarnedBadge[];
  loading: boolean;
  error: string | null;
  levelProgress: number;
  xpForNextLevel: number;
  // Actions
  awardXP: (eventType: XPEventType, metadata?: {
    empireId?: EmpireId;
    epochId?: EpochId;
    contentId?: string;
    contentType?: ContentType;
  }) => Promise<ProgressUpdateResult | null>;
  recordEpisodeGenerated: (empireId: EmpireId, epochId: EpochId, contentType: ContentType, contentId?: string) => Promise<ProgressUpdateResult | null>;
  recordEpisodeCompleted: (empireId: EmpireId) => Promise<ProgressUpdateResult | null>;
  recordListeningTime: (minutes: number) => Promise<void>;
  toggleBadgePin: (badgeId: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

export function useExplorerProgress(userId: string | null): UseExplorerProgressReturn {
  const [profile, setProfile] = useState<ExplorerProfile | null>(null);
  const [empireProgress, setEmpireProgress] = useState<EmpireProgress[]>([]);
  const [epochProgress, setEpochProgress] = useState<EpochProgress[]>([]);
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const levelProgress = profile ? getLevelProgress(profile.currentXP, profile.currentLevel) : 0;
  const xpForNextLevel = profile ? getXPForNextLevel(profile.currentLevel) : 0;

  // Initialize or load explorer data
  const initializeExplorer = useCallback(async () => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const explorerRef = doc(db, 'users', userId, 'explorer', 'profile');
      const explorerSnap = await getDoc(explorerRef);

      if (explorerSnap.exists()) {
        // Load existing profile
        const data = explorerSnap.data();
        setProfile({
          ...data,
          lastActivityDate: data.lastActivityDate?.toDate() || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as ExplorerProfile);
      } else {
        // Create new profile
        const newProfile = createInitialExplorerProfile(userId);
        await setDoc(explorerRef, {
          ...newProfile,
          lastActivityDate: null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        setProfile(newProfile);
      }

      // Load empire progress
      const empiresRef = collection(db, 'users', userId, 'explorer', 'profile', 'empires');
      const empiresSnap = await getDocs(empiresRef);
      const empireData: EmpireProgress[] = [];
      empiresSnap.forEach((docSnap) => {
        const data = docSnap.data();
        empireData.push({
          ...data,
          firstExploredAt: data.firstExploredAt?.toDate() || null,
          lastExploredAt: data.lastExploredAt?.toDate() || null,
        } as EmpireProgress);
      });
      setEmpireProgress(empireData);

      // Load epoch progress
      const epochsRef = collection(db, 'users', userId, 'explorer', 'profile', 'epochs');
      const epochsSnap = await getDocs(epochsRef);
      const epochData: EpochProgress[] = [];
      epochsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        epochData.push({
          ...data,
          firstExploredAt: data.firstExploredAt?.toDate() || null,
          lastExploredAt: data.lastExploredAt?.toDate() || null,
        } as EpochProgress);
      });
      setEpochProgress(epochData);

      // Load badges
      const badgesRef = collection(db, 'users', userId, 'explorer', 'profile', 'badges');
      const badgesSnap = await getDocs(badgesRef);
      const badgeData: EarnedBadge[] = [];
      badgesSnap.forEach((docSnap) => {
        const data = docSnap.data();
        badgeData.push({
          ...data,
          unlockedAt: data.unlockedAt?.toDate() || null,
        } as EarnedBadge);
      });

      // Initialize any missing badges
      const existingBadgeIds = badgeData.map(b => b.badgeId);
      const missingBadgeIds = getAllBadgeIds().filter(id => !existingBadgeIds.includes(id));

      if (missingBadgeIds.length > 0) {
        const batch = writeBatch(db);
        for (const badgeId of missingBadgeIds) {
          const badgeDef = BADGES.find(b => b.id === badgeId);
          if (badgeDef) {
            const newBadge = createEarnedBadge(badgeId, badgeDef.targetProgress);
            const badgeRef = doc(db, 'users', userId, 'explorer', 'profile', 'badges', badgeId);
            batch.set(badgeRef, newBadge);
            badgeData.push(newBadge);
          }
        }
        await batch.commit();
      }

      setBadges(badgeData);
    } catch (err) {
      console.error('Error loading explorer progress:', err);
      setError('Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    initializeExplorer();
  }, [initializeExplorer]);

  // Award XP and check for level-ups and badges
  const awardXP = useCallback(async (
    eventType: XPEventType,
    metadata?: {
      empireId?: EmpireId;
      epochId?: EpochId;
      contentId?: string;
      contentType?: ContentType;
    }
  ): Promise<ProgressUpdateResult | null> => {
    if (!userId || !db || !profile) return null;

    try {
      const xpAmount = XP_REWARDS[eventType];
      const newXP = profile.currentXP + xpAmount;
      const levelUpResult = processXPGain(profile, xpAmount);

      // Update profile
      const updates: Record<string, unknown> = {
        currentXP: newXP,
        updatedAt: Timestamp.now(),
      };

      // Check for streak update
      const streakCheck = shouldUpdateStreak(profile.lastActivityDate);
      let newStreak = profile.currentDailyStreak;

      if (streakCheck.isNewDay) {
        updates.lastActivityDate = new Date();
        if (streakCheck.continueStreak) {
          newStreak = profile.currentDailyStreak + 1;
          updates.currentDailyStreak = newStreak;
          if (newStreak > profile.longestDailyStreak) {
            updates.longestDailyStreak = newStreak;
          }
        } else if (streakCheck.resetStreak) {
          newStreak = 1;
          updates.currentDailyStreak = 1;
        } else {
          newStreak = 1;
          updates.currentDailyStreak = 1;
        }
      }

      // Handle level up
      if (levelUpResult) {
        updates.currentLevel = levelUpResult.newLevel;
        updates.tier = levelUpResult.newTier;
        updates.avatarStage = levelUpResult.newAvatarStage;
        updates.currentTitle = getTitleFromTier(levelUpResult.newTier);
      }

      // Update Firestore
      const profileRef = doc(db, 'users', userId, 'explorer', 'profile');
      await updateDoc(profileRef, updates as Record<string, unknown>);

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);

      // Check for new badges
      const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
      const newlyUnlocked = checkBadgeUnlocks(updatedProfile, empireProgress, epochProgress, badges);

      const badgeResults: BadgeUnlockResult[] = [];
      if (newlyUnlocked.length > 0) {
        const batch = writeBatch(db);
        for (const badge of newlyUnlocked) {
          const badgeRef = doc(db, 'users', userId, 'explorer', 'profile', 'badges', badge.id);
          const earnedBadge: EarnedBadge = {
            badgeId: badge.id,
            unlockedAt: new Date(),
            isUnlocked: true,
            isPinned: false,
            progress: badge.targetProgress,
            targetProgress: badge.targetProgress,
          };
          batch.update(badgeRef, {
            badgeId: earnedBadge.badgeId,
            unlockedAt: Timestamp.now(),
            isUnlocked: earnedBadge.isUnlocked,
            isPinned: earnedBadge.isPinned,
            progress: earnedBadge.progress,
            targetProgress: earnedBadge.targetProgress,
          });
          badgeResults.push({ badge, earnedBadge, isNewUnlock: true });
        }
        await batch.commit();

        // Update local badges state
        setBadges(prev => {
          const updated = [...prev];
          for (const result of badgeResults) {
            const idx = updated.findIndex(b => b.badgeId === result.badge.id);
            if (idx >= 0) {
              updated[idx] = result.earnedBadge;
            }
          }
          return updated;
        });
      }

      // Update badge progress for non-unlocked badges
      const progressUpdates: EarnedBadge[] = [];
      for (const badge of BADGES) {
        const earned = badges.find(b => b.badgeId === badge.id);
        if (earned && !earned.isUnlocked) {
          const newProgress = calculateBadgeProgress(badge, updatedProfile, empireProgress, epochProgress);
          if (newProgress !== earned.progress) {
            progressUpdates.push({ ...earned, progress: newProgress });
          }
        }
      }

      if (progressUpdates.length > 0) {
        const batch = writeBatch(db);
        for (const badge of progressUpdates) {
          const badgeRef = doc(db, 'users', userId, 'explorer', 'profile', 'badges', badge.badgeId);
          batch.update(badgeRef, { progress: badge.progress });
        }
        await batch.commit();

        setBadges(prev => {
          const updated = [...prev];
          for (const badge of progressUpdates) {
            const idx = updated.findIndex(b => b.badgeId === badge.badgeId);
            if (idx >= 0) {
              updated[idx] = badge;
            }
          }
          return updated;
        });
      }

      return {
        xpGained: xpAmount,
        levelUp: levelUpResult,
        newBadges: badgeResults,
        streakUpdated: streakCheck.isNewDay,
        newStreak,
      };
    } catch (err) {
      console.error('Error awarding XP:', err);
      return null;
    }
  }, [userId, profile, empireProgress, epochProgress, badges]);

  // Record episode generation
  const recordEpisodeGenerated = useCallback(async (
    empireId: EmpireId,
    epochId: EpochId,
    contentType: ContentType,
    contentId?: string
  ): Promise<ProgressUpdateResult | null> => {
    if (!userId || !db || !profile) return null;

    try {
      // Update profile stats
      const profileRef = doc(db, 'users', userId, 'explorer', 'profile');
      await updateDoc(profileRef, {
        totalEpisodesGenerated: profile.totalEpisodesGenerated + 1,
        updatedAt: Timestamp.now(),
      });

      setProfile(prev => prev ? {
        ...prev,
        totalEpisodesGenerated: prev.totalEpisodesGenerated + 1,
        updatedAt: new Date(),
      } : null);

      // Update empire progress
      const empireRef = doc(db, 'users', userId, 'explorer', 'profile', 'empires', empireId);
      const empireSnap = await getDoc(empireRef);

      let isFirstEmpire = false;
      let empireUpdate: EmpireProgress;

      if (empireSnap.exists()) {
        const existingData = empireSnap.data() as EmpireProgress;
        empireUpdate = { ...existingData };
        empireUpdate.totalEpisodes = (existingData.totalEpisodes || 0) + 1;
        empireUpdate.lastExploredAt = new Date();

        // Track content discoveries
        if (contentType === 'figure' && contentId && !existingData.figuresDiscovered.includes(contentId)) {
          empireUpdate.figuresDiscovered = [...existingData.figuresDiscovered, contentId];
        } else if (contentType === 'moment' && contentId && !existingData.momentsDiscovered.includes(contentId)) {
          empireUpdate.momentsDiscovered = [...existingData.momentsDiscovered, contentId];
        } else if (contentType === 'perspective' && contentId && !existingData.perspectivesExperienced.includes(contentId)) {
          empireUpdate.perspectivesExperienced = [...existingData.perspectivesExperienced, contentId];
        } else if (contentType === 'overview') {
          empireUpdate.overviewCompleted = true;
        }

        // Recalculate completion percentage (simplified)
        const totalContent = 4; // overview + at least 1 figure + 1 moment + 1 perspective
        const completed = (empireUpdate.overviewCompleted ? 1 : 0) +
          Math.min(1, empireUpdate.figuresDiscovered.length) +
          Math.min(1, empireUpdate.momentsDiscovered.length) +
          Math.min(1, empireUpdate.perspectivesExperienced.length);
        empireUpdate.completionPercentage = Math.round((completed / totalContent) * 100);

        // Update rank based on completion
        if (empireUpdate.completionPercentage >= 100) empireUpdate.rank = 'master';
        else if (empireUpdate.completionPercentage >= 75) empireUpdate.rank = 'expert';
        else if (empireUpdate.completionPercentage >= 50) empireUpdate.rank = 'studied';
        else if (empireUpdate.completionPercentage >= 25) empireUpdate.rank = 'familiar';
        else empireUpdate.rank = 'curious';

      } else {
        // First time exploring this empire
        isFirstEmpire = empireProgress.length === 0;
        empireUpdate = {
          empireId,
          figuresDiscovered: contentType === 'figure' && contentId ? [contentId] : [],
          momentsDiscovered: contentType === 'moment' && contentId ? [contentId] : [],
          perspectivesExperienced: contentType === 'perspective' && contentId ? [contentId] : [],
          overviewCompleted: contentType === 'overview',
          completionPercentage: 25, // First content = 25%
          rank: 'curious',
          totalEpisodes: 1,
          firstExploredAt: new Date(),
          lastExploredAt: new Date(),
        };
      }

      await setDoc(empireRef, {
        ...empireUpdate,
        firstExploredAt: empireUpdate.firstExploredAt ? Timestamp.fromDate(empireUpdate.firstExploredAt) : Timestamp.now(),
        lastExploredAt: Timestamp.now(),
      });

      setEmpireProgress(prev => {
        const idx = prev.findIndex(e => e.empireId === empireId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = empireUpdate;
          return updated;
        }
        return [...prev, empireUpdate];
      });

      // Update epoch progress
      const epochRef = doc(db, 'users', userId, 'explorer', 'profile', 'epochs', epochId);
      const epochSnap = await getDoc(epochRef);

      let epochUpdate: EpochProgress;
      if (epochSnap.exists()) {
        const existingData = epochSnap.data() as EpochProgress;
        epochUpdate = { ...existingData };
        epochUpdate.totalEpisodes = (existingData.totalEpisodes || 0) + 1;
        epochUpdate.lastExploredAt = new Date();

        if (!existingData.empiresExplored.includes(empireId)) {
          epochUpdate.empiresExplored = [...existingData.empiresExplored, empireId];
        }

        // Calculate epoch completion
        const epochData = EPOCHS.find(e => e.id === epochId);
        if (epochData) {
          epochUpdate.completionPercentage = Math.round(
            (epochUpdate.empiresExplored.length / epochData.empires.length) * 100
          );
        }
      } else {
        epochUpdate = {
          epochId,
          empiresExplored: [empireId],
          totalEpisodes: 1,
          completionPercentage: 0,
          firstExploredAt: new Date(),
          lastExploredAt: new Date(),
        };
        const epochData = EPOCHS.find(e => e.id === epochId);
        if (epochData) {
          epochUpdate.completionPercentage = Math.round((1 / epochData.empires.length) * 100);
        }
      }

      await setDoc(epochRef, {
        ...epochUpdate,
        firstExploredAt: epochUpdate.firstExploredAt ? Timestamp.fromDate(epochUpdate.firstExploredAt) : Timestamp.now(),
        lastExploredAt: Timestamp.now(),
      });

      setEpochProgress(prev => {
        const idx = prev.findIndex(e => e.epochId === epochId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = epochUpdate;
          return updated;
        }
        return [...prev, epochUpdate];
      });

      // Award XP for episode generation
      let result = await awardXP('episode_generated', { empireId, epochId, contentId, contentType });

      // Award XP for first empire
      if (isFirstEmpire) {
        const firstEmpireResult = await awardXP('first_empire', { empireId, epochId });
        if (firstEmpireResult && result) {
          result.xpGained += firstEmpireResult.xpGained;
          result.newBadges = [...result.newBadges, ...firstEmpireResult.newBadges];
        }
      }

      // Award XP for content type discoveries
      if (contentType === 'figure' && contentId) {
        const figureResult = await awardXP('figure_discovered', { empireId, epochId, contentId, contentType });
        if (figureResult && result) {
          result.xpGained += figureResult.xpGained;
          result.newBadges = [...result.newBadges, ...figureResult.newBadges];
        }
      } else if (contentType === 'moment' && contentId) {
        const momentResult = await awardXP('moment_discovered', { empireId, epochId, contentId, contentType });
        if (momentResult && result) {
          result.xpGained += momentResult.xpGained;
          result.newBadges = [...result.newBadges, ...momentResult.newBadges];
        }
      } else if (contentType === 'perspective' && contentId) {
        const perspResult = await awardXP('perspective_discovered', { empireId, epochId, contentId, contentType });
        if (perspResult && result) {
          result.xpGained += perspResult.xpGained;
          result.newBadges = [...result.newBadges, ...perspResult.newBadges];
        }
      } else if (contentType === 'overview') {
        const overviewResult = await awardXP('overview_completed', { empireId, epochId, contentType });
        if (overviewResult && result) {
          result.xpGained += overviewResult.xpGained;
          result.newBadges = [...result.newBadges, ...overviewResult.newBadges];
        }
      }

      return result;
    } catch (err) {
      console.error('Error recording episode:', err);
      return null;
    }
  }, [userId, profile, empireProgress, awardXP]);

  // Record episode completion
  const recordEpisodeCompleted = useCallback(async (
    empireId: EmpireId
  ): Promise<ProgressUpdateResult | null> => {
    if (!userId || !db || !profile) return null;

    try {
      const profileRef = doc(db, 'users', userId, 'explorer', 'profile');
      await updateDoc(profileRef, {
        episodesCompleted: profile.episodesCompleted + 1,
        updatedAt: Timestamp.now(),
      });

      setProfile(prev => prev ? {
        ...prev,
        episodesCompleted: prev.episodesCompleted + 1,
        updatedAt: new Date(),
      } : null);

      return await awardXP('episode_completed', { empireId });
    } catch (err) {
      console.error('Error recording completion:', err);
      return null;
    }
  }, [userId, profile, awardXP]);

  // Record listening time
  const recordListeningTime = useCallback(async (minutes: number): Promise<void> => {
    if (!userId || !db || !profile) return;

    try {
      const profileRef = doc(db, 'users', userId, 'explorer', 'profile');
      await updateDoc(profileRef, {
        totalListeningMinutes: profile.totalListeningMinutes + minutes,
        updatedAt: Timestamp.now(),
      });

      setProfile(prev => prev ? {
        ...prev,
        totalListeningMinutes: prev.totalListeningMinutes + minutes,
        updatedAt: new Date(),
      } : null);
    } catch (err) {
      console.error('Error recording listening time:', err);
    }
  }, [userId, profile]);

  // Toggle badge pin
  const toggleBadgePin = useCallback(async (badgeId: string): Promise<void> => {
    if (!userId || !db) return;

    try {
      const badge = badges.find(b => b.badgeId === badgeId);
      if (!badge) return;

      // Count currently pinned badges
      const pinnedCount = badges.filter(b => b.isPinned).length;

      // Don't allow more than 3 pinned badges unless unpinning
      if (!badge.isPinned && pinnedCount >= 3) return;

      const badgeRef = doc(db, 'users', userId, 'explorer', 'profile', 'badges', badgeId);
      await updateDoc(badgeRef, { isPinned: !badge.isPinned });

      setBadges(prev => prev.map(b =>
        b.badgeId === badgeId ? { ...b, isPinned: !b.isPinned } : b
      ));
    } catch (err) {
      console.error('Error toggling badge pin:', err);
    }
  }, [userId, badges]);

  // Refresh all progress data
  const refreshProgress = useCallback(async (): Promise<void> => {
    await initializeExplorer();
  }, [initializeExplorer]);

  return {
    profile,
    empireProgress,
    epochProgress,
    badges,
    loading,
    error,
    levelProgress,
    xpForNextLevel,
    awardXP,
    recordEpisodeGenerated,
    recordEpisodeCompleted,
    recordListeningTime,
    toggleBadgePin,
    refreshProgress,
  };
}
