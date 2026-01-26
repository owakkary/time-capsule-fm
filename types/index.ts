// Firestore document types

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Episode {
  id: string;
  userId: string;
  epoch: EpochId;
  empire: EmpireId;
  contentType: ContentType;
  contentId?: string; // ID of the figure, moment, perspective, or null for overview
  durationMinutes: number;
  title: string;
  content: string;
  audioUrl: string | null;
  audioDurationSeconds: number | null;
  createdAt: Date;
  // Legacy field for backward compatibility
  timePeriod?: string;
}

export interface ListeningHistory {
  id: string;
  userId: string;
  episodeId: string;
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
    id: 'ancient-world',
    name: 'Ancient World',
    years: '3100 BCE – 476 CE',
    description: 'The great civilizations that shaped the foundations of human history',
    color: '#C9A66B',
    empires: ['ancient-egypt', 'persian-empire', 'classical-greece', 'roman-empire'],
    mapImage: '/maps/ancient-world.png',
  },
  {
    id: 'revolutionary-period',
    name: 'Revolutionary Period',
    years: '1600 – 1912',
    description: 'An era of global empires, revolution, and transformation',
    color: '#4A6FA5',
    empires: ['british-empire', 'french-empire', 'spanish-empire', 'qing-china', 'united-states'],
    mapImage: '/maps/revolutionary-period.png',
  },
] as const;

export type EpochId = typeof EPOCHS[number]['id'];

// ============================================
// EMPIRES - Historical civilizations/nations
// ============================================

export const EMPIRES = [
  // Ancient World Empires
  {
    id: 'ancient-egypt',
    epochId: 'ancient-world',
    name: 'Ancient Egypt',
    emoji: '🏺',
    years: '3100 BCE – 30 BCE',
    color: '#D4A574',
    description: 'Land of the pharaohs, pyramids, and the eternal Nile',
    keyThemes: ['divine kingship', 'afterlife beliefs', 'monumental architecture', 'hieroglyphic writing'],
    mapRegion: {
      // SVG path for clickable region on map
      path: 'M 180 120 L 220 100 L 240 140 L 220 180 L 180 160 Z',
      centerX: 210,
      centerY: 140,
    },
  },
  {
    id: 'persian-empire',
    epochId: 'ancient-world',
    name: 'Persian Empire',
    emoji: '🦁',
    years: '550 BCE – 330 BCE',
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
    id: 'classical-greece',
    epochId: 'ancient-world',
    name: 'Classical Greece',
    emoji: '🏛️',
    years: '500 BCE – 323 BCE',
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
    id: 'roman-empire',
    epochId: 'ancient-world',
    name: 'Roman Empire',
    emoji: '⚔️',
    years: '27 BCE – 476 CE',
    color: '#C9534D',
    description: 'The empire that defined law, engineering, and governance for millennia',
    keyThemes: ['Roman law', 'engineering marvels', 'military expansion', 'cultural assimilation'],
    mapRegion: {
      path: 'M 80 60 L 180 40 L 220 80 L 200 140 L 100 160 L 60 100 Z',
      centerX: 140,
      centerY: 100,
    },
  },
  // Revolutionary Period Empires
  {
    id: 'british-empire',
    epochId: 'revolutionary-period',
    name: 'British Empire',
    emoji: '👑',
    years: '1600 – 1947',
    color: '#DC143C',
    description: 'The empire on which the sun never set',
    keyThemes: ['colonialism', 'industrial revolution', 'parliamentary democracy', 'global trade'],
    mapRegion: {
      path: 'M 120 40 L 160 30 L 180 60 L 160 90 L 120 80 Z',
      centerX: 150,
      centerY: 60,
    },
  },
  {
    id: 'french-empire',
    epochId: 'revolutionary-period',
    name: 'French Empire',
    emoji: '⚜️',
    years: '1600 – 1815',
    color: '#002654',
    description: 'From absolute monarchy to revolutionary republic to Napoleonic glory',
    keyThemes: ['enlightenment', 'revolution', 'Napoleonic wars', 'civil code'],
    mapRegion: {
      path: 'M 100 60 L 140 50 L 150 90 L 130 120 L 90 100 Z',
      centerX: 120,
      centerY: 85,
    },
  },
  {
    id: 'spanish-empire',
    epochId: 'revolutionary-period',
    name: 'Spanish Empire',
    emoji: '🚢',
    years: '1492 – 1898',
    color: '#F1BF00',
    description: 'Conquistadors, gold, and the first global empire',
    keyThemes: ['conquistadors', 'colonial extraction', 'Catholic missions', 'maritime exploration'],
    mapRegion: {
      path: 'M 70 80 L 110 70 L 120 110 L 100 140 L 60 120 Z',
      centerX: 90,
      centerY: 105,
    },
  },
  {
    id: 'qing-china',
    epochId: 'revolutionary-period',
    name: 'Qing Dynasty China',
    emoji: '🐉',
    years: '1644 – 1912',
    color: '#FFD700',
    description: 'The last imperial dynasty and the twilight of the Middle Kingdom',
    keyThemes: ['Manchu rule', 'opium wars', 'tributary system', 'cultural flourishing'],
    mapRegion: {
      path: 'M 320 60 L 420 40 L 460 100 L 440 160 L 340 140 L 300 100 Z',
      centerX: 380,
      centerY: 100,
    },
  },
  {
    id: 'united-states',
    epochId: 'revolutionary-period',
    name: 'Revolutionary America',
    emoji: '🔔',
    years: '1765 – 1800',
    color: '#3D5A80',
    description: 'The birth of a new nation founded on revolutionary ideals',
    keyThemes: ['independence', 'constitution', 'founding fathers', 'democratic experiment'],
    mapRegion: {
      path: 'M 40 60 L 120 40 L 140 100 L 100 140 L 20 120 Z',
      centerX: 80,
      centerY: 90,
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
// DURATIONS - Episode length options
// ============================================

export const DURATIONS = [
  { minutes: 5, label: '5 min', description: 'Quick hit' },
  { minutes: 10, label: '10 min', description: 'Coffee break' },
  { minutes: 15, label: '15 min', description: 'Deep dive' },
] as const;

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
// API REQUEST/RESPONSE TYPES
// ============================================

export interface GenerateRequest {
  epoch: EpochId;
  empire: EmpireId;
  contentType: ContentType;
  contentId?: string;
  durationMinutes: number;
}

export interface GenerateResponse {
  id: string;
  title: string;
  content: string;
  epoch: EpochId;
  empire: EmpireId;
  contentType: ContentType;
  durationMinutes: number;
}

export interface TTSRequest {
  episodeId: string;
  text: string;
}

export interface TTSResponse {
  audioUrl: string;
}

// ============================================
// EMPIRE TO EPOCH MAPPING
// ============================================

export const EMPIRE_TO_EPOCH: Record<EmpireId, EpochId> = {
  'ancient-egypt': 'ancient-world',
  'persian-empire': 'ancient-world',
  'classical-greece': 'ancient-world',
  'roman-empire': 'ancient-world',
  'british-empire': 'revolutionary-period',
  'french-empire': 'revolutionary-period',
  'spanish-empire': 'revolutionary-period',
  'qing-china': 'revolutionary-period',
  'united-states': 'revolutionary-period',
};

// Legacy era to empire mapping for migration
export const LEGACY_ERA_TO_EMPIRE: Record<string, EmpireId | 'archived'> = {
  'ancient-egypt': 'ancient-egypt',
  'classical-greece': 'classical-greece',
  'roman-empire': 'roman-empire',
  'medieval-europe': 'archived',
  'renaissance': 'archived',
  'american-revolution': 'united-states',
};
