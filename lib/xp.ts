import {
  ExplorerTier,
  AvatarStage,
  XPEventType,
  ExplorerProfile,
  LevelUpResult,
} from '@/types';

// ============================================
// XP REWARDS
// ============================================

export const XP_REWARDS: Record<XPEventType, number> = {
  episode_generated: 25,
  episode_completed: 50,
  episode_partial: 15,
  figure_discovered: 20,
  moment_discovered: 20,
  perspective_discovered: 25,
  overview_completed: 40,
  first_empire: 50,
  daily_activity: 10,
  streak_weekly: 100,
  streak_monthly: 500,
};

// ============================================
// LEVEL THRESHOLDS
// ============================================

// XP required to reach each level (cumulative)
// Formula: Level N requires N * 50 + (N-1) * 25 XP from level N-1
// This creates a gradual increase in XP requirements

function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  // Simplified formula: each level requires progressively more XP
  // Level 2: 100, Level 3: 225, Level 4: 375, etc.
  let totalXP = 0;
  for (let i = 2; i <= level; i++) {
    totalXP += 50 + (i - 1) * 50;
  }
  return totalXP;
}

// Pre-calculate thresholds for levels 1-60
export const LEVEL_THRESHOLDS: number[] = Array.from({ length: 61 }, (_, i) =>
  calculateXPForLevel(i)
);

// ============================================
// TIER & AVATAR MAPPINGS
// ============================================

export const TIER_LEVELS: Record<ExplorerTier, { min: number; max: number }> = {
  novice: { min: 1, max: 5 },
  apprentice: { min: 6, max: 10 },
  journeyman: { min: 11, max: 20 },
  scholar: { min: 21, max: 35 },
  sage: { min: 36, max: 50 },
  master: { min: 51, max: Infinity },
};

export const TIER_TO_AVATAR: Record<ExplorerTier, AvatarStage> = {
  novice: 'wanderer',
  apprentice: 'cartographer',
  journeyman: 'archaeologist',
  scholar: 'chronicler',
  sage: 'antiquarian',
  master: 'timekeeper',
};

export const TIER_TITLES: Record<ExplorerTier, string> = {
  novice: 'Curious Wanderer',
  apprentice: 'Eager Cartographer',
  journeyman: 'Seasoned Archaeologist',
  scholar: 'Learned Chronicler',
  sage: 'Venerable Antiquarian',
  master: 'Master Timekeeper',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate level from total XP
 */
export function calculateLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i;
    } else {
      break;
    }
  }
  return level;
}

/**
 * Get tier from level
 */
export function getTierFromLevel(level: number): ExplorerTier {
  if (level <= 5) return 'novice';
  if (level <= 10) return 'apprentice';
  if (level <= 20) return 'journeyman';
  if (level <= 35) return 'scholar';
  if (level <= 50) return 'sage';
  return 'master';
}

/**
 * Get avatar stage from tier
 */
export function getAvatarFromTier(tier: ExplorerTier): AvatarStage {
  return TIER_TO_AVATAR[tier];
}

/**
 * Get title from tier
 */
export function getTitleFromTier(tier: ExplorerTier): string {
  return TIER_TITLES[tier];
}

/**
 * Calculate XP needed for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length - 1) {
    // Max level reached
    return LEVEL_THRESHOLDS[currentLevel];
  }
  return LEVEL_THRESHOLDS[currentLevel + 1];
}

/**
 * Calculate XP progress within current level (0-100%)
 */
export function getLevelProgress(currentXP: number, currentLevel: number): number {
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel];
  const nextLevelXP = getXPForNextLevel(currentLevel);

  if (nextLevelXP === currentLevelXP) return 100; // Max level

  const xpIntoLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  return Math.min(100, Math.floor((xpIntoLevel / xpNeeded) * 100));
}

/**
 * Calculate XP remaining until next level
 */
export function getXPUntilNextLevel(currentXP: number, currentLevel: number): number {
  const nextLevelXP = getXPForNextLevel(currentLevel);
  return Math.max(0, nextLevelXP - currentXP);
}

/**
 * Process XP gain and return level up result if applicable
 */
export function processXPGain(
  profile: ExplorerProfile,
  xpGained: number
): LevelUpResult | null {
  const newXP = profile.currentXP + xpGained;
  const previousLevel = profile.currentLevel;
  const newLevel = calculateLevelFromXP(newXP);

  if (newLevel > previousLevel) {
    const previousTier = profile.tier;
    const newTier = getTierFromLevel(newLevel);
    const previousAvatarStage = profile.avatarStage;
    const newAvatarStage = getAvatarFromTier(newTier);

    return {
      previousLevel,
      newLevel,
      previousTier,
      newTier,
      previousAvatarStage,
      newAvatarStage,
      xpGained,
      totalXP: newXP,
    };
  }

  return null;
}

/**
 * Create initial explorer profile
 */
export function createInitialExplorerProfile(userId: string): ExplorerProfile {
  return {
    userId,
    currentXP: 0,
    currentLevel: 1,
    tier: 'novice',
    avatarStage: 'wanderer',
    currentTitle: TIER_TITLES.novice,
    totalEpisodesGenerated: 0,
    totalListeningMinutes: 0,
    episodesCompleted: 0,
    currentDailyStreak: 0,
    longestDailyStreak: 0,
    lastActivityDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Check if a daily streak should be updated
 */
export function shouldUpdateStreak(lastActivityDate: Date | null): {
  continueStreak: boolean;
  resetStreak: boolean;
  isNewDay: boolean;
} {
  if (!lastActivityDate) {
    return { continueStreak: false, resetStreak: false, isNewDay: true };
  }

  const now = new Date();
  const last = new Date(lastActivityDate);

  // Reset hours to compare dates only
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDate = new Date(last.getFullYear(), last.getMonth(), last.getDate());

  const daysDiff = Math.floor((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day - no streak update needed
    return { continueStreak: false, resetStreak: false, isNewDay: false };
  } else if (daysDiff === 1) {
    // Next day - continue streak
    return { continueStreak: true, resetStreak: false, isNewDay: true };
  } else {
    // More than 1 day gap - reset streak
    return { continueStreak: false, resetStreak: true, isNewDay: true };
  }
}

/**
 * Format level display string
 */
export function formatLevelDisplay(level: number): string {
  return `Level ${level}`;
}

/**
 * Format XP display string
 */
export function formatXPDisplay(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K XP`;
  }
  return `${xp} XP`;
}
