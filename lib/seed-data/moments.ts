import { KeyMoment } from '@/types';

export const KEY_MOMENTS: KeyMoment[] = [
  // ============================================
  // ANCIENT EGYPT (3 moments)
  // ============================================
  {
    id: 'building-great-pyramid',
    name: 'Building the Great Pyramid',
    empire: 'ancient-egypt',
    year: '2560 BCE',
    description: 'The construction of the Great Pyramid of Giza, one of the Seven Wonders of the Ancient World, built as a tomb for Pharaoh Khufu.',
    significance: 'Remained the tallest man-made structure for over 3,800 years and demonstrated the organizational and engineering capabilities of ancient Egypt.',
    tags: ['architecture', 'engineering', 'pharaoh', 'wonder'],
  },
  {
    id: 'discovery-tutankhamun-tomb',
    name: 'Discovery of Tutankhamun\'s Tomb',
    empire: 'ancient-egypt',
    year: '1922 CE',
    description: 'Howard Carter\'s discovery of the nearly intact tomb of the young pharaoh Tutankhamun in the Valley of the Kings.',
    significance: 'Sparked worldwide interest in Egyptology and provided unprecedented insight into ancient Egyptian burial practices and royal life.',
    tags: ['archaeology', 'discovery', 'pharaoh', 'treasure'],
  },
  {
    id: 'battle-of-kadesh',
    name: 'Battle of Kadesh',
    empire: 'ancient-egypt',
    year: '1274 BCE',
    description: 'The largest chariot battle ever fought, between the Egyptian Empire under Ramesses II and the Hittite Empire.',
    significance: 'Led to the first known peace treaty in history between Egypt and the Hittites.',
    tags: ['battle', 'military', 'diplomacy', 'ramesses'],
  },

  // ============================================
  // PERSIAN EMPIRE (3 moments)
  // ============================================
  {
    id: 'conquest-of-babylon',
    name: 'Conquest of Babylon',
    empire: 'persian-empire',
    year: '539 BCE',
    description: 'Cyrus the Great\'s capture of Babylon, ending the Neo-Babylonian Empire and freeing the Jewish people from captivity.',
    significance: 'Established Persian dominance in Mesopotamia and is celebrated in the Hebrew Bible for freeing the Jews.',
    tags: ['conquest', 'cyrus', 'liberation', 'babylon'],
  },
  {
    id: 'battle-of-thermopylae',
    name: 'Battle of Thermopylae',
    empire: 'persian-empire',
    year: '480 BCE',
    description: 'The famous last stand of 300 Spartans and their allies against the massive Persian army of Xerxes I.',
    significance: 'Became a symbol of courage against overwhelming odds and delayed the Persian advance into Greece.',
    tags: ['battle', 'spartans', 'xerxes', 'heroism'],
  },
  {
    id: 'construction-persepolis',
    name: 'Construction of Persepolis',
    empire: 'persian-empire',
    year: '518 BCE',
    description: 'Darius I began construction of Persepolis, the ceremonial capital of the Achaemenid Empire.',
    significance: 'Represented the height of Persian architectural and artistic achievement, hosting the annual tribute ceremony from all satrapies.',
    tags: ['architecture', 'darius', 'capital', 'ceremony'],
  },

  // ============================================
  // CLASSICAL GREECE (3 moments)
  // ============================================
  {
    id: 'birth-of-democracy',
    name: 'Birth of Athenian Democracy',
    empire: 'classical-greece',
    year: '508 BCE',
    description: 'Cleisthenes\' reforms established democracy in Athens, allowing citizens to participate directly in political decisions.',
    significance: 'Created the foundation for Western democratic traditions and the concept of citizen participation in government.',
    tags: ['democracy', 'politics', 'reform', 'athens'],
  },
  {
    id: 'battle-of-marathon',
    name: 'Battle of Marathon',
    empire: 'classical-greece',
    year: '490 BCE',
    description: 'The Athenian army defeated a larger Persian force, preserving Greek independence and democracy.',
    significance: 'Proved that the Persian Empire could be defeated and inspired the legend of the marathon runner.',
    tags: ['battle', 'victory', 'persian-wars', 'athens'],
  },
  {
    id: 'golden-age-athens',
    name: 'Golden Age of Athens',
    empire: 'classical-greece',
    year: '461 BCE',
    description: 'The period of Athenian political hegemony, economic growth, and cultural flourishing under Pericles.',
    significance: 'Produced the Parthenon, the works of Sophocles and Euripides, and the philosophy of Socrates.',
    tags: ['culture', 'philosophy', 'arts', 'pericles'],
  },

  // ============================================
  // ROMAN EMPIRE (3 moments)
  // ============================================
  {
    id: 'crossing-the-rubicon',
    name: 'Crossing the Rubicon',
    empire: 'roman-empire',
    year: '49 BCE',
    description: 'Julius Caesar led his army across the Rubicon River, defying the Roman Senate and starting a civil war.',
    significance: 'Marked the beginning of the end of the Roman Republic and Caesar\'s rise to absolute power.',
    tags: ['caesar', 'civil-war', 'politics', 'military'],
  },
  {
    id: 'fall-of-rome',
    name: 'Fall of the Western Roman Empire',
    empire: 'roman-empire',
    year: '476 CE',
    description: 'The Germanic chieftain Odoacer deposed the last Roman emperor, Romulus Augustulus, ending the Western Roman Empire.',
    significance: 'Marked the traditional end of ancient history and the beginning of the Middle Ages in Europe.',
    tags: ['fall', 'barbarians', 'empire', 'medieval'],
  },
  {
    id: 'eruption-vesuvius',
    name: 'Eruption of Mount Vesuvius',
    empire: 'roman-empire',
    year: '79 CE',
    description: 'The catastrophic eruption that buried the cities of Pompeii and Herculaneum in volcanic ash.',
    significance: 'Preserved a snapshot of Roman daily life and remains one of the most studied volcanic events in history.',
    tags: ['disaster', 'pompeii', 'archaeology', 'preservation'],
  },

  // ============================================
  // BRITISH EMPIRE (3 moments)
  // ============================================
  {
    id: 'industrial-revolution-begins',
    name: 'Industrial Revolution Begins',
    empire: 'british-empire',
    year: '1760',
    description: 'The transition from hand production to machine manufacturing that began in Britain and spread worldwide.',
    significance: 'Fundamentally transformed society, economy, and daily life, creating the modern industrial world.',
    tags: ['industry', 'technology', 'economy', 'transformation'],
  },
  {
    id: 'battle-of-trafalgar',
    name: 'Battle of Trafalgar',
    empire: 'british-empire',
    year: '1805',
    description: 'Admiral Nelson\'s decisive naval victory over the combined French and Spanish fleets.',
    significance: 'Established British naval supremacy for over a century and ended Napoleon\'s plans to invade Britain.',
    tags: ['naval', 'nelson', 'napoleon', 'victory'],
  },
  {
    id: 'abolition-slavery',
    name: 'Abolition of Slavery in the British Empire',
    empire: 'british-empire',
    year: '1833',
    description: 'The Slavery Abolition Act freed all slaves in the British Empire and compensated slave owners.',
    significance: 'Marked a major turning point in the global abolition movement and British moral authority.',
    tags: ['abolition', 'slavery', 'reform', 'humanitarian'],
  },

  // ============================================
  // FRENCH EMPIRE (3 moments)
  // ============================================
  {
    id: 'storming-bastille',
    name: 'Storming of the Bastille',
    empire: 'french-empire',
    year: '1789',
    description: 'Parisian revolutionaries stormed the Bastille fortress, a symbol of royal tyranny, marking the start of the French Revolution.',
    significance: 'Became the defining moment of the French Revolution and is celebrated as France\'s national day.',
    tags: ['revolution', 'liberty', 'paris', 'uprising'],
  },
  {
    id: 'coronation-napoleon',
    name: 'Coronation of Napoleon',
    empire: 'french-empire',
    year: '1804',
    description: 'Napoleon Bonaparte crowned himself Emperor of the French at Notre-Dame Cathedral in Paris.',
    significance: 'Marked the end of the French Republic and the beginning of the First French Empire.',
    tags: ['napoleon', 'emperor', 'coronation', 'empire'],
  },
  {
    id: 'battle-of-waterloo',
    name: 'Battle of Waterloo',
    empire: 'french-empire',
    year: '1815',
    description: 'Napoleon\'s final defeat by the Duke of Wellington and Prussian forces in present-day Belgium.',
    significance: 'Ended Napoleon\'s rule and the Napoleonic Wars, reshaping the political map of Europe.',
    tags: ['napoleon', 'defeat', 'wellington', 'end-of-era'],
  },

  // ============================================
  // SPANISH EMPIRE (3 moments)
  // ============================================
  {
    id: 'columbus-voyage',
    name: 'Columbus Reaches the Americas',
    empire: 'spanish-empire',
    year: '1492',
    description: 'Christopher Columbus, sponsored by Spain, reached the Caribbean, beginning the Age of Exploration.',
    significance: 'Initiated sustained European contact with the Americas and the Columbian Exchange.',
    tags: ['exploration', 'discovery', 'columbus', 'americas'],
  },
  {
    id: 'fall-tenochtitlan',
    name: 'Fall of Tenochtitlan',
    empire: 'spanish-empire',
    year: '1521',
    description: 'Hernan Cortes and his allies captured the Aztec capital, ending the Aztec Empire.',
    significance: 'Marked the beginning of Spanish colonial rule in Mexico and the destruction of Aztec civilization.',
    tags: ['conquest', 'cortes', 'aztec', 'colonization'],
  },
  {
    id: 'spanish-armada',
    name: 'Defeat of the Spanish Armada',
    empire: 'spanish-empire',
    year: '1588',
    description: 'The Spanish fleet sent to invade England was defeated by English naval forces and storms.',
    significance: 'Marked the beginning of English naval power and the decline of Spanish dominance.',
    tags: ['naval', 'defeat', 'england', 'decline'],
  },

  // ============================================
  // QING CHINA (3 moments)
  // ============================================
  {
    id: 'manchu-conquest',
    name: 'Manchu Conquest of China',
    empire: 'qing-china',
    year: '1644',
    description: 'The Manchu forces entered Beijing and established the Qing dynasty, China\'s last imperial dynasty.',
    significance: 'Began nearly three centuries of Manchu rule over China and expansion of Chinese territory.',
    tags: ['conquest', 'dynasty', 'manchu', 'transition'],
  },
  {
    id: 'first-opium-war',
    name: 'First Opium War',
    empire: 'qing-china',
    year: '1839',
    description: 'Conflict between Britain and China over trade imbalances and the opium trade.',
    significance: 'Resulted in the Treaty of Nanking, ceding Hong Kong to Britain and opening Chinese ports to foreign trade.',
    tags: ['war', 'opium', 'britain', 'unequal-treaties'],
  },
  {
    id: 'boxer-rebellion',
    name: 'Boxer Rebellion',
    empire: 'qing-china',
    year: '1900',
    description: 'Anti-foreign uprising in China suppressed by an international coalition of eight nations.',
    significance: 'Weakened the Qing dynasty and accelerated demands for reform and revolution.',
    tags: ['rebellion', 'foreign-intervention', 'nationalism', 'decline'],
  },

  // ============================================
  // REVOLUTIONARY AMERICA (3 moments)
  // ============================================
  {
    id: 'declaration-independence',
    name: 'Declaration of Independence',
    empire: 'united-states',
    year: '1776',
    description: 'The Continental Congress adopted the Declaration of Independence, proclaiming separation from Britain.',
    significance: 'Articulated the principles of liberty and equality that would inspire democratic movements worldwide.',
    tags: ['independence', 'founding', 'liberty', 'jefferson'],
  },
  {
    id: 'boston-tea-party',
    name: 'Boston Tea Party',
    empire: 'united-states',
    year: '1773',
    description: 'American colonists dumped British tea into Boston Harbor to protest taxation without representation.',
    significance: 'Galvanized colonial opposition to British rule and led to the Intolerable Acts.',
    tags: ['protest', 'taxation', 'boston', 'rebellion'],
  },
  {
    id: 'constitutional-convention',
    name: 'Constitutional Convention',
    empire: 'united-states',
    year: '1787',
    description: 'Delegates met in Philadelphia to draft the United States Constitution, creating the federal government.',
    significance: 'Produced the oldest written national constitution still in use, establishing American democracy.',
    tags: ['constitution', 'founding', 'government', 'philadelphia'],
  },
];

// Helper function to get moments by empire
export function getMomentsByEmpire(empireId: string): KeyMoment[] {
  return KEY_MOMENTS.filter(m => m.empire === empireId);
}

// Helper function to get moment by ID
export function getMomentById(id: string): KeyMoment | undefined {
  return KEY_MOMENTS.find(m => m.id === id);
}
