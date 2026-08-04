// Firestore document types

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// A pre-generated, shared episode in the static content library.
// Stored at contentLibrary/{id} — id is deterministic, see lib/content-library.ts.
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

// How this item's audio is produced: 'elevenlabs' for the pre-rendered mp3
// at audioUrl, 'browser-speech' for items narrated client-side via the
// Web Speech API (no audioUrl, kept free of ongoing TTS cost).
export type AudioProvider = 'elevenlabs' | 'browser-speech';

export interface ContentLibraryItem {
  id: string;
  contentType: ContentType;
  contentId: string | null; // ID of the figure, moment, perspective; null for overview
  empireId: EmpireId;
  epochId: EpochId;
  title: string;
  script: string;
  durationMinutes: number;
  voiceId: string;
  audioProvider: AudioProvider;
  audioUrl: string | null; // null when audioProvider is 'browser-speech'
  audioDurationSeconds: number | null;
  wordCount: number;
  quiz: QuizQuestion[];
  createdAt: Date;
}

export interface ListeningHistory {
  id: string;
  userId: string;
  episodeId: string; // ContentLibraryItem id
  title: string;
  empireId: EmpireId;
  epochId: EpochId;
  contentType: ContentType;
  durationMinutes: number;
  progressSeconds: number;
  completed: boolean;
  lastPlayedAt: Date;
  createdAt: Date;
}

// Content types for episodes
export type ContentType = 'overview' | 'moment' | 'figure' | 'perspective';

// ============================================
// EPOCHS - Top level historical groupings
// ============================================

export const EPOCHS = [
  {
    id: 'bronze-age',
    name: 'Bronze Age Mediterranean',
    years: '3000 – 1200 BCE',
    description: 'The first great civilizations of the Nile, Mesopotamia, and Aegean',
    color: '#B87333', // Bronze color
    empires: ['ancient-egypt', 'mesopotamia', 'minoan-crete', 'mycenaean-greece', 'hittite-empire'],
    mapImage: '/maps/bronze-age.png',
  },
  {
    id: 'classical',
    name: 'Classical Antiquity',
    years: '800 – 323 BCE',
    description: 'The age of philosophy, democracy, and the first world empires',
    color: '#7BA3C9', // Classic blue
    empires: ['classical-greece', 'persian-empire', 'phoenicia', 'carthage', 'roman-republic'],
    mapImage: '/maps/classical.png',
  },
  {
    id: 'hellenistic-roman',
    name: 'Hellenistic & Roman World',
    years: '323 BCE – 476 CE',
    description: 'From Alexander\'s conquests to the fall of Rome',
    color: '#C9534D', // Roman red
    empires: ['macedonian-empire', 'roman-empire', 'parthian-empire', 'ptolemaic-egypt', 'han-china'],
    mapImage: '/maps/hellenistic-roman.png',
  },
  {
    id: 'revolutionary',
    name: 'Revolutionary Age',
    years: '1700 – 1900 CE',
    description: 'An era of revolutions, industry, and the birth of the modern world',
    color: '#4A6FA5', // Revolutionary blue
    empires: ['british-empire', 'french-empire', 'united-states', 'qing-china', 'russian-empire', 'meiji-japan'],
    mapImage: '/maps/revolutionary.png',
  },
] as const;

export type EpochId = typeof EPOCHS[number]['id'];

// ============================================
// EMPIRES - Historical civilizations/nations
// ============================================

