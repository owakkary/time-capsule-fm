import { EmpireOverview } from '@/types';

export const EMPIRE_OVERVIEWS: EmpireOverview[] = [
  // ============================================
  // BRONZE AGE MEDITERRANEAN (3000 – 1200 BCE)
  // ============================================
  {
    id: 'overview-ancient-egypt',
    empire: 'ancient-egypt',
    title: 'Ancient Egypt: Land of the Pharaohs',
    description: 'For over three thousand years, the civilization of ancient Egypt flourished along the fertile banks of the Nile River. From the unification of Upper and Lower Egypt under the first pharaohs to the construction of the great pyramids, Egypt produced some of humanity\'s most enduring achievements. The Old and New Kingdoms represented the height of Egyptian power, when pharaohs built monuments meant to last for eternity.',
    keyThemes: [
      'Divine kingship and the pharaoh as living god',
      'The Nile as the source of life and agricultural abundance',
      'Elaborate beliefs about death, afterlife, and preservation',
      'Monumental architecture built to last for eternity',
      'Hieroglyphic writing and the priestly class',
    ],
    timespan: '3000 – 1070 BCE',
  },
  {
    id: 'overview-mesopotamia',
    empire: 'mesopotamia',
    title: 'Mesopotamia: Cradle of Civilization',
    description: 'Between the Tigris and Euphrates rivers, in the land the Greeks called Mesopotamia, human civilization took its first steps. Here, Sumerians invented writing, Babylonians codified law, and Assyrians built the ancient world\'s most fearsome military machine. City-states rose and fell, empires came and went, but the achievements of Mesopotamia—from cuneiform to the concept of the wheel—shaped all subsequent human history.',
    keyThemes: [
      'Invention of writing and record-keeping',
      'The Code of Hammurabi and early legal systems',
      'City-states, ziggurats, and temple economies',
      'Astronomical observation and mathematical advances',
      'Successive empires: Sumer, Akkad, Babylon, Assyria',
    ],
    timespan: '2900 – 1200 BCE',
  },
  {
    id: 'overview-minoan-crete',
    empire: 'minoan-crete',
    title: 'Minoan Crete: Europe\'s First Civilization',
    description: 'On the island of Crete, Europe\'s first advanced civilization emerged from the Bronze Age mists. The Minoans built elaborate palace complexes, developed sophisticated art and writing systems, and dominated Mediterranean trade for centuries. Their civilization, named for the legendary King Minos, was so advanced that later Greeks remembered it in myths of the Labyrinth and the Minotaur.',
    keyThemes: [
      'Palace civilization centered on Knossos',
      'Maritime trade and naval power',
      'Sophisticated art and fresco painting',
      'Bull worship and religious ritual',
      'Linear A script and palatial administration',
    ],
    timespan: '2700 – 1450 BCE',
  },
  {
    id: 'overview-mycenaean-greece',
    empire: 'mycenaean-greece',
    title: 'Mycenaean Greece: The Heroic Age',
    description: 'The Mycenaean civilization represents the first advanced Greek culture and the world Homer immortalized in his epic poems. From their fortress-palaces at Mycenae, Tiryns, and Pylos, warrior kings led expeditions that may have included the legendary siege of Troy. Their civilization collapsed mysteriously around 1200 BCE, plunging Greece into a dark age from which would eventually emerge Classical civilization.',
    keyThemes: [
      'Warrior aristocracy and palace kingdoms',
      'The Trojan War and heroic tradition',
      'Linear B script and palace economy',
      'Cyclopean architecture and fortified citadels',
      'Bronze Age collapse and the end of an era',
    ],
    timespan: '1600 – 1100 BCE',
  },
  {
    id: 'overview-hittite-empire',
    empire: 'hittite-empire',
    title: 'The Hittite Empire: Masters of Iron',
    description: 'From their mountain capital at Hattusa in central Anatolia, the Hittites built an empire that rivaled Egypt and pioneered technologies that would transform the ancient world. They were among the first to work iron, developed sophisticated treaty diplomacy, and fought Ramesses II to a standstill at the Battle of Kadesh. Their civilization, lost for millennia, was rediscovered only in the modern era.',
    keyThemes: [
      'Iron technology and metallurgical innovation',
      'Treaty diplomacy and international law',
      'Chariot warfare and military tactics',
      'Religious syncretism and the "thousand gods"',
      'The Bronze Age Collapse and disappearance',
    ],
    timespan: '1600 – 1178 BCE',
  },

  // ============================================
  // CLASSICAL ANTIQUITY (800 – 323 BCE)
  // ============================================
  {
    id: 'overview-classical-greece',
    empire: 'classical-greece',
    title: 'Classical Greece: The Birthplace of Western Civilization',
    description: 'In the rocky peninsula and scattered islands of Greece, a collection of independent city-states produced ideas that would shape the entire Western world. Democracy was born in Athens, philosophy emerged from questioning minds like Socrates and Plato, and the Olympic Games united Greeks in peaceful competition. Though they fought each other as often as foreign enemies, the Greeks created a cultural legacy that endures to this day.',
    keyThemes: [
      'The invention of democracy and citizen participation',
      'Philosophy and the pursuit of wisdom through reason',
      'The rivalry between Athens and Sparta',
      'Athletic competition and the Olympic ideal',
      'Drama, art, and the celebration of human achievement',
    ],
    timespan: '800 – 323 BCE',
  },
  {
    id: 'overview-persian-empire',
    empire: 'persian-empire',
    title: 'The Persian Empire: The First World Empire',
    description: 'Rising from the highlands of modern-day Iran, the Achaemenid Persian Empire became the largest the world had yet seen, stretching from Egypt to India. Under enlightened rulers like Cyrus the Great and Darius I, the Persians pioneered new approaches to imperial administration, religious tolerance, and infrastructure that would influence empires for millennia to come.',
    keyThemes: [
      'Religious and cultural tolerance as tools of empire',
      'The Royal Road and imperial communication networks',
      'The satrapy system of provincial governance',
      'Zoroastrianism and the cosmic struggle of good versus evil',
      'The clash with Greece that defined the classical world',
    ],
    timespan: '550 – 330 BCE',
  },
  {
    id: 'overview-phoenicia',
    empire: 'phoenicia',
    title: 'Phoenicia: Masters of the Sea',
    description: 'From their city-states along the Lebanese coast, the Phoenicians became the ancient world\'s greatest sailors and traders. They gave humanity one of its most important inventions—the alphabet—and established trading posts and colonies throughout the Mediterranean. Though never a unified empire, Phoenician influence spread far beyond their small homeland through commerce, culture, and the ships that carried both.',
    keyThemes: [
      'Invention of the alphabet and its spread',
      'Mediterranean trade networks and colonization',
      'Tyrian purple dye and luxury goods',
      'Naval technology and seamanship',
      'The founding of Carthage and western expansion',
    ],
    timespan: '1500 – 300 BCE',
  },
  {
    id: 'overview-carthage',
    empire: 'carthage',
    title: 'Carthage: Rome\'s Greatest Rival',
    description: 'Founded by Phoenician colonists from Tyre, Carthage grew to dominate the western Mediterranean through naval power and commercial acumen. For over a century, Carthage and Rome fought for supremacy in three devastating Punic Wars. Hannibal\'s legendary crossing of the Alps nearly destroyed Rome, but ultimately Carthage was razed to the ground, its civilization erased by its victorious enemy.',
    keyThemes: [
      'Naval supremacy and control of trade routes',
      'The Punic Wars against Rome',
      'Hannibal\'s military genius',
      'Mercantile economy and commercial empire',
      'The destruction and legacy of Carthage',
    ],
    timespan: '814 – 146 BCE',
  },
  {
    id: 'overview-roman-republic',
    empire: 'roman-republic',
    title: 'The Roman Republic: Rise of an Empire',
    description: 'After expelling their kings, the Romans created a republic that would grow from a small Italian city-state to master of the Mediterranean world. Through citizen armies, political flexibility, and relentless determination, Rome conquered Italy, destroyed Carthage, and absorbed the Greek east. The Republic\'s internal tensions would eventually tear it apart, but its achievements laid the foundation for the Roman Empire.',
    keyThemes: [
      'Republican government and citizen participation',
      'The citizen army and military expansion',
      'The Struggle of the Orders and political evolution',
      'Conquest of Italy and the Mediterranean',
      'The transition from Republic to Empire',
    ],
    timespan: '509 – 27 BCE',
  },

  // ============================================
  // HELLENISTIC & ROMAN WORLD (323 BCE – 476 CE)
  // ============================================
  {
    id: 'overview-macedonian-empire',
    empire: 'macedonian-empire',
    title: 'The Macedonian Empire: Alexander\'s Legacy',
    description: 'In just thirteen years, Alexander of Macedon conquered the Persian Empire and spread Greek culture from Egypt to India. His death at 32 left no clear successor, and his generals divided his empire into competing kingdoms. The Hellenistic age that followed blended Greek and Eastern cultures, creating a cosmopolitan world centered on great cities like Alexandria, Antioch, and Pergamon.',
    keyThemes: [
      'Alexander\'s conquests and military genius',
      'The spread of Hellenistic culture',
      'The Library of Alexandria and scholarship',
      'The successor kingdoms and their rivalries',
      'Cultural fusion between Greek and Eastern traditions',
    ],
    timespan: '323 – 30 BCE',
  },
  {
    id: 'overview-roman-empire',
    empire: 'roman-empire',
    title: 'The Roman Empire: Eternal City, Eternal Legacy',
    description: 'From a small city on the Tiber River, Rome grew to dominate the Mediterranean world and beyond, creating an empire that would last for centuries and whose influence continues today. Roman law, engineering, language, and governance became the foundation of Western civilization. The Pax Romana brought unprecedented peace and prosperity, while the eventual fall of Rome marked the end of the ancient world.',
    keyThemes: [
      'Roman law and its enduring influence on legal systems',
      'Engineering marvels: aqueducts, roads, and the Colosseum',
      'The Pax Romana and imperial administration',
      'Cultural assimilation and the spread of Latin civilization',
      'The fall of Rome and transition to medieval Europe',
    ],
    timespan: '27 BCE – 476 CE',
  },
  {
    id: 'overview-parthian-empire',
    empire: 'parthian-empire',
    title: 'The Parthian Empire: Rome\'s Eastern Rival',
    description: 'For nearly five centuries, the Parthian Empire stood as Rome\'s great rival in the East. Rising from the ashes of the Seleucid kingdom, the Parthians mastered mounted archery and controlled the lucrative Silk Road trade. Their defeat of Crassus at Carrhae was one of Rome\'s worst military disasters, and Parthia remained unconquered until its replacement by the Sassanid dynasty.',
    keyThemes: [
      'Mounted archery and military innovation',
      'Control of the Silk Road trade',
      'The rivalry with Rome',
      'Iranian cultural revival',
      'Feudal aristocracy and decentralized power',
    ],
    timespan: '247 BCE – 224 CE',
  },
  {
    id: 'overview-ptolemaic-egypt',
    empire: 'ptolemaic-egypt',
    title: 'Ptolemaic Egypt: Greek Pharaohs of the Nile',
    description: 'After Alexander\'s death, his general Ptolemy claimed Egypt and founded a dynasty that would rule for nearly three centuries. The Ptolemies presented themselves as pharaohs to their Egyptian subjects while creating Alexandria as a center of Greek learning. The dynasty ended with Cleopatra VII, whose death marked the end of both Ptolemaic rule and ancient Egypt\'s independence.',
    keyThemes: [
      'The Library and Museum of Alexandria',
      'Greek-Egyptian cultural synthesis',
      'The Ptolemaic court and royal intrigue',
      'Agricultural wealth and economic power',
      'Cleopatra and the end of the dynasty',
    ],
    timespan: '305 – 30 BCE',
  },
  {
    id: 'overview-han-china',
    empire: 'han-china',
    title: 'Han Dynasty China: The Golden Age',
    description: 'The Han dynasty is often considered the golden age of Chinese civilization, comparable in duration and achievement to the Roman Empire in the West. Han rulers established Confucianism as state ideology, opened the Silk Road connecting China to the West, and oversaw advances in technology including the invention of paper. The Han legacy was so profound that ethnic Chinese still call themselves "Han people."',
    keyThemes: [
      'The Silk Road and East-West trade',
      'Confucian ideology and bureaucratic government',
      'Technological innovation including paper',
      'Expansion and consolidation of Chinese territory',
      'Art, literature, and historical writing',
    ],
    timespan: '206 BCE – 220 CE',
  },

  // ============================================
  // REVOLUTIONARY AGE (1700 – 1900 CE)
  // ============================================
  {
    id: 'overview-british-empire',
    empire: 'british-empire',
    title: 'The British Empire: On Which the Sun Never Set',
    description: 'At its height, the British Empire was the largest in human history, spanning every continent and controlling a quarter of the world\'s population. From a small island nation, Britain leveraged naval supremacy, industrial innovation, and commercial enterprise to build a global network of colonies, trading posts, and dominions. The empire\'s legacy—both its achievements and its injustices—continues to shape the modern world.',
    keyThemes: [
      'Naval supremacy and the rule of the waves',
      'The Industrial Revolution and its global impact',
      'Colonialism and its complex legacy',
      'Parliamentary democracy and constitutional monarchy',
      'Global trade networks and the spread of English language and culture',
    ],
    timespan: '1707 – 1947 CE',
  },
  {
    id: 'overview-french-empire',
    empire: 'french-empire',
    title: 'The French Empire: Revolution and Glory',
    description: 'The French Revolution transformed not just France but the entire Western world, overthrowing monarchy in the name of liberty, equality, and fraternity. From this upheaval emerged Napoleon Bonaparte, who built an empire that dominated Europe and spread revolutionary ideals through conquest. Though Napoleon\'s empire fell, his Napoleonic Code and the principles of the Revolution reshaped law and politics across the globe.',
    keyThemes: [
      'The French Revolution and its ideals',
      'Napoleon\'s military campaigns',
      'The Napoleonic Code and legal reform',
      'The Continental System and European dominance',
      'The legacy of revolutionary politics',
    ],
    timespan: '1804 – 1815 CE',
  },
  {
    id: 'overview-united-states',
    empire: 'united-states',
    title: 'The United States: Democracy\'s Experiment',
    description: 'Born from a revolutionary rejection of monarchy and colonial rule, the United States represented a bold experiment in self-government. The Constitution created a republic that would expand across a continent, survive a devastating civil war, and emerge as a global power. The tension between American ideals and American realities—liberty and slavery, democracy and inequality—has defined its ongoing story.',
    keyThemes: [
      'The American Revolution and independence',
      'The Constitution and federal government',
      'Westward expansion and Manifest Destiny',
      'The Civil War and emancipation',
      'The emergence of American power',
    ],
    timespan: '1776 – present',
  },
  {
    id: 'overview-qing-china',
    empire: 'qing-china',
    title: 'Qing Dynasty China: The Last Empire',
    description: 'The Qing dynasty, founded by Manchu conquerors from the north, ruled China for nearly three centuries and expanded Chinese territory to its greatest extent. As the world\'s most populous and one of its wealthiest nations, Qing China initially looked down on Western "barbarians." But the 19th century brought humiliation: defeat in the Opium Wars, unequal treaties, and internal rebellions that would eventually bring down the last dynasty.',
    keyThemes: [
      'Manchu rule over the Han Chinese majority',
      'The tribute system and China\'s world view',
      'The Opium Wars and the "Century of Humiliation"',
      'The Confucian examination system',
      'Internal rebellions and dynastic decline',
    ],
    timespan: '1644 – 1912 CE',
  },
  {
    id: 'overview-russian-empire',
    empire: 'russian-empire',
    title: 'The Russian Empire: From Peter to Revolution',
    description: 'From Peter the Great\'s drive to modernize Russia to the revolutions that destroyed it, the Russian Empire spanned two centuries of dramatic transformation and expansion. The Romanov tsars ruled over a vast, diverse empire stretching from Poland to the Pacific, presiding over serfdom, industrialization, and the intellectual ferment that would eventually produce revolution.',
    keyThemes: [
      'Peter the Great and Westernization',
      'Expansion across Siberia and Central Asia',
      'Serfdom and its abolition',
      'The intelligentsia and revolutionary movements',
      'The Great Game and European power politics',
    ],
    timespan: '1721 – 1917 CE',
  },
  {
    id: 'overview-meiji-japan',
    empire: 'meiji-japan',
    title: 'Meiji Japan: From Isolation to World Power',
    description: 'In 1868, Japan emerged from over two centuries of self-imposed isolation to begin one of history\'s most remarkable transformations. In a single generation, the Meiji government dismantled feudalism, built modern industries, and created a powerful military. By defeating China and Russia in successive wars, Japan announced itself as the first Asian power capable of challenging the West on its own terms.',
    keyThemes: [
      'The Meiji Restoration and end of the shogunate',
      'Rapid industrialization and modernization',
      'The adoption of Western institutions',
      'Military victories over China and Russia',
      'The tension between tradition and modernity',
    ],
    timespan: '1868 – 1912 CE',
  },
];

// Helper function to get overview by empire
export function getOverviewByEmpire(empireId: string): EmpireOverview | undefined {
  return EMPIRE_OVERVIEWS.find(o => o.empire === empireId);
}

// Helper function to get all overviews
export function getAllOverviews(): EmpireOverview[] {
  return EMPIRE_OVERVIEWS;
}
