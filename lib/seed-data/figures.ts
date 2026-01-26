import { KeyFigure } from '@/types';

export const KEY_FIGURES: KeyFigure[] = [
  // ============================================
  // ANCIENT EGYPT (2 figures)
  // ============================================
  {
    id: 'ramesses-ii',
    name: 'Ramesses II',
    empire: 'ancient-egypt',
    title: 'Pharaoh of Egypt',
    years: '1303 BCE – 1213 BCE',
    description: 'The greatest and most powerful pharaoh of the Egyptian Empire, known for his military campaigns and monumental building projects including Abu Simbel.',
    significance: 'Reigned for 66 years, signed the first known peace treaty in history, and left more monuments than any other pharaoh.',
    tags: ['pharaoh', 'military', 'architecture', 'diplomacy'],
  },
  {
    id: 'cleopatra-vii',
    name: 'Cleopatra VII',
    empire: 'ancient-egypt',
    title: 'Last Pharaoh of Egypt',
    years: '69 BCE – 30 BCE',
    description: 'The last active ruler of the Ptolemaic Kingdom of Egypt, known for her intelligence, political acumen, and relationships with Julius Caesar and Mark Antony.',
    significance: 'Her death marked the end of ancient Egypt as an independent nation and the beginning of Roman rule.',
    tags: ['pharaoh', 'politics', 'diplomacy', 'roman-relations'],
  },

  // ============================================
  // PERSIAN EMPIRE (2 figures)
  // ============================================
  {
    id: 'cyrus-the-great',
    name: 'Cyrus the Great',
    empire: 'persian-empire',
    title: 'Founder of the Achaemenid Empire',
    years: '600 BCE – 530 BCE',
    description: 'Founded the first Persian Empire and created the largest empire the world had yet seen, known for his respect for customs and religions of conquered lands.',
    significance: 'Created the Cyrus Cylinder, often considered the first declaration of human rights, and freed the Jews from Babylonian captivity.',
    tags: ['founder', 'conqueror', 'tolerance', 'administration'],
  },
  {
    id: 'darius-i',
    name: 'Darius I',
    empire: 'persian-empire',
    title: 'King of Kings',
    years: '550 BCE – 486 BCE',
    description: 'Organized the Persian Empire into satrapies, built the Royal Road, and constructed the ceremonial capital at Persepolis.',
    significance: 'Created an efficient administrative system that became a model for future empires and standardized weights, measures, and coinage.',
    tags: ['administrator', 'builder', 'reformer', 'military'],
  },

  // ============================================
  // CLASSICAL GREECE (2 figures)
  // ============================================
  {
    id: 'alexander-the-great',
    name: 'Alexander the Great',
    empire: 'classical-greece',
    title: 'King of Macedon',
    years: '356 BCE – 323 BCE',
    description: 'Created one of the largest empires in ancient history, stretching from Greece to northwestern India, spreading Greek culture throughout the known world.',
    significance: 'Never lost a battle and spread Hellenistic culture across three continents, fundamentally changing the ancient world.',
    tags: ['conqueror', 'military-genius', 'hellenism', 'empire-builder'],
  },
  {
    id: 'pericles',
    name: 'Pericles',
    empire: 'classical-greece',
    title: 'Strategos of Athens',
    years: '495 BCE – 429 BCE',
    description: 'The most prominent and influential Greek statesman during the Golden Age of Athens, champion of democracy and patron of the arts.',
    significance: 'Oversaw the construction of the Parthenon and promoted arts and literature, making Athens the educational and cultural center of the Greek world.',
    tags: ['democracy', 'statesman', 'culture', 'architecture'],
  },

  // ============================================
  // ROMAN EMPIRE (2 figures)
  // ============================================
  {
    id: 'julius-caesar',
    name: 'Julius Caesar',
    empire: 'roman-empire',
    title: 'Dictator of Rome',
    years: '100 BCE – 44 BCE',
    description: 'Roman general and statesman who played a critical role in the transformation of the Roman Republic into the Roman Empire.',
    significance: 'Conquered Gaul, crossed the Rubicon, reformed the calendar, and his assassination led to the end of the Roman Republic.',
    tags: ['military', 'politics', 'conquest', 'reform'],
  },
  {
    id: 'marcus-aurelius',
    name: 'Marcus Aurelius',
    empire: 'roman-empire',
    title: 'Roman Emperor and Philosopher',
    years: '121 CE – 180 CE',
    description: 'The last of the Five Good Emperors and a Stoic philosopher whose Meditations remains one of the greatest works of philosophy.',
    significance: 'Represented the ideal of the philosopher-king and his reign marked the end of the Pax Romana.',
    tags: ['emperor', 'philosopher', 'stoicism', 'military'],
  },

  // ============================================
  // BRITISH EMPIRE (2 figures)
  // ============================================
  {
    id: 'queen-victoria',
    name: 'Queen Victoria',
    empire: 'british-empire',
    title: 'Queen of the United Kingdom',
    years: '1819 – 1901',
    description: 'The longest-reigning British monarch of the 19th century, presiding over an era of industrial, cultural, political, and military expansion.',
    significance: 'The Victorian Era saw Britain become the world\'s most powerful nation, with an empire spanning a quarter of the globe.',
    tags: ['monarchy', 'empire', 'industrial-revolution', 'culture'],
  },
  {
    id: 'winston-churchill',
    name: 'Winston Churchill',
    empire: 'british-empire',
    title: 'Prime Minister',
    years: '1874 – 1965',
    description: 'British statesman who served as Prime Minister during World War II and led Britain through its darkest and finest hours.',
    significance: 'His leadership and oratory inspired British resistance against Nazi Germany and helped preserve Western democracy.',
    tags: ['politics', 'war-leader', 'oratory', 'writer'],
  },

  // ============================================
  // FRENCH EMPIRE (2 figures)
  // ============================================
  {
    id: 'napoleon-bonaparte',
    name: 'Napoleon Bonaparte',
    empire: 'french-empire',
    title: 'Emperor of the French',
    years: '1769 – 1821',
    description: 'Rose from obscurity to become Emperor of France and dominate European affairs for over a decade through his military campaigns.',
    significance: 'Spread the ideals of the French Revolution across Europe, reformed legal systems with the Napoleonic Code, and reshaped the map of Europe.',
    tags: ['military', 'emperor', 'reformer', 'conquest'],
  },
  {
    id: 'louis-xiv',
    name: 'Louis XIV',
    empire: 'french-empire',
    title: 'The Sun King',
    years: '1638 – 1715',
    description: 'The longest-reigning monarch in European history, who transformed France into the leading European power and built the Palace of Versailles.',
    significance: 'Centralized French power, established French cultural dominance in Europe, and created the model of absolute monarchy.',
    tags: ['monarchy', 'absolutism', 'culture', 'versailles'],
  },

  // ============================================
  // SPANISH EMPIRE (2 figures)
  // ============================================
  {
    id: 'hernan-cortes',
    name: 'Hernan Cortes',
    empire: 'spanish-empire',
    title: 'Conquistador',
    years: '1485 – 1547',
    description: 'Led the expedition that caused the fall of the Aztec Empire and brought large portions of Mexico under Spanish rule.',
    significance: 'His conquest of the Aztec Empire was a pivotal event in the Spanish colonization of the Americas.',
    tags: ['conquistador', 'conquest', 'colonization', 'military'],
  },
  {
    id: 'isabella-i',
    name: 'Isabella I',
    empire: 'spanish-empire',
    title: 'Queen of Castile',
    years: '1451 – 1504',
    description: 'Together with Ferdinand II, unified Spain, completed the Reconquista, and sponsored Christopher Columbus\'s voyages to the Americas.',
    significance: 'Her reign marked the beginning of Spain\'s golden age and the creation of the Spanish colonial empire.',
    tags: ['monarchy', 'unification', 'exploration', 'reconquista'],
  },

  // ============================================
  // QING CHINA (2 figures)
  // ============================================
  {
    id: 'kangxi-emperor',
    name: 'Kangxi Emperor',
    empire: 'qing-china',
    title: 'Emperor of China',
    years: '1654 – 1722',
    description: 'The longest-reigning emperor in Chinese history, who consolidated Qing rule and expanded the empire to its greatest extent.',
    significance: 'Oversaw a period of prosperity and stability, promoted arts and learning, and commissioned the Kangxi Dictionary.',
    tags: ['emperor', 'expansion', 'culture', 'administration'],
  },
  {
    id: 'empress-dowager-cixi',
    name: 'Empress Dowager Cixi',
    empire: 'qing-china',
    title: 'Regent of China',
    years: '1835 – 1908',
    description: 'The de facto ruler of China for 47 years during a period of immense challenges from Western powers and internal rebellions.',
    significance: 'Her conservative policies and resistance to reform contributed to the eventual fall of the Qing dynasty.',
    tags: ['regent', 'politics', 'conservatism', 'decline'],
  },

  // ============================================
  // REVOLUTIONARY AMERICA (2 figures)
  // ============================================
  {
    id: 'george-washington',
    name: 'George Washington',
    empire: 'united-states',
    title: 'First President of the United States',
    years: '1732 – 1799',
    description: 'Commander of the Continental Army during the Revolutionary War and the first President of the United States.',
    significance: 'Set precedents for the presidency, voluntarily relinquished power after two terms, and is known as the Father of His Country.',
    tags: ['founding-father', 'military', 'president', 'leadership'],
  },
  {
    id: 'benjamin-franklin',
    name: 'Benjamin Franklin',
    empire: 'united-states',
    title: 'Founding Father and Polymath',
    years: '1706 – 1790',
    description: 'A leading writer, scientist, inventor, statesman, diplomat, and one of the most influential Founding Fathers.',
    significance: 'Helped draft the Declaration of Independence and the Constitution, secured French alliance during the Revolution.',
    tags: ['founding-father', 'inventor', 'diplomat', 'scientist'],
  },
];

// Helper function to get figures by empire
export function getFiguresByEmpire(empireId: string): KeyFigure[] {
  return KEY_FIGURES.filter(f => f.empire === empireId);
}

// Helper function to get figure by ID
export function getFigureById(id: string): KeyFigure | undefined {
  return KEY_FIGURES.find(f => f.id === id);
}
