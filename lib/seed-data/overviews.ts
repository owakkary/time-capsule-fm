import { EmpireOverview } from '@/types';

export const EMPIRE_OVERVIEWS: EmpireOverview[] = [
  // ============================================
  // ANCIENT WORLD EMPIRES
  // ============================================
  {
    id: 'overview-ancient-egypt',
    empire: 'ancient-egypt',
    title: 'Ancient Egypt: Land of the Pharaohs',
    description: 'For over three thousand years, the civilization of ancient Egypt flourished along the fertile banks of the Nile River. From the unification of Upper and Lower Egypt under the first pharaohs to the death of Cleopatra, Egypt produced some of humanity\'s most enduring achievements: the pyramids of Giza, the elaborate burial practices that preserved kings for eternity, and a writing system that took millennia to decipher.',
    keyThemes: [
      'Divine kingship and the pharaoh as living god',
      'The Nile as the source of life and agricultural abundance',
      'Elaborate beliefs about death, afterlife, and preservation',
      'Monumental architecture built to last for eternity',
      'Hieroglyphic writing and the priestly class',
    ],
    timespan: '3100 BCE – 30 BCE',
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
    timespan: '550 BCE – 330 BCE',
  },
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
    timespan: '500 BCE – 323 BCE',
  },
  {
    id: 'overview-roman-empire',
    empire: 'roman-empire',
    title: 'The Roman Empire: Eternal City, Eternal Legacy',
    description: 'From a small city on the Tiber River, Rome grew to dominate the Mediterranean world and beyond, creating an empire that would last for centuries and whose influence continues today. Roman law, engineering, language, and governance became the foundation of Western civilization. The transition from Republic to Empire, the Pax Romana, and the eventual fall of Rome remain among history\'s most studied and debated subjects.',
    keyThemes: [
      'Roman law and its enduring influence on legal systems',
      'Engineering marvels: aqueducts, roads, and the Colosseum',
      'Military organization and the legions that conquered the known world',
      'The transformation from Republic to Empire',
      'Cultural assimilation and the spread of Latin civilization',
    ],
    timespan: '27 BCE – 476 CE',
  },

  // ============================================
  // REVOLUTIONARY PERIOD EMPIRES
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
    timespan: '1600 – 1947',
  },
  {
    id: 'overview-french-empire',
    empire: 'french-empire',
    title: 'The French Empire: Revolution, Glory, and Enlightenment',
    description: 'France\'s path from absolute monarchy under the Sun King to revolutionary republic to Napoleonic empire represents one of history\'s most dramatic transformations. The French Revolution\'s ideals of liberty, equality, and fraternity echoed around the world, while Napoleon\'s conquests redrew the map of Europe. French culture, philosophy, and political thought have shaped modern civilization in profound ways.',
    keyThemes: [
      'Absolute monarchy and the splendor of Versailles',
      'The Enlightenment and the power of ideas',
      'The French Revolution and the birth of modern politics',
      'Napoleon\'s military genius and the Napoleonic Code',
      'Cultural dominance and the spread of French civilization',
    ],
    timespan: '1600 – 1815',
  },
  {
    id: 'overview-spanish-empire',
    empire: 'spanish-empire',
    title: 'The Spanish Empire: Conquistadors and the New World',
    description: 'The Spanish Empire was the first truly global empire, spanning from the Philippines to the Americas, from Italy to the Netherlands. Fueled by the wealth of the New World—gold, silver, and new crops—Spain dominated European politics for over a century. The encounter between Spanish conquistadors and indigenous American civilizations was one of history\'s most consequential and tragic meetings of worlds.',
    keyThemes: [
      'The Age of Exploration and maritime discovery',
      'The conquest of the Aztec and Inca empires',
      'The flow of silver from the Americas and its global impact',
      'Catholic missions and the spread of Christianity',
      'The Black Legend and the debates over colonialism',
    ],
    timespan: '1492 – 1898',
  },
  {
    id: 'overview-qing-china',
    empire: 'qing-china',
    title: 'Qing Dynasty China: The Last Empire',
    description: 'The Qing dynasty, founded by Manchu conquerors from the north, ruled China for nearly three centuries and expanded Chinese territory to its greatest extent. As the world\'s most populous and one of its wealthiest nations, Qing China initially looked down on Western \"barbarians.\" But the 19th century brought humiliation: defeat in the Opium Wars, unequal treaties, and internal rebellions that would eventually bring down the last dynasty.',
    keyThemes: [
      'Manchu rule over the Han Chinese majority',
      'The tribute system and China\'s view of itself as the center of civilization',
      'The Opium Wars and the \"Century of Humiliation\"',
      'The Confucian examination system and imperial bureaucracy',
      'The Taiping Rebellion and internal challenges',
    ],
    timespan: '1644 – 1912',
  },
  {
    id: 'overview-united-states',
    empire: 'united-states',
    title: 'Revolutionary America: The Birth of a Nation',
    description: 'The American Revolution was more than a colonial rebellion—it was an experiment in Enlightenment ideals made real. Thirteen colonies, united by grievances against British rule and inspired by ideas of natural rights and self-governance, declared independence and forged a new kind of nation. The Constitution they created established a republic that has endured for over two centuries, inspiring democratic movements around the world.',
    keyThemes: [
      'Colonial grievances and the road to revolution',
      'Enlightenment ideals of liberty and natural rights',
      'The Declaration of Independence and its global influence',
      'The Revolutionary War and the alliance with France',
      'The Constitution and the founding of American democracy',
    ],
    timespan: '1765 – 1800',
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
