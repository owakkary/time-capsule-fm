import {
  BadgeDefinition,
  BadgeCategory,
  BadgeRarity,
  ExplorerProfile,
  EmpireProgress,
  EpochProgress,
  EarnedBadge,
  EPOCHS,
  EMPIRES,
} from '@/types';

// ============================================
// BADGE DEFINITIONS
// ============================================

export const BADGES: BadgeDefinition[] = [
  // ============================================
  // MILESTONE BADGES
  // ============================================
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Generate your first episode',
    icon: 'steps',
    category: 'milestone',
    rarity: 'common',
    targetProgress: 1,
    getProgress: (profile) => profile.totalEpisodesGenerated,
    checkUnlock: (profile) => profile.totalEpisodesGenerated >= 1,
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    description: 'Generate 5 episodes',
    icon: 'brain',
    category: 'milestone',
    rarity: 'common',
    targetProgress: 5,
    getProgress: (profile) => profile.totalEpisodesGenerated,
    checkUnlock: (profile) => profile.totalEpisodesGenerated >= 5,
  },
  {
    id: 'dedicated-scholar',
    name: 'Dedicated Scholar',
    description: 'Generate 25 episodes',
    icon: 'book',
    category: 'milestone',
    rarity: 'uncommon',
    targetProgress: 25,
    getProgress: (profile) => profile.totalEpisodesGenerated,
    checkUnlock: (profile) => profile.totalEpisodesGenerated >= 25,
  },
  {
    id: 'history-devotee',
    name: 'History Devotee',
    description: 'Generate 50 episodes',
    icon: 'temple',
    category: 'milestone',
    rarity: 'rare',
    targetProgress: 50,
    getProgress: (profile) => profile.totalEpisodesGenerated,
    checkUnlock: (profile) => profile.totalEpisodesGenerated >= 50,
  },
  {
    id: 'master-historian',
    name: 'Master Historian',
    description: 'Generate 100 episodes',
    icon: 'crown',
    category: 'milestone',
    rarity: 'epic',
    targetProgress: 100,
    getProgress: (profile) => profile.totalEpisodesGenerated,
    checkUnlock: (profile) => profile.totalEpisodesGenerated >= 100,
  },
  {
    id: 'attentive-listener',
    name: 'Attentive Listener',
    description: 'Complete your first episode',
    icon: 'headphones',
    category: 'milestone',
    rarity: 'common',
    targetProgress: 1,
    getProgress: (profile) => profile.episodesCompleted,
    checkUnlock: (profile) => profile.episodesCompleted >= 1,
  },
  {
    id: 'deep-listener',
    name: 'Deep Listener',
    description: 'Listen for 10 hours total',
    icon: 'music',
    category: 'milestone',
    rarity: 'uncommon',
    targetProgress: 600, // 600 minutes = 10 hours
    getProgress: (profile) => profile.totalListeningMinutes,
    checkUnlock: (profile) => profile.totalListeningMinutes >= 600,
  },
  {
    id: 'marathon-listener',
    name: 'Marathon Listener',
    description: 'Listen for 50 hours total',
    icon: 'music',
    category: 'milestone',
    rarity: 'rare',
    targetProgress: 3000, // 3000 minutes = 50 hours
    getProgress: (profile) => profile.totalListeningMinutes,
    checkUnlock: (profile) => profile.totalListeningMinutes >= 3000,
  },

  // ============================================
  // DISCOVERY BADGES
  // ============================================
  {
    id: 'ancient-initiate',
    name: 'Ancient Initiate',
    description: 'Explore your first ancient empire',
    icon: 'vase',
    category: 'discovery',
    rarity: 'common',
    targetProgress: 1,
    getProgress: (_, empires) => {
      const ancientEmpires = EMPIRES.filter(e =>
        ['bronze-age', 'classical', 'hellenistic-roman'].includes(e.epochId)
      ).map(e => e.id);
      return empires.filter(ep => ancientEmpires.includes(ep.empireId) && ep.totalEpisodes > 0).length > 0 ? 1 : 0;
    },
    checkUnlock: (_, empires) => {
      const ancientEmpires = EMPIRES.filter(e =>
        ['bronze-age', 'classical', 'hellenistic-roman'].includes(e.epochId)
      ).map(e => e.id);
      return empires.some(ep => ancientEmpires.includes(ep.empireId) && ep.totalEpisodes > 0);
    },
  },
  {
    id: 'revolutionary-spirit',
    name: 'Revolutionary Spirit',
    description: 'Explore your first Revolutionary Age empire',
    icon: 'bell',
    category: 'discovery',
    rarity: 'common',
    targetProgress: 1,
    getProgress: (_, empires) => {
      const revEmpires = EMPIRES.filter(e => e.epochId === 'revolutionary').map(e => e.id as string);
      return empires.filter(ep => revEmpires.includes(ep.empireId) && ep.totalEpisodes > 0).length > 0 ? 1 : 0;
    },
    checkUnlock: (_, empires) => {
      const revEmpires = EMPIRES.filter(e => e.epochId === 'revolutionary').map(e => e.id as string);
      return empires.some(ep => revEmpires.includes(ep.empireId) && ep.totalEpisodes > 0);
    },
  },
  {
    id: 'dual-era-explorer',
    name: 'Dual Era Explorer',
    description: 'Explore empires from both ancient and revolutionary eras',
    icon: 'scale',
    category: 'discovery',
    rarity: 'uncommon',
    targetProgress: 2,
    getProgress: (_, empires) => {
      const ancientEmpires = EMPIRES.filter(e =>
        ['bronze-age', 'classical', 'hellenistic-roman'].includes(e.epochId)
      ).map(e => e.id as string);
      const revEmpires = EMPIRES.filter(e => e.epochId === 'revolutionary').map(e => e.id as string);
      const hasAncient = empires.some(ep => ancientEmpires.includes(ep.empireId) && ep.totalEpisodes > 0);
      const hasRev = empires.some(ep => revEmpires.includes(ep.empireId) && ep.totalEpisodes > 0);
      return (hasAncient ? 1 : 0) + (hasRev ? 1 : 0);
    },
    checkUnlock: (_, empires) => {
      const ancientEmpires = EMPIRES.filter(e =>
        ['bronze-age', 'classical', 'hellenistic-roman'].includes(e.epochId)
      ).map(e => e.id as string);
      const revEmpires = EMPIRES.filter(e => e.epochId === 'revolutionary').map(e => e.id as string);
      const hasAncient = empires.some(ep => ancientEmpires.includes(ep.empireId) && ep.totalEpisodes > 0);
      const hasRev = empires.some(ep => revEmpires.includes(ep.empireId) && ep.totalEpisodes > 0);
      return hasAncient && hasRev;
    },
  },
  {
    id: 'epoch-explorer',
    name: 'Epoch Explorer',
    description: 'Explore all 4 epochs',
    icon: 'map',
    category: 'discovery',
    rarity: 'rare',
    targetProgress: 4,
    getProgress: (_, __, epochs) => epochs.filter(ep => ep.totalEpisodes > 0).length,
    checkUnlock: (_, __, epochs) => epochs.filter(ep => ep.totalEpisodes > 0).length >= 4,
  },
  {
    id: 'world-historian',
    name: 'World Historian',
    description: 'Explore all 21 empires',
    icon: 'globe',
    category: 'discovery',
    rarity: 'legendary',
    targetProgress: 21,
    getProgress: (_, empires) => empires.filter(ep => ep.totalEpisodes > 0).length,
    checkUnlock: (_, empires) => empires.filter(ep => ep.totalEpisodes > 0).length >= 21,
  },

  // ============================================
  // EMPIRE MASTERY BADGES
  // ============================================
  {
    id: 'keeper-of-the-nile',
    name: 'Keeper of the Nile',
    description: 'Master Ancient Egypt (100% completion)',
    icon: 'vase',
    category: 'mastery',
    rarity: 'epic',
    targetProgress: 100,
    getProgress: (_, empires) => {
      const egypt = empires.find(e => e.empireId === 'ancient-egypt');
      return egypt?.completionPercentage || 0;
    },
    checkUnlock: (_, empires) => {
      const egypt = empires.find(e => e.empireId === 'ancient-egypt');
      return egypt?.completionPercentage === 100;
    },
  },
  {
    id: 'persian-scholar',
    name: 'Persian Scholar',
    description: 'Master the Persian Empire (100% completion)',
    icon: 'lion',
    category: 'mastery',
    rarity: 'epic',
    targetProgress: 100,
    getProgress: (_, empires) => {
      const persia = empires.find(e => e.empireId === 'persian-empire');
      return persia?.completionPercentage || 0;
    },
    checkUnlock: (_, empires) => {
      const persia = empires.find(e => e.empireId === 'persian-empire');
      return persia?.completionPercentage === 100;
    },
  },
  {
    id: 'hellenic-sage',
    name: 'Hellenic Sage',
    description: 'Master Classical Greece (100% completion)',
    icon: 'temple',
    category: 'mastery',
    rarity: 'epic',
    targetProgress: 100,
    getProgress: (_, empires) => {
      const greece = empires.find(e => e.empireId === 'classical-greece');
      return greece?.completionPercentage || 0;
    },
    checkUnlock: (_, empires) => {
      const greece = empires.find(e => e.empireId === 'classical-greece');
      return greece?.completionPercentage === 100;
    },
  },
  {
    id: 'roman-consul',
    name: 'Roman Consul',
    description: 'Master the Roman Empire (100% completion)',
    icon: 'sword',
    category: 'mastery',
    rarity: 'epic',
    targetProgress: 100,
    getProgress: (_, empires) => {
      const rome = empires.find(e => e.empireId === 'roman-empire');
      return rome?.completionPercentage || 0;
    },
    checkUnlock: (_, empires) => {
      const rome = empires.find(e => e.empireId === 'roman-empire');
      return rome?.completionPercentage === 100;
    },
  },
  {
    id: 'silk-road-merchant',
    name: 'Silk Road Merchant',
    description: 'Master Han China (100% completion)',
    icon: 'dragon',
    category: 'mastery',
    rarity: 'epic',
    targetProgress: 100,
    getProgress: (_, empires) => {
      const han = empires.find(e => e.empireId === 'han-china');
      return han?.completionPercentage || 0;
    },
    checkUnlock: (_, empires) => {
      const han = empires.find(e => e.empireId === 'han-china');
      return han?.completionPercentage === 100;
    },
  },
  {
    id: 'british-scholar',
    name: 'British Scholar',
    description: 'Master the British Empire (100% completion)',
    icon: 'crown',
    category: 'mastery',
    rarity: 'epic',
    targetProgress: 100,
    getProgress: (_, empires) => {
      const britain = empires.find(e => e.empireId === 'british-empire');
      return britain?.completionPercentage || 0;
    },
    checkUnlock: (_, empires) => {
      const britain = empires.find(e => e.empireId === 'british-empire');
      return britain?.completionPercentage === 100;
    },
  },
  {
    id: 'founding-father',
    name: 'Founding Father',
    description: 'Master United States history (100% completion)',
    icon: 'bell',
    category: 'mastery',
    rarity: 'epic',
    targetProgress: 100,
    getProgress: (_, empires) => {
      const us = empires.find(e => e.empireId === 'united-states');
      return us?.completionPercentage || 0;
    },
    checkUnlock: (_, empires) => {
      const us = empires.find(e => e.empireId === 'united-states');
      return us?.completionPercentage === 100;
    },
  },

  // ============================================
  // STREAK BADGES
  // ============================================
  {
    id: 'weekly-wanderer',
    name: 'Weekly Wanderer',
    description: 'Maintain a 7-day streak',
    icon: 'fire',
    category: 'streak',
    rarity: 'uncommon',
    targetProgress: 7,
    getProgress: (profile) => profile.currentDailyStreak,
    checkUnlock: (profile) => profile.longestDailyStreak >= 7,
  },
  {
    id: 'monthly-master',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: 'star',
    category: 'streak',
    rarity: 'rare',
    targetProgress: 30,
    getProgress: (profile) => profile.currentDailyStreak,
    checkUnlock: (profile) => profile.longestDailyStreak >= 30,
  },
  {
    id: 'century-seeker',
    name: 'Century Seeker',
    description: 'Maintain a 100-day streak',
    icon: 'gem',
    category: 'streak',
    rarity: 'legendary',
    targetProgress: 100,
    getProgress: (profile) => profile.currentDailyStreak,
    checkUnlock: (profile) => profile.longestDailyStreak >= 100,
  },

  // ============================================
  // SPECIAL BADGES
  // ============================================
  {
    id: 'perspective-seeker',
    name: 'Perspective Seeker',
    description: 'Experience 5 first-person perspectives',
    icon: 'eye',
    category: 'special',
    rarity: 'uncommon',
    targetProgress: 5,
    getProgress: (_, empires) => {
      return empires.reduce((total, ep) => total + ep.perspectivesExperienced.length, 0);
    },
    checkUnlock: (_, empires) => {
      const totalPerspectives = empires.reduce((total, ep) => total + ep.perspectivesExperienced.length, 0);
      return totalPerspectives >= 5;
    },
  },
  {
    id: 'figure-finder',
    name: 'Figure Finder',
    description: 'Discover 10 historical figures',
    icon: 'mask',
    category: 'special',
    rarity: 'uncommon',
    targetProgress: 10,
    getProgress: (_, empires) => {
      return empires.reduce((total, ep) => total + ep.figuresDiscovered.length, 0);
    },
    checkUnlock: (_, empires) => {
      const totalFigures = empires.reduce((total, ep) => total + ep.figuresDiscovered.length, 0);
      return totalFigures >= 10;
    },
  },
  {
    id: 'moment-maven',
    name: 'Moment Maven',
    description: 'Discover 10 historical moments',
    icon: 'bolt',
    category: 'special',
    rarity: 'uncommon',
    targetProgress: 10,
    getProgress: (_, empires) => {
      return empires.reduce((total, ep) => total + ep.momentsDiscovered.length, 0);
    },
    checkUnlock: (_, empires) => {
      const totalMoments = empires.reduce((total, ep) => total + ep.momentsDiscovered.length, 0);
      return totalMoments >= 10;
    },
  },
  {
    id: 'overview-collector',
    name: 'Overview Collector',
    description: 'Complete 5 empire overviews',
    icon: 'scroll',
    category: 'special',
    rarity: 'uncommon',
    targetProgress: 5,
    getProgress: (_, empires) => {
      return empires.filter(ep => ep.overviewCompleted).length;
    },
    checkUnlock: (_, empires) => {
      return empires.filter(ep => ep.overviewCompleted).length >= 5;
    },
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get badge by ID
 */
export function getBadgeById(badgeId: string): BadgeDefinition | undefined {
  return BADGES.find(b => b.id === badgeId);
}

/**
 * Get badges by category
 */
export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return BADGES.filter(b => b.category === category);
}

