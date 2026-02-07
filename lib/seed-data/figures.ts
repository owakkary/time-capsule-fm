import { KeyFigure } from '@/types';

export const KEY_FIGURES: KeyFigure[] = [
  // ============================================
  // BRONZE AGE MEDITERRANEAN (3000 – 1200 BCE)
  // ============================================

  // ANCIENT EGYPT (2 figures)
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
    id: 'khufu',
    name: 'Khufu',
    empire: 'ancient-egypt',
    title: 'Builder of the Great Pyramid',
    years: 'c. 2589 BCE – 2566 BCE',
    description: 'Fourth Dynasty pharaoh who commissioned the Great Pyramid of Giza, the only surviving wonder of the ancient world.',
    significance: 'His pyramid remained the tallest man-made structure for over 3,800 years and represents the pinnacle of Egyptian engineering.',
    tags: ['pharaoh', 'pyramid', 'architecture', 'old-kingdom'],
  },

  // MESOPOTAMIA (2 figures)
  {
    id: 'hammurabi',
    name: 'Hammurabi',
    empire: 'mesopotamia',
    title: 'King of Babylon',
    years: 'c. 1810 BCE – 1750 BCE',
    description: 'Sixth king of the First Babylonian dynasty who transformed Babylon from a small city-state into a major power.',
    significance: 'Created the Code of Hammurabi, one of the oldest deciphered writings of significant length, establishing the concept of codified law.',
    tags: ['king', 'law', 'babylon', 'administration'],
  },
  {
    id: 'sargon-akkad',
    name: 'Sargon of Akkad',
    empire: 'mesopotamia',
    title: 'Founder of the Akkadian Empire',
    years: 'c. 2334 BCE – 2279 BCE',
    description: 'Rose from humble origins to create the world\'s first empire, uniting Sumer and Akkad under a single ruler.',
    significance: 'Established the model for future empires and his legend inspired rulers for millennia after his death.',
    tags: ['emperor', 'conquest', 'akkad', 'founder'],
  },

  // MINOAN CRETE (2 figures)
  {
    id: 'minos',
    name: 'King Minos',
    empire: 'minoan-crete',
    title: 'Legendary King of Crete',
    years: 'c. 1500 BCE (legendary)',
    description: 'Legendary king of Crete whose name gave the Minoan civilization its modern designation, associated with the labyrinth and Minotaur myths.',
    significance: 'His legend reflects Minoan naval supremacy and the sophisticated palace culture that flourished on Crete.',
    tags: ['king', 'legend', 'labyrinth', 'naval-power'],
  },
  {
    id: 'minoan-priestess',
    name: 'The Snake Goddess Priestess',
    empire: 'minoan-crete',
    title: 'High Priestess of Knossos',
    years: 'c. 1600 BCE',
    description: 'Represented by the famous Snake Goddess figurines, the high priestesses of Minoan Crete wielded significant religious and possibly political power.',
    significance: 'Exemplifies the prominent role of women in Minoan religious life and the sophisticated ritual practices of the palace culture.',
    tags: ['priestess', 'religion', 'women', 'ritual'],
  },

  // MYCENAEAN GREECE (2 figures)
  {
    id: 'agamemnon',
    name: 'Agamemnon',
    empire: 'mycenaean-greece',
    title: 'King of Mycenae',
    years: 'c. 1250 BCE (legendary)',
    description: 'Legendary king who led the Greeks in the Trojan War, commanding the greatest expedition of the Bronze Age.',
    significance: 'His story preserves memories of Mycenaean palace culture and the interconnected Bronze Age Mediterranean world.',
    tags: ['king', 'war', 'troy', 'legend'],
  },
  {
    id: 'nestor',
    name: 'Nestor of Pylos',
    empire: 'mycenaean-greece',
    title: 'King of Pylos',
    years: 'c. 1250 BCE (legendary)',
    description: 'Wise elder king who participated in the Trojan War and was renowned for his counsel and eloquence.',
    significance: 'Archaeological discoveries at Pylos confirmed the historical basis of Homer\'s descriptions of Mycenaean palatial society.',
    tags: ['king', 'wisdom', 'pylos', 'council'],
  },

  // HITTITE EMPIRE (2 figures)
  {
    id: 'suppiluliuma-i',
    name: 'Suppiluliuma I',
    empire: 'hittite-empire',
    title: 'Great King of the Hittites',
    years: 'c. 1344 BCE – 1322 BCE',
    description: 'The most powerful Hittite king who expanded the empire to its greatest extent, conquering Syria and challenging Egypt.',
    significance: 'Transformed the Hittites into a major power and his diplomatic correspondence reveals the interconnected world of Late Bronze Age diplomacy.',
    tags: ['king', 'conquest', 'diplomacy', 'expansion'],
  },
  {
    id: 'hattusili-iii',
    name: 'Hattusili III',
    empire: 'hittite-empire',
    title: 'Great King and Treaty Maker',
    years: 'c. 1267 BCE – 1237 BCE',
    description: 'Hittite king who negotiated the famous peace treaty with Ramesses II after the Battle of Kadesh.',
    significance: 'Co-authored history\'s first known peace treaty, a copy of which hangs in the United Nations as a symbol of diplomacy.',
    tags: ['king', 'diplomacy', 'treaty', 'peace'],
  },

  // ============================================
  // CLASSICAL ANTIQUITY (800 – 323 BCE)
  // ============================================

  // CLASSICAL GREECE (2 figures)
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
  {
    id: 'socrates',
    name: 'Socrates',
    empire: 'classical-greece',
    title: 'Father of Western Philosophy',
    years: '470 BCE – 399 BCE',
    description: 'Athenian philosopher who developed the Socratic method of inquiry and questioned everything, including the foundations of Athenian society.',
    significance: 'His teachings, preserved through Plato, laid the groundwork for Western philosophy and the tradition of critical thinking.',
    tags: ['philosophy', 'education', 'ethics', 'questioning'],
  },

  // PERSIAN EMPIRE (2 figures)
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

  // PHOENICIA (2 figures)
  {
    id: 'hiram-i',
    name: 'Hiram I of Tyre',
    empire: 'phoenicia',
    title: 'King of Tyre',
    years: 'c. 980 BCE – 947 BCE',
    description: 'Powerful king of Tyre who expanded Phoenician trade networks and allied with King Solomon to build the First Temple in Jerusalem.',
    significance: 'His reign marked the height of Phoenician commercial power and cultural influence across the Mediterranean.',
    tags: ['king', 'trade', 'alliance', 'temple'],
  },
  {
    id: 'jezebel',
    name: 'Jezebel',
    empire: 'phoenicia',
    title: 'Princess of Sidon, Queen of Israel',
    years: 'c. 900 BCE – 842 BCE',
    description: 'Phoenician princess who became queen of Israel through marriage to King Ahab, promoting the worship of Baal and Phoenician culture.',
    significance: 'Her story illustrates the cultural and religious tensions of the ancient Near East and the influence of Phoenician civilization.',
    tags: ['queen', 'religion', 'politics', 'culture'],
  },

  // CARTHAGE (2 figures)
  {
    id: 'hannibal-barca',
    name: 'Hannibal Barca',
    empire: 'carthage',
    title: 'General of Carthage',
    years: '247 BCE – 183 BCE',
    description: 'Carthaginian general who led his army, including war elephants, across the Alps to invade Italy during the Second Punic War.',
    significance: 'Considered one of the greatest military commanders in history, his tactics are still studied in military academies today.',
    tags: ['general', 'military', 'strategy', 'elephants'],
  },
  {
    id: 'dido',
    name: 'Dido (Elissa)',
    empire: 'carthage',
    title: 'Founder and Queen of Carthage',
    years: 'c. 814 BCE (legendary)',
    description: 'Legendary Phoenician princess who founded Carthage after fleeing Tyre, becoming the city\'s first queen.',
    significance: 'Her legend, immortalized by Virgil, represents the founding myth of one of antiquity\'s greatest commercial powers.',
    tags: ['founder', 'queen', 'legend', 'exile'],
  },

  // ROMAN REPUBLIC (2 figures)
  {
    id: 'scipio-africanus',
    name: 'Scipio Africanus',
    empire: 'roman-republic',
    title: 'Conqueror of Hannibal',
    years: '236 BCE – 183 BCE',
    description: 'Roman general who defeated Hannibal at the Battle of Zama, ending the Second Punic War and establishing Roman dominance.',
    significance: 'His victory over Carthage transformed Rome from an Italian power into a Mediterranean empire.',
    tags: ['general', 'military', 'victory', 'hero'],
  },
  {
    id: 'cincinnatus',
    name: 'Cincinnatus',
    empire: 'roman-republic',
    title: 'Dictator of Rome',
    years: 'c. 519 BCE – 430 BCE',
    description: 'Roman aristocrat who was called from his farm to serve as dictator, saved Rome from invasion, then immediately returned to farming.',
    significance: 'Became the model of Roman virtue and civic duty, inspiring leaders from Washington to modern times.',
    tags: ['dictator', 'virtue', 'farmer', 'duty'],
  },

  // ============================================
  // HELLENISTIC & ROMAN WORLD (323 BCE – 476 CE)
  // ============================================

  // MACEDONIAN EMPIRE (2 figures)
  {
    id: 'alexander-the-great',
    name: 'Alexander the Great',
    empire: 'macedonian-empire',
    title: 'King of Macedon',
    years: '356 BCE – 323 BCE',
    description: 'Created one of the largest empires in ancient history, stretching from Greece to northwestern India, spreading Greek culture throughout the known world.',
    significance: 'Never lost a battle and spread Hellenistic culture across three continents, fundamentally changing the ancient world.',
    tags: ['conqueror', 'military-genius', 'hellenism', 'empire-builder'],
  },
  {
    id: 'ptolemy-i',
    name: 'Ptolemy I Soter',
    empire: 'macedonian-empire',
    title: 'Founder of the Ptolemaic Dynasty',
    years: '367 BCE – 282 BCE',
    description: 'One of Alexander\'s most trusted generals who became ruler of Egypt and founded the Ptolemaic dynasty and the Library of Alexandria.',
    significance: 'Established Alexandria as the intellectual center of the ancient world and preserved Greek learning for centuries.',
    tags: ['general', 'founder', 'library', 'egypt'],
  },

  // ROMAN EMPIRE (2 figures)
  {
    id: 'augustus',
    name: 'Augustus Caesar',
    empire: 'roman-empire',
    title: 'First Roman Emperor',
    years: '63 BCE – 14 CE',
    description: 'The first Roman emperor who transformed the Republic into the Empire and initiated the Pax Romana, an era of peace and prosperity.',
    significance: 'His reign marked the beginning of the Roman Empire and established the political system that would endure for centuries.',
    tags: ['emperor', 'founder', 'peace', 'administration'],
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

  // PARTHIAN EMPIRE (2 figures)
  {
    id: 'mithridates-i',
    name: 'Mithridates I',
    empire: 'parthian-empire',
    title: 'Great King of Parthia',
    years: 'c. 195 BCE – 138 BCE',
    description: 'Transformed Parthia from a minor kingdom into a major empire, conquering Media, Mesopotamia, and Elam.',
    significance: 'Established Parthia as a great power that would rival Rome for nearly three centuries.',
    tags: ['king', 'conqueror', 'founder', 'expansion'],
  },
  {
    id: 'surena',
    name: 'Surena',
    empire: 'parthian-empire',
    title: 'Spahbed (General) of Parthia',
    years: 'c. 84 BCE – 52 BCE',
    description: 'Parthian general who defeated the Roman army of Crassus at the Battle of Carrhae, one of Rome\'s worst defeats.',
    significance: 'His victory demonstrated the effectiveness of Parthian mounted archery and halted Roman expansion eastward.',
    tags: ['general', 'military', 'victory', 'archery'],
  },

  // PTOLEMAIC EGYPT (2 figures)
  {
    id: 'cleopatra-vii',
    name: 'Cleopatra VII',
    empire: 'ptolemaic-egypt',
    title: 'Last Pharaoh of Egypt',
    years: '69 BCE – 30 BCE',
    description: 'The last active ruler of the Ptolemaic Kingdom of Egypt, known for her intelligence, political acumen, and relationships with Julius Caesar and Mark Antony.',
    significance: 'Her death marked the end of ancient Egypt as an independent nation and the beginning of Roman rule.',
    tags: ['pharaoh', 'politics', 'diplomacy', 'roman-relations'],
  },
  {
    id: 'ptolemy-ii',
    name: 'Ptolemy II Philadelphus',
    empire: 'ptolemaic-egypt',
    title: 'King of Egypt',
    years: '308 BCE – 246 BCE',
    description: 'Second ruler of Ptolemaic Egypt who expanded the Library of Alexandria and commissioned the Septuagint translation of the Hebrew Bible.',
    significance: 'Made Alexandria the cultural and intellectual capital of the Mediterranean world during his reign.',
    tags: ['king', 'patron', 'library', 'scholarship'],
  },

  // HAN CHINA (2 figures)
  {
    id: 'emperor-wu',
    name: 'Emperor Wu of Han',
    empire: 'han-china',
    title: 'Emperor of China',
    years: '156 BCE – 87 BCE',
    description: 'One of the greatest Chinese emperors who expanded the Han dynasty to its greatest extent and opened the Silk Road.',
    significance: 'His reign established Confucianism as state ideology and connected China to Central Asia and beyond.',
    tags: ['emperor', 'expansion', 'silk-road', 'confucianism'],
  },
  {
    id: 'ban-zhao',
    name: 'Ban Zhao',
    empire: 'han-china',
    title: 'Court Historian and Scholar',
    years: '45 CE – 116 CE',
    description: 'China\'s first known female historian who completed the Book of Han and served as court librarian and teacher.',
    significance: 'Her scholarship and writings on women\'s conduct influenced Chinese society for nearly two thousand years.',
    tags: ['historian', 'scholar', 'women', 'literature'],
  },

  // ============================================
  // REVOLUTIONARY AGE (1700 – 1900 CE)
  // ============================================

  // BRITISH EMPIRE (2 figures)
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

  // FRENCH EMPIRE (2 figures)
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
    id: 'robespierre',
    name: 'Maximilien Robespierre',
    empire: 'french-empire',
    title: 'Leader of the Committee of Public Safety',
    years: '1758 – 1794',
    description: 'Principal figure of the French Revolution who led the radical Jacobins and the Reign of Terror.',
    significance: 'Embodied both the idealistic hopes and terrifying extremes of revolutionary politics, shaping modern political discourse.',
    tags: ['revolutionary', 'terror', 'republic', 'ideology'],
  },

  // UNITED STATES (2 figures)
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
    id: 'abraham-lincoln',
    name: 'Abraham Lincoln',
    empire: 'united-states',
    title: '16th President of the United States',
    years: '1809 – 1865',
    description: 'Led the nation through the Civil War, preserved the Union, and ended slavery with the Emancipation Proclamation.',
    significance: 'Transformed the meaning of American freedom and gave his life to preserve the nation he reunited.',
    tags: ['president', 'emancipation', 'civil-war', 'leadership'],
  },

  // QING CHINA (2 figures)
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

  // RUSSIAN EMPIRE (2 figures)
  {
    id: 'peter-the-great',
    name: 'Peter the Great',
    empire: 'russian-empire',
    title: 'Tsar of Russia',
    years: '1672 – 1725',
    description: 'Transformed Russia from a medieval backwater into a major European power through radical reforms and westernization.',
    significance: 'Founded St. Petersburg, modernized the military, and established Russia as a major player in European affairs.',
    tags: ['tsar', 'reformer', 'westernization', 'founder'],
  },
  {
    id: 'catherine-the-great',
    name: 'Catherine the Great',
    empire: 'russian-empire',
    title: 'Empress of Russia',
    years: '1729 – 1796',
    description: 'Prussian-born empress who expanded Russian territory and promoted Enlightenment ideals while maintaining autocratic rule.',
    significance: 'Her reign marked the golden age of the Russian Empire and established Russia as a leading European cultural power.',
    tags: ['empress', 'expansion', 'enlightenment', 'culture'],
  },

  // MEIJI JAPAN (2 figures)
  {
    id: 'emperor-meiji',
    name: 'Emperor Meiji',
    empire: 'meiji-japan',
    title: 'Emperor of Japan',
    years: '1852 – 1912',
    description: 'The emperor who presided over Japan\'s transformation from feudal isolation to modern industrial power.',
    significance: 'The Meiji Restoration under his reign modernized Japan in a single generation, making it the first Asian industrial power.',
    tags: ['emperor', 'modernization', 'restoration', 'reform'],
  },
  {
    id: 'ito-hirobumi',
    name: 'Ito Hirobumi',
    empire: 'meiji-japan',
    title: 'First Prime Minister of Japan',
    years: '1841 – 1909',
    description: 'Architect of Japan\'s Meiji Constitution and four-time Prime Minister who shaped modern Japanese government.',
    significance: 'Created Japan\'s constitutional framework and led the nation\'s transformation into a modern state.',
    tags: ['statesman', 'constitution', 'reform', 'politics'],
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