export const EMPIRES = [
  // ============================================
  // BRONZE AGE MEDITERRANEAN (3000 – 1200 BCE)
  // ============================================
  {
    id: 'ancient-egypt',
    epochId: 'bronze-age',
    name: 'Ancient Egypt',
    emoji: '🏺',
    years: '3000 – 1070 BCE',
    color: '#D4A574',
    description: 'Land of the pharaohs, pyramids, and the eternal Nile',
    keyThemes: ['divine kingship', 'afterlife beliefs', 'monumental architecture', 'hieroglyphic writing'],
    mapRegion: {
      path: 'M 180 120 L 220 100 L 240 140 L 220 180 L 180 160 Z',
      centerX: 210,
      centerY: 140,
    },
  },
  {
    id: 'mesopotamia',
    epochId: 'bronze-age',
    name: 'Mesopotamian Empires',
    emoji: '🏛️',
    years: '2900 – 1200 BCE',
    color: '#8B7355',
    description: 'The cradle of civilization between the Tigris and Euphrates',
    keyThemes: ['cuneiform writing', 'code of laws', 'ziggurat temples', 'city-states'],
    mapRegion: {
      path: 'M 260 100 L 300 90 L 320 130 L 300 160 L 260 140 Z',
      centerX: 285,
      centerY: 125,
    },
  },
  {
    id: 'minoan-crete',
    epochId: 'bronze-age',
    name: 'Minoan Crete',
    emoji: '🐂',
    years: '2700 – 1450 BCE',
    color: '#4A90A4',
    description: 'Europe\'s first advanced civilization and master seafarers',
    keyThemes: ['palace civilization', 'sea trade', 'bull worship', 'Linear A script'],
    mapRegion: {
      path: 'M 170 100 L 200 95 L 205 115 L 180 125 L 165 110 Z',
      centerX: 185,
      centerY: 110,
    },
  },
  {
    id: 'mycenaean-greece',
    epochId: 'bronze-age',
    name: 'Mycenaean Greece',
    emoji: '🗡️',
    years: '1600 – 1100 BCE',
    color: '#6B5B73',
    description: 'Bronze Age warriors and the heroes of Homer\'s epics',
    keyThemes: ['warrior aristocracy', 'Trojan War', 'palace economy', 'Linear B script'],
    mapRegion: {
      path: 'M 160 80 L 190 75 L 200 100 L 185 120 L 155 105 Z',
      centerX: 175,
      centerY: 95,
    },
  },
  {
    id: 'hittite-empire',
    epochId: 'bronze-age',
    name: 'Hittite Empire',
    emoji: '⚒️',
    years: '1600 – 1178 BCE',
    color: '#A0522D',
    description: 'Masters of iron and rivals to Egypt in Anatolia',
    keyThemes: ['iron technology', 'treaty diplomacy', 'chariot warfare', 'Hattusa capital'],
    mapRegion: {
      path: 'M 220 70 L 270 60 L 290 90 L 270 120 L 220 100 Z',
      centerX: 250,
      centerY: 90,
    },
  },

  // ============================================
  // CLASSICAL ANTIQUITY (800 – 323 BCE)
  // ============================================
  {
    id: 'classical-greece',
    epochId: 'classical',
    name: 'Classical Greece',
    emoji: '🏛️',
    years: '800 – 323 BCE',
    color: '#7BA3C9',
    description: 'Birthplace of democracy, philosophy, and Western civilization',
    keyThemes: ['democracy', 'philosophy', 'Olympic games', 'city-states'],
    mapRegion: {
      path: 'M 160 80 L 200 70 L 210 100 L 190 130 L 150 110 Z',
      centerX: 180,
      centerY: 100,
    },
  },
  {
    id: 'persian-empire',
    epochId: 'classical',
    name: 'Persian Empire',
    emoji: '🦁',
    years: '550 – 330 BCE',
    color: '#8B4513',
    description: 'The first true world empire, stretching from Egypt to India',
    keyThemes: ['religious tolerance', 'royal roads', 'satrapy system', 'Zoroastrianism'],
    mapRegion: {
      path: 'M 260 100 L 340 80 L 380 120 L 360 180 L 280 160 L 260 120 Z',
      centerX: 310,
      centerY: 130,
    },
  },
  {
    id: 'phoenicia',
    epochId: 'classical',
    name: 'Phoenician City-States',
    emoji: '⚓',
    years: '1500 – 300 BCE',
    color: '#800080',
    description: 'Masters of the sea who gave the world the alphabet',
    keyThemes: ['alphabet invention', 'Mediterranean trade', 'purple dye', 'colonial settlements'],
    mapRegion: {
      path: 'M 230 100 L 250 95 L 255 120 L 240 135 L 225 115 Z',
      centerX: 240,
      centerY: 115,
    },
  },
  {
    id: 'carthage',
    epochId: 'classical',
    name: 'Carthage',
    emoji: '🐘',
    years: '814 – 146 BCE',
    color: '#B22222',
    description: 'Phoenician colony that became Rome\'s greatest rival',
    keyThemes: ['naval supremacy', 'Punic Wars', 'Hannibal', 'mercantile power'],
    mapRegion: {
      path: 'M 110 110 L 150 100 L 160 130 L 140 150 L 105 135 Z',
      centerX: 135,
      centerY: 125,
    },
  },
  {
    id: 'roman-republic',
    epochId: 'classical',
    name: 'Roman Republic',
    emoji: '🏛️',
    years: '509 – 27 BCE',
    color: '#8B0000',
    description: 'From city-state to Mediterranean power through citizen soldiers',
    keyThemes: ['republican government', 'citizen army', 'conquest of Italy', 'Punic Wars'],
    mapRegion: {
      path: 'M 100 70 L 150 60 L 165 100 L 145 130 L 95 110 Z',
      centerX: 130,
      centerY: 95,
    },
  },

  // ============================================
  // HELLENISTIC & ROMAN WORLD (323 BCE – 476 CE)
  // ============================================
  {
    id: 'macedonian-empire',
    epochId: 'hellenistic-roman',
    name: 'Macedonian Empire',
    emoji: '⭐',
    years: '323 – 30 BCE',
    color: '#DAA520',
    description: 'Alexander\'s legacy divided among his generals',
    keyThemes: ['Hellenistic culture', 'library of Alexandria', 'cultural fusion', 'successor kingdoms'],
    mapRegion: {
      path: 'M 200 60 L 350 40 L 380 100 L 350 150 L 200 130 Z',
      centerX: 275,
      centerY: 95,
    },
  },
  {
    id: 'roman-empire',
    epochId: 'hellenistic-roman',
    name: 'Roman Empire',
    emoji: '⚔️',
    years: '27 BCE – 476 CE',
    color: '#C9534D',
    description: 'The empire that defined law, engineering, and governance for millennia',
    keyThemes: ['Roman law', 'engineering marvels', 'Pax Romana', 'cultural assimilation'],
    mapRegion: {
      path: 'M 80 60 L 180 40 L 220 80 L 200 140 L 100 160 L 60 100 Z',
      centerX: 140,
      centerY: 100,
    },
  },
  {
    id: 'parthian-empire',
    epochId: 'hellenistic-roman',
    name: 'Parthian Empire',
    emoji: '🏹',
    years: '247 BCE – 224 CE',
    color: '#556B2F',
    description: 'Rome\'s eastern rival and guardian of the Silk Road',
    keyThemes: ['Silk Road trade', 'mounted archery', 'Iranian revival', 'Rome\'s nemesis'],
    mapRegion: {
      path: 'M 300 80 L 380 60 L 420 110 L 390 160 L 310 140 Z',
      centerX: 355,
      centerY: 110,
    },
  },
  {
    id: 'ptolemaic-egypt',
    epochId: 'hellenistic-roman',
    name: 'Ptolemaic Egypt',
    emoji: '📜',
    years: '305 – 30 BCE',
    color: '#4169E1',
    description: 'Greek pharaohs ruling the land of the Nile',
    keyThemes: ['Alexandria library', 'Cleopatra', 'Greek-Egyptian fusion', 'scholarly center'],
    mapRegion: {
      path: 'M 200 130 L 240 120 L 255 160 L 235 190 L 195 170 Z',
      centerX: 225,
      centerY: 155,
    },
  },
  {
    id: 'han-china',
    epochId: 'hellenistic-roman',
    name: 'Han Dynasty China',
    emoji: '🐲',
    years: '206 BCE – 220 CE',
    color: '#DC143C',
    description: 'The golden age of ancient China and the Silk Road\'s eastern terminus',
    keyThemes: ['Silk Road', 'Confucian bureaucracy', 'paper invention', 'Han expansion'],
    mapRegion: {
      path: 'M 420 50 L 520 30 L 560 90 L 540 150 L 440 130 L 400 90 Z',
      centerX: 480,
      centerY: 90,
    },
  },

  // ============================================
  // REVOLUTIONARY AGE (1700 – 1900 CE)
  // ============================================
  {
    id: 'british-empire',
    epochId: 'revolutionary',
    name: 'British Empire',
    emoji: '👑',
    years: '1707 – 1947 CE',
    color: '#DC143C',
    description: 'The empire on which the sun never set',
    keyThemes: ['Industrial Revolution', 'global trade', 'parliamentary democracy', 'naval supremacy'],
    mapRegion: {
      path: 'M 120 40 L 160 30 L 180 60 L 160 90 L 120 80 Z',
      centerX: 150,
      centerY: 60,
    },
  },
  {
    id: 'french-empire',
    epochId: 'revolutionary',
    name: 'French Empire',
    emoji: '⚜️',
    years: '1804 – 1815 CE',
    color: '#002654',
    description: 'Napoleon\'s empire that reshaped Europe\'s boundaries',
    keyThemes: ['French Revolution', 'Napoleonic Code', 'continental system', 'military genius'],
    mapRegion: {
      path: 'M 100 60 L 140 50 L 150 90 L 130 120 L 90 100 Z',
      centerX: 120,
      centerY: 85,
    },
  },
  {
    id: 'united-states',
    epochId: 'revolutionary',
    name: 'United States',
    emoji: '🔔',
    years: '1776 – present',
    color: '#3D5A80',
    description: 'Democracy\'s experiment and westward expansion',
    keyThemes: ['independence', 'Constitution', 'westward expansion', 'democratic experiment'],
    mapRegion: {
      path: 'M 40 60 L 120 40 L 140 100 L 100 140 L 20 120 Z',
      centerX: 80,
      centerY: 90,
    },
  },
  {
    id: 'qing-china',
    epochId: 'revolutionary',
    name: 'Qing Dynasty China',
    emoji: '🐉',
    years: '1644 – 1912 CE',
    color: '#FFD700',
    description: 'The last imperial dynasty facing Western encroachment',
    keyThemes: ['Manchu rule', 'Opium Wars', 'tributary system', 'century of humiliation'],
    mapRegion: {
      path: 'M 320 60 L 420 40 L 460 100 L 440 160 L 340 140 L 300 100 Z',
      centerX: 380,
      centerY: 100,
    },
  },
  {
    id: 'russian-empire',
    epochId: 'revolutionary',
    name: 'Russian Empire',
    emoji: '🦅',
    years: '1721 – 1917 CE',
    color: '#1C1C1C',
    description: 'The vast Eurasian empire from Peter the Great to the Romanov fall',
    keyThemes: ['Eurasian expansion', 'serfdom', 'Romanov dynasty', 'Great Game'],
    mapRegion: {
      path: 'M 200 20 L 400 10 L 450 60 L 420 100 L 220 90 L 180 50 Z',
      centerX: 310,
      centerY: 55,
    },
  },
  {
    id: 'meiji-japan',
    epochId: 'revolutionary',
    name: 'Meiji Japan',
    emoji: '🌸',
    years: '1868 – 1912 CE',
    color: '#BC002D',
    description: 'From isolation to Asian power in a single generation',
    keyThemes: ['modernization', 'industrialization', 'Meiji Restoration', 'Asian imperialism'],
    mapRegion: {
      path: 'M 500 50 L 540 40 L 560 80 L 540 110 L 495 95 Z',
      centerX: 525,
      centerY: 75,
    },
  },
] as const;