/**
 * Get badges by rarity
 */
export function getBadgesByRarity(rarity: BadgeRarity): BadgeDefinition[] {
  return BADGES.filter(b => b.rarity === rarity);
}

/**
 * Check which badges should be unlocked based on current progress
 */
export function checkBadgeUnlocks(
  profile: ExplorerProfile,
  empires: EmpireProgress[],
  epochs: EpochProgress[],
  currentBadges: EarnedBadge[]
): BadgeDefinition[] {
  const newlyUnlocked: BadgeDefinition[] = [];

  for (const badge of BADGES) {
    const earned = currentBadges.find(eb => eb.badgeId === badge.id);

    // Skip if already unlocked
    if (earned?.isUnlocked) continue;

    // Check if should unlock
    if (badge.checkUnlock?.(profile, empires, epochs)) {
      newlyUnlocked.push(badge);
    }
  }

  return newlyUnlocked;
}

/**
 * Calculate progress for a specific badge
 */
export function calculateBadgeProgress(
  badge: BadgeDefinition,
  profile: ExplorerProfile,
  empires: EmpireProgress[],
  epochs: EpochProgress[]
): number {
  if (badge.getProgress) {
    return badge.getProgress(profile, empires, epochs);
  }
  return 0;
}

/**
 * Create initial earned badge entry
 */
