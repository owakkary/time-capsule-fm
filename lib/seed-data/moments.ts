import { KeyMoment } from '@/types';

export const KEY_MOMENTS: KeyMoment[] = [
  // ============================================
  // BRONZE AGE MEDITERRANEAN (3000 – 1200 BCE)
  // ============================================

  // ANCIENT EGYPT (3 moments)
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
    id: 'battle-of-kadesh',
    name: 'Battle of Kadesh',
    empire: 'ancient-egypt',
    year: '1274 BCE',
    description: 'The largest chariot battle ever fought, between the Egyptian Empire under Ramesses II and the Hittite Empire.',
    significance: 'Led to the first known peace treaty in history between Egypt and the Hittites.',
    tags: ['battle', 'military', 'diplomacy', 'ramesses'],
  },
  {
    id: 'unification-egypt',
    name: 'Unification of Upper and Lower Egypt',
    empire: 'ancient-egypt',
    year: 'c. 3100 BCE',
    description: 'King Narmer unified the two lands of Egypt, establishing the first dynasty and creating one of history\'s longest-lasting civilizations.',
    significance: 'Began over three thousand years of pharaonic civilization and established the concept of divine kingship.',
    tags: ['unification', 'founding', 'pharaoh', 'dynasty'],
  },

  // MESOPOTAMIA (3 moments)
  {
    id: 'code-of-hammurabi',
    name: 'Creation of the Code of Hammurabi',
    empire: 'mesopotamia',
    year: 'c. 1754 BCE',
    description: 'King Hammurabi of Babylon created one of the oldest deciphered writings of significant length, a comprehensive code of laws.',
    significance: 'Established the principle of codified law and the concept of "an eye for an eye" that influenced legal systems for millennia.',
    tags: ['law', 'code', 'justice', 'babylon'],
  },
  {
    id: 'invention-of-writing',
    name: 'Invention of Cuneiform Writing',
    empire: 'mesopotamia',
    year: 'c. 3400 BCE',
    description: 'Sumerian scribes developed cuneiform, the world\'s first writing system, using wedge-shaped marks on clay tablets.',
    significance: 'Enabled record-keeping, literature, and the transmission of knowledge across generations, beginning recorded history.',
    tags: ['writing', 'invention', 'sumer', 'literacy'],
  },
  {
    id: 'fall-of-ur',
    name: 'Fall of Ur to the Elamites',
    empire: 'mesopotamia',
    year: '2004 BCE',
    description: 'The great Sumerian city of Ur fell to Elamite invaders, ending the Third Dynasty of Ur and Sumerian political dominance.',
    significance: 'Marked the end of Sumerian civilization as a political force, though its cultural legacy endured.',
    tags: ['fall', 'invasion', 'sumer', 'transition'],
  },

  // MINOAN CRETE (3 moments)
  {
    id: 'building-knossos',
    name: 'Construction of the Palace at Knossos',
    empire: 'minoan-crete',
    year: 'c. 1900 BCE',
    description: 'The great palace complex at Knossos was built, becoming the center of Minoan civilization with over 1,000 rooms.',
    significance: 'Represented the height of Minoan palace culture and inspired the legend of the Labyrinth.',
    tags: ['palace', 'architecture', 'knossos', 'civilization'],
  },
  {
    id: 'thera-eruption',
    name: 'Volcanic Eruption of Thera',
    empire: 'minoan-crete',
    year: 'c. 1600 BCE',
    description: 'The catastrophic volcanic eruption of Thera (Santorini) devastated the region and may have weakened Minoan civilization.',
    significance: 'One of the largest volcanic events in recorded history, possibly inspiring the Atlantis legend.',
    tags: ['disaster', 'volcano', 'destruction', 'legend'],
  },
  {
    id: 'minoan-collapse',
    name: 'Collapse of Minoan Civilization',
    empire: 'minoan-crete',
    year: 'c. 1450 BCE',
    description: 'Minoan civilization collapsed, likely due to Mycenaean invasion following earlier volcanic and seismic disasters.',
    significance: 'Ended Europe\'s first advanced civilization and transferred cultural leadership to mainland Greece.',
    tags: ['collapse', 'invasion', 'mycenaean', 'transition'],
  },

  // MYCENAEAN GREECE (3 moments)
  {
    id: 'trojan-war',
    name: 'The Trojan War',
    empire: 'mycenaean-greece',
    year: 'c. 1250 BCE',
    description: 'The legendary conflict between the Greeks and Troy, immortalized in Homer\'s Iliad, reflecting Bronze Age warfare and diplomacy.',
    significance: 'Preserved in epic poetry, it became the foundation myth of Greek identity and Western literature.',
    tags: ['war', 'troy', 'legend', 'homer'],
  },
  {
    id: 'lion-gate-mycenae',
    name: 'Construction of the Lion Gate',
    empire: 'mycenaean-greece',
    year: 'c. 1250 BCE',
    description: 'The massive Lion Gate entrance to the citadel of Mycenae was constructed, showcasing Mycenaean engineering and artistic skill.',
    significance: 'The oldest monumental sculpture in Europe, symbolizing Mycenaean power and sophistication.',
    tags: ['architecture', 'sculpture', 'mycenae', 'monument'],
  },
  {
    id: 'bronze-age-collapse',
    name: 'Bronze Age Collapse',
    empire: 'mycenaean-greece',
    year: 'c. 1200 BCE',
    description: 'The sudden collapse of Mycenaean civilization as part of the wider Bronze Age Collapse that destroyed empires across the eastern Mediterranean.',
    significance: 'Ended the heroic age of Greece and ushered in the Greek Dark Ages, erasing literacy for centuries.',
    tags: ['collapse', 'dark-ages', 'catastrophe', 'transition'],
  },

  // HITTITE EMPIRE (3 moments)
  {
    id: 'battle-of-kadesh-hittite',
    name: 'Battle of Kadesh',
    empire: 'hittite-empire',
    year: '1274 BCE',
    description: 'The Hittites under Muwatalli II faced the Egyptian army of Ramesses II in one of the largest chariot battles in history.',
    significance: 'Though inconclusive militarily, it led to history\'s first known peace treaty between the Hittites and Egypt.',
    tags: ['battle', 'egypt', 'kadesh', 'treaty'],
  },
  {
    id: 'building-hattusa',
    name: 'Construction of Hattusa',
    empire: 'hittite-empire',
    year: 'c. 1650 BCE',
    description: 'The Hittites established their capital at Hattusa, building massive fortifications and temples in central Anatolia.',
    significance: 'Became one of the largest Bronze Age cities and the administrative center of a major empire.',
    tags: ['capital', 'architecture', 'city', 'fortification'],
  },
  {
    id: 'hittite-collapse',
    name: 'Fall of the Hittite Empire',
    empire: 'hittite-empire',
    year: '1178 BCE',
    description: 'The Hittite Empire collapsed during the Bronze Age Collapse, with Hattusa burned and abandoned.',
    significance: 'Ended one of the great Bronze Age powers and left a power vacuum that would reshape the ancient world.',
    tags: ['collapse', 'fall', 'bronze-age', 'destruction'],
  },

  // ============================================
  // CLASSICAL ANTIQUITY (800 – 323 BCE)
  // ============================================

  // CLASSICAL GREECE (3 moments)
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

  // PERSIAN EMPIRE (3 moments)
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

  // PHOENICIA (3 moments)
  {
    id: 'invention-alphabet',
    name: 'Invention of the Alphabet',
    empire: 'phoenicia',
    year: 'c. 1050 BCE',
    description: 'Phoenician scribes developed the first alphabetic writing system, simplifying literacy with just 22 consonant letters.',
    significance: 'Became the ancestor of Greek, Latin, Arabic, and Hebrew alphabets, revolutionizing human communication.',
    tags: ['alphabet', 'writing', 'invention', 'literacy'],
  },
  {
    id: 'founding-carthage-phoenicia',
    name: 'Founding of Carthage',
    empire: 'phoenicia',
    year: '814 BCE',
    description: 'Phoenicians from Tyre established the colony of Carthage in North Africa, which would become a major Mediterranean power.',
    significance: 'Extended Phoenician commercial networks westward and created a civilization that would challenge Rome.',
    tags: ['colonization', 'founding', 'carthage', 'trade'],
  },
  {
    id: 'siege-of-tyre',
    name: 'Siege of Tyre by Alexander',
    empire: 'phoenicia',
    year: '332 BCE',
    description: 'Alexander the Great besieged the island city of Tyre for seven months, finally conquering it by building a causeway.',
    significance: 'Ended Phoenician independence and demonstrated Alexander\'s engineering genius and determination.',
    tags: ['siege', 'alexander', 'conquest', 'tyre'],
  },

  // CARTHAGE (3 moments)
  {
    id: 'hannibal-crosses-alps',
    name: 'Hannibal Crosses the Alps',
    empire: 'carthage',
    year: '218 BCE',
    description: 'Hannibal led his army, including war elephants, across the Alps to invade Italy in one of history\'s greatest military feats.',
    significance: 'Shocked Rome and began the Second Punic War, nearly destroying Roman power in Italy.',
    tags: ['military', 'hannibal', 'alps', 'invasion'],
  },
  {
    id: 'battle-of-cannae',
    name: 'Battle of Cannae',
    empire: 'carthage',
    year: '216 BCE',
    description: 'Hannibal\'s tactical masterpiece, where he encircled and destroyed a much larger Roman army, killing up to 70,000 soldiers.',
    significance: 'Rome\'s worst military defeat, studied as a perfect example of tactical encirclement for over two millennia.',
    tags: ['battle', 'hannibal', 'tactics', 'victory'],
  },
  {
    id: 'destruction-carthage',
    name: 'Destruction of Carthage',
    empire: 'carthage',
    year: '146 BCE',
    description: 'Roman forces sacked and completely destroyed Carthage at the end of the Third Punic War, ending its civilization.',
    significance: 'Eliminated Rome\'s greatest rival and established Roman dominance over the western Mediterranean.',
    tags: ['destruction', 'rome', 'punic-wars', 'fall'],
  },

  // ROMAN REPUBLIC (3 moments)
  {
    id: 'founding-republic',
    name: 'Founding of the Roman Republic',
    empire: 'roman-republic',
    year: '509 BCE',
    description: 'The Romans expelled their last king and established a republic with elected officials and a senate.',
    significance: 'Created a system of government that would last nearly 500 years and inspire republics throughout history.',
    tags: ['founding', 'republic', 'government', 'revolution'],
  },
  {
    id: 'sack-of-rome-gauls',
    name: 'Sack of Rome by the Gauls',
    empire: 'roman-republic',
    year: '390 BCE',
    description: 'Celtic Gauls captured and sacked Rome, a traumatic event that shaped Roman military and political development.',
    significance: 'The humiliation drove Roman expansion northward and their obsession with defensive walls.',
    tags: ['sack', 'gauls', 'defeat', 'trauma'],
  },
  {
    id: 'battle-of-zama',
    name: 'Battle of Zama',
    empire: 'roman-republic',
    year: '202 BCE',
    description: 'Scipio Africanus defeated Hannibal in North Africa, ending the Second Punic War and establishing Roman supremacy.',
    significance: 'Transformed Rome from an Italian power into a Mediterranean empire.',
    tags: ['battle', 'scipio', 'hannibal', 'victory'],
  },

  // ============================================
  // HELLENISTIC & ROMAN WORLD (323 BCE – 476 CE)
  // ============================================

  // MACEDONIAN EMPIRE (3 moments)
  {
    id: 'conquest-of-persia',
    name: 'Alexander\'s Conquest of Persia',
    empire: 'macedonian-empire',
    year: '330 BCE',
    description: 'Alexander the Great conquered the Persian Empire, burning Persepolis and pursuing Darius III to his death.',
    significance: 'Ended the Achaemenid Empire and spread Greek culture from Egypt to India.',
    tags: ['conquest', 'alexander', 'persia', 'empire'],
  },
  {
    id: 'founding-alexandria',
    name: 'Founding of Alexandria',
    empire: 'macedonian-empire',
    year: '331 BCE',
    description: 'Alexander founded the city of Alexandria in Egypt, which would become the intellectual center of the ancient world.',
    significance: 'Housed the famous Library of Alexandria and became a beacon of learning for centuries.',
    tags: ['founding', 'alexandria', 'egypt', 'culture'],
  },
  {
    id: 'death-of-alexander',
    name: 'Death of Alexander the Great',
    empire: 'macedonian-empire',
    year: '323 BCE',
    description: 'Alexander died in Babylon at age 32, leaving an empire without a clear successor and sparking wars among his generals.',
    significance: 'His death divided his empire into successor kingdoms that shaped the Hellenistic world.',
    tags: ['death', 'alexander', 'succession', 'division'],
  },

  // ROMAN EMPIRE (3 moments)
  {
    id: 'augustus-becomes-emperor',
    name: 'Augustus Becomes First Emperor',
    empire: 'roman-empire',
    year: '27 BCE',
    description: 'Octavian received the title Augustus from the Senate, marking the transition from Republic to Empire.',
    significance: 'Began the Pax Romana and established the political system that would endure for centuries.',
    tags: ['emperor', 'augustus', 'founding', 'empire'],
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
  {
    id: 'fall-of-rome',
    name: 'Fall of the Western Roman Empire',
    empire: 'roman-empire',
    year: '476 CE',
    description: 'The Germanic chieftain Odoacer deposed the last Roman emperor, Romulus Augustulus, ending the Western Roman Empire.',
    significance: 'Marked the traditional end of ancient history and the beginning of the Middle Ages in Europe.',
    tags: ['fall', 'barbarians', 'empire', 'medieval'],
  },

  // PARTHIAN EMPIRE (3 moments)
  {
    id: 'battle-of-carrhae',
    name: 'Battle of Carrhae',
    empire: 'parthian-empire',
    year: '53 BCE',
    description: 'Parthian forces under Surena destroyed the Roman army of Crassus, killing 20,000 and capturing 10,000 soldiers.',
    significance: 'Rome\'s worst defeat in the east, halting Roman expansion and establishing Parthia as a rival power.',
    tags: ['battle', 'crassus', 'victory', 'rome'],
  },
  {
    id: 'founding-ctesiphon',
    name: 'Establishment of Ctesiphon as Capital',
    empire: 'parthian-empire',
    year: 'c. 120 BCE',
    description: 'The Parthians established Ctesiphon on the Tigris River as their main capital, opposite the Greek city of Seleucia.',
    significance: 'Became one of the largest cities in the ancient world and remained a capital for nearly 800 years.',
    tags: ['capital', 'city', 'founding', 'mesopotamia'],
  },
  {
    id: 'silk-road-parthia',
    name: 'Parthian Control of the Silk Road',
    empire: 'parthian-empire',
    year: 'c. 100 BCE',
    description: 'Parthia established control over the central Silk Road, becoming the crucial middleman in trade between Rome and China.',
    significance: 'Parthian merchants grew wealthy controlling East-West trade for centuries.',
    tags: ['trade', 'silk-road', 'commerce', 'china'],
  },

  // PTOLEMAIC EGYPT (3 moments)
  {
    id: 'founding-library-alexandria',
    name: 'Founding of the Library of Alexandria',
    empire: 'ptolemaic-egypt',
    year: 'c. 295 BCE',
    description: 'Ptolemy I founded the great Library of Alexandria, which aimed to collect all knowledge in the known world.',
    significance: 'Became the greatest center of learning in antiquity, preserving Greek and ancient knowledge.',
    tags: ['library', 'knowledge', 'scholarship', 'founding'],
  },
  {
    id: 'septuagint-translation',
    name: 'Translation of the Septuagint',
    empire: 'ptolemaic-egypt',
    year: 'c. 250 BCE',
    description: 'Jewish scholars translated the Hebrew Bible into Greek in Alexandria under Ptolemaic patronage.',
    significance: 'Made Jewish scripture accessible to the Greek-speaking world and influenced early Christianity.',
    tags: ['translation', 'bible', 'jewish', 'greek'],
  },
  {
    id: 'death-of-cleopatra',
    name: 'Death of Cleopatra VII',
    empire: 'ptolemaic-egypt',
    year: '30 BCE',
    description: 'Cleopatra VII committed suicide after her defeat by Octavian, ending the Ptolemaic dynasty and Egypt\'s independence.',
    significance: 'Egypt became a Roman province, ending three thousand years of pharaonic rule.',
    tags: ['death', 'cleopatra', 'rome', 'fall'],
  },

  // HAN CHINA (3 moments)
  {
    id: 'opening-silk-road',
    name: 'Opening of the Silk Road',
    empire: 'han-china',
    year: '130 BCE',
    description: 'Emperor Wu sent Zhang Qian westward, establishing diplomatic and trade connections that became the Silk Road.',
    significance: 'Connected China to Central Asia, Persia, and eventually Rome, enabling unprecedented cultural exchange.',
    tags: ['trade', 'silk-road', 'diplomacy', 'exploration'],
  },
  {
    id: 'invention-paper',
    name: 'Invention of Paper',
    empire: 'han-china',
    year: '105 CE',
    description: 'Court official Cai Lun improved the papermaking process, creating the writing material that would revolutionize communication.',
    significance: 'Eventually spread worldwide and remained the primary medium for written communication until the digital age.',
    tags: ['invention', 'paper', 'technology', 'communication'],
  },
  {
    id: 'yellow-turban-rebellion',
    name: 'Yellow Turban Rebellion',
    empire: 'han-china',
    year: '184 CE',
    description: 'A massive peasant uprising against Han rule, led by Taoist followers wearing yellow cloth on their heads.',
    significance: 'Fatally weakened the Han dynasty and led to its fall, beginning China\'s Three Kingdoms period.',
    tags: ['rebellion', 'fall', 'peasant', 'taoism'],
  },

  // ============================================
  // REVOLUTIONARY AGE (1700 – 1900 CE)
  // ============================================

  // BRITISH EMPIRE (3 moments)
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

  // FRENCH EMPIRE (3 moments)
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

  // UNITED STATES (3 moments)
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
    id: 'constitutional-convention',
    name: 'Constitutional Convention',
    empire: 'united-states',
    year: '1787',
    description: 'Delegates met in Philadelphia to draft the United States Constitution, creating the federal government.',
    significance: 'Produced the oldest written national constitution still in use, establishing American democracy.',
    tags: ['constitution', 'founding', 'government', 'philadelphia'],
  },
  {
    id: 'civil-war-ends',
    name: 'End of the Civil War',
    empire: 'united-states',
    year: '1865',
    description: 'Confederate General Robert E. Lee surrendered at Appomattox Court House, ending the American Civil War.',
    significance: 'Preserved the Union, ended slavery, and reshaped the meaning of American freedom.',
    tags: ['civil-war', 'surrender', 'slavery', 'reconstruction'],
  },

  // QING CHINA (3 moments)
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

  // RUSSIAN EMPIRE (3 moments)
  {
    id: 'founding-st-petersburg',
    name: 'Founding of St. Petersburg',
    empire: 'russian-empire',
    year: '1703',
    description: 'Peter the Great founded St. Petersburg as Russia\'s new capital, his "window to Europe."',
    significance: 'Symbolized Russia\'s turn toward Western Europe and modernization.',
    tags: ['founding', 'capital', 'peter', 'modernization'],
  },
  {
    id: 'napoleon-invasion-russia',
    name: 'Napoleon\'s Invasion of Russia',
    empire: 'russian-empire',
    year: '1812',
    description: 'Napoleon invaded Russia with the largest army Europe had ever seen, only to be destroyed by Russian resistance and winter.',
    significance: 'The catastrophic defeat broke Napoleon\'s power and established Russia as a major European force.',
    tags: ['invasion', 'napoleon', 'winter', 'victory'],
  },
  {
    id: 'emancipation-serfs',
    name: 'Emancipation of the Serfs',
    empire: 'russian-empire',
    year: '1861',
    description: 'Tsar Alexander II freed Russia\'s serfs, ending centuries of feudal bondage for tens of millions of peasants.',
    significance: 'One of the largest single acts of emancipation in history, though its incomplete reforms sowed seeds of revolution.',
    tags: ['emancipation', 'reform', 'peasants', 'alexander'],
  },

  // MEIJI JAPAN (3 moments)
  {
    id: 'meiji-restoration',
    name: 'The Meiji Restoration',
    empire: 'meiji-japan',
    year: '1868',
    description: 'The shogunate was overthrown and imperial rule restored under Emperor Meiji, beginning Japan\'s modernization.',
    significance: 'Transformed Japan from a feudal society to a modern industrial nation in a single generation.',
    tags: ['restoration', 'modernization', 'emperor', 'reform'],
  },
  {
    id: 'sino-japanese-war',
    name: 'First Sino-Japanese War',
    empire: 'meiji-japan',
    year: '1894',
    description: 'Japan defeated Qing China, gaining Taiwan and demonstrating the success of Meiji modernization.',
    significance: 'Marked Japan\'s emergence as an Asian power and accelerated China\'s decline.',
    tags: ['war', 'china', 'victory', 'expansion'],
  },
  {
    id: 'russo-japanese-war',
    name: 'Russo-Japanese War Victory',
    empire: 'meiji-japan',
    year: '1905',
    description: 'Japan defeated Russia, the first modern victory of an Asian power over a European one.',
    significance: 'Shocked the world, inspired Asian nationalism, and established Japan as a world power.',
    tags: ['war', 'russia', 'victory', 'power'],
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
