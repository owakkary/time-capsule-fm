import { Perspective } from '@/types';

export const PERSPECTIVES: Perspective[] = [
  // ============================================
  // ANCIENT EGYPT (3 perspectives)
  // ============================================
  {
    id: 'egyptian-court-scribe',
    name: 'A Pharaoh\'s Court Scribe',
    empire: 'ancient-egypt',
    archetype: 'Scholar',
    description: 'Experience life as a royal scribe in the palace of the pharaoh, recording decrees, managing temple records, and witnessing the inner workings of divine kingship.',
    tags: ['literacy', 'palace', 'hieroglyphics', 'administration'],
  },
  {
    id: 'pyramid-builder',
    name: 'A Pyramid Builder',
    empire: 'ancient-egypt',
    archetype: 'Laborer',
    description: 'Live the life of a skilled worker on the Giza plateau, hauling limestone blocks, working in rotating crews, and contributing to monuments meant to last for eternity.',
    tags: ['construction', 'labor', 'engineering', 'community'],
  },
  {
    id: 'temple-priestess',
    name: 'A Temple Priestess of Isis',
    empire: 'ancient-egypt',
    archetype: 'Religious',
    description: 'Serve the goddess Isis in her sacred temple, performing daily rituals, interpreting dreams, and guiding worshippers through the mysteries of death and rebirth.',
    tags: ['religion', 'ritual', 'women', 'spirituality'],
  },

  // ============================================
  // PERSIAN EMPIRE (3 perspectives)
  // ============================================
  {
    id: 'persian-satrap',
    name: 'A Provincial Satrap',
    empire: 'persian-empire',
    archetype: 'Administrator',
    description: 'Govern a vast Persian province as satrap, collecting tribute, maintaining the Royal Road, and balancing loyalty to the King of Kings with local autonomy.',
    tags: ['governance', 'administration', 'taxation', 'diplomacy'],
  },
  {
    id: 'immortal-warrior',
    name: 'An Immortal Warrior',
    empire: 'persian-empire',
    archetype: 'Soldier',
    description: 'March with the legendary Ten Thousand Immortals, the elite royal guard of the Persian king, whose ranks were always kept at exactly 10,000 men.',
    tags: ['military', 'elite', 'loyalty', 'warfare'],
  },
  {
    id: 'zoroastrian-priest',
    name: 'A Zoroastrian Priest',
    empire: 'persian-empire',
    archetype: 'Religious',
    description: 'Tend the sacred fire that must never be extinguished, teach the cosmic struggle between Ahura Mazda and Angra Mainyu, and guide souls toward righteousness.',
    tags: ['religion', 'fire-temple', 'spirituality', 'ethics'],
  },

  // ============================================
  // CLASSICAL GREECE (3 perspectives)
  // ============================================
  {
    id: 'athenian-citizen',
    name: 'An Athenian Citizen',
    empire: 'classical-greece',
    archetype: 'Citizen',
    description: 'Participate in the world\'s first democracy, debate in the Assembly, serve on juries, and balance civic duty with family and business in the golden age of Athens.',
    tags: ['democracy', 'politics', 'civic-duty', 'philosophy'],
  },
  {
    id: 'spartan-hoplite',
    name: 'A Spartan Hoplite',
    empire: 'classical-greece',
    archetype: 'Soldier',
    description: 'Train from age seven in the agoge, fight in the legendary phalanx formation, and live by the code that demands you return with your shield or on it.',
    tags: ['military', 'discipline', 'honor', 'training'],
  },
  {
    id: 'greek-philosopher',
    name: 'A Student of Socrates',
    empire: 'classical-greece',
    archetype: 'Scholar',
    description: 'Walk through the agora with the great questioner himself, engage in dialectic discourse, and witness the birth of Western philosophy in the streets of Athens.',
    tags: ['philosophy', 'education', 'socrates', 'wisdom'],
  },

  // ============================================
  // ROMAN EMPIRE (3 perspectives)
  // ============================================
  {
    id: 'roman-legionary',
    name: 'A Roman Legionary',
    empire: 'roman-empire',
    archetype: 'Soldier',
    description: 'March with the legions across three continents, build roads and fortifications, and experience the discipline and camaraderie that made Rome\'s army invincible.',
    tags: ['military', 'discipline', 'conquest', 'engineering'],
  },
  {
    id: 'roman-senator',
    name: 'A Roman Senator',
    empire: 'roman-empire',
    archetype: 'Politician',
    description: 'Navigate the treacherous politics of the Roman Senate, deliver orations in the Forum, and witness the transformation from Republic to Empire.',
    tags: ['politics', 'oratory', 'power', 'intrigue'],
  },
  {
    id: 'gladiator',
    name: 'A Gladiator in the Colosseum',
    empire: 'roman-empire',
    archetype: 'Entertainer',
    description: 'Train in the ludus, fight for glory and survival in the arena, and experience the roar of 50,000 spectators in the greatest amphitheater ever built.',
    tags: ['combat', 'entertainment', 'slavery', 'fame'],
  },

  // ============================================
  // BRITISH EMPIRE (3 perspectives)
  // ============================================
  {
    id: 'east-india-merchant',
    name: 'An East India Company Merchant',
    empire: 'british-empire',
    archetype: 'Merchant',
    description: 'Trade in silks, spices, and tea across the Indian Ocean, navigate company politics, and witness the transformation of a trading company into an empire.',
    tags: ['trade', 'colonialism', 'wealth', 'adventure'],
  },
  {
    id: 'factory-worker',
    name: 'A Manchester Factory Worker',
    empire: 'british-empire',
    archetype: 'Laborer',
    description: 'Work the thundering power looms of the cotton mills, experience the hardships and solidarity of industrial labor, and witness the birth of the working class.',
    tags: ['industry', 'labor', 'hardship', 'community'],
  },
  {
    id: 'british-explorer',
    name: 'A Victorian Explorer',
    empire: 'british-empire',
    archetype: 'Explorer',
    description: 'Chart unknown territories in Africa and Asia, document new species, and grapple with the complex legacy of exploration in the age of empire.',
    tags: ['exploration', 'adventure', 'science', 'colonialism'],
  },

  // ============================================
  // FRENCH EMPIRE (3 perspectives)
  // ============================================
  {
    id: 'versailles-courtier',
    name: 'A Courtier at Versailles',
    empire: 'french-empire',
    archetype: 'Aristocrat',
    description: 'Navigate the elaborate rituals and deadly intrigues of Louis XIV\'s court, where a misplaced word could mean exile and proximity to the Sun King meant everything.',
    tags: ['court', 'intrigue', 'luxury', 'etiquette'],
  },
  {
    id: 'parisian-revolutionary',
    name: 'A Parisian Revolutionary',
    empire: 'french-empire',
    archetype: 'Revolutionary',
    description: 'Storm the Bastille, march to Versailles, and witness the birth of modern revolution as the old order crumbles and new ideals of liberty, equality, and fraternity emerge.',
    tags: ['revolution', 'politics', 'idealism', 'violence'],
  },
  {
    id: 'napoleonic-soldier',
    name: 'A Soldier in Napoleon\'s Grand Army',
    empire: 'french-empire',
    archetype: 'Soldier',
    description: 'March across Europe with the greatest military force of its age, from the triumph at Austerlitz to the frozen horrors of the Russian campaign.',
    tags: ['military', 'napoleon', 'conquest', 'hardship'],
  },

  // ============================================
  // SPANISH EMPIRE (3 perspectives)
  // ============================================
  {
    id: 'conquistador',
    name: 'A Conquistador in the New World',
    empire: 'spanish-empire',
    archetype: 'Soldier',
    description: 'Sail across the unknown ocean, encounter civilizations unlike any seen before, and face the moral complexities of conquest driven by gold, glory, and God.',
    tags: ['conquest', 'exploration', 'violence', 'faith'],
  },
  {
    id: 'mission-priest',
    name: 'A Franciscan Mission Priest',
    empire: 'spanish-empire',
    archetype: 'Religious',
    description: 'Build missions in the Americas, attempt to convert indigenous peoples, and navigate the tensions between protecting native populations and serving the empire.',
    tags: ['religion', 'missions', 'conversion', 'colonialism'],
  },
  {
    id: 'silver-miner',
    name: 'A Miner at Potosi',
    empire: 'spanish-empire',
    archetype: 'Laborer',
    description: 'Descend into the silver mountain that funded an empire, work alongside indigenous and African laborers, and experience the brutal reality beneath Spanish wealth.',
    tags: ['mining', 'labor', 'silver', 'exploitation'],
  },

  // ============================================
  // QING CHINA (3 perspectives)
  // ============================================
  {
    id: 'canton-tea-trader',
    name: 'A Canton Tea Trader',
    empire: 'qing-china',
    archetype: 'Merchant',
    description: 'Trade tea, silk, and porcelain with European merchants at the only port open to foreign trade, navigating the complex regulations of the Canton System.',
    tags: ['trade', 'tea', 'foreign-relations', 'commerce'],
  },
  {
    id: 'imperial-examiner',
    name: 'An Imperial Examination Scholar',
    empire: 'qing-china',
    archetype: 'Scholar',
    description: 'Spend decades mastering the Confucian classics, endure the grueling imperial examinations, and compete for a position in the world\'s most sophisticated bureaucracy.',
    tags: ['education', 'examinations', 'confucianism', 'bureaucracy'],
  },
  {
    id: 'bannerman',
    name: 'A Manchu Bannerman',
    empire: 'qing-china',
    archetype: 'Soldier',
    description: 'Serve in the elite Eight Banners army that conquered China, maintain Manchu identity while ruling over hundreds of millions of Han Chinese.',
    tags: ['military', 'manchu', 'identity', 'conquest'],
  },

  // ============================================
  // REVOLUTIONARY AMERICA (3 perspectives)
  // ============================================
  {
    id: 'continental-soldier',
    name: 'A Continental Army Soldier',
    empire: 'united-states',
    archetype: 'Soldier',
    description: 'Endure the hardships of Valley Forge, march barefoot through snow, and fight for independence against the world\'s most powerful military force.',
    tags: ['military', 'revolution', 'hardship', 'patriotism'],
  },
  {
    id: 'daughters-liberty',
    name: 'A Daughter of Liberty',
    empire: 'united-states',
    archetype: 'Activist',
    description: 'Organize boycotts of British goods, spin homespun cloth as an act of resistance, and experience the Revolution through the eyes of colonial women.',
    tags: ['women', 'resistance', 'boycott', 'patriotism'],
  },
  {
    id: 'founding-delegate',
    name: 'A Constitutional Convention Delegate',
    empire: 'united-states',
    archetype: 'Politician',
    description: 'Debate the future of a new nation in Philadelphia\'s sweltering summer heat, forge compromises, and help write the document that will define American democracy.',
    tags: ['politics', 'constitution', 'founding', 'debate'],
  },
];

// Helper function to get perspectives by empire
export function getPerspectivesByEmpire(empireId: string): Perspective[] {
  return PERSPECTIVES.filter(p => p.empire === empireId);
}

// Helper function to get perspective by ID
export function getPerspectiveById(id: string): Perspective | undefined {
  return PERSPECTIVES.find(p => p.id === id);
}
