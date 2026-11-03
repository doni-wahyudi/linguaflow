/**
 * @file french.js
 * @description Comprehensive French curriculum aligned to CEFR Levels (A1 Breakthrough & A2 Waystage).
 */

export const frenchLessons = [
  // ── CEFR A1 — Basics: Lesson 1 ────────────────────────────────────────────
  {
    id: 'fr-basics-1',
    categoryId: 'basics',
    languageId: 'fr',
    level: 'A1',
    title: 'Hello & Basic Greetings',
    description: 'Learn elegant French greetings for any hour of the day.',
    order: 1,
    xpReward: 50,
    vocabulary: [
      { id: 'fr-w-001', word: 'Bonjour', translation: 'Hello / Good morning', pronunciation: 'bohn-ZHOOR', example: 'Bonjour, comment allez-vous ?', exampleTranslation: 'Hello, how are you?' },
      { id: 'fr-w-002', word: 'Salut', translation: 'Hi / Bye (casual)', pronunciation: 'sah-LOO', example: 'Salut Thomas ! Ça va ?', exampleTranslation: 'Hi Thomas! How are you?' },
      { id: 'fr-w-003', word: 'Bonsoir', translation: 'Good evening', pronunciation: 'bohn-SWAHR', example: 'Bonsoir madame.', exampleTranslation: 'Good evening madam.' },
      { id: 'fr-w-004', word: 'Au revoir', translation: 'Goodbye', pronunciation: 'oh ruh-VWAHR', example: 'Au revoir et bonne journée !', exampleTranslation: 'Goodbye and have a nice day!' },
      { id: 'fr-w-005', word: 'À bientôt', translation: 'See you soon', pronunciation: 'ah byan-TOH', example: 'À bientôt mes amis !', exampleTranslation: 'See you soon my friends!' },
      { id: 'fr-w-006', word: 'Bonne nuit', translation: 'Good night', pronunciation: 'buhn NWEE', example: 'Dors bien, bonne nuit.', exampleTranslation: 'Sleep well, good night.' },
    ],
    exercises: [
      { id: 'fr-ex-101', type: 'flashcard', wordId: 'fr-w-001', word: 'Bonjour', translation: 'Hello / Good morning', pronunciation: 'bohn-ZHOOR', example: 'Bonjour, comment allez-vous ?', exampleTranslation: 'Hello, how are you?' },
      { id: 'fr-ex-102', type: 'multipleChoice', question: 'What is the informal French word for both "Hi" and "Bye"?', options: ['Bonjour', 'Salut', 'Bonsoir', 'Au revoir'], correctIndex: 1, explanation: '"Salut" is used among friends and peers for both greeting and saying goodbye.' },
      { id: 'fr-ex-103', type: 'fillBlank', sentence: '___, comment allez-vous ?', answer: 'Bonjour', hint: 'Most common French greeting', translation: 'Hello, how are you?' },
      { id: 'fr-ex-104', type: 'matchPairs', prompt: 'Match French greetings to English', pairs: [{ left: 'Bonjour', right: 'Hello' }, { left: 'Au revoir', right: 'Goodbye' }, { left: 'Bonsoir', right: 'Good evening' }, { left: 'À bientôt', right: 'See you soon' }] },
      { id: 'fr-ex-105', type: 'typing', prompt: 'Type the French word for "Goodbye"', answer: 'Au revoir', hint: 'Two words starting with Au...', placeholder: 'Tapez ici...' },
    ],
  },

  // ── CEFR A1 — Basics: Lesson 2 ────────────────────────────────────────────
  {
    id: 'fr-basics-2',
    categoryId: 'basics',
    languageId: 'fr',
    level: 'A1',
    title: 'Please, Thank You & Etiquette',
    description: 'Master polite French manners and everyday courtesy.',
    order: 2,
    xpReward: 50,
    vocabulary: [
      { id: 'fr-w-007', word: "S'il vous plaît", translation: 'Please (formal / plural)', pronunciation: 'seel voo PLEH', example: 'Un croissant, s\'il vous plaît.', exampleTranslation: 'A croissant, please.' },
      { id: 'fr-w-008', word: 'Merci', translation: 'Thank you', pronunciation: 'mehr-SEE', example: 'Merci beaucoup pour tout !', exampleTranslation: 'Thank you very much for everything!' },
      { id: 'fr-w-009', word: 'De rien', translation: "You're welcome", pronunciation: 'duh RYAN', example: '— Merci ! — De rien.', exampleTranslation: '— Thank you! — You\'re welcome.' },
      { id: 'fr-w-010', word: 'Pardon / Excusez-moi', translation: 'Excuse me / Pardon', pronunciation: 'pahr-DOHN / ehk-skew-zay MWAH', example: 'Pardon, où est le Louvre ?', exampleTranslation: 'Excuse me, where is the Louvre?' },
      { id: 'fr-w-011', word: 'Oui / Non', translation: 'Yes / No', pronunciation: 'wee / noh', example: 'Oui, je comprends.', exampleTranslation: 'Yes, I understand.' },
    ],
    exercises: [
      { id: 'fr-ex-201', type: 'multipleChoice', question: 'How do you say "Thank you very much" in French?', options: ['Merci beaucoup', "S'il vous plaît", 'De rien', 'Au revoir'], correctIndex: 0, explanation: '"Merci beaucoup" expresses deep gratitude.' },
      { id: 'fr-ex-202', type: 'matchPairs', prompt: 'Match French politeness phrases', pairs: [{ left: 'Merci', right: 'Thank you' }, { left: "S'il vous plaît", right: 'Please' }, { left: 'De rien', right: "You're welcome" }, { left: 'Pardon', right: 'Excuse me' }] },
      { id: 'fr-ex-203', type: 'typing', prompt: 'Type the French word for "Thank you"', answer: 'Merci', hint: 'Starts with M, 5 letters', placeholder: 'Tapez ici...' },
    ],
  },

  // ── CEFR A1 — Greetings: Lesson 1 ─────────────────────────────────────────
  {
    id: 'fr-greetings-1',
    categoryId: 'greetings',
    languageId: 'fr',
    level: 'A1',
    title: 'Introducing Yourself (Se présenter)',
    description: 'Learn to state your name and ask how someone is doing.',
    order: 1,
    xpReward: 55,
    vocabulary: [
      { id: 'fr-w-012', word: "Je m'appelle", translation: 'My name is...', pronunciation: 'zhuh mah-PELL', example: "Bonjour, je m'appelle Claire.", exampleTranslation: 'Hello, my name is Claire.' },
      { id: 'fr-w-013', word: 'Comment vous appelez-vous ?', translation: 'What is your name? (polite)', pronunciation: 'koh-mahn voo zah-play VOO', example: 'Et vous, comment vous appelez-vous ?', exampleTranslation: 'And you, what is your name?' },
      { id: 'fr-w-014', word: 'Enchanté(e)', translation: 'Delighted / Nice to meet you', pronunciation: 'ahn-shahn-TAY', example: 'Enchanté de faire votre connaissance.', exampleTranslation: 'Nice to meet you.' },
      { id: 'fr-w-015', word: 'Ça va ?', translation: 'How are you? / How are things?', pronunciation: 'sah VAH', example: 'Salut ! Ça va bien ?', exampleTranslation: 'Hi! Are things going well?' },
    ],
    exercises: [
      { id: 'fr-ex-301', type: 'multipleChoice', question: 'What does "Enchanté" mean when introduced to someone?', options: ['Goodbye', 'Pleased / Nice to meet you', 'Good luck', 'Pardon me'], correctIndex: 1, explanation: '"Enchanté" literally means "enchanted" and is the traditional way to say "Nice to meet you".' },
      { id: 'fr-ex-302', type: 'fillBlank', sentence: "Bonjour, je ___ Pierre.", answer: "m'appelle", hint: 'French for "call myself"', translation: 'Hello, my name is Pierre.' },
      { id: 'fr-ex-303', type: 'matchPairs', prompt: 'Match conversational phrases', pairs: [{ left: "Je m'appelle", right: 'My name is' }, { left: 'Ça va ?', right: 'How are you?' }, { left: 'Enchanté', right: 'Nice to meet you' }, { left: 'Oui', right: 'Yes' }] },
    ],
  },

  // ── CEFR A1 — Numbers: Lesson 1 ───────────────────────────────────────────
  {
    id: 'fr-numbers-1',
    categoryId: 'numbers',
    languageId: 'fr',
    level: 'A1',
    title: 'Numbers 1 to 10 (Un à Dix)',
    description: 'Learn to count from un to dix in French.',
    order: 1,
    xpReward: 50,
    vocabulary: [
      { id: 'fr-w-016', word: 'Un', translation: 'One (1)', pronunciation: 'uhn', example: 'Un café, s\'il vous plaît.', exampleTranslation: 'One coffee, please.' },
      { id: 'fr-w-017', word: 'Deux', translation: 'Two (2)', pronunciation: 'duh', example: 'Deux baguettes.', exampleTranslation: 'Two baguettes.' },
      { id: 'fr-w-018', word: 'Trois', translation: 'Three (3)', pronunciation: 'trwah', example: 'Trois amis.', exampleTranslation: 'Three friends.' },
      { id: 'fr-w-019', word: 'Quatre', translation: 'Four (4)', pronunciation: 'KAT-ruh', example: 'Quatre personnes.', exampleTranslation: 'Four people.' },
      { id: 'fr-w-020', word: 'Cinq', translation: 'Five (5)', pronunciation: 'sank', example: 'Cinq minutes.', exampleTranslation: 'Five minutes.' },
      { id: 'fr-w-021', word: 'Dix', translation: 'Ten (10)', pronunciation: 'dees', example: 'Dix euros.', exampleTranslation: 'Ten euros.' },
    ],
    exercises: [
      { id: 'fr-ex-401', type: 'multipleChoice', question: 'Which is the number "Three" in French?', options: ['Un', 'Deux', 'Trois', 'Quatre'], correctIndex: 2, explanation: '"Trois" is 3 in French.' },
      { id: 'fr-ex-402', type: 'matchPairs', prompt: 'Match French numbers to digits', pairs: [{ left: 'Un', right: '1' }, { left: 'Deux', right: '2' }, { left: 'Trois', right: '3' }, { left: 'Cinq', right: '5' }] },
      { id: 'fr-ex-403', type: 'typing', prompt: 'Type the French word for number 1', answer: 'Un', hint: 'Two letters starting with U', placeholder: 'Tapez ici...' },
    ],
  },

  // ── CEFR A1 — Food & Dining: Lesson 1 ─────────────────────────────────────
  {
    id: 'fr-food-1',
    categoryId: 'food-drink',
    languageId: 'fr',
    level: 'A1',
    title: 'At the Bistro & Café (Au Café)',
    description: 'Order coffee, water, croissants, and ask for l\'addition.',
    order: 1,
    xpReward: 60,
    vocabulary: [
      { id: 'fr-w-022', word: "L'eau (f)", translation: 'Water', pronunciation: 'loh', example: 'Une carafe d\'eau, s\'il vous plaît.', exampleTranslation: 'A jug of water, please.' },
      { id: 'fr-w-023', word: 'Le café', translation: 'Coffee', pronunciation: 'luh kah-FAY', example: 'Un café noir, s\'il vous plaît.', exampleTranslation: 'A black coffee, please.' },
      { id: 'fr-w-024', word: "L'addition", translation: 'The bill / check', pronunciation: 'lah-dee-SYOHN', example: 'L\'addition, s\'il vous plaît.', exampleTranslation: 'The check, please.' },
      { id: 'fr-w-025', word: 'Délicieux', translation: 'Delicious', pronunciation: 'day-lee-SYUH', example: 'C\'est vraiment délicieux !', exampleTranslation: 'It is truly delicious!' },
      { id: 'fr-w-026', word: 'Le pain / Le croissant', translation: 'Bread / Croissant', pronunciation: 'luh pan / luh krwah-SAHN', example: 'Deux croissants chauds.', exampleTranslation: 'Two warm croissants.' },
    ],
    exercises: [
      { id: 'fr-ex-501', type: 'multipleChoice', question: 'How do you ask for "The bill, please" in French?', options: ['Le café, s\'il vous plaît', 'L\'addition, s\'il vous plaît', 'Bonjour monsieur', 'Au revoir merci'], correctIndex: 1, explanation: '"L\'addition, s\'il vous plaît" is the standard phrase to request the check.' },
      { id: 'fr-ex-502', type: 'fillBlank', sentence: "L'___, s'il vous plaît.", answer: 'addition', hint: 'Word for the restaurant check', translation: "The bill, please." },
      { id: 'fr-ex-503', type: 'matchPairs', prompt: 'Match café terms', pairs: [{ left: "L'eau", right: 'Water' }, { left: 'Le café', right: 'Coffee' }, { left: "L'addition", right: 'The bill' }, { left: 'Délicieux', right: 'Delicious' }] },
    ],
  },

  // ── CEFR A2 — Travel: Lesson 1 ────────────────────────────────────────────
  {
    id: 'fr-travel-1',
    categoryId: 'travel',
    languageId: 'fr',
    level: 'A2',
    title: 'The Train Station & Métro (Gare et Métro)',
    description: 'Travel by train or métro in Paris and throughout France.',
    order: 1,
    xpReward: 65,
    vocabulary: [
      { id: 'fr-w-027', word: 'La gare', translation: 'Train station', pronunciation: 'lah GAHR', example: 'Où est la gare de Lyon ?', exampleTranslation: 'Where is the Lyon train station?' },
      { id: 'fr-w-028', word: 'Le billet', translation: 'Ticket', pronunciation: 'luh bee-YEH', example: 'Un billet aller-retour pour Nice.', exampleTranslation: 'A round-trip ticket to Nice.' },
      { id: 'fr-w-029', word: "L'aéroport (m)", translation: 'Airport', pronunciation: 'lah-ay-roh-POHR', example: 'Un taxi pour l\'aéroport Charles de Gaulle.', exampleTranslation: 'A taxi to Charles de Gaulle Airport.' },
      { id: 'fr-w-030', word: "L'hôtel (m)", translation: 'Hotel', pronunciation: 'loh-TEHL', example: 'J\'ai une chambre réservée à l\'hôtel.', exampleTranslation: 'I have a room reserved at the hotel.' },
      { id: 'fr-w-031', word: 'Le passeport', translation: 'Passport', pronunciation: 'luh pahs-POHR', example: 'Votre passeport, s\'il vous plaît.', exampleTranslation: 'Your passport, please.' },
    ],
    exercises: [
      { id: 'fr-ex-601', type: 'multipleChoice', question: 'What does "La gare" mean?', options: ['Airport', 'Train station', 'Hotel', 'Ticket'], correctIndex: 1, explanation: '"La gare" means the train station.' },
      { id: 'fr-ex-602', type: 'fillBlank', sentence: 'Où est la ___ de train ?', answer: 'gare', hint: 'Station word', translation: 'Where is the train station?' },
      { id: 'fr-ex-603', type: 'matchPairs', prompt: 'Match travel words', pairs: [{ left: 'La gare', right: 'Train station' }, { left: 'Le billet', right: 'Ticket' }, { left: "L'hôtel", right: 'Hotel' }, { left: "L'aéroport", right: 'Airport' }] },
    ],
  },

  // ── CEFR A2 — Travel: Lesson 2 ────────────────────────────────────────────
  {
    id: 'fr-travel-2',
    categoryId: 'travel',
    languageId: 'fr',
    level: 'A2',
    title: 'Directions in the City (Demander son chemin)',
    description: 'Navigate French streets with left, right, and straight ahead.',
    order: 2,
    xpReward: 65,
    vocabulary: [
      { id: 'fr-w-032', word: 'Où est... ?', translation: 'Where is...?', pronunciation: 'oo EH', example: 'Où est la station de métro ?', exampleTranslation: 'Where is the métro station?' },
      { id: 'fr-w-033', word: 'À gauche', translation: 'To the left', pronunciation: 'ah GOHSH', example: 'Tournez à gauche après la boulangerie.', exampleTranslation: 'Turn left after the bakery.' },
      { id: 'fr-w-034', word: 'À droite', translation: 'To the right', pronunciation: 'ah DRWAHT', example: 'La pharmacie est sur votre droite.', exampleTranslation: 'The pharmacy is on your right.' },
      { id: 'fr-w-035', word: 'Tout droit', translation: 'Straight ahead', pronunciation: 'too DRWAH', example: 'Continuez tout droit pendant cent mètres.', exampleTranslation: 'Continue straight ahead for 100 meters.' },
      { id: 'fr-w-036', word: 'Près / Loin', translation: 'Near / Far', pronunciation: 'preh / lwan', example: 'Le musée est très près d\'ici.', exampleTranslation: 'The museum is very close to here.' },
    ],
    exercises: [
      { id: 'fr-ex-701', type: 'multipleChoice', question: 'What does "À gauche" mean?', options: ['To the left', 'To the right', 'Straight ahead', 'Far'], correctIndex: 0, explanation: '"À gauche" means to the left.' },
      { id: 'fr-ex-702', type: 'fillBlank', sentence: 'Continuez tout ___.', answer: 'droit', hint: 'Straight', translation: 'Continue straight ahead.' },
      { id: 'fr-ex-703', type: 'matchPairs', prompt: 'Match directions', pairs: [{ left: 'À gauche', right: 'To the left' }, { left: 'À droite', right: 'To the right' }, { left: 'Tout droit', right: 'Straight ahead' }, { left: 'Où est... ?', right: 'Where is...?' }] },
    ],
  },

  // ── CEFR A2 — Family: Lesson 1 ────────────────────────────────────────────
  {
    id: 'fr-family-1',
    categoryId: 'family',
    languageId: 'fr',
    level: 'A2',
    title: 'Family Members (La Famille)',
    description: 'Talk about your family, parents, brothers, sisters, and grandparents.',
    order: 1,
    xpReward: 65,
    vocabulary: [
      { id: 'fr-w-037', word: 'La famille', translation: 'Family', pronunciation: 'lah fah-MEE', example: 'J\'aime beaucoup ma famille.', exampleTranslation: 'I love my family very much.' },
      { id: 'fr-w-038', word: 'Le père / La mère', translation: 'Father / Mother', pronunciation: 'luh pair / lah mair', example: 'Mon père est médecin.', exampleTranslation: 'My father is a doctor.' },
      { id: 'fr-w-039', word: 'Le frère / La sœur', translation: 'Brother / Sister', pronunciation: 'luh frair / lah suhr', example: 'J\'ai un frère et une sœur.', exampleTranslation: 'I have a brother and a sister.' },
      { id: 'fr-w-040', word: 'Le fils / La fille', translation: 'Son / Daughter', pronunciation: 'luh feess / lah fee', example: 'Leur fille a huit ans.', exampleTranslation: 'Their daughter is eight years old.' },
      { id: 'fr-w-041', word: 'Les grands-parents', translation: 'Grandparents', pronunciation: 'lay grahn-pah-RAHN', example: 'Mes grands-parents habitent à Bordeaux.', exampleTranslation: 'My grandparents live in Bordeaux.' },
    ],
    exercises: [
      { id: 'fr-ex-801', type: 'multipleChoice', question: 'How do you say "Sister" in French?', options: ['La mère', 'La sœur', 'La fille', 'Le frère'], correctIndex: 1, explanation: '"La sœur" is sister.' },
      { id: 'fr-ex-802', type: 'fillBlank', sentence: "Mon ___ est médecin.", answer: 'père', hint: 'Father', translation: 'My father is a doctor.' },
      { id: 'fr-ex-803', type: 'matchPairs', prompt: 'Match family vocabulary', pairs: [{ left: 'Le père', right: 'Father' }, { left: 'La mère', right: 'Mother' }, { left: 'Le frère', right: 'Brother' }, { left: 'La sœur', right: 'Sister' }] },
    ],
  },

  // ── CEFR B1 — Work & Career: Lesson 1 ─────────────────────────────────────
  {
    id: 'fr-work-1',
    categoryId: 'work-career',
    languageId: 'fr',
    level: 'B1',
    title: 'At the Office & Professional Life (Au Travail)',
    description: 'Master French workplace terms, business meetings, colleagues, and deadlines.',
    order: 1,
    xpReward: 70,
    vocabulary: [
      { id: 'fr-w-042', word: 'La réunion', translation: 'Meeting', pronunciation: 'lah ray-oo-NYOHN', example: 'Nous avons une réunion d\'équipe à dix heures.', exampleTranslation: 'We have a team meeting at ten o\'clock.' },
      { id: 'fr-w-043', word: 'Le collègue', translation: 'Colleague / Coworker', pronunciation: 'luh koh-LEHG', example: 'Je m\'entends très bien avec mes collègues.', exampleTranslation: 'I get along very well with my colleagues.' },
      { id: 'fr-w-044', word: 'Le projet', translation: 'Project', pronunciation: 'luh proh-ZHEH', example: 'C\'est un projet passionnant.', exampleTranslation: 'It is an exciting project.' },
      { id: 'fr-w-045', word: 'La date limite', translation: 'Deadline', pronunciation: 'lah daht lee-MEET', example: 'La date limite pour ce rapport est vendredi.', exampleTranslation: 'The deadline for this report is Friday.' },
      { id: 'fr-w-046', word: "L'entretien d'embauche", translation: 'Job interview', pronunciation: 'lahn-truh-TYAN dahm-BOHSH', example: 'Demain, j\'ai un entretien d\'embauche important.', exampleTranslation: 'Tomorrow, I have an important job interview.' },
    ],
    exercises: [
      { id: 'fr-ex-901', type: 'multipleChoice', question: 'How do you say "Job interview" in French?', options: ['La réunion', "L'entretien d'embauche", 'Le collègue', 'La date limite'], correctIndex: 1, explanation: "\"L'entretien d'embauche\" means job interview." },
      { id: 'fr-ex-902', type: 'fillBlank', sentence: "Nous avons une ___ à dix heures.", answer: 'réunion', hint: 'Meeting in French', translation: 'We have a meeting at ten o\'clock.' },
      { id: 'fr-ex-903', type: 'matchPairs', prompt: 'Match workplace vocabulary', pairs: [{ left: 'La réunion', right: 'Meeting' }, { left: 'Le collègue', right: 'Colleague' }, { left: 'Le projet', right: 'Project' }, { left: 'La date limite', right: 'Deadline' }] },
      { id: 'fr-ex-904', type: 'typing', prompt: 'Type "Project" in French', answer: 'Le projet', hint: 'Starts with Le pro...', placeholder: 'Tapez ici...' },
    ],
  },

  // ── CEFR B1 — Opinions & Culture: Lesson 1 ────────────────────────────────
  {
    id: 'fr-opinions-1',
    categoryId: 'opinions-culture',
    languageId: 'fr',
    level: 'B1',
    title: 'Expressing Opinions (Donner son Avis)',
    description: 'Express your thoughts, agreement, disagreement, and subtle viewpoints in French.',
    order: 1,
    xpReward: 70,
    vocabulary: [
      { id: 'fr-w-047', word: 'À mon avis', translation: 'In my opinion', pronunciation: 'ah mohn ah-VEE', example: 'À mon avis, cette solution est idéale.', exampleTranslation: 'In my opinion, this solution is ideal.' },
      { id: 'fr-w-048', word: "Je suis d'accord", translation: 'I agree', pronunciation: 'zhuh swee dah-KOR', example: 'Absolument, je suis tout à fait d\'accord.', exampleTranslation: 'Absolutely, I completely agree.' },
      { id: 'fr-w-049', word: 'Je pense que', translation: 'I think that', pronunciation: 'zhuh pahns kuh', example: 'Je pense que nous devrions essayer.', exampleTranslation: 'I think that we should try.' },
      { id: 'fr-w-050', word: 'Cependant', translation: 'However / Nevertheless', pronunciation: 'suh-pahn-DAHN', example: 'C\'est difficile, cependant c\'est possible.', exampleTranslation: 'It is difficult, however it is possible.' },
      { id: 'fr-w-051', word: 'Bien sûr', translation: 'Of course', pronunciation: 'byan SOOR', example: '— Tu viens avec nous ? — Bien sûr !', exampleTranslation: '— Are you coming with us? — Of course!' },
    ],
    exercises: [
      { id: 'fr-ex-1001', type: 'multipleChoice', question: 'How do you say "In my opinion" in French?', options: ['Je pense que', 'À mon avis', 'Cependant', 'Bien sûr'], correctIndex: 1, explanation: '"À mon avis" is the classic phrase for "In my opinion".' },
      { id: 'fr-ex-1002', type: 'fillBlank', sentence: "Je suis tout à fait d'___ avec toi.", answer: 'accord', hint: 'Agreement', translation: "I completely agree with you." },
      { id: 'fr-ex-1003', type: 'matchPairs', prompt: 'Match opinion phrases', pairs: [{ left: 'À mon avis', right: 'In my opinion' }, { left: "Je suis d'accord", right: 'I agree' }, { left: 'Cependant', right: 'However' }, { left: 'Bien sûr', right: 'Of course' }] },
      { id: 'fr-ex-1004', type: 'typing', prompt: 'Type "Of course" in French', answer: 'Bien sûr', hint: 'Two words: B___ s__', placeholder: 'Tapez ici...' },
    ],
  },
];

export default frenchLessons;