export function createEarnedBadge(badgeId: string, targetProgress: number): EarnedBadge {
  return {
    badgeId,
    unlockedAt: null,
    isUnlocked: false,
    isPinned: false,
    progress: 0,
    targetProgress,
  };
}

/**
 * Get rarity color classes for Tailwind
 */
export function getRarityColors(rarity: BadgeRarity): {
  border: string;
  bg: string;
  text: string;
  glow: string;
} {
  switch (rarity) {
    case 'common':
      return {
        border: 'border-[#B87333]',
        bg: 'bg-[#B87333]/10',
        text: 'text-[#B87333]',
        glow: '',
      };
    case 'uncommon':
      return {
        border: 'border-[#B87333]',
        bg: 'bg-[#B87333]/15',
        text: 'text-[#B87333]',
        glow: 'shadow-[0_0_10px_rgba(184,115,51,0.3)]',
      };
    case 'rare':
      return {
        border: 'border-[#C9A66B]',
        bg: 'bg-[#C9A66B]/15',
        text: 'text-[#C9A66B]',
        glow: 'shadow-[0_0_15px_rgba(201,166,107,0.4)]',
      };
    case 'epic':
      return {
        border: 'border-[#4A6FA5]',
        bg: 'bg-[#4A6FA5]/15',
        text: 'text-[#4A6FA5]',
        glow: 'shadow-[0_0_20px_rgba(74,111,165,0.4)]',
      };
    case 'legendary':
      return {
        border: 'border-[#722F37]',
        bg: 'bg-[#722F37]/15',
        text: 'text-[#722F37]',
        glow: 'shadow-[0_0_25px_rgba(114,47,55,0.5)]',
      };
  }
}

/**
 * Get all badge IDs
 */
export function getAllBadgeIds(): string[] {
  return BADGES.map(b => b.id);
}