export type EmpireId = typeof EMPIRES[number]['id'];

// Helper to get empire by ID
export function getEmpire(id: EmpireId) {
  return EMPIRES.find(e => e.id === id);
}

// Helper to get epoch by ID
export function getEpoch(id: EpochId) {
  return EPOCHS.find(e => e.id === id);
}

// Helper to get empires for an epoch
export function getEmpiresForEpoch(epochId: EpochId) {
  return EMPIRES.filter(e => e.epochId === epochId);
}

// ============================================
// KEY FIGURES - Historical personalities
// ============================================

export interface KeyFigure {
  id: string;
  name: string;
  empire: EmpireId;
  title: string;
  years: string;
  description: string;
  significance: string;
  tags: string[];
}

// ============================================
// KEY MOMENTS - Historical events
// ============================================

export interface KeyMoment {
  id: string;
  name: string;
  empire: EmpireId;
  year: string;
  description: string;
  significance: string;
  tags: string[];
}

// ============================================
// PERSPECTIVES - First-person POV characters
// ============================================

export interface Perspective {
  id: string;
  name: string;
  empire: EmpireId;
  archetype: string;
  description: string;
  tags: string[];
}

// ============================================
// EMPIRE OVERVIEWS - Introductory content
// ============================================

export interface EmpireOverview {
  id: string;
  empire: EmpireId;
  title: string;
  description: string;
  keyThemes: string[];
  timespan: string;
}

