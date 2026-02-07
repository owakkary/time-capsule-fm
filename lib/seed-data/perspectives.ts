import { Perspective } from '@/types';

export const PERSPECTIVES: Perspective[] = [
  // ============================================
  // BRONZE AGE MEDITERRANEAN (3000 – 1200 BCE)
  // ============================================

  // ANCIENT EGYPT (3 perspectives)
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

  // MESOPOTAMIA (3 perspectives)
  {
    id: 'babylonian-merchant',
    name: 'A Babylonian Merchant',
    empire: 'mesopotamia',
    archetype: 'Merchant',
    description: 'Navigate the bustling markets of Babylon, trading grain, textiles, and precious metals while keeping meticulous records on clay tablets.',
    tags: ['trade', 'commerce', 'contracts', 'city-life'],
  },
  {
    id: 'sumerian-priest',
    name: 'A Priest of the Ziggurat',
    empire: 'mesopotamia',
    archetype: 'Religious',
    description: 'Climb the great ziggurat to commune with the gods, observe the stars for omens, and maintain the cosmic order through daily offerings and rituals.',
    tags: ['religion', 'astronomy', 'ritual', 'temple'],
  },
  {
    id: 'assyrian-soldier',
    name: 'An Assyrian Soldier',
    empire: 'mesopotamia',
    archetype: 'Soldier',
    description: 'March with the fearsome Assyrian army, the most powerful military force of the ancient Near East, enforcing the will of the king across vast territories.',
    tags: ['military', 'conquest', 'discipline', 'empire'],
  },

  // MINOAN CRETE (3 perspectives)
  {
    id: 'minoan-merchant-captain',
    name: 'A Minoan Ship Captain',
    empire: 'minoan-crete',
    archetype: 'Merchant',
    description: 'Sail the wine-dark sea in your trading vessel, bringing Cretan goods to Egypt, the Levant, and the Aegean islands while navigating by stars and landmarks.',
    tags: ['trade', 'sailing', 'navigation', 'adventure'],
  },
  {
    id: 'bull-leaper',
    name: 'A Sacred Bull Leaper',
    empire: 'minoan-crete',
    archetype: 'Athlete',
    description: 'Train for the dangerous bull-leaping ceremony in the palace courtyard, a sacred athletic feat that honors the gods and thrills the crowds.',
    tags: ['athletics', 'ritual', 'danger', 'honor'],
  },
  {
    id: 'minoan-fresco-painter',
    name: 'A Palace Fresco Painter',
    empire: 'minoan-crete',
    archetype: 'Artisan',
    description: 'Create vibrant frescoes on the palace walls depicting dolphins, flowers, and processions, bringing color and life to Minoan royal spaces.',
    tags: ['art', 'palace', 'craftsmanship', 'beauty'],
  },

  // MYCENAEAN GREECE (3 perspectives)
  {
    id: 'mycenaean-warrior',
    name: 'A Mycenaean Warrior Prince',
    empire: 'mycenaean-greece',
    archetype: 'Warrior',
    description: 'Ride into battle in your chariot wearing bronze armor, seeking glory and honor in warfare between the great palace kingdoms of the Aegean.',
    tags: ['warfare', 'honor', 'nobility', 'chariot'],
  },
  {
    id: 'mycenaean-queen',
    name: 'A Mycenaean Palace Queen',
    empire: 'mycenaean-greece',
    archetype: 'Ruler',
    description: 'Manage the vast palace economy, overseeing textile production, storage, and the complex redistribution systems recorded in Linear B tablets.',
    tags: ['administration', 'women', 'economy', 'power'],
  },
  {
    id: 'mycenaean-bard',
    name: 'A Court Bard',
    empire: 'mycenaean-greece',
    archetype: 'Entertainer',
    description: 'Sing of heroes and gods in the great halls of the palace, preserving the stories and genealogies that would one day become Homer\'s epics.',
    tags: ['poetry', 'music', 'storytelling', 'tradition'],
  },

  // HITTITE EMPIRE (3 perspectives)
  {
    id: 'hittite-charioteer',
    name: 'A Royal Charioteer',
    empire: 'hittite-empire',
    archetype: 'Soldier',
    description: 'Drive the three-man Hittite war chariot into battle, a revolutionary weapon that helped the Hittites challenge Egypt for supremacy.',
    tags: ['chariot', 'warfare', 'technology', 'skill'],
  },
  {
    id: 'hittite-diplomat',
    name: 'A Royal Diplomat',
    empire: 'hittite-empire',
    archetype: 'Diplomat',
    description: 'Carry treaties and diplomatic correspondence across the ancient world, negotiating royal marriages and alliances in the interconnected Bronze Age world.',
    tags: ['diplomacy', 'treaties', 'travel', 'negotiation'],
  },
  {
    id: 'hittite-metalworker',
    name: 'A Hittite Ironsmith',
    empire: 'hittite-empire',
    archetype: 'Artisan',
    description: 'Guard the secrets of iron-working, a technology the Hittites pioneered that would revolutionize warfare and agriculture across the world.',
    tags: ['metallurgy', 'craftsmanship', 'secrets', 'technology'],
  },

  // ============================================
  // CLASSICAL ANTIQUITY (800 – 323 BCE)
  // ============================================

  // CLASSICAL GREECE (3 perspectives)
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

  // PERSIAN EMPIRE (3 perspectives)
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

  // PHOENICIA (3 perspectives)
  {
    id: 'phoenician-captain',
    name: 'A Phoenician Sea Captain',
    empire: 'phoenicia',
    archetype: 'Merchant',
    description: 'Sail beyond the Pillars of Hercules seeking tin and amber, navigating by the stars and establishing trading posts across the Mediterranean world.',
    tags: ['sailing', 'trade', 'exploration', 'adventure'],
  },
  {
    id: 'tyrian-dyer',
    name: 'A Tyrian Purple Dyer',
    empire: 'phoenicia',
    archetype: 'Artisan',
    description: 'Harvest murex snails and create the legendary Tyrian purple dye, so valuable that only royalty can afford to wear it.',
    tags: ['craftsmanship', 'dye', 'luxury', 'trade-secret'],
  },
  {
    id: 'phoenician-scribe',
    name: 'A Scribe of the Alphabet',
    empire: 'phoenicia',
    archetype: 'Scholar',
    description: 'Use the revolutionary Phoenician alphabet to record trade contracts and correspondence, a system so efficient it will transform human communication forever.',
    tags: ['writing', 'alphabet', 'commerce', 'innovation'],
  },

  // CARTHAGE (3 perspectives)
  {
    id: 'carthaginian-admiral',
    name: 'A Carthaginian Admiral',
    empire: 'carthage',
    archetype: 'Military',
    description: 'Command Carthage\'s powerful war fleet, patrolling the western Mediterranean and protecting the trade routes that bring wealth to the city.',
    tags: ['naval', 'warfare', 'command', 'sea-power'],
  },
  {
    id: 'sacred-band-soldier',
    name: 'A Sacred Band Soldier',
    empire: 'carthage',
    archetype: 'Soldier',
    description: 'Fight in Carthage\'s elite citizen infantry, the Sacred Band, defending your city against the rising threat of Rome.',
    tags: ['military', 'elite', 'patriotism', 'infantry'],
  },
  {
    id: 'carthaginian-priestess',
    name: 'A Priestess of Tanit',
    empire: 'carthage',
    archetype: 'Religious',
    description: 'Serve the great goddess Tanit in her sacred precinct, performing the rituals that ensure Carthage\'s prosperity and divine favor.',
    tags: ['religion', 'goddess', 'ritual', 'women'],
  },

  // ROMAN REPUBLIC (3 perspectives)
  {
    id: 'roman-centurion',
    name: 'A Roman Centurion',
    empire: 'roman-republic',
    archetype: 'Soldier',
    description: 'Lead eighty legionaries into battle, enforce iron discipline, and embody the virtues that made Rome\'s citizen army the most effective fighting force in the Mediterranean.',
    tags: ['military', 'discipline', 'leadership', 'duty'],
  },
  {
    id: 'roman-tribune',
    name: 'A Tribune of the Plebs',
    empire: 'roman-republic',
    archetype: 'Politician',
    description: 'Champion the rights of common citizens in the struggle of the orders, wielding the sacred power of the veto against patrician oppression.',
    tags: ['politics', 'reform', 'advocacy', 'conflict'],
  },
  {
    id: 'roman-matron',
    name: 'A Roman Matron',
    empire: 'roman-republic',
    archetype: 'Citizen',
    description: 'Manage a Roman household, raise future citizens, and wield considerable influence despite formal exclusion from political life.',
    tags: ['family', 'women', 'household', 'influence'],
  },

  // ============================================
  // HELLENISTIC & ROMAN WORLD (323 BCE – 476 CE)
  // ============================================

  // MACEDONIAN EMPIRE (3 perspectives)
  {
    id: 'companion-cavalry',
    name: 'A Companion Cavalryman',
    empire: 'macedonian-empire',
    archetype: 'Soldier',
    description: 'Ride beside Alexander as one of his elite Companion cavalry, charging into battle at Gaugamela and following him to the ends of the earth.',
    tags: ['cavalry', 'alexander', 'loyalty', 'conquest'],
  },
  {
    id: 'alexandrian-scholar',
    name: 'A Scholar at Alexandria',
    empire: 'macedonian-empire',
    archetype: 'Scholar',
    description: 'Study at the great Library of Alexandria, preserving Greek knowledge while learning from Egyptian, Jewish, and Persian wisdom traditions.',
    tags: ['scholarship', 'library', 'knowledge', 'synthesis'],
  },
  {
    id: 'hellenistic-merchant',
    name: 'A Hellenistic Merchant',
    empire: 'macedonian-empire',
    archetype: 'Merchant',
    description: 'Trade across Alexander\'s vast empire, bringing goods from India to Egypt while spreading Greek language and culture throughout the East.',
    tags: ['trade', 'culture', 'travel', 'commerce'],
  },

  // ROMAN EMPIRE (3 perspectives)
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

  // PARTHIAN EMPIRE (3 perspectives)
  {
    id: 'parthian-cataphract',
    name: 'A Parthian Cataphract',
    empire: 'parthian-empire',
    archetype: 'Soldier',
    description: 'Ride into battle as an armored cataphract, the heavily armored cavalry that formed the backbone of Parthian military might against Rome.',
    tags: ['cavalry', 'armor', 'warfare', 'elite'],
  },
  {
    id: 'silk-road-trader-parthia',
    name: 'A Silk Road Caravan Master',
    empire: 'parthian-empire',
    archetype: 'Merchant',
    description: 'Lead caravans across the Parthian heartland on the Silk Road, connecting Roman luxury markets with Chinese silk and Indian spices.',
    tags: ['trade', 'caravan', 'silk-road', 'travel'],
  },
  {
    id: 'parthian-noble',
    name: 'A Parthian Noble',
    empire: 'parthian-empire',
    archetype: 'Aristocrat',
    description: 'Rule your ancestral lands as a Parthian noble, maintaining Iranian traditions while your king balances the great clans against Roman threats.',
    tags: ['nobility', 'feudal', 'politics', 'tradition'],
  },

  // PTOLEMAIC EGYPT (3 perspectives)
  {
    id: 'alexandrian-librarian',
    name: 'A Librarian of Alexandria',
    empire: 'ptolemaic-egypt',
    archetype: 'Scholar',
    description: 'Catalog scrolls in the greatest library ever assembled, translate ancient texts, and participate in the scholarly community that made Alexandria the intellectual capital of the ancient world.',
    tags: ['library', 'scholarship', 'translation', 'preservation'],
  },
  {
    id: 'greco-egyptian-priest',
    name: 'A Greco-Egyptian Priest',
    empire: 'ptolemaic-egypt',
    archetype: 'Religious',
    description: 'Serve in a temple where Greek and Egyptian traditions blend, maintaining ancient rituals while adapting to Ptolemaic rule.',
    tags: ['religion', 'syncretism', 'ritual', 'tradition'],
  },
  {
    id: 'cleopatra-courtier',
    name: 'A Courtier to Cleopatra',
    empire: 'ptolemaic-egypt',
    archetype: 'Diplomat',
    description: 'Navigate the intrigues of Cleopatra\'s court as Rome\'s shadow falls over Egypt, witnessing the last days of the Ptolemaic dynasty.',
    tags: ['court', 'diplomacy', 'intrigue', 'decline'],
  },

  // HAN CHINA (3 perspectives)
  {
    id: 'han-official',
    name: 'A Han Dynasty Official',
    empire: 'han-china',
    archetype: 'Administrator',
    description: 'Govern a Chinese prefecture after passing the imperial examinations, implementing Confucian principles while managing taxes, justice, and public works.',
    tags: ['bureaucracy', 'confucianism', 'governance', 'examinations'],
  },
  {
    id: 'silk-road-envoy',
    name: 'A Silk Road Envoy',
    empire: 'han-china',
    archetype: 'Diplomat',
    description: 'Travel westward as an imperial envoy, establishing diplomatic relations with distant kingdoms and opening trade routes that will connect East and West.',
    tags: ['diplomacy', 'exploration', 'silk-road', 'travel'],
  },
  {
    id: 'han-farmer',
    name: 'A Han Dynasty Farmer',
    empire: 'han-china',
    archetype: 'Laborer',
    description: 'Work the land that feeds the empire, experiencing the cycles of rice cultivation, corvée labor, and the festivals that mark the agricultural year.',
    tags: ['agriculture', 'peasant', 'labor', 'community'],
  },

  // ============================================
  // REVOLUTIONARY AGE (1700 – 1900 CE)
  // ============================================

  // BRITISH EMPIRE (3 perspectives)
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

  // FRENCH EMPIRE (3 perspectives)
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

  // UNITED STATES (3 perspectives)
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

  // QING CHINA (3 perspectives)
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

  // RUSSIAN EMPIRE (3 perspectives)
  {
    id: 'russian-serf',
    name: 'A Russian Serf',
    empire: 'russian-empire',
    archetype: 'Laborer',
    description: 'Work the land bound to your lord, experiencing the harsh realities of serfdom while preserving village traditions and awaiting the promise of emancipation.',
    tags: ['serfdom', 'peasant', 'labor', 'hardship'],
  },
  {
    id: 'russian-officer',
    name: 'A Russian Imperial Officer',
    empire: 'russian-empire',
    archetype: 'Soldier',
    description: 'Serve in the Tsar\'s army defending the vast Russian frontier, from Napoleon\'s invasion to the Crimean War and the Great Game in Central Asia.',
    tags: ['military', 'officer', 'expansion', 'duty'],
  },
  {
    id: 'russian-intellectual',
    name: 'A Russian Intellectual',
    empire: 'russian-empire',
    archetype: 'Scholar',
    description: 'Debate the future of Russia in St. Petersburg salons, torn between Westernizers and Slavophiles, while censorship looms over every written word.',
    tags: ['intellectual', 'debate', 'reform', 'censorship'],
  },

  // MEIJI JAPAN (3 perspectives)
  {
    id: 'samurai-officer',
    name: 'A Former Samurai Officer',
    empire: 'meiji-japan',
    archetype: 'Soldier',
    description: 'Transition from samurai to modern army officer, mastering Western military tactics while grappling with the loss of traditional warrior status.',
    tags: ['military', 'modernization', 'tradition', 'transition'],
  },
  {
    id: 'meiji-industrialist',
    name: 'A Meiji Industrialist',
    empire: 'meiji-japan',
    archetype: 'Merchant',
    description: 'Build Japan\'s industrial future, establishing factories and trading companies with government support as Japan races to catch up with Western powers.',
    tags: ['industry', 'modernization', 'business', 'patriotism'],
  },
  {
    id: 'meiji-student',
    name: 'A Student Abroad',
    empire: 'meiji-japan',
    archetype: 'Scholar',
    description: 'Study Western science and governance in Europe or America, then return to help transform Japan while balancing foreign knowledge with Japanese identity.',
    tags: ['education', 'westernization', 'knowledge', 'identity'],
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
