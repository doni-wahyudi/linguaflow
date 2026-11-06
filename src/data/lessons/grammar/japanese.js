/**
 * @file japanese.js
 * @description Authentic, pedagogically structured grammar micro-guides for Japanese curriculum (JLPT N5–N3).
 */

export const japaneseGrammar = {
  'ja-basics-1': {
    id: 'ja-grammar-basics-1',
    title: 'Topic Particle は (wa) & Copula です (desu)',
    subtitle: 'Foundations of Japanese Sentence Structure',
    readTimeMinutes: 1,
    concept: 'In Japanese, the particle は (written "ha", pronounced "wa") marks the topic of the sentence ("as for X..."). The polite copula です (desu) stands at the end of the sentence to state what something is politely.',
    rules: [
      {
        rule: 'Topic Marking with Particle は (wa)',
        pattern: '[Topic/Noun] は + [Description/Predicate]',
        example: '私は田中です。 (Watashi wa Tanaka desu.)',
        translation: 'As for me, I am Tanaka.',
      },
      {
        rule: 'Polite Equational Predicate with です (desu)',
        pattern: '[Noun A] は [Noun B] です',
        example: '今日はいい天気です。 (Kyou wa ii tenki desu.)',
        translation: 'Today is fine weather.',
      },
      {
        rule: 'Pronunciation of Particle は as "wa"',
        pattern: 'Written as は (ha), pronounced as "wa" when acting as particle',
        example: 'こんにちは (Konnichiwa) / これは本です (Kore wa hon desu)',
        translation: 'Hello / This is a book',
      },
    ],
    tip: 'Never say "desu" before the particle "wa"! In Japanese, the copula "desu" stands proudly at the very end of the polite sentence.',
  },

  'ja-basics-2': {
    id: 'ja-grammar-basics-2',
    title: 'Questions with か (ka) & Polite Negation',
    subtitle: 'Asking Questions and Making Polite Denials',
    readTimeMinutes: 1,
    concept: 'To turn any Japanese statement into a polite question, simply add the question particle か (ka) to the end—no word order inversion required! For polite negation of です, use じゃありません (casual-polite) or ではありません (formal).',
    rules: [
      {
        rule: 'Question Formation with Final Particle か',
        pattern: '[Sentence] です + か？',
        example: '田中さんは学生ですか？ (Tanaka-san wa gakusei desu ka?)',
        translation: 'Is Mr. Tanaka a student?',
      },
      {
        rule: 'Polite Negative Copula (じゃありません / ではありません)',
        pattern: '[Noun] + じゃありません (spoken) / ではありません (written/formal)',
        example: 'いいえ、学生じゃありません。 (Iie, gakusei ja arimasen.)',
        translation: 'No, I am not a student.',
      },
      {
        rule: 'Polite Confirmation vs Denial',
        pattern: 'はい、そうです (Yes, that is right) / いいえ、違います (No, that is incorrect)',
        example: 'はい、そうです。私も行きます。 (Hai, sou desu. Watashi mo ikimasu.)',
        translation: 'Yes, that is right. I will go too.',
      },
    ],
    tip: 'In formal Japanese writing or business documents, always use ではありません (dewa arimasen). In natural daily conversations, じゃありません (ja arimasen) is the friendlier go-to!',
  },

  'ja-greetings-1': {
    id: 'ja-grammar-greetings-1',
    title: 'Politeness Levels & Self-Introductions',
    subtitle: 'Hajimemashite, Yoroshiku & Etiquette Rituals',
    readTimeMinutes: 1,
    concept: 'A Japanese self-introduction (自己紹介 jikoshoukai) follows a ceremonial structure: opening with はじめまして (nice to meet you for the first time), introducing your identity, and closing with よろしくお願いします (please treat me well).',
    rules: [
      {
        rule: 'The 3-Step Self Introduction Ritual',
        pattern: 'はじめまして + [Name] です + よろしくお願いします',
        example: 'はじめまして、ケンです。よろしくお願いします。 (Hajimemashite, Ken desu. Yoroshiku onegaishimasu.)',
        translation: 'Nice to meet you for the first time. I am Ken. Pleased to meet you.',
      },
      {
        rule: 'Honorific Title Suffixes (〜さん / 〜先生)',
        pattern: '[Other person\'s family name] + さん (san) / 先生 (sensei)',
        example: '佐藤さん、おはようございます。 (Satou-san, ohayou gozaimasu.)',
        translation: 'Good morning, Ms. Sato.',
      },
      {
        rule: 'Never Add Suffixes to Your Own Name',
        pattern: '[My name] です (NEVER [My name] さん)',
        example: '私はスミスです。 (Watashi wa Sumisu desu.)',
        translation: 'I am Smith.',
      },
    ],
    tip: 'Never refer to yourself with "san" (e.g. saying "Watashi wa Ken-san" is a major etiquette mistake). San is exclusively an honorific title conferred on others!',
  },

  'ja-numbers-1': {
    id: 'ja-grammar-numbers-1',
    title: 'Japanese Counters & Quantifiers',
    subtitle: 'Counting Objects with 〜つ, 〜人, 〜本, 〜枚',
    readTimeMinutes: 1,
    concept: 'Japanese requires specific numeral classifier suffixes (counters) depending on the shape, nature, and animacy of the items being counted. Native Japanese counters (一つ, 二つ...) count generic objects up to 10.',
    rules: [
      {
        rule: 'Native Japanese Universal Counters (〜つ tsu)',
        pattern: '一つ (hitotsu), 二つ (futatsu), 三つ (mittsu)...',
        example: 'リンゴを二つください。 (Ringo o futatsu kudasai.)',
        translation: 'Please give me two apples.',
      },
      {
        rule: 'People Counter (〜人 nin / hitori, futari)',
        pattern: '一人 (hitori), 二人 (futari), 三人 (sannin)...',
        example: '私たちは三人です。 (Watashitachi wa sannin desu.)',
        translation: 'We are a party of three people.',
      },
      {
        rule: 'Shape-Based Counters (〜本 long thin, 〜枚 flat sheets)',
        pattern: '[Number] + 本 (hon/bon/pon) / 枚 (mai)',
        example: '切符を一枚とペンを二本買いました。 (Kippu o ichimai to pen o nihon kaimashita.)',
        translation: 'I bought one ticket and two pens.',
      },
    ],
    tip: 'If you ever forget the specific shape counter for an everyday object at a restaurant or shop, fall back on the universal 〜つ counter (hitotsu, futatsu, mittsu)!',
  },

  'ja-food-1': {
    id: 'ja-grammar-food-1',
    title: 'Direct Object Marker を (o) & Ordering',
    subtitle: 'Using を (o) and Requesting with ください (kudasai)',
    readTimeMinutes: 1,
    concept: 'The particle を (written with hiragana を, pronounced "o") marks the direct object of an action verb. When asking for items at a restaurant or shop, pair the noun with をください (o kudasai) or お願いします (onegaishimasu).',
    rules: [
      {
        rule: 'Direct Object Marking with を (o)',
        pattern: '[Noun] を + [Action Verb]',
        example: 'お水を飲みます。 (O-mizu o nomimasu.)',
        translation: 'I drink water.',
      },
      {
        rule: 'Ordering Items with [Noun] をください',
        pattern: '[Item] を [Quantity] ください (kudasai)',
        example: '温かいお茶を二つください。 (Atatakai o-cha o futatsu kudasai.)',
        translation: 'Two hot green teas, please.',
      },
      {
        rule: 'Polite Meal Etiquette Phrases',
        pattern: 'いただきます (Before eating) / ごちそうさまでした (After eating)',
        example: '手を合わせて、いただきます！ (Te o awasete, itadakimasu!)',
        translation: 'Hands together: Thank you for this meal!',
      },
    ],
    tip: 'In rapid conversational Japanese when ordering, the particle を is often dropped: "O-kaikei onegaishimasu" (Check, please) or "Kore kudasai" (This one, please).',
  },

  'ja-travel-1': {
    id: 'ja-grammar-travel-1',
    title: 'Destination & Means Particles (に / へ / で)',
    subtitle: 'Navigating Transit, Stations, and Destinations',
    readTimeMinutes: 1,
    concept: 'To express movement and transportation, Japanese uses three vital particles: に (ni) for specific arrival points/destinations, へ (he, pronounced e) for general direction, and で (de) for means of transport.',
    rules: [
      {
        rule: 'Destination Particle に (ni) & Direction Particle へ (e)',
        pattern: '[Destination] に / へ + 行きます (ikimasu) / 来ます (kimasu)',
        example: '新幹線で京都へ行きます。 (Shinkansen de Kyouto e ikimasu.)',
        translation: 'I will go to Kyoto by bullet train.',
      },
      {
        rule: 'Means of Transport with で (de)',
        pattern: '[Vehicle/Transport] で + [Movement Verb]',
        example: '成田空港まで電車で行きます。 (Narita kuukou made densha de ikimasu.)',
        translation: 'I will go to Narita Airport by train.',
      },
      {
        rule: 'Starting Point and Destination (〜から 〜まで)',
        pattern: '[Origin] から [Destination] まで',
        example: '東京駅からホテルまで歩きます。 (Toukyou-eki kara hoteru made arukimasu.)',
        translation: 'I walk from Tokyo Station to the hotel.',
      },
    ],
    tip: 'The directional particle へ is written with the hiragana character "he" (へ), but is ALWAYS pronounced as "e" when functioning as a particle!',
  },

  'ja-travel-2': {
    id: 'ja-grammar-travel-2',
    title: 'Giving & Asking Directions (道案内)',
    subtitle: 'Using 〜て Form for Sequential Actions and Polite Guidance',
    readTimeMinutes: 1,
    concept: 'When navigating or guiding someone through a city, the 〜てください (~te kudasai) form gives polite instructions, while particles に and を define turns and pathways.',
    rules: [
      {
        rule: 'Polite Direction Instructions with 〜てください',
        pattern: '[Direction] に曲がってください / [Path] をまっすぐ行ってください',
        example: '次の交差点を右に曲がってください。 (Tsugi no kousaten o migi ni magatte kudasai.)',
        translation: 'Please turn right at the next intersection.',
      },
      {
        rule: 'Locating Landmarks with はどこですか',
        pattern: '[Place/Landmark] はどこですか？',
        example: 'すみません、一番近い薬局はどこですか？ (Sumimasen, ichiban chikai yakkyoku wa doko desu ka?)',
        translation: 'Excuse me, where is the nearest pharmacy?',
      },
      {
        rule: 'Stating Location with にあります (ni arimasu)',
        pattern: '[Place] は [Reference] の [右/左/前] にあります',
        example: 'コンビニは駅の左側にあります。 (Konbini wa eki no hidarigawa ni arimasu.)',
        translation: 'The convenience store is on the left side of the station.',
      },
    ],
    tip: 'When asking a stranger for directions in Japan, always open with a polite bow and "Sumimasen" (Excuse me) and end with "Arigatou gozaimasu"!',
  },

  'ja-family-1': {
    id: 'ja-grammar-family-1',
    title: 'Humble vs. Respectful Family Terms',
    subtitle: 'Distinguishing In-Group (Uchi) and Out-Group (Soto)',
    readTimeMinutes: 1,
    concept: 'Japanese culture strictly distinguishes between one\'s in-group (内 uchi: your own family) and out-group (外 soto: someone else\'s family). You use humble terms for your own relatives and respectful honorific terms for others\' relatives.',
    rules: [
      {
        rule: 'Humble Terms for Your Own Family (when speaking to outsiders)',
        pattern: '父 (chichi - my dad), 母 (haha - my mom), 兄 (ani - my older bro)',
        example: '私の父は会社員で、母は教師です。 (Watashi no chichi wa kaishain de, haha wa kyoushi desu.)',
        translation: 'My father is a company employee, and my mother is a teacher.',
      },
      {
        rule: 'Honorific Terms for Someone Else\'s Family',
        pattern: 'お父さん (otousan), お母さん (okaasan), ご家族 (gokazoku)',
        example: '田中さんのご家族はお元気ですか？ (Tanaka-san no gokazoku wa o-genki desu ka?)',
        translation: 'How is Mr. Tanaka\'s family doing?',
      },
      {
        rule: 'Expressing Family Member Count with 〜人 (nin)',
        pattern: '家族は [Number] 人です',
        example: '私の家族は四人です。 (Watashi no kazoku wa yonin desu.)',
        translation: 'My family has four people.',
      },
    ],
    tip: 'Never call your own mother "Okaasan" when talking to your boss or a client! Always use the humble term "Haha" in business and formal conversation.',
  },

  'ja-work-1': {
    id: 'ja-grammar-work-1',
    title: 'Polite Past Tense (〜ました / 〜ませんでした)',
    subtitle: 'Reporting Completed Workplace Tasks and Updates',
    readTimeMinutes: 1,
    concept: 'To report completed work, meetings, or actions politely in Japanese, conjugate the polite verb ending 〜ます (masu) into 〜ました (mashita for past affirmative) or 〜ませんでした (masen deshita for past negative).',
    rules: [
      {
        rule: 'Past Affirmative Conjugation (〜ました)',
        pattern: 'Verb stem + ました (mashita)',
        example: '今日の会議の資料をすべて確認しました。 (Kyou no kaigi no shiryou o subete kakunin shimashita.)',
        translation: 'I checked all the materials for today\'s meeting.',
      },
      {
        rule: 'Past Negative Conjugation (〜ませんでした)',
        pattern: 'Verb stem + ませんでした (masen deshita)',
        example: '昨日は残業しませんでした。 (Kinou wa zangyou shimasen deshita.)',
        translation: 'I did not work overtime yesterday.',
      },
      {
        rule: 'Indispensable Office Greetings',
        pattern: 'お疲れ様です (during day) / お疲れ様でした (after finishing)',
        example: '皆さん、今日もお疲れ様でした！ (Minasan, kyou mo otsukaresama deshita!)',
        translation: 'Everyone, thank you for your hard work today!',
      },
    ],
    tip: 'When finishing your shift and leaving the office before others, bow and say: "O-saki ni shitsurei shimasu" (Pardon me for leaving ahead of you).',
  },

  'ja-opinions-1': {
    id: 'ja-grammar-opinions-1',
    title: 'Expressing Thoughts with 〜と思う & Giving Reasons with 〜から',
    subtitle: 'Articulating Business Perspectives and Nuanced Reasons',
    readTimeMinutes: 1,
    concept: 'To soften personal viewpoints and sound collaborative, Japanese sentences quote thoughts using the particle と (to) with 思います (omoimasu - I think). Reasons are connected using the conjunction particle から (kara - because/since).',
    rules: [
      {
        rule: 'Stating Thoughts and Opinions with 〜と思います',
        pattern: '[Plain form sentence] + と思います (to omoimasu)',
        example: 'この新しい企画はとても良いと思います。 (Kono atarashii kikaku wa totemo ii to omoimasu.)',
        translation: 'I think this new proposal is very good.',
      },
      {
        rule: 'Giving Explanations and Reasons with 〜から (kara)',
        pattern: '[Reason/Clause] から、[Result/Action]',
        example: '締切が近いから、急いで準備しましょう。 (Shimekiri ga chikai kara, isoide junbi shimashou.)',
        translation: 'Because the deadline is close, let us prepare quickly.',
      },
      {
        rule: 'Polite Partial Agreement and Discourse Softeners',
        pattern: '確かに...ですが (Tashika ni... desu ga) / 実は (Jitsu wa)',
        example: '確かにそうですが、別の方法も検討しましょう。 (Tashika ni sou desu ga, betsu no houhou mo kentou shimashou.)',
        translation: 'That is certainly true, but let us also consider another method.',
      },
    ],
    tip: 'In Japanese business, stating an opinion directly as a bald fact can seem confrontational. Adding "〜to omoimasu" transforms a blunt statement into a polite, respectful suggestion!',
  },
};

export default japaneseGrammar;