// ============================================
// FAVORITES / COLLECTION
// ============================================

export interface FavoriteItem {
  id: string;
  oduserId: string;
  itemType: 'figure' | 'moment' | 'perspective' | 'episode' | 'empire';
  itemId: string;
  empire: EmpireId;
  createdAt: Date;
}

// ============================================
// ARCHIVED TIME PERIODS (for future epochs)
// ============================================

export const ARCHIVED_PERIODS = [
  { id: 'medieval-europe', name: 'Medieval Europe', emoji: '🏰', years: '500 CE – 1500 CE', color: '#6B5B73' },
  { id: 'renaissance', name: 'Renaissance', emoji: '🎨', years: '1400 – 1600', color: '#8B9D77' },
] as const;

// Legacy TIME_PERIODS for backward compatibility (deprecated)
export const TIME_PERIODS = [
  ...EMPIRES.map(e => ({ id: e.id, name: e.name, emoji: e.emoji, years: e.years, color: e.color })),
] as const;

export type TimePeriodId = EmpireId;

// ============================================
// EMPIRE TO EPOCH MAPPING
// ============================================

export const EMPIRE_TO_EPOCH: Record<EmpireId, EpochId> = {
  // Bronze Age
  'ancient-egypt': 'bronze-age',
  'mesopotamia': 'bronze-age',
  'minoan-crete': 'bronze-age',
  'mycenaean-greece': 'bronze-age',
  'hittite-empire': 'bronze-age',
  // Classical
  'classical-greece': 'classical',
  'persian-empire': 'classical',
  'phoenicia': 'classical',
  'carthage': 'classical',
  'roman-republic': 'classical',
  // Hellenistic & Roman
  'macedonian-empire': 'hellenistic-roman',
  'roman-empire': 'hellenistic-roman',
  'parthian-empire': 'hellenistic-roman',
  'ptolemaic-egypt': 'hellenistic-roman',
  'han-china': 'hellenistic-roman',
  // Revolutionary
  'british-empire': 'revolutionary',
  'french-empire': 'revolutionary',
  'united-states': 'revolutionary',
  'qing-china': 'revolutionary',
  'russian-empire': 'revolutionary',
  'meiji-japan': 'revolutionary',
};

