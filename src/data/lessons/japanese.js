/**
 * @file japanese.js
 * @description Comprehensive Japanese curriculum aligned to JLPT Levels (N5 Beginner & N4 Elementary).
 */

export const japaneseLessons = [
  // ── JLPT N5 — Basics: Lesson 1 ────────────────────────────────────────────
  {
    id: 'ja-basics-1',
    categoryId: 'basics',
    languageId: 'ja',
    level: 'N5',
    title: 'Hello, Greetings & Respect',
    description: 'Learn everyday Japanese greetings and natural conversational welcomes.',
    order: 1,
    xpReward: 50,
    vocabulary: [
      { id: 'ja-w-001', word: 'こんにちは', translation: 'Hello / Good afternoon', pronunciation: 'Konnichiwa', example: '皆さん、こんにちは！', exampleTranslation: 'Hello everyone!' },
      { id: 'ja-w-002', word: 'おはようございます', translation: 'Good morning (polite)', pronunciation: 'Ohayou gozaimasu', example: '先生、おはようございます。', exampleTranslation: 'Good morning, teacher.' },
      { id: 'ja-w-003', word: 'こんばんは', translation: 'Good evening', pronunciation: 'Konbanwa', example: 'こんばんは、田中さん。', exampleTranslation: 'Good evening, Mr. Tanaka.' },
      { id: 'ja-w-004', word: 'さようなら', translation: 'Goodbye', pronunciation: 'Sayounara', example: '皆さん、さようなら。', exampleTranslation: 'Goodbye, everyone.' },
      { id: 'ja-w-005', word: 'またね', translation: 'See you later (casual)', pronunciation: 'Mata ne', example: 'じゃあ、またね！', exampleTranslation: 'Well then, see you later!' },
      { id: 'ja-w-006', word: 'おやすみなさい', translation: 'Good night', pronunciation: 'Oyasuminasai', example: 'おやすみなさい、いい夢を。', exampleTranslation: 'Good night, sweet dreams.' },
    ],
    exercises: [
      { id: 'ja-ex-101', type: 'flashcard', wordId: 'ja-w-001', word: 'こんにちは', translation: 'Hello / Good afternoon', pronunciation: 'Konnichiwa', example: '皆さん、こんにちは！', exampleTranslation: 'Hello everyone!' },
      { id: 'ja-ex-102', type: 'multipleChoice', question: 'What does "おはようございます" (Ohayou gozaimasu) mean?', options: ['Good evening', 'Good morning', 'Goodbye', 'Thank you'], correctIndex: 1, explanation: '"Ohayou gozaimasu" is the polite greeting used in the morning.' },
      { id: 'ja-ex-103', type: 'fillBlank', sentence: '先生、___ ございます。', answer: 'おはよう', hint: 'First half of good morning (Ohayou)', translation: 'Good morning, teacher.' },
      { id: 'ja-ex-104', type: 'matchPairs', prompt: 'Match Japanese greetings with English equivalents', pairs: [{ left: 'こんにちは', right: 'Hello' }, { left: 'さようなら', right: 'Goodbye' }, { left: 'こんばんは', right: 'Good evening' }, { left: 'またね', right: 'See you later' }] },
      { id: 'ja-ex-105', type: 'typing', prompt: 'Type the romaji for "さようなら" (Goodbye)', answer: 'sayounara', hint: 'sa-you-na-ra', placeholder: 'Romaji input...' },
      { id: 'ja-ex-106', type: 'writing', character: 'あ', prompt: 'Practice drawing Hiragana character "あ" (a)', translation: 'Sound "a" as in father', gridType: 'rice' },
    ],
  },

  // ── JLPT N5 — Basics: Lesson 2 ────────────────────────────────────────────
  {
    id: 'ja-basics-2',
    categoryId: 'basics',
    languageId: 'ja',
    level: 'N5',
    title: 'Thank You, Excuse Me & Courtesy',
    description: 'Crucial polite Japanese phrases for expressing gratitude and apology.',
    order: 2,
    xpReward: 50,
    vocabulary: [
      { id: 'ja-w-007', word: 'ありがとう', translation: 'Thank you (casual)', pronunciation: 'Arigatou', example: '手伝ってくれてありがとう。', exampleTranslation: 'Thank you for helping me.' },
      { id: 'ja-w-008', word: 'ありがとうございます', translation: 'Thank you very much (polite)', pronunciation: 'Arigatou gozaimasu', example: 'どうもありがとうございます。', exampleTranslation: 'Thank you very much.' },
      { id: 'ja-w-009', word: 'すみません', translation: 'Excuse me / Sorry', pronunciation: 'Sumimasen', example: 'すみません、駅はどこですか？', exampleTranslation: 'Excuse me, where is the station?' },
      { id: 'ja-w-010', word: 'はい / いいえ', translation: 'Yes / No', pronunciation: 'Hai / Iie', example: 'はい、そうです。', exampleTranslation: 'Yes, that is right.' },
      { id: 'ja-w-011', word: 'お願いします', translation: 'Please', pronunciation: 'Onegaishimasu', example: 'これをお願いします。', exampleTranslation: 'This one, please.' },
    ],
    exercises: [
      { id: 'ja-ex-201', type: 'multipleChoice', question: 'Which word means "Excuse me" or "Sorry" in Japanese?', options: ['こんにちは', 'すみません', 'はい', 'ありがとう'], correctIndex: 1, explanation: '"Sumimasen" is the versatile phrase used to get attention or apologize.' },
      { id: 'ja-ex-202', type: 'fillBlank', sentence: 'これをお___します。', answer: '願い', hint: 'Onegai (request/wish)', translation: 'This one, please.' },
      { id: 'ja-ex-203', type: 'matchPairs', prompt: 'Match courtesy expressions', pairs: [{ left: 'ありがとう', right: 'Thank you' }, { left: 'すみません', right: 'Excuse me' }, { left: 'はい', right: 'Yes' }, { left: 'いいえ', right: 'No' }] },
      { id: 'ja-ex-204', type: 'typing', prompt: 'Type the romaji for "はい" (Yes)', answer: 'hai', hint: 'Three letters starting with h', placeholder: 'hai...' },
    ],
  },

  // ── JLPT N5 — Greetings: Lesson 1 ─────────────────────────────────────────
  {
    id: 'ja-greetings-1',
    categoryId: 'greetings',
    languageId: 'ja',
    level: 'N5',
    title: 'Self Introductions (自己紹介)',
    description: 'Introduce yourself politely with Hajimemashite and Yoroshiku.',
    order: 1,
    xpReward: 55,
    vocabulary: [
      { id: 'ja-w-012', word: 'はじめまして', translation: 'Nice to meet you (first time)', pronunciation: 'Hajimemashite', example: 'はじめまして、ケンです。', exampleTranslation: 'Nice to meet you, I am Ken.' },
      { id: 'ja-w-013', word: 'よろしくお願いします', translation: 'Pleased to meet you / treat me well', pronunciation: 'Yoroshiku onegaishimasu', example: 'どうぞよろしくお願いします。', exampleTranslation: 'Pleased to meet you.' },
      { id: 'ja-w-014', word: '私の名前は', translation: 'My name is...', pronunciation: 'Watashi no namae wa', example: '私の名前はエミです。', exampleTranslation: 'My name is Emi.' },
      { id: 'ja-w-015', word: '元気ですか？', translation: 'How are you?', pronunciation: 'Genki desu ka?', example: 'お元気ですか？', exampleTranslation: 'How are you doing?' },
    ],
    exercises: [
      { id: 'ja-ex-301', type: 'multipleChoice', question: 'When do you say "はじめまして" (Hajimemashite)?', options: ['When saying goodbye', 'When meeting someone for the first time', 'Before eating', 'When going to bed'], correctIndex: 1, explanation: '"Hajimemashite" comes from the verb "hajimeru" (to begin) and is said when meeting someone for the first time.' },
      { id: 'ja-ex-302', type: 'matchPairs', prompt: 'Match introduction terms', pairs: [{ left: 'はじめまして', right: 'Nice to meet you' }, { left: '私の名前は', right: 'My name is' }, { left: '元気ですか？', right: 'How are you?' }, { left: 'はい', right: 'Yes' }] },
    ],
  },

  // ── JLPT N5 — Numbers: Lesson 1 ───────────────────────────────────────────
  {
    id: 'ja-numbers-1',
    categoryId: 'numbers',
    languageId: 'ja',
    level: 'N5',
    title: 'Numbers 1 to 10 (一 〜 十)',
    description: 'Learn kanji and readings for numbers 1 to 10.',
    order: 1,
    xpReward: 50,
    vocabulary: [
      { id: 'ja-w-016', word: '一 (いち)', translation: 'One (1)', pronunciation: 'Ichi', example: '一匹の猫。', exampleTranslation: 'One cat.' },
      { id: 'ja-w-017', word: '二 (に)', translation: 'Two (2)', pronunciation: 'Ni', example: '二つのリンゴ。', exampleTranslation: 'Two apples.' },
      { id: 'ja-w-018', word: '三 (さん)', translation: 'Three (3)', pronunciation: 'San', example: '三人の友達。', exampleTranslation: 'Three friends.' },
      { id: 'ja-w-019', word: '四 (よん / し)', translation: 'Four (4)', pronunciation: 'Yon / Shi', example: '四時です。', exampleTranslation: "It's 4 o'clock." },
      { id: 'ja-w-020', word: '五 (ご)', translation: 'Five (5)', pronunciation: 'Go', example: '五分待ってください。', exampleTranslation: 'Please wait 5 minutes.' },
      { id: 'ja-w-021', word: '十 (じゅう)', translation: 'Ten (10)', pronunciation: 'Juu', example: '十円。', exampleTranslation: '10 yen.' },
    ],
    exercises: [
      { id: 'ja-ex-401', type: 'multipleChoice', question: 'What is the reading for kanji 三 ?', options: ['Ichi', 'Ni', 'San', 'Yon'], correctIndex: 2, explanation: '三 is read as "San" (Three).' },
      { id: 'ja-ex-402', type: 'matchPairs', prompt: 'Match Kanji to numbers', pairs: [{ left: '一', right: '1' }, { left: '二', right: '2' }, { left: '三', right: '3' }, { left: '五', right: '5' }] },
      { id: 'ja-ex-403', type: 'typing', prompt: 'Type the romaji for kanji 一 (1)', answer: 'ichi', hint: 'i-chi', placeholder: 'ichi...' },
    ],
  },

  // ── JLPT N5 — Food & Dining: Lesson 1 ─────────────────────────────────────
  {
    id: 'ja-food-1',
    categoryId: 'food-drink',
    languageId: 'ja',
    level: 'N5',
    title: 'At the Restaurant & Izakaya (飲食店)',
    description: 'Order water, food, express deliciousness, and pay the check in Japanese.',
    order: 1,
    xpReward: 60,
    vocabulary: [
      { id: 'ja-w-022', word: 'お水 (おみず)', translation: 'Water', pronunciation: 'O-mizu', example: 'お水をください。', exampleTranslation: 'Water, please.' },
      { id: 'ja-w-023', word: 'お茶 (おちゃ)', translation: 'Green tea', pronunciation: 'O-cha', example: '温かいお茶をお願いします。', exampleTranslation: 'Hot green tea, please.' },
      { id: 'ja-w-024', word: '美味しい (おいしい)', translation: 'Delicious / Tasty', pronunciation: 'Oishii', example: 'このラーメンはとても美味しいです！', exampleTranslation: 'This ramen is very delicious!' },
      { id: 'ja-w-025', word: 'いただきます', translation: 'Thank you for the meal (before eating)', pronunciation: 'Itadakimasu', example: '手を合わせて、いただきます！', exampleTranslation: 'Put hands together: Itadakimasu!' },
      { id: 'ja-w-026', word: 'お会計 (おかいけい)', translation: 'The bill / check', pronunciation: 'O-kaikei', example: 'お会計をお願いします。', exampleTranslation: 'The bill, please.' },
    ],
    exercises: [
      { id: 'ja-ex-501', type: 'multipleChoice', question: 'What do you say before starting to eat in Japan?', options: ['ごちそうさまでした', 'いただきます', 'さようなら', 'お会計'], correctIndex: 1, explanation: '"Itadakimasu" expresses gratitude to the ingredients, chef, and nature before eating.' },
      { id: 'ja-ex-502', type: 'fillBlank', sentence: 'お___をお願いします。', answer: '会計', hint: 'The word for bill/check (kaikei)', translation: 'The bill, please.' },
      { id: 'ja-ex-503', type: 'matchPairs', prompt: 'Match restaurant terms', pairs: [{ left: 'お水', right: 'Water' }, { left: 'お茶', right: 'Green tea' }, { left: '美味しい', right: 'Delicious' }, { left: 'お会計', right: 'The bill' }] },
      { id: 'ja-ex-504', type: 'typing', prompt: 'Type romaji for "美味しい" (Delicious)', answer: 'oishii', hint: 'oi-shii', placeholder: 'oishii...' },
    ],
  },

  // ── JLPT N4 — Travel: Lesson 1 ────────────────────────────────────────────
  {
    id: 'ja-travel-1',
    categoryId: 'travel',
    languageId: 'ja',
    level: 'N4',
    title: 'Trains & Stations (駅と新幹線)',
    description: 'Navigate train stations, bullet trains (Shinkansen), and buy tickets.',
    order: 1,
    xpReward: 65,
    vocabulary: [
      { id: 'ja-w-027', word: '駅 (えき)', translation: 'Station', pronunciation: 'Eki', example: '東京駅はどこですか？', exampleTranslation: 'Where is Tokyo Station?' },
      { id: 'ja-w-028', word: '切符 (きっぷ)', translation: 'Ticket', pronunciation: 'Kippu', example: '京都までの切符を一枚ください。', exampleTranslation: 'One ticket to Kyoto, please.' },
      { id: 'ja-w-029', word: '新幹線 (しんかんせん)', translation: 'Bullet train (Shinkansen)', pronunciation: 'Shinkansen', example: '新幹線で大阪へ行きます。', exampleTranslation: 'I will go to Osaka by bullet train.' },
      { id: 'ja-w-030', word: 'ホテル', translation: 'Hotel', pronunciation: 'Hoteru', example: 'ホテルのチェックインは何時ですか？', exampleTranslation: 'What time is hotel check-in?' },
      { id: 'ja-w-031', word: '空港 (くうこう)', translation: 'Airport', pronunciation: 'Kuukou', example: '成田空港行きの電車。', exampleTranslation: 'Train bound for Narita Airport.' },
    ],
    exercises: [
      { id: 'ja-ex-601', type: 'multipleChoice', question: 'What is the Japanese word for "Train Station"?', options: ['ホテル', '空港', '駅 (えき)', '切符'], correctIndex: 2, explanation: '駅 (Eki) means train station.' },
      { id: 'ja-ex-602', type: 'fillBlank', sentence: '東京___はどこですか？', answer: '駅', hint: 'Station kanji', translation: 'Where is Tokyo Station?' },
      { id: 'ja-ex-603', type: 'matchPairs', prompt: 'Match travel terms', pairs: [{ left: '駅', right: 'Station' }, { left: '切符', right: 'Ticket' }, { left: '空港', right: 'Airport' }, { left: '新幹線', right: 'Bullet train' }] },
    ],
  },

  // ── JLPT N4 — Travel: Lesson 2 ────────────────────────────────────────────
  {
    id: 'ja-travel-2',
    categoryId: 'travel',
    languageId: 'ja',
    level: 'N4',
    title: 'Asking Directions (道案内)',
    description: 'Ask for directions and understand left, right, straight, and distance.',
    order: 2,
    xpReward: 65,
    vocabulary: [
      { id: 'ja-w-032', word: 'どこですか？', translation: 'Where is it?', pronunciation: 'Doko desu ka?', example: 'トイレはどこですか？', exampleTranslation: 'Where is the restroom?' },
      { id: 'ja-w-033', word: '右 (みぎ)', translation: 'Right', pronunciation: 'Migi', example: '右に曲がってください。', exampleTranslation: 'Please turn right.' },
      { id: 'ja-w-034', word: '左 (ひだり)', translation: 'Left', pronunciation: 'Hidari', example: '左側にコンビニがあります。', exampleTranslation: 'There is a convenience store on the left.' },
      { id: 'ja-w-035', word: 'まっすぐ', translation: 'Straight ahead', pronunciation: 'Massugu', example: 'この道をまっすぐ行ってください。', exampleTranslation: 'Please go straight along this street.' },
      { id: 'ja-w-036', word: '近い / 遠い', translation: 'Near / Far', pronunciation: 'Chikai / Tooi', example: '歩いて五分、とても近いです。', exampleTranslation: 'A 5-minute walk, it is very close.' },
    ],
    exercises: [
      { id: 'ja-ex-701', type: 'multipleChoice', question: 'What does "右 (みぎ)" mean?', options: ['Left', 'Right', 'Straight', 'Near'], correctIndex: 1, explanation: '右 (Migi) is Right.' },
      { id: 'ja-ex-702', type: 'fillBlank', sentence: 'トイレは___ですか？', answer: 'どこ', hint: 'Question word for "Where"', translation: 'Where is the restroom?' },
      { id: 'ja-ex-703', type: 'matchPairs', prompt: 'Match direction words', pairs: [{ left: '右', right: 'Right' }, { left: '左', right: 'Left' }, { left: 'まっすぐ', right: 'Straight ahead' }, { left: 'どこですか？', right: 'Where is it?' }] },
    ],
  },

  // ── JLPT N4 — Family: Lesson 1 ────────────────────────────────────────────
  {
    id: 'ja-family-1',
    categoryId: 'family',
    languageId: 'ja',
    level: 'N4',
    title: 'Family Members (家族)',
    description: 'Learn terms for talking about your family and other people\'s families.',
    order: 1,
    xpReward: 65,
    vocabulary: [
      { id: 'ja-w-037', word: '家族 (かぞく)', translation: 'Family', pronunciation: 'Kazoku', example: '私の家族は四人です。', exampleTranslation: 'My family has four people.' },
      { id: 'ja-w-038', word: '父 / 母 (ちち / はは)', translation: 'Father / Mother (my)', pronunciation: 'Chichi / Haha', example: '母は料理が上手です。', exampleTranslation: 'My mother is good at cooking.' },
      { id: 'ja-w-039', word: '兄 / 姉 (あに / あね)', translation: 'Older brother / Older sister', pronunciation: 'Ani / Ane', example: '兄は東京に住んでいます。', exampleTranslation: 'My older brother lives in Tokyo.' },
      { id: 'ja-w-040', word: '弟 / 妹 (おとうと / いもうと)', translation: 'Younger brother / Younger sister', pronunciation: 'Otouto / Imouto', example: '妹は高校生です。', exampleTranslation: 'My younger sister is a high school student.' },
      { id: 'ja-w-041', word: '友達 (ともだち)', translation: 'Friend', pronunciation: 'Tomodachi', example: '友達と一緒に勉強します。', exampleTranslation: 'I study together with my friend.' },
    ],
    exercises: [
      { id: 'ja-ex-801', type: 'multipleChoice', question: 'How do you refer to your own mother in Japanese?', options: ['お母さん (okaasan)', '母 (haha)', '姉 (ane)', '妹 (imouto)'], correctIndex: 1, explanation: 'In Japanese humble speech, you refer to your own mother as 母 (Haha) when speaking to others.' },
      { id: 'ja-ex-802', type: 'matchPairs', prompt: 'Match family vocabulary', pairs: [{ left: '家族', right: 'Family' }, { left: '友達', right: 'Friend' }, { left: '父', right: 'Father' }, { left: '母', right: 'Mother' }] },
      { id: 'ja-ex-803', type: 'typing', prompt: 'Type romaji for "友達" (Friend)', answer: 'tomodachi', hint: 'to-mo-da-chi', placeholder: 'tomodachi...' },
    ],
  },

  // ── JLPT N3 — Work & Office Life: Lesson 1 ────────────────────────────────
  {
    id: 'ja-work-1',
    categoryId: 'work-career',
    languageId: 'ja',
    level: 'N3',
    title: 'Workplace & Office Life (職場とビジネス)',
    description: 'Master practical office Japanese, meetings, deadlines, and polite workplace etiquette.',
    order: 1,
    xpReward: 70,
    vocabulary: [
      { id: 'ja-w-042', word: '会議 (かいぎ)', translation: 'Meeting / Conference', pronunciation: 'Kaigi', example: '午後二時から会議があります。', exampleTranslation: 'There is a meeting from 2:00 PM.' },
      { id: 'ja-w-043', word: '同僚 (どうりょう)', translation: 'Colleague / Coworker', pronunciation: 'Douryou', example: '会社の同僚とランチを食べました。', exampleTranslation: 'I had lunch with my coworker.' },
      { id: 'ja-w-044', word: '締切 (しめきり)', translation: 'Deadline', pronunciation: 'Shimekiri', example: 'レポートの締切は明日です。', exampleTranslation: 'The report deadline is tomorrow.' },
      { id: 'ja-w-045', word: 'お疲れ様です', translation: 'Thank you for your hard work (standard office greeting)', pronunciation: 'Otsukaresama desu', example: '皆さん、今日もお疲れ様でした！', exampleTranslation: 'Everyone, thank you for your hard work today!' },
      { id: 'ja-w-046', word: '書類 (しょるい)', translation: 'Document / Papers', pronunciation: 'Shorui', example: 'この書類を確認してください。', exampleTranslation: 'Please review this document.' },
    ],
    exercises: [
      { id: 'ja-ex-901', type: 'multipleChoice', question: 'What is the indispensable daily phrase said to coworkers in a Japanese office?', options: ['さようなら', 'お疲れ様です', 'いらっしゃいませ', '初めまして'], correctIndex: 1, explanation: '"お疲れ様です (Otsukaresama desu)" is the essential greeting expressing mutual appreciation for hard work.' },
      { id: 'ja-ex-902', type: 'fillBlank', sentence: '午後から大切な___があります。', answer: '会議', hint: 'Kanji for meeting (kaigi)', translation: 'There is an important meeting this afternoon.' },
      { id: 'ja-ex-903', type: 'matchPairs', prompt: 'Match business Japanese terms', pairs: [{ left: '会議', right: 'Meeting' }, { left: '同僚', right: 'Colleague' }, { left: '締切', right: 'Deadline' }, { left: '書類', right: 'Document' }] },
      { id: 'ja-ex-904', type: 'typing', prompt: 'Type romaji for "締切" (Deadline)', answer: 'shimekiri', hint: 'shi-me-ki-ri', placeholder: 'shimekiri...' },
    ],
  },

  // ── JLPT N3 — Opinions & Nuances: Lesson 1 ────────────────────────────────
  {
    id: 'ja-opinions-1',
    categoryId: 'opinions-culture',
    languageId: 'ja',
    level: 'N3',
    title: 'Expressing Thoughts & Nuances (意見と気持ち)',
    description: 'Express personal viewpoints, polite disagreement, and natural conversational nuance.',
    order: 1,
    xpReward: 70,
    vocabulary: [
      { id: 'ja-w-047', word: '〜と思います', translation: 'I think that...', pronunciation: '~ to omoimasu', example: 'それは良いアイディアだと思います。', exampleTranslation: 'I think that is a good idea.' },
      { id: 'ja-w-048', word: '確かに (たしかに)', translation: 'Indeed / Certainly', pronunciation: 'Tashika ni', example: '確かに、おっしゃる通りです。', exampleTranslation: 'Indeed, it is as you say.' },
      { id: 'ja-w-049', word: '例えば (たとえば)', translation: 'For example', pronunciation: 'Tatoeba', example: '例えば、京都や奈良などです。', exampleTranslation: 'For example, Kyoto and Nara.' },
      { id: 'ja-w-050', word: '実は (じつは)', translation: 'Actually / To tell the truth', pronunciation: 'Jitsu wa', example: '実は、私もそう思っていました。', exampleTranslation: 'Actually, I was thinking so too.' },
      { id: 'ja-w-051', word: '賛成 / 反対', translation: 'Agreement / Opposition', pronunciation: 'Sansei / Hantai', example: 'その計画に賛成です。', exampleTranslation: 'I agree with that plan.' },
    ],
    exercises: [
      { id: 'ja-ex-1001', type: 'multipleChoice', question: 'How do you say "For example" in Japanese?', options: ['確かに', '例えば', '実は', '反対'], correctIndex: 1, explanation: '例えば (Tatoeba) means "For example".' },
      { id: 'ja-ex-1002', type: 'fillBlank', sentence: 'それは素晴らしいと___。', answer: '思います', hint: 'Omoimasu (I think)', translation: 'I think that is wonderful.' },
      { id: 'ja-ex-1003', type: 'matchPairs', prompt: 'Match discourse phrases', pairs: [{ left: '確かに', right: 'Indeed / Certainly' }, { left: '例えば', right: 'For example' }, { left: '実は', right: 'Actually' }, { left: '賛成', right: 'Agreement' }] },
      { id: 'ja-ex-1004', type: 'typing', prompt: 'Type romaji for "実は" (Actually)', answer: 'jitsu wa', hint: 'ji-tsu wa', placeholder: 'jitsu wa...' },
    ],
  },
];

export default japaneseLessons;
