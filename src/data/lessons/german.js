/**
 * @file german.js
 * @description Comprehensive German curriculum aligned to CEFR Levels (A1 Einstieg & A2 Grundlagen).
 */

export const germanLessons = [
  // ── CEFR A1 — Basics: Lesson 1 ────────────────────────────────────────────
  {
    id: 'de-basics-1',
    categoryId: 'basics',
    languageId: 'de',
    level: 'A1',
    title: 'Hello & Essential Greetings',
    description: 'Learn foundational German greetings and polite welcomes for any time of day.',
    order: 1,
    xpReward: 50,
    vocabulary: [
      { id: 'de-w-001', word: 'Hallo', translation: 'Hello / Hi', pronunciation: 'HAH-loh', example: 'Hallo! Wie geht es dir?', exampleTranslation: 'Hello! How are you?' },
      { id: 'de-w-002', word: 'Guten Tag', translation: 'Good day / Hello', pronunciation: 'GOO-ten TAHK', example: 'Guten Tag, Herr Müller.', exampleTranslation: 'Good day, Mr. Mueller.' },
      { id: 'de-w-003', word: 'Guten Morgen', translation: 'Good morning', pronunciation: 'GOO-ten MOR-gen', example: 'Guten Morgen allerseits!', exampleTranslation: 'Good morning everyone!' },
      { id: 'de-w-004', word: 'Guten Abend', translation: 'Good evening', pronunciation: 'GOO-ten AH-bent', example: 'Guten Abend, willkommen!', exampleTranslation: 'Good evening, welcome!' },
      { id: 'de-w-005', word: 'Auf Wiedersehen', translation: 'Goodbye (formal)', pronunciation: 'owf VEE-der-zay-en', example: 'Auf Wiedersehen und schönen Tag noch!', exampleTranslation: 'Goodbye and have a nice day!' },
      { id: 'de-w-006', word: 'Tschüss', translation: 'Bye (casual)', pronunciation: 'tchooss', example: 'Tschüss, bis morgen!', exampleTranslation: 'Bye, see you tomorrow!' },
    ],
    exercises: [
      { id: 'de-ex-101', type: 'flashcard', wordId: 'de-w-001', word: 'Hallo', translation: 'Hello / Hi', pronunciation: 'HAH-loh', example: 'Hallo! Wie geht es dir?', exampleTranslation: 'Hello! How are you?' },
      { id: 'de-ex-102', type: 'multipleChoice', question: 'What does "Guten Morgen" mean in German?', options: ['Good evening', 'Good morning', 'Goodbye', 'Please'], correctIndex: 1, explanation: '"Guten Morgen" is used before noon to greet someone in the morning.' },
      { id: 'de-ex-103', type: 'fillBlank', sentence: '___ Tag, Herr Müller.', answer: 'Guten', hint: 'German word for "Good" (masculine accusative)', translation: 'Good day, Mr. Mueller.' },
      { id: 'de-ex-104', type: 'matchPairs', prompt: 'Match German greetings to their English meanings', pairs: [{ left: 'Hallo', right: 'Hello' }, { left: 'Tschüss', right: 'Bye' }, { left: 'Guten Abend', right: 'Good evening' }, { left: 'Auf Wiedersehen', right: 'Goodbye' }] },
      { id: 'de-ex-105', type: 'typing', prompt: 'Type the casual German word for "Bye"', answer: 'Tschüss', hint: 'Starts with Ts...', placeholder: 'Tippe hier...' },
      { id: 'de-ex-106', type: 'multipleChoice', question: 'How do you say formal "Goodbye" in German?', options: ['Guten Morgen', 'Auf Wiedersehen', 'Hallo', 'Tschüss'], correctIndex: 1, explanation: '"Auf Wiedersehen" literally translates to "Until we see each other again".' },
    ],
  },

  // ── CEFR A1 — Basics: Lesson 2 ────────────────────────────────────────────
  {
    id: 'de-basics-2',
    categoryId: 'basics',
    languageId: 'de',
    level: 'A1',
    title: 'Please, Thank You & Courtesy',
    description: 'Learn polite everyday German manners and essential courtesies.',
    order: 2,
    xpReward: 50,
    vocabulary: [
      { id: 'de-w-007', word: 'Bitte', translation: 'Please / You are welcome', pronunciation: 'BIT-teh', example: 'Einen Kaffee, bitte.', exampleTranslation: 'A coffee, please.' },
      { id: 'de-w-008', word: 'Danke', translation: 'Thank you', pronunciation: 'DAHN-keh', example: 'Danke für deine Hilfe.', exampleTranslation: 'Thank you for your help.' },
      { id: 'de-w-009', word: 'Vielen Dank', translation: 'Thank you very much', pronunciation: 'FEE-len DAHN-k', example: 'Vielen Dank für alles!', exampleTranslation: 'Thank you very much for everything!' },
      { id: 'de-w-010', word: 'Entschuldigung', translation: 'Excuse me / Sorry', pronunciation: 'ent-SHOOL-dee-goong', example: 'Entschuldigung, wo ist der Bahnhof?', exampleTranslation: 'Excuse me, where is the train station?' },
      { id: 'de-w-011', word: 'Es tut mir leid', translation: "I'm sorry", pronunciation: 'es toot meer light', example: 'Es tut mir leid, ich bin spät.', exampleTranslation: "I'm sorry, I am late." },
      { id: 'de-w-012', word: 'Ja / Nein', translation: 'Yes / No', pronunciation: 'yah / nine', example: 'Ja, gerne!', exampleTranslation: 'Yes, with pleasure!' },
    ],
    exercises: [
      { id: 'de-ex-201', type: 'flashcard', wordId: 'de-w-008', word: 'Danke', translation: 'Thank you', pronunciation: 'DAHN-keh', example: 'Danke für deine Hilfe.', exampleTranslation: 'Thank you for your help.' },
      { id: 'de-ex-202', type: 'multipleChoice', question: 'What is the versatile German word meaning both "Please" and "You\'re welcome"?', options: ['Danke', 'Bitte', 'Hallo', 'Nein'], correctIndex: 1, explanation: '"Bitte" serves as both "please" and the response to "danke".' },
      { id: 'de-ex-203', type: 'fillBlank', sentence: 'Einen Kaffee, ___.', answer: 'bitte', hint: 'German word for please', translation: 'A coffee, please.' },
      { id: 'de-ex-204', type: 'matchPairs', prompt: 'Match German courtesies', pairs: [{ left: 'Bitte', right: 'Please' }, { left: 'Danke', right: 'Thank you' }, { left: 'Entschuldigung', right: 'Excuse me' }, { left: 'Ja', right: 'Yes' }] },
      { id: 'de-ex-205', type: 'typing', prompt: 'Type "Thank you" in German', answer: 'Danke', hint: 'Starts with D, 5 letters', placeholder: 'Tippe hier...' },
    ],
  },

  // ── CEFR A1 — Greetings: Lesson 1 ─────────────────────────────────────────
  {
    id: 'de-greetings-1',
    categoryId: 'greetings',
    languageId: 'de',
    level: 'A1',
    title: 'Personal Introductions (Kennenlernen)',
    description: 'Introduce yourself, ask names, and ask how someone is doing in German.',
    order: 1,
    xpReward: 55,
    vocabulary: [
      { id: 'de-w-013', word: 'Ich heiße', translation: 'My name is...', pronunciation: 'ikh HY-seh', example: 'Ich heiße Lukas.', exampleTranslation: 'My name is Lukas.' },
      { id: 'de-w-014', word: 'Wie heißt du?', translation: 'What is your name? (casual)', pronunciation: 'vee hy-st doo', example: 'Hallo! Wie heißt du?', exampleTranslation: 'Hello! What is your name?' },
      { id: 'de-w-015', word: 'Freut mich', translation: 'Pleased / Nice to meet you', pronunciation: 'froyt mikh', example: 'Freut mich, dich kennenzulernen.', exampleTranslation: 'Pleased to meet you.' },
      { id: 'de-w-016', word: "Wie geht's?", translation: 'How are you? / How is it going?', pronunciation: 'vee gayts', example: 'Hallo Anna, wie geht\'s dir?', exampleTranslation: 'Hello Anna, how are you?' },
      { id: 'de-w-017', word: 'Sehr gut', translation: 'Very good', pronunciation: 'zair goot', example: 'Mir geht es sehr gut, danke!', exampleTranslation: 'I am doing very well, thank you!' },
    ],
    exercises: [
      { id: 'de-ex-301', type: 'multipleChoice', question: 'Which phrase means "Nice to meet you" in German?', options: ['Auf Wiedersehen', 'Freut mich', 'Guten Morgen', 'Nein danke'], correctIndex: 1, explanation: '"Freut mich" is the common short form for "It pleases me to meet you".' },
      { id: 'de-ex-302', type: 'fillBlank', sentence: 'Ich ___ Julia.', answer: 'heiße', hint: 'German verb for "am called"', translation: 'My name is Julia.' },
      { id: 'de-ex-303', type: 'matchPairs', prompt: 'Match conversation phrases', pairs: [{ left: 'Ich heiße', right: 'My name is' }, { left: "Wie geht's?", right: 'How are you?' }, { left: 'Sehr gut', right: 'Very good' }, { left: 'Freut mich', right: 'Nice to meet you' }] },
      { id: 'de-ex-304', type: 'typing', prompt: 'Type "Very good" in German', answer: 'Sehr gut', hint: 'Two words: S___ g__', placeholder: 'Tippe hier...' },
    ],
  },

  // ── CEFR A1 — Numbers: Lesson 1 ───────────────────────────────────────────
  {
    id: 'de-numbers-1',
    categoryId: 'numbers',
    languageId: 'de',
    level: 'A1',
    title: 'Numbers 1 to 10 (Zahlen 1 bis 10)',
    description: 'Learn to count from eins to zehn in German with clear pronunciation.',
    order: 1,
    xpReward: 50,
    vocabulary: [
      { id: 'de-w-018', word: 'Eins', translation: 'One (1)', pronunciation: 'eyens', example: 'Ein Ticket, bitte.', exampleTranslation: 'One ticket, please.' },
      { id: 'de-w-019', word: 'Zwei', translation: 'Two (2)', pronunciation: 'tsvye', example: 'Zwei Brötchen.', exampleTranslation: 'Two bread rolls.' },
      { id: 'de-w-020', word: 'Drei', translation: 'Three (3)', pronunciation: 'dry', example: 'Drei Freunde.', exampleTranslation: 'Three friends.' },
      { id: 'de-w-021', word: 'Vier', translation: 'Four (4)', pronunciation: 'feer', example: 'Vier Stunden.', exampleTranslation: 'Four hours.' },
      { id: 'de-w-022', word: 'Fünf', translation: 'Five (5)', pronunciation: 'fyeunf', example: 'Fünf Minuten.', exampleTranslation: 'Five minutes.' },
      { id: 'de-w-023', word: 'Zehn', translation: 'Ten (10)', pronunciation: 'tsayn', example: 'Zehn Euro.', exampleTranslation: 'Ten euros.' },
    ],
    exercises: [
      { id: 'de-ex-401', type: 'multipleChoice', question: 'What is the German number "Drei"?', options: ['One', 'Two', 'Three', 'Four'], correctIndex: 2, explanation: '"Drei" is the number 3.' },
      { id: 'de-ex-402', type: 'matchPairs', prompt: 'Match German numbers to digits', pairs: [{ left: 'Eins', right: '1' }, { left: 'Zwei', right: '2' }, { left: 'Drei', right: '3' }, { left: 'Fünf', right: '5' }] },
      { id: 'de-ex-403', type: 'typing', prompt: 'Type the German word for number 2', answer: 'Zwei', hint: 'Starts with Zw...', placeholder: 'Zahl...' },
    ],
  },

  // ── CEFR A1 — Food & Dining: Lesson 1 ─────────────────────────────────────
  {
    id: 'de-food-1',
    categoryId: 'food-drink',
    languageId: 'de',
    level: 'A1',
    title: 'At the Café & Bakery (Bäckerei)',
    description: 'Order water, coffee, bakery goods, and ask for the bill.',
    order: 1,
    xpReward: 60,
    vocabulary: [
      { id: 'de-w-024', word: 'Das Wasser', translation: 'Water', pronunciation: 'dahs VAHS-ser', example: 'Ein Glas Wasser, bitte.', exampleTranslation: 'A glass of water, please.' },
      { id: 'de-w-025', word: 'Der Kaffee', translation: 'Coffee', pronunciation: 'dair KAH-fay', example: 'Ich trinke gerne Kaffee.', exampleTranslation: 'I like drinking coffee.' },
      { id: 'de-w-026', word: 'Die Rechnung', translation: 'The bill / check', pronunciation: 'dee REKH-noong', example: 'Die Rechnung, bitte.', exampleTranslation: 'The bill, please.' },
      { id: 'de-w-027', word: 'Lecker', translation: 'Delicious / Tasty', pronunciation: 'LEK-ker', example: 'Das Essen ist sehr lecker!', exampleTranslation: 'The food is very delicious!' },
      { id: 'de-w-028', word: 'Das Brötchen', translation: 'Bread roll', pronunciation: 'dahs BROYT-shen', example: 'Zwei Brötchen, bitte.', exampleTranslation: 'Two bread rolls, please.' },
    ],
    exercises: [
      { id: 'de-ex-501', type: 'multipleChoice', question: 'How do you ask for "The bill, please" in German?', options: ['Der Kaffee, bitte', 'Die Rechnung, bitte', 'Das Wasser, bitte', 'Guten Tag, bitte'], correctIndex: 1, explanation: '"Die Rechnung, bitte" is the customary way to ask for the bill.' },
      { id: 'de-ex-502', type: 'fillBlank', sentence: 'Ein Glas ___, bitte.', answer: 'Wasser', hint: 'German word for water (starts with W)', translation: 'A glass of water, please.' },
      { id: 'de-ex-503', type: 'matchPairs', prompt: 'Match café and dining terms', pairs: [{ left: 'Das Wasser', right: 'Water' }, { left: 'Der Kaffee', right: 'Coffee' }, { left: 'Die Rechnung', right: 'The bill' }, { left: 'Lecker', right: 'Delicious' }] },
    ],
  },

  // ── CEFR A2 — Travel: Lesson 1 ────────────────────────────────────────────
  {
    id: 'de-travel-1',
    categoryId: 'travel',
    languageId: 'de',
    level: 'A2',
    title: 'At the Train Station & Travel (Am Bahnhof)',
    description: 'Travel by ICE train across Germany, buy tickets, and find your platform.',
    order: 1,
    xpReward: 65,
    vocabulary: [
      { id: 'de-w-029', word: 'Der Bahnhof', translation: 'Train station', pronunciation: 'dair BAHN-hohf', example: 'Wo ist der Hauptbahnhof?', exampleTranslation: 'Where is the central station?' },
      { id: 'de-w-030', word: 'Die Fahrkarte', translation: 'Ticket', pronunciation: 'dee FAHR-kar-teh', example: 'Eine Fahrkarte nach München, bitte.', exampleTranslation: 'A ticket to Munich, please.' },
      { id: 'de-w-031', word: 'Das Gleis', translation: 'Platform / Track', pronunciation: 'dahs glyce', example: 'Der Zug fährt von Gleis 4 ab.', exampleTranslation: 'The train departs from platform 4.' },
      { id: 'de-w-032', word: 'Der Flughafen', translation: 'Airport', pronunciation: 'dair FLOOK-hah-fen', example: 'Wie komme ich zum Flughafen?', exampleTranslation: 'How do I get to the airport?' },
      { id: 'de-w-033', word: 'Das Hotel', translation: 'Hotel', pronunciation: 'dahs hoh-TEHL', example: 'Ich habe ein Zimmer im Hotel.', exampleTranslation: 'I have a room at the hotel.' },
    ],
    exercises: [
      { id: 'de-ex-601', type: 'multipleChoice', question: 'What does "Der Bahnhof" mean?', options: ['Airport', 'Train station', 'Hotel', 'Ticket'], correctIndex: 1, explanation: '"Der Bahnhof" is the train station.' },
      { id: 'de-ex-602', type: 'fillBlank', sentence: 'Wo ist der Haupt___?', answer: 'bahnhof', hint: 'Main station', translation: 'Where is the central station?' },
      { id: 'de-ex-603', type: 'matchPairs', prompt: 'Match travel words', pairs: [{ left: 'Der Bahnhof', right: 'Train station' }, { left: 'Die Fahrkarte', right: 'Ticket' }, { left: 'Das Gleis', right: 'Platform' }, { left: 'Der Flughafen', right: 'Airport' }] },
    ],
  },

  // ── CEFR A2 — Travel: Lesson 2 ────────────────────────────────────────────
  {
    id: 'de-travel-2',
    categoryId: 'travel',
    languageId: 'de',
    level: 'A2',
    title: 'Directions in the City (Wegbeschreibung)',
    description: 'Find your way around German cities with links, rechts, and geradeaus.',
    order: 2,
    xpReward: 65,
    vocabulary: [
      { id: 'de-w-034', word: 'Wo ist...?', translation: 'Where is...?', pronunciation: 'voh ist', example: 'Entschuldigung, wo ist die Apotheke?', exampleTranslation: 'Excuse me, where is the pharmacy?' },
      { id: 'de-w-035', word: 'Links', translation: 'Left', pronunciation: 'links', example: 'Biegen Sie links ab.', exampleTranslation: 'Turn left.' },
      { id: 'de-w-036', word: 'Rechts', translation: 'Right', pronunciation: 'rekhts', example: 'Das Museum ist auf der rechten Seite.', exampleTranslation: 'The museum is on the right side.' },
      { id: 'de-w-037', word: 'Geradeaus', translation: 'Straight ahead', pronunciation: 'geh-rah-deh-OWS', example: 'Gehen Sie immer geradeaus.', exampleTranslation: 'Go straight ahead.' },
      { id: 'de-w-038', word: 'In der Nähe / Weit', translation: 'Nearby / Far', pronunciation: 'in dair NAY-eh / vyte', example: 'Es ist ganz in der Nähe.', exampleTranslation: 'It is very close nearby.' },
    ],
    exercises: [
      { id: 'de-ex-701', type: 'multipleChoice', question: 'What is the German word for "Straight ahead"?', options: ['Links', 'Rechts', 'Geradeaus', 'Weit'], correctIndex: 2, explanation: '"Geradeaus" means straight ahead.' },
      { id: 'de-ex-702', type: 'fillBlank', sentence: 'Biegen Sie ___ ab.', answer: 'links', hint: 'Opposite of right', translation: 'Turn left.' },
      { id: 'de-ex-703', type: 'matchPairs', prompt: 'Match directions in German', pairs: [{ left: 'Links', right: 'Left' }, { left: 'Rechts', right: 'Right' }, { left: 'Geradeaus', right: 'Straight ahead' }, { left: 'In der Nähe', right: 'Nearby' }] },
    ],
  },

  // ── CEFR A2 — Family: Lesson 1 ────────────────────────────────────────────
  {
    id: 'de-family-1',
    categoryId: 'family',
    languageId: 'de',
    level: 'A2',
    title: 'Family Members (Die Familie)',
    description: 'Talk about family members, parents, siblings, and relatives.',
    order: 1,
    xpReward: 65,
    vocabulary: [
      { id: 'de-w-039', word: 'Die Familie', translation: 'Family', pronunciation: 'dee fah-MEE-lyeh', example: 'Meine Familie lebt in Berlin.', exampleTranslation: 'My family lives in Berlin.' },
      { id: 'de-w-040', word: 'Der Vater / Die Mutter', translation: 'Father / Mother', pronunciation: 'FAH-ter / MOOT-ter', example: 'Mein Vater ist Ingenieur.', exampleTranslation: 'My father is an engineer.' },
      { id: 'de-w-041', word: 'Der Bruder / Die Schwester', translation: 'Brother / Sister', pronunciation: 'BROO-der / SHVES-ter', example: 'Ich habe einen Bruder.', exampleTranslation: 'I have a brother.' },
      { id: 'de-w-042', word: 'Der Sohn / Die Tochter', translation: 'Son / Daughter', pronunciation: 'zohn / TOKH-ter', example: 'Ihre Tochter geht zur Schule.', exampleTranslation: 'Their daughter goes to school.' },
      { id: 'de-w-043', word: 'Die Großeltern', translation: 'Grandparents', pronunciation: 'GROHS-el-tern', example: 'Meine Großeltern sind sehr nett.', exampleTranslation: 'My grandparents are very nice.' },
    ],
    exercises: [
      { id: 'de-ex-801', type: 'multipleChoice', question: 'What does "Die Schwester" mean?', options: ['Mother', 'Sister', 'Daughter', 'Grandmother'], correctIndex: 1, explanation: '"Die Schwester" is sister.' },
      { id: 'de-ex-802', type: 'fillBlank', sentence: 'Meine ___ lebt in Berlin.', answer: 'Familie', hint: 'Family', translation: 'My family lives in Berlin.' },
      { id: 'de-ex-803', type: 'matchPairs', prompt: 'Match German family terms', pairs: [{ left: 'Der Vater', right: 'Father' }, { left: 'Die Mutter', right: 'Mother' }, { left: 'Der Bruder', right: 'Brother' }, { left: 'Die Schwester', right: 'Sister' }] },
    ],
  },

  // ── CEFR B1 — Work & Career: Lesson 1 ─────────────────────────────────────
  {
    id: 'de-work-1',
    categoryId: 'work-career',
    languageId: 'de',
    level: 'B1',
    title: 'At the Workplace & Careers (Im Beruf)',
    description: 'Master German office communication, team meetings, deadlines, and interviews.',
    order: 1,
    xpReward: 70,
    vocabulary: [
      { id: 'de-w-044', word: 'Die Besprechung', translation: 'Meeting', pronunciation: 'dee beh-SHPREKH-oong', example: 'Wir haben um zehn Uhr eine Teambesprechung.', exampleTranslation: 'We have a team meeting at ten o\'clock.' },
      { id: 'de-w-045', word: 'Der Kollege', translation: 'Colleague / Coworker', pronunciation: 'dair kol-LAY-geh', example: 'Meine Kollegen sind sehr hilfsbereit.', exampleTranslation: 'My colleagues are very helpful.' },
      { id: 'de-w-046', word: 'Das Projekt', translation: 'Project', pronunciation: 'dahs proh-YEHKT', example: 'Das neue Projekt läuft sehr gut.', exampleTranslation: 'The new project is going very well.' },
      { id: 'de-w-047', word: 'Die Frist', translation: 'Deadline', pronunciation: 'dee frisht', example: 'Die Frist endet am Freitag.', exampleTranslation: 'The deadline ends on Friday.' },
      { id: 'de-w-048', word: 'Das Vorstellungsgespräch', translation: 'Job interview', pronunciation: 'dahs FOHR-shte-loongs-geh-shpraykh', example: 'Ich habe morgen ein Vorstellungsgespräch.', exampleTranslation: 'I have a job interview tomorrow.' },
    ],
    exercises: [
      { id: 'de-ex-901', type: 'multipleChoice', question: 'How do you say "Job interview" in German?', options: ['Die Besprechung', 'Das Vorstellungsgespräch', 'Der Kollege', 'Die Frist'], correctIndex: 1, explanation: '"Das Vorstellungsgespräch" is the German term for a job interview.' },
      { id: 'de-ex-902', type: 'fillBlank', sentence: 'Wir haben heute eine wichtige ___.', answer: 'Besprechung', hint: 'Meeting in German', translation: 'We have an important meeting today.' },
      { id: 'de-ex-903', type: 'matchPairs', prompt: 'Match workplace vocabulary', pairs: [{ left: 'Die Besprechung', right: 'Meeting' }, { left: 'Der Kollege', right: 'Colleague' }, { left: 'Das Projekt', right: 'Project' }, { left: 'Die Frist', right: 'Deadline' }] },
      { id: 'de-ex-904', type: 'typing', prompt: 'Type "Project" in German', answer: 'Das Projekt', hint: 'Starts with Das Pro...', placeholder: 'Tippe hier...' },
    ],
  },

  // ── CEFR B1 — Opinions & Culture: Lesson 1 ────────────────────────────────
  {
    id: 'de-opinions-1',
    categoryId: 'opinions-culture',
    languageId: 'de',
    level: 'B1',
    title: 'Expressing Opinions (Meinungen äußern)',
    description: 'Articulate thoughtful viewpoints, agreement, disagreement, and arguments.',
    order: 1,
    xpReward: 70,
    vocabulary: [
      { id: 'de-w-049', word: 'Meiner Meinung nach', translation: 'In my opinion', pronunciation: 'MY-ner MY-noong nahkh', example: 'Meiner Meinung nach ist das die beste Idee.', exampleTranslation: 'In my opinion that is the best idea.' },
      { id: 'de-w-050', word: 'Ich stimme zu', translation: 'I agree', pronunciation: 'ikh SHTIM-meh tsoo', example: 'Da stimme ich dir vollkommen zu.', exampleTranslation: 'I completely agree with you on that.' },
      { id: 'de-w-051', word: 'Ich denke, dass', translation: 'I think that', pronunciation: 'ikh DENG-keh dahs', example: 'Ich denke, dass wir das schaffen können.', exampleTranslation: 'I think that we can manage it.' },
      { id: 'de-w-052', word: 'Allerdings', translation: 'However / Indeed', pronunciation: 'ahl-ler-DINGS', example: 'Das ist wahr, allerdings nicht einfach.', exampleTranslation: 'That is true, however not easy.' },
      { id: 'de-w-053', word: 'Selbstverständlich', translation: 'Of course / Naturally', pronunciation: 'ZELPST-fair-shtehnt-likh', example: 'Selbstverständlich helfe ich dir gern.', exampleTranslation: 'Of course I am glad to help you.' },
    ],
    exercises: [
      { id: 'de-ex-1001', type: 'multipleChoice', question: 'What does "Meiner Meinung nach" mean?', options: ['In my opinion', 'I disagree', 'Of course', 'However'], correctIndex: 0, explanation: '"Meiner Meinung nach" means "In my opinion".' },
      { id: 'de-ex-1002', type: 'fillBlank', sentence: 'Da stimme ich dir voll und ganz ___.', answer: 'zu', hint: 'Separable verb prefix (zustimmen)', translation: 'I completely agree with you on that.' },
      { id: 'de-ex-1003', type: 'matchPairs', prompt: 'Match opinion phrases', pairs: [{ left: 'Meiner Meinung nach', right: 'In my opinion' }, { left: 'Ich stimme zu', right: 'I agree' }, { left: 'Allerdings', right: 'However' }, { left: 'Selbstverständlich', right: 'Of course' }] },
      { id: 'de-ex-1004', type: 'typing', prompt: 'Type "I agree" in German', answer: 'Ich stimme zu', hint: 'Three words: I__ s_____ z_', placeholder: 'Tippe hier...' },
    ],
  },
];

export default germanLessons;