// Legacy era to empire mapping for migration
export const LEGACY_ERA_TO_EMPIRE: Record<string, EmpireId | 'archived'> = {
  'ancient-egypt': 'ancient-egypt',
  'classical-greece': 'classical-greece',
  'persian-empire': 'persian-empire',
  'roman-empire': 'roman-empire',
  'medieval-europe': 'archived',
  'renaissance': 'archived',
  'american-revolution': 'united-states',
  'british-empire': 'british-empire',
  'french-empire': 'french-empire',
  'qing-china': 'qing-china',
  'spanish-empire': 'archived', // Spanish Empire removed from new structure
};

// ============================================
// GEOGRAPHIC MAP TYPES
// ============================================

export interface GeoCoordinate {
  longitude: number;
  latitude: number;
}

export interface GeoBounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

export interface EmpireGeoData {
  id: EmpireId;
  features: GeoJSON.FeatureCollection;
  labelPosition: GeoCoordinate;
  capitalPosition?: GeoCoordinate;
}

export type TerrainType = 'mountain' | 'forest' | 'desert' | 'water' | 'city' | 'capital';

export interface TerrainFeature {
  id: string;
  type: TerrainType;
  position: GeoCoordinate;
  name?: string;
  scale?: number; // Size multiplier
}

export interface MapProjectionConfig {
  type: 'naturalEarth' | 'albers' | 'mercator' | 'equirectangular';
  center: GeoCoordinate;
  scale: number;
  rotate?: [number, number, number];
}

export interface EpochMapConfig {
  epochId: EpochId;
  projection: MapProjectionConfig;
  bounds: GeoBounds;
  terrainFeatures: TerrainFeature[];
}

// GeoJSON type helpers
export type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;
export type GeoFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

// ============================================
// EXPLORER PROGRESSION SYSTEM
// ============================================

// Explorer tiers (visual stages based on level)
export type ExplorerTier = 'novice' | 'apprentice' | 'journeyman' | 'scholar' | 'sage' | 'master';

// Avatar stages (maps to tier)
export type AvatarStage = 'wanderer' | 'cartographer' | 'archaeologist' | 'chronicler' | 'antiquarian' | 'timekeeper';

// Badge rarity for visual styling
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Badge categories
export type BadgeCategory = 'milestone' | 'discovery' | 'mastery' | 'streak' | 'special';

// Empire mastery rank
export type EmpireRank = 'curious' | 'familiar' | 'studied' | 'expert' | 'master';

// Main explorer profile stored at users/{userId}/explorer/profile
export interface ExplorerProfile {
  userId: string;
  currentXP: number;
  currentLevel: number;
  tier: ExplorerTier;
  avatarStage: AvatarStage;
  currentTitle: string;
  totalEpisodesGenerated: number;
  totalListeningMinutes: number;
  episodesCompleted: number;
  currentDailyStreak: number;
  longestDailyStreak: number;
  lastActivityDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Progress for a specific epoch (stored at users/{userId}/explorer/epochs/{epochId})
export interface EpochProgress {
  epochId: EpochId;
  empiresExplored: EmpireId[];
  totalEpisodes: number;
  completionPercentage: number;
  firstExploredAt: Date | null;
  lastExploredAt: Date | null;
}

// Progress for a specific empire (stored at users/{userId}/explorer/empires/{empireId})
export interface EmpireProgress {
  empireId: EmpireId;
  figuresDiscovered: string[];
  momentsDiscovered: string[];
  perspectivesExperienced: string[];
  overviewCompleted: boolean;
  completionPercentage: number;
  rank: EmpireRank;
  totalEpisodes: number;
  firstExploredAt: Date | null;
  lastExploredAt: Date | null;
}

// Badge definition (static, defined in code)
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  category: BadgeCategory;
  rarity: BadgeRarity;
  targetProgress: number;
  // Function to check if badge should be unlocked
  checkUnlock?: (profile: ExplorerProfile, empires: EmpireProgress[], epochs: EpochProgress[]) => boolean;
  // Function to calculate current progress
  getProgress?: (profile: ExplorerProfile, empires: EmpireProgress[], epochs: EpochProgress[]) => number;
}

// Earned badge (stored at users/{userId}/explorer/badges/{badgeId})
export interface EarnedBadge {
  badgeId: string;
  unlockedAt: Date | null;
  isUnlocked: boolean;
  isPinned: boolean;
  progress: number;
  targetProgress: number;
}

// XP reward event types
export type XPEventType =
  | 'episode_generated'
  | 'episode_completed'
  | 'episode_partial'
  | 'figure_discovered'
  | 'moment_discovered'
  | 'perspective_discovered'
  | 'overview_completed'
  | 'first_empire'
  | 'daily_activity'
  | 'streak_weekly'
  | 'streak_monthly';

// XP event for tracking
export interface XPEvent {
  type: XPEventType;
  xp: number;
  timestamp: Date;
  metadata?: {
    empireId?: EmpireId;
    epochId?: EpochId;
    contentId?: string;
    contentType?: ContentType;
  };
}

// Level up result
export interface LevelUpResult {
  previousLevel: number;
  newLevel: number;
  previousTier: ExplorerTier;
  newTier: ExplorerTier;
  previousAvatarStage: AvatarStage;
  newAvatarStage: AvatarStage;
  xpGained: number;
  totalXP: number;
}

// Badge unlock result
export interface BadgeUnlockResult {
  badge: BadgeDefinition;
  earnedBadge: EarnedBadge;
  isNewUnlock: boolean;
}

// Combined progress update result
export interface ProgressUpdateResult {
  xpGained: number;
  levelUp: LevelUpResult | null;
  newBadges: BadgeUnlockResult[];
  streakUpdated: boolean;
  newStreak: number;
}

// ============================================
// ADAPTIVE CONTENT ENGINE
// ============================================

// Engagement event types for tracking user behavior
export type EngagementEventType =
  | 'episode_started'
  | 'episode_completed'
  | 'episode_abandoned'
  | 'episode_replayed'
  | 'recommendation_clicked'
  | 'recommendation_skipped'
  | 'quiz_passed'
  | 'quiz_failed';

// Engagement event stored at users/{userId}/explorer/profile/events/{auto-id}
export interface EngagementEvent {
  userId: string;
  eventType: EngagementEventType;
  episodeId?: string;
  empire?: EmpireId;
  epoch?: EpochId;
  contentType?: ContentType;
  contentId?: string;
  completionPercentage?: number;
  recommendationId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Interest profile stored at users/{userId}/explorer/profile/interests
export interface UserInterestProfile {
  // Counter-based fields (updated atomically)
  empireCounts: Record<string, number>;
  epochCounts: Record<string, number>;
  contentTypeCounts: Record<string, number>;
  tagCounts: Record<string, number>;
  completedEpisodeIds: string[];
  totalEpisodesStarted: number;
  totalEpisodesCompleted: number;

  updatedAt: Date;
}

// A single recommendation from the engine
export interface Recommendation {
  id: string;
  empire: EmpireId;
  epoch: EpochId;
  contentType: ContentType;
  contentId?: string;
  title: string;
  hostPitch: string;
  reason: string;
  confidence: number;
}

// Full response from POST /api/recommend
export interface RecommendationResponse {
  recommendations: Recommendation[];
  welcomeBack: string;
  isNewUser: boolean;
}
