/**
 * @file japanese.js
 * @description Comprehensive Japanese writing system datasets: Hiragana (104), Katakana (104), and Essential N5 Kanji (50).
 */

// ── 1. HIRAGANA DATASET ──────────────────────────────────────────────────────
export const hiraganaData = [
  // ── Row A (Vowels) ──
  { id: 'hiragana-a', char: 'あ', romaji: 'a', row: 'a', group: 'gojuon', strokeCount: 3, mnemonic: 'Looks like an apple with a stem and curved loop.', audioText: 'あ', examples: [{ word: 'あさ', reading: 'asa', meaning: 'morning' }, { word: 'あめ', reading: 'ame', meaning: 'rain' }] },
  { id: 'hiragana-i', char: 'い', romaji: 'i', row: 'a', group: 'gojuon', strokeCount: 2, mnemonic: 'Two upright eels or two needles.', audioText: 'い', examples: [{ word: 'いぬ', reading: 'inu', meaning: 'dog' }, { word: 'いえ', reading: 'ie', meaning: 'house' }] },
  { id: 'hiragana-u', char: 'う', romaji: 'u', row: 'a', group: 'gojuon', strokeCount: 2, mnemonic: 'A person bent over carrying a heavy load: "Oof!"', audioText: 'う', examples: [{ word: 'うみ', reading: 'umi', meaning: 'sea' }, { word: 'うた', reading: 'uta', meaning: 'song' }] },
  { id: 'hiragana-e', char: 'え', romaji: 'e', row: 'a', group: 'gojuon', strokeCount: 2, mnemonic: 'An energetic exotic bird running.', audioText: 'え', examples: [{ word: 'えき', reading: 'eki', meaning: 'station' }, { word: 'えん', reading: 'en', meaning: 'yen / circle' }] },
  { id: 'hiragana-o', char: 'お', romaji: 'o', row: 'a', group: 'gojuon', strokeCount: 3, mnemonic: 'A golfer putting a golf ball on a green "O".', audioText: 'お', examples: [{ word: 'お茶', reading: 'おちゃ (ocha)', meaning: 'tea' }, { word: 'おにぎり', reading: 'onigiri', meaning: 'rice ball' }] },

  // ── Row Ka ──
  { id: 'hiragana-ka', char: 'か', romaji: 'ka', row: 'ka', group: 'gojuon', strokeCount: 3, mnemonic: 'A kite flying with a tail.', audioText: 'か', examples: [{ word: 'かわ', reading: 'kawa', meaning: 'river' }, { word: 'かさ', reading: 'kasa', meaning: 'umbrella' }] },
  { id: 'hiragana-ki', char: 'き', romaji: 'ki', row: 'ka', group: 'gojuon', strokeCount: 4, mnemonic: 'Looks like a classic key.', audioText: 'き', examples: [{ word: 'き', reading: 'ki', meaning: 'tree' }, { word: 'きょう', reading: 'kyou', meaning: 'today' }] },
  { id: 'hiragana-ku', char: 'く', romaji: 'ku', row: 'ka', group: 'gojuon', strokeCount: 1, mnemonic: 'A bird’s open beak crying "Coo!".', audioText: 'く', examples: [{ word: 'くるま', reading: 'kuruma', meaning: 'car' }, { word: 'くつ', reading: 'kutsu', meaning: 'shoes' }] },
  { id: 'hiragana-ke', char: 'け', romaji: 'ke', row: 'ka', group: 'gojuon', strokeCount: 3, mnemonic: 'A wooden keg with rings.', audioText: 'け', examples: [{ word: 'けさ', reading: 'kesa', meaning: 'this morning' }, { word: 'けむり', reading: 'kemuri', meaning: 'smoke' }] },
  { id: 'hiragana-ko', char: 'こ', romaji: 'ko', row: 'ka', group: 'gojuon', strokeCount: 2, mnemonic: 'Two coils or koi fish swimming together.', audioText: 'こ', examples: [{ word: 'これ', reading: 'kore', meaning: 'this' }, { word: 'こども', reading: 'kodomo', meaning: 'child' }] },

  // ── Row Sa ──
  { id: 'hiragana-sa', char: 'さ', romaji: 'sa', row: 'sa', group: 'gojuon', strokeCount: 3, mnemonic: 'A samurai sword blade slashing downward.', audioText: 'さ', examples: [{ word: 'さくら', reading: 'sakura', meaning: 'cherry blossom' }, { word: 'さかな', reading: 'sakana', meaning: 'fish' }] },
  { id: 'hiragana-shi', char: 'し', romaji: 'shi', row: 'sa', group: 'gojuon', strokeCount: 1, mnemonic: 'A curved fish hook sinking in the sea.', audioText: 'し', examples: [{ word: 'しろ', reading: 'shiro', meaning: 'white' }, { word: 'しんぶん', reading: 'shinbun', meaning: 'newspaper' }] },
  { id: 'hiragana-su', char: 'す', romaji: 'su', row: 'sa', group: 'gojuon', strokeCount: 2, mnemonic: 'A spiral straw swirling soup.', audioText: 'す', examples: [{ word: 'すし', reading: 'sushi', meaning: 'sushi' }, { word: 'すき', reading: 'suki', meaning: 'liked / fond of' }] },
  { id: 'hiragana-se', char: 'せ', romaji: 'se', row: 'sa', group: 'gojuon', strokeCount: 3, mnemonic: 'Two people chatting on a settee sofa.', audioText: 'せ', examples: [{ word: 'せんせい', reading: 'sensei', meaning: 'teacher' }, { word: 'せかい', reading: 'sekai', meaning: 'world' }] },
  { id: 'hiragana-so', char: 'そ', romaji: 'so', row: 'sa', group: 'gojuon', strokeCount: 1, mnemonic: 'A zigzag sewing stitch.', audioText: 'そ', examples: [{ word: 'そら', reading: 'sora', meaning: 'sky' }, { word: 'そこ', reading: 'soko', meaning: 'there' }] },

  // ── Row Ta ──
  { id: 'hiragana-ta', char: 'た', romaji: 'ta', row: 'ta', group: 'gojuon', strokeCount: 4, mnemonic: 'Spells the letters "t" and "a".', audioText: 'た', examples: [{ word: 'たべる', reading: 'taberu', meaning: 'to eat' }, { word: 'たまご', reading: 'tamago', meaning: 'egg' }] },
  { id: 'hiragana-chi', char: 'ち', romaji: 'chi', row: 'ta', group: 'gojuon', strokeCount: 2, mnemonic: 'A cheerleader waving her pompom.', audioText: 'ち', examples: [{ word: 'ちず', reading: 'chizu', meaning: 'map' }, { word: 'ちかい', reading: 'chikai', meaning: 'near / close' }] },
  { id: 'hiragana-tsu', char: 'つ', romaji: 'tsu', row: 'ta', group: 'gojuon', strokeCount: 1, mnemonic: 'A massive tsunami wave curving over.', audioText: 'つ', examples: [{ word: 'つき', reading: 'tsuki', meaning: 'moon' }, { word: 'つくえ', reading: 'tsukue', meaning: 'desk' }] },
  { id: 'hiragana-te', char: 'て', romaji: 'te', row: 'ta', group: 'gojuon', strokeCount: 1, mnemonic: 'A bent dog tail wagging.', audioText: 'て', examples: [{ word: 'て', reading: 'te', meaning: 'hand' }, { word: 'てがみ', reading: 'tegami', meaning: 'letter' }] },
  { id: 'hiragana-to', char: 'と', romaji: 'to', row: 'ta', group: 'gojuon', strokeCount: 2, mnemonic: 'A nail hammered into a big toe.', audioText: 'と', examples: [{ word: 'ともだち', reading: 'tomodachi', meaning: 'friend' }, { word: 'とり', reading: 'tori', meaning: 'bird' }] },

  // ── Row Na ──
  { id: 'hiragana-na', char: 'な', romaji: 'na', row: 'na', group: 'gojuon', strokeCount: 4, mnemonic: 'A nun praying before a cross.', audioText: 'な', examples: [{ word: 'なつ', reading: 'natsu', meaning: 'summer' }, { word: 'なまえ', reading: 'namae', meaning: 'name' }] },
  { id: 'hiragana-ni', char: 'に', romaji: 'ni', row: 'na', group: 'gojuon', strokeCount: 3, mnemonic: 'A needle sewing a hem with two stitches.', audioText: 'に', examples: [{ word: 'にく', reading: 'niku', meaning: 'meat' }, { word: 'にほん', reading: 'nihon', meaning: 'Japan' }] },
  { id: 'hiragana-nu', char: 'ぬ', romaji: 'nu', row: 'na', group: 'gojuon', strokeCount: 2, mnemonic: 'Noodles curled on chopsticks with a little tail loop.', audioText: 'ぬ', examples: [{ word: 'いぬ', reading: 'inu', meaning: 'dog' }, { word: 'ぬの', reading: 'nuno', meaning: 'cloth' }] },
  { id: 'hiragana-ne', char: 'ね', romaji: 'ne', row: 'na', group: 'gojuon', strokeCount: 2, mnemonic: 'A cat (neko) curled asleep with its tail curled.', audioText: 'ね', examples: [{ word: 'ねこ', reading: 'neko', meaning: 'cat' }, { word: 'ねる', reading: 'neru', meaning: 'to sleep' }] },
  { id: 'hiragana-no', char: 'の', romaji: 'no', row: 'na', group: 'gojuon', strokeCount: 1, mnemonic: 'A round "No smoking" sign contour.', audioText: 'の', examples: [{ word: 'のみもの', reading: 'nomimono', meaning: 'beverage' }, { word: 'のる', reading: 'noru', meaning: 'to ride' }] },

  // ── Row Ha ──
  { id: 'hiragana-ha', char: 'は', romaji: 'ha', row: 'ha', group: 'gojuon', strokeCount: 3, mnemonic: 'A hockey stick and a person wearing a big hat.', audioText: 'は', examples: [{ word: 'はな', reading: 'hana', meaning: 'flower / nose' }, { word: 'はる', reading: 'haru', meaning: 'spring' }] },
  { id: 'hiragana-hi', char: 'ひ', romaji: 'hi', row: 'ha', group: 'gojuon', strokeCount: 1, mnemonic: 'A big smiling mouth laughing: "He-he-he!".', audioText: 'ひ', examples: [{ word: 'ひと', reading: 'hito', meaning: 'person' }, { word: 'ひる', reading: 'hiru', meaning: 'noon' }] },
  { id: 'hiragana-fu', char: 'ふ', romaji: 'fu', row: 'ha', group: 'gojuon', strokeCount: 4, mnemonic: 'Mount Fuji standing proud.', audioText: 'ふ', examples: [{ word: 'ふね', reading: 'fune', meaning: 'boat' }, { word: 'ふゆ', reading: 'fuyu', meaning: 'winter' }] },
  { id: 'hiragana-he', char: 'へ', romaji: 'he', row: 'ha', group: 'gojuon', strokeCount: 1, mnemonic: 'Point of an arrow aiming up towards heaven.', audioText: 'へ', examples: [{ word: 'へや', reading: 'heya', meaning: 'room' }, { word: 'へた', reading: 'heta', meaning: 'unskilled' }] },
  { id: 'hiragana-ho', char: 'ほ', romaji: 'ho', row: 'ha', group: 'gojuon', strokeCount: 4, mnemonic: 'A house with a tall chimney and a roof.', audioText: 'ほ', examples: [{ word: 'ほん', reading: 'hon', meaning: 'book' }, { word: 'ほし', reading: 'hoshi', meaning: 'star' }] },

  // ── Row Ma ──
  { id: 'hiragana-ma', char: 'ま', romaji: 'ma', row: 'ma', group: 'gojuon', strokeCount: 3, mnemonic: 'A mast on a sailboat.', audioText: 'ま', examples: [{ word: 'まち', reading: 'machi', meaning: 'town' }, { word: 'まど', reading: 'mado', meaning: 'window' }] },
  { id: 'hiragana-mi', char: 'み', romaji: 'mi', row: 'ma', group: 'gojuon', strokeCount: 2, mnemonic: 'Musical note shape for "me".', audioText: 'み', examples: [{ word: 'みず', reading: 'mizu', meaning: 'water' }, { word: 'みち', reading: 'michi', meaning: 'road' }] },
  { id: 'hiragana-mu', char: 'む', romaji: 'mu', row: 'ma', group: 'gojuon', strokeCount: 3, mnemonic: 'A cow with horns saying "Moo".', audioText: 'む', examples: [{ word: 'むし', reading: 'mushi', meaning: 'insect' }, { word: 'むら', reading: 'mura', meaning: 'village' }] },
  { id: 'hiragana-me', char: 'め', romaji: 'me', row: 'ma', group: 'gojuon', strokeCount: 2, mnemonic: 'An eye (me) with an eyebrow.', audioText: 'め', examples: [{ word: 'め', reading: 'me', meaning: 'eye' }, { word: 'めがね', reading: 'megane', meaning: 'glasses' }] },
  { id: 'hiragana-mo', char: 'も', romaji: 'mo', row: 'ma', group: 'gojuon', strokeCount: 3, mnemonic: 'A fish hook catching more and more fish.', audioText: 'も', examples: [{ word: 'もり', reading: 'mori', meaning: 'forest' }, { word: 'もの', reading: 'mono', meaning: 'thing' }] },

  // ── Row Ya ──
  { id: 'hiragana-ya', char: 'や', romaji: 'ya', row: 'ya', group: 'gojuon', strokeCount: 3, mnemonic: 'A yak head with horns.', audioText: 'や', examples: [{ word: 'やま', reading: 'yama', meaning: 'mountain' }, { word: 'やすみ', reading: 'yasumi', meaning: 'rest / holiday' }] },
  { id: 'hiragana-yu', char: 'ゆ', romaji: 'yu', row: 'ya', group: 'gojuon', strokeCount: 2, mnemonic: 'A hot spring tub with steam rising: "Yu".', audioText: 'ゆ', examples: [{ word: 'ゆき', reading: 'yuki', meaning: 'snow' }, { word: 'ゆめ', reading: 'yume', meaning: 'dream' }] },
  { id: 'hiragana-yo', char: 'よ', romaji: 'yo', row: 'ya', group: 'gojuon', strokeCount: 2, mnemonic: 'A yo-yo swinging on a string.', audioText: 'よ', examples: [{ word: 'よる', reading: 'yoru', meaning: 'night' }, { word: 'よい', reading: 'yoi', meaning: 'good' }] },

  // ── Row Ra ──
  { id: 'hiragana-ra', char: 'ら', romaji: 'ra', row: 'ra', group: 'gojuon', strokeCount: 2, mnemonic: 'A rabbit sitting up on its hind legs.', audioText: 'ら', examples: [{ word: 'らいしゅう', reading: 'raishuu', meaning: 'next week' }, { word: 'らくだ', reading: 'rakuda', meaning: 'camel' }] },
  { id: 'hiragana-ri', char: 'り', romaji: 'ri', row: 'ra', group: 'gojuon', strokeCount: 2, mnemonic: 'A river flowing with two streams.', audioText: 'り', examples: [{ word: 'りんご', reading: 'ringo', meaning: 'apple' }, { word: 'りょこう', reading: 'ryokou', meaning: 'travel' }] },
  { id: 'hiragana-ru', char: 'る', romaji: 'ru', row: 'ra', group: 'gojuon', strokeCount: 1, mnemonic: 'A road curving with a roundabout loop.', audioText: 'る', examples: [{ word: 'るす', reading: 'rusu', meaning: 'absence from home' }] },
  { id: 'hiragana-re', char: 'れ', romaji: 're', row: 'ra', group: 'gojuon', strokeCount: 2, mnemonic: 'A runner leaning forward over the hurdle.', audioText: 'れ', examples: [{ word: 'れきし', reading: 'rekishi', meaning: 'history' }, { word: 'れい', reading: 'rei', meaning: 'zero / example' }] },
  { id: 'hiragana-ro', char: 'ろ', romaji: 'ro', row: 'ra', group: 'gojuon', strokeCount: 1, mnemonic: 'A road rolling ahead without a loop.', audioText: 'ろ', examples: [{ word: 'ろく', reading: 'roku', meaning: 'six (6)' }, { word: 'ろうそく', reading: 'rousoku', meaning: 'candle' }] },

  // ── Row Wa & N ──
  { id: 'hiragana-wa', char: 'わ', romaji: 'wa', row: 'wa', group: 'gojuon', strokeCount: 2, mnemonic: 'A white swan floating gracefully on water.', audioText: 'わ', examples: [{ word: 'わたし', reading: 'watashi', meaning: 'I / me' }, { word: 'わらう', reading: 'warau', meaning: 'to laugh' }] },
  { id: 'hiragana-wo', char: 'を', romaji: 'wo', row: 'wa', group: 'gojuon', strokeCount: 3, mnemonic: 'An Olympic skater performing a "Whoa!" jump.', audioText: 'を', examples: [{ word: 'パンを食べる', reading: 'pan o taberu', meaning: 'eat bread (particle)' }] },
  { id: 'hiragana-n', char: 'ん', romaji: 'n', row: 'wa', group: 'gojuon', strokeCount: 1, mnemonic: 'Looks like a lowercase English "n".', audioText: 'ん', examples: [{ word: 'ほん', reading: 'hon', meaning: 'book' }, { word: 'おんがく', reading: 'ongaku', meaning: 'music' }] },

  // ── Dakuten (が, ざ, だ, ば) & Handakuten (ぱ) (25 entries) ──
  { id: 'hiragana-ga', char: 'が', romaji: 'ga', row: 'ka', group: 'dakuten', strokeCount: 5, audioText: 'が' },
  { id: 'hiragana-gi', char: 'ぎ', romaji: 'gi', row: 'ka', group: 'dakuten', strokeCount: 6, audioText: 'ぎ' },
  { id: 'hiragana-gu', char: 'ぐ', romaji: 'gu', row: 'ka', group: 'dakuten', strokeCount: 3, audioText: 'ぐ' },
  { id: 'hiragana-ge', char: 'げ', romaji: 'ge', row: 'ka', group: 'dakuten', strokeCount: 5, audioText: 'げ' },
  { id: 'hiragana-go', char: 'ご', romaji: 'go', row: 'ka', group: 'dakuten', strokeCount: 4, audioText: 'ご' },

  { id: 'hiragana-za', char: 'ざ', romaji: 'za', row: 'sa', group: 'dakuten', strokeCount: 5, audioText: 'ざ' },
  { id: 'hiragana-ji', char: 'じ', romaji: 'ji', row: 'sa', group: 'dakuten', strokeCount: 3, audioText: 'じ' },
  { id: 'hiragana-zu', char: 'ず', romaji: 'zu', row: 'sa', group: 'dakuten', strokeCount: 4, audioText: 'ず' },
  { id: 'hiragana-ze', char: 'ぜ', romaji: 'ze', row: 'sa', group: 'dakuten', strokeCount: 5, audioText: 'ぜ' },
  { id: 'hiragana-zo', char: 'ぞ', romaji: 'zo', row: 'sa', group: 'dakuten', strokeCount: 3, audioText: 'ぞ' },

  { id: 'hiragana-da', char: 'だ', romaji: 'da', row: 'ta', group: 'dakuten', strokeCount: 6, audioText: 'だ' },
  { id: 'hiragana-dji', char: 'ぢ', romaji: 'ji (dji)', row: 'ta', group: 'dakuten', strokeCount: 4, audioText: 'ぢ' },
  { id: 'hiragana-dzu', char: 'づ', romaji: 'zu (dzu)', row: 'ta', group: 'dakuten', strokeCount: 3, audioText: 'づ' },
  { id: 'hiragana-de', char: 'で', romaji: 'de', row: 'ta', group: 'dakuten', strokeCount: 3, audioText: 'で' },
  { id: 'hiragana-do', char: 'ど', romaji: 'do', row: 'ta', group: 'dakuten', strokeCount: 4, audioText: 'ど' },

  { id: 'hiragana-ba', char: 'ば', romaji: 'ba', row: 'ha', group: 'dakuten', strokeCount: 5, audioText: 'ば' },
  { id: 'hiragana-bi', char: 'び', romaji: 'bi', row: 'ha', group: 'dakuten', strokeCount: 3, audioText: 'び' },
  { id: 'hiragana-bu', char: 'ぶ', romaji: 'bu', row: 'ha', group: 'dakuten', strokeCount: 6, audioText: 'ぶ' },
  { id: 'hiragana-be', char: 'べ', romaji: 'be', row: 'ha', group: 'dakuten', strokeCount: 3, audioText: 'べ' },
  { id: 'hiragana-bo', char: 'ぼ', romaji: 'bo', row: 'ha', group: 'dakuten', strokeCount: 6, audioText: 'ぼ' },

  { id: 'hiragana-pa', char: 'ぱ', romaji: 'pa', row: 'ha', group: 'dakuten', strokeCount: 4, audioText: 'ぱ' },
  { id: 'hiragana-pi', char: 'ぴ', romaji: 'pi', row: 'ha', group: 'dakuten', strokeCount: 2, audioText: 'ぴ' },
  { id: 'hiragana-pu', char: 'ぷ', romaji: 'pu', row: 'ha', group: 'dakuten', strokeCount: 5, audioText: 'ぷ' },
  { id: 'hiragana-pe', char: 'ぺ', romaji: 'pe', row: 'ha', group: 'dakuten', strokeCount: 2, audioText: 'ぺ' },
  { id: 'hiragana-po', char: 'ぽ', romaji: 'po', row: 'ha', group: 'dakuten', strokeCount: 5, audioText: 'ぽ' },

  // ── Yōon Combinations (33 entries) ──
  { id: 'hiragana-kya', char: 'きゃ', romaji: 'kya', row: 'ka', group: 'yoon', strokeCount: 7, audioText: 'きゃ' },
  { id: 'hiragana-kyu', char: 'きゅ', romaji: 'kyu', row: 'ka', group: 'yoon', strokeCount: 6, audioText: 'きゅ' },
  { id: 'hiragana-kyo', char: 'きょ', romaji: 'kyo', row: 'ka', group: 'yoon', strokeCount: 6, audioText: 'きょ' },

  { id: 'hiragana-gya', char: 'ぎゃ', romaji: 'gya', row: 'ka', group: 'yoon', strokeCount: 9, audioText: 'ぎゃ' },
  { id: 'hiragana-gyu', char: 'ぎゅ', romaji: 'gyu', row: 'ka', group: 'yoon', strokeCount: 8, audioText: 'ぎゅ' },
  { id: 'hiragana-gyo', char: 'ぎょ', romaji: 'gyo', row: 'ka', group: 'yoon', strokeCount: 8, audioText: 'ぎょ' },

  { id: 'hiragana-sha', char: 'しゃ', romaji: 'sha', row: 'sa', group: 'yoon', strokeCount: 4, audioText: 'しゃ' },
  { id: 'hiragana-shu', char: 'しゅ', romaji: 'shu', row: 'sa', group: 'yoon', strokeCount: 3, audioText: 'しゅ' },
  { id: 'hiragana-sho', char: 'しょ', romaji: 'sho', row: 'sa', group: 'yoon', strokeCount: 3, audioText: 'しょ' },

  { id: 'hiragana-ja', char: 'じゃ', romaji: 'ja', row: 'sa', group: 'yoon', strokeCount: 6, audioText: 'じゃ' },
  { id: 'hiragana-ju', char: 'じゅ', romaji: 'ju', row: 'sa', group: 'yoon', strokeCount: 5, audioText: 'じゅ' },
  { id: 'hiragana-jo', char: 'じょ', romaji: 'jo', row: 'sa', group: 'yoon', strokeCount: 5, audioText: 'じょ' },

  { id: 'hiragana-cha', char: 'ちゃ', romaji: 'cha', row: 'ta', group: 'yoon', strokeCount: 5, audioText: 'ちゃ' },
  { id: 'hiragana-chu', char: 'ちゅ', romaji: 'chu', row: 'ta', group: 'yoon', strokeCount: 4, audioText: 'ちゅ' },
  { id: 'hiragana-cho', char: 'ちょ', romaji: 'cho', row: 'ta', group: 'yoon', strokeCount: 4, audioText: 'ちょ' },

  { id: 'hiragana-nya', char: 'にゃ', romaji: 'nya', row: 'na', group: 'yoon', strokeCount: 6, audioText: 'にゃ' },
  { id: 'hiragana-nyu', char: 'にゅ', romaji: 'nyu', row: 'na', group: 'yoon', strokeCount: 5, audioText: 'にゅ' },
  { id: 'hiragana-nyo', char: 'にょ', romaji: 'nyo', row: 'na', group: 'yoon', strokeCount: 5, audioText: 'にょ' },

  { id: 'hiragana-hya', char: 'ひゃ', romaji: 'hya', row: 'ha', group: 'yoon', strokeCount: 4, audioText: 'ひゃ' },
  { id: 'hiragana-hyu', char: 'ひゅ', romaji: 'hyu', row: 'ha', group: 'yoon', strokeCount: 3, audioText: 'ひゅ' },
  { id: 'hiragana-hyo', char: 'ひょ', romaji: 'hyo', row: 'ha', group: 'yoon', strokeCount: 3, audioText: 'ひょ' },

  { id: 'hiragana-bya', char: 'びゃ', romaji: 'bya', row: 'ha', group: 'yoon', strokeCount: 6, audioText: 'びゃ' },
  { id: 'hiragana-byu', char: 'びゅ', romaji: 'byu', row: 'ha', group: 'yoon', strokeCount: 5, audioText: 'びゅ' },
  { id: 'hiragana-byo', char: 'びょ', romaji: 'byo', row: 'ha', group: 'yoon', strokeCount: 5, audioText: 'びょ' },

  { id: 'hiragana-pya', char: 'ぴゃ', romaji: 'pya', row: 'ha', group: 'yoon', strokeCount: 5, audioText: 'ぴゃ' },
  { id: 'hiragana-pyu', char: 'ぴゅ', romaji: 'pyu', row: 'ha', group: 'yoon', strokeCount: 4, audioText: 'ぴゅ' },
  { id: 'hiragana-pyo', char: 'ぴょ', romaji: 'pyo', row: 'ha', group: 'yoon', strokeCount: 4, audioText: 'ぴょ' },

  { id: 'hiragana-mya', char: 'みゃ', romaji: 'mya', row: 'ma', group: 'yoon', strokeCount: 5, audioText: 'みゃ' },
  { id: 'hiragana-myu', char: 'みゅ', romaji: 'myu', row: 'ma', group: 'yoon', strokeCount: 4, audioText: 'みゅ' },
  { id: 'hiragana-myo', char: 'みょ', romaji: 'myo', row: 'ma', group: 'yoon', strokeCount: 4, audioText: 'みょ' },

  { id: 'hiragana-rya', char: 'りゃ', romaji: 'rya', row: 'ra', group: 'yoon', strokeCount: 5, audioText: 'りゃ' },
  { id: 'hiragana-ryu', char: 'りゅ', romaji: 'ryu', row: 'ra', group: 'yoon', strokeCount: 4, audioText: 'りゅ' },
  { id: 'hiragana-ryo', char: 'りょ', romaji: 'ryo', row: 'ra', group: 'yoon', strokeCount: 4, audioText: 'りょ' },
];

// ── 2. KATAKANA DATASET ──────────────────────────────────────────────────────
export const katakanaData = [
  // ── Row A (Vowels) ──
  { id: 'katakana-a', char: 'ア', romaji: 'a', row: 'a', group: 'gojuon', strokeCount: 2, mnemonic: 'Sharp angle looking like an axe.', audioText: 'ア', examples: [{ word: 'アメリカ', reading: 'amerika', meaning: 'America' }, { word: 'アイス', reading: 'aisu', meaning: 'ice cream' }] },
  { id: 'katakana-i', char: 'イ', romaji: 'i', row: 'a', group: 'gojuon', strokeCount: 2, mnemonic: 'An easel standing tall.', audioText: 'イ', examples: [{ word: 'イタリア', reading: 'itaria', meaning: 'Italy' }, { word: 'インク', reading: 'inku', meaning: 'ink' }] },
  { id: 'katakana-u', char: 'ウ', romaji: 'u', row: 'a', group: 'gojuon', strokeCount: 3, mnemonic: 'An upside-down cup with a hook.', audioText: 'ウ', examples: [{ word: 'ウエブ', reading: 'webu', meaning: 'web' }, { word: 'ウール', reading: 'uuru', meaning: 'wool' }] },
  { id: 'katakana-e', char: 'エ', romaji: 'e', row: 'a', group: 'gojuon', strokeCount: 3, mnemonic: 'An elevator entrance frame.', audioText: 'エ', examples: [{ word: 'エアコン', reading: 'eakon', meaning: 'air conditioner' }, { word: 'エレベーター', reading: 'erebeetaa', meaning: 'elevator' }] },
  { id: 'katakana-o', char: 'オ', romaji: 'o', row: 'a', group: 'gojuon', strokeCount: 3, mnemonic: 'An opera singer performing with an outstretched arm.', audioText: 'オ', examples: [{ word: 'オレンジ', reading: 'orenji', meaning: 'orange' }, { word: 'ホテル', reading: 'hoteru', meaning: 'hotel' }] },

  // ── Row Ka ──
  { id: 'katakana-ka', char: 'カ', romaji: 'ka', row: 'ka', group: 'gojuon', strokeCount: 2, mnemonic: 'Sharp sword cut, like Hiragana か without the drop.', audioText: 'カ', examples: [{ word: 'カメラ', reading: 'kamera', meaning: 'camera' }, { word: 'カフェ', reading: 'kafe', meaning: 'café' }] },
  { id: 'katakana-ki', char: 'キ', romaji: 'ki', row: 'ka', group: 'gojuon', strokeCount: 3, mnemonic: 'Top part of a key.', audioText: 'キ', examples: [{ word: 'キロ', reading: 'kiro', meaning: 'kilo / kilometer' }, { word: 'キー', reading: 'kii', meaning: 'key' }] },
  { id: 'katakana-ku', char: 'ク', romaji: 'ku', row: 'ka', group: 'gojuon', strokeCount: 2, mnemonic: 'A cook’s chef hat.', audioText: 'ク', examples: [{ word: 'クラス', reading: 'kurasu', meaning: 'class' }, { word: 'クラブ', reading: 'kurabu', meaning: 'club' }] },
  { id: 'katakana-ke', char: 'ケ', romaji: 'ke', row: 'ka', group: 'gojuon', strokeCount: 3, mnemonic: 'A kettle spout.', audioText: 'ケ', examples: [{ word: 'ケーキ', reading: 'keeki', meaning: 'cake' }] },
  { id: 'katakana-ko', char: 'コ', romaji: 'ko', row: 'ka', group: 'gojuon', strokeCount: 2, mnemonic: 'Two corners of a box.', audioText: 'コ', examples: [{ word: 'コーヒー', reading: 'koohii', meaning: 'coffee' }, { word: 'コース', reading: 'koosu', meaning: 'course' }] },

  // ── Row Sa ──
  { id: 'katakana-sa', char: 'サ', romaji: 'sa', row: 'sa', group: 'gojuon', strokeCount: 3, mnemonic: 'Three planks of a wooden sailboat.', audioText: 'サ', examples: [{ word: 'サラダ', reading: 'sarada', meaning: 'salad' }, { word: 'サンドイッチ', reading: 'sandoitchi', meaning: 'sandwich' }] },
  { id: 'katakana-shi', char: 'シ', romaji: 'shi', row: 'sa', group: 'gojuon', strokeCount: 3, mnemonic: 'Smiling face with two eyes looking up.', audioText: 'シ', examples: [{ word: 'シャツ', reading: 'shatsu', meaning: 'shirt' }, { word: 'システム', reading: 'shisutemu', meaning: 'system' }] },
  { id: 'katakana-su', char: 'ス', romaji: 'su', row: 'sa', group: 'gojuon', strokeCount: 2, mnemonic: 'A skier skiing down a slope.', audioText: 'ス', examples: [{ word: 'スポーツ', reading: 'supootsu', meaning: 'sports' }, { word: 'スーパー', reading: 'suupaa', meaning: 'supermarket' }] },
  { id: 'katakana-se', char: 'セ', romaji: 'se', row: 'sa', group: 'gojuon', strokeCount: 2, mnemonic: 'A settee sofa corner.', audioText: 'セ', examples: [{ word: 'セーター', reading: 'seetaa', meaning: 'sweater' }, { word: 'センター', reading: 'sentaa', meaning: 'center' }] },
  { id: 'katakana-so', char: 'ソ', romaji: 'so', row: 'sa', group: 'gojuon', strokeCount: 2, mnemonic: 'One eye looking down.', audioText: 'ソ', examples: [{ word: 'ソフト', reading: 'sofuto', meaning: 'software' }, { word: 'ソース', reading: 'soosu', meaning: 'sauce' }] },

  // ── Row Ta ──
  { id: 'katakana-ta', char: 'タ', romaji: 'ta', row: 'ta', group: 'gojuon', strokeCount: 3, mnemonic: 'Looks like a sailboat tacking.', audioText: 'タ', examples: [{ word: 'タクシー', reading: 'takushii', meaning: 'taxi' }, { word: 'タオル', reading: 'taoru', meaning: 'towel' }] },
  { id: 'katakana-chi', char: 'チ', romaji: 'chi', row: 'ta', group: 'gojuon', strokeCount: 3, mnemonic: 'Cheerleader with three pompom flags.', audioText: 'チ', examples: [{ word: 'チーズ', reading: 'chiizu', meaning: 'cheese' }, { word: 'チケット', reading: 'chiketto', meaning: 'ticket' }] },
  { id: 'katakana-tsu', char: 'ツ', romaji: 'tsu', row: 'ta', group: 'gojuon', strokeCount: 3, mnemonic: 'Tsunami droplets falling down.', audioText: 'ツ', examples: [{ word: 'ツアー', reading: 'tsuaa', meaning: 'tour' }] },
  { id: 'katakana-te', char: 'テ', romaji: 'te', row: 'ta', group: 'gojuon', strokeCount: 3, mnemonic: 'A TV antenna pole with crossbars.', audioText: 'テ', examples: [{ word: 'テレビ', reading: 'terebi', meaning: 'television' }, { word: 'テスト', reading: 'tesuto', meaning: 'test' }] },
  { id: 'katakana-to', char: 'ト', romaji: 'to', row: 'ta', group: 'gojuon', strokeCount: 2, mnemonic: 'A totem pole with a branch sticking out.', audioText: 'ト', examples: [{ word: 'トマト', reading: 'tomato', meaning: 'tomato' }, { word: 'トイレ', reading: 'toire', meaning: 'toilet' }] },

  // ── Row Na ──
  { id: 'katakana-na', char: 'ナ', romaji: 'na', row: 'na', group: 'gojuon', strokeCount: 2, mnemonic: 'A pocket knife or narwhal tusk.', audioText: 'ナ', examples: [{ word: 'ナイフ', reading: 'naifu', meaning: 'knife' }, { word: 'ナンバー', reading: 'nanbaa', meaning: 'number' }] },
  { id: 'katakana-ni', char: 'ニ', romaji: 'ni', row: 'na', group: 'gojuon', strokeCount: 2, mnemonic: 'Two horizontal lines: "Ni" = two (2).', audioText: 'ニ', examples: [{ word: 'ニュース', reading: 'nyuusu', meaning: 'news' }] },
  { id: 'katakana-nu', char: 'ヌ', romaji: 'nu', row: 'na', group: 'gojuon', strokeCount: 2, mnemonic: 'Nunchucks swinging in cross.', audioText: 'ヌ', examples: [{ word: 'カヌー', reading: 'kanuu', meaning: 'canoe' }] },
  { id: 'katakana-ne', char: 'ネ', romaji: 'ne', row: 'na', group: 'gojuon', strokeCount: 4, mnemonic: 'A necktie draped neatly.', audioText: 'ネ', examples: [{ word: 'ネット', reading: 'netto', meaning: 'internet / net' }, { word: 'ネクタイ', reading: 'nekutai', meaning: 'necktie' }] },
  { id: 'katakana-no', char: 'ノ', romaji: 'no', row: 'na', group: 'gojuon', strokeCount: 1, mnemonic: 'A long slope running down.', audioText: 'ノ', examples: [{ word: 'ノート', reading: 'nooto', meaning: 'notebook' }] },

  // ── Row Ha ──
  { id: 'katakana-ha', char: 'ハ', romaji: 'ha', row: 'ha', group: 'gojuon', strokeCount: 2, mnemonic: 'Two sides of a thatched house roof.', audioText: 'ハ', examples: [{ word: 'ハンバーガー', reading: 'hanbaagaa', meaning: 'hamburger' }] },
  { id: 'katakana-hi', char: 'ヒ', romaji: 'hi', row: 'ha', group: 'gojuon', strokeCount: 2, mnemonic: 'A hero standing proudly with heel pointed out.', audioText: 'ヒ', examples: [{ word: 'ヒーロー', reading: 'hiiroo', meaning: 'hero' }, { word: 'ヒント', reading: 'hinto', meaning: 'hint' }] },
  { id: 'katakana-fu', char: 'フ', romaji: 'fu', row: 'ha', group: 'gojuon', strokeCount: 1, mnemonic: 'A cliff looking over Mt. Fuji.', audioText: 'フ', examples: [{ word: 'フォーク', reading: 'fooku', meaning: 'fork' }, { word: 'フルーツ', reading: 'furuutsu', meaning: 'fruit' }] },
  { id: 'katakana-he', char: 'ヘ', romaji: 'he', row: 'ha', group: 'gojuon', strokeCount: 1, mnemonic: 'Same as Hiragana へ - peak pointing up.', audioText: 'ヘ', examples: [{ word: 'ヘルメット', reading: 'herumetto', meaning: 'helmet' }] },
  { id: 'katakana-ho', char: 'ホ', romaji: 'ho', row: 'ha', group: 'gojuon', strokeCount: 4, mnemonic: 'A holy cross with sacred leaves.', audioText: 'ホ', examples: [{ word: 'ホテル', reading: 'hoteru', meaning: 'hotel' }, { word: 'ホーム', reading: 'hoomu', meaning: 'platform / home' }] },

  // ── Row Ma ──
  { id: 'katakana-ma', char: 'マ', romaji: 'ma', row: 'ma', group: 'gojuon', strokeCount: 2, mnemonic: 'A math angle symbol.', audioText: 'マ', examples: [{ word: 'マッチ', reading: 'matchi', meaning: 'match' }, { word: 'マスク', reading: 'masuku', meaning: 'mask' }] },
  { id: 'katakana-mi', char: 'ミ', romaji: 'mi', row: 'ma', group: 'gojuon', strokeCount: 3, mnemonic: 'Three missile lines shooting right.', audioText: 'ミ', examples: [{ word: 'ミルク', reading: 'miruku', meaning: 'milk' }, { word: 'ミス', reading: 'misu', meaning: 'mistake' }] },
  { id: 'katakana-mu', char: 'ム', romaji: 'mu', row: 'ma', group: 'gojuon', strokeCount: 2, mnemonic: 'Moose antlers forming a triangle.', audioText: 'ム', examples: [{ word: 'ムービー', reading: 'muubii', meaning: 'movie' }] },
  { id: 'katakana-me', char: 'メ', romaji: 'me', row: 'ma', group: 'gojuon', strokeCount: 2, mnemonic: 'Metal scissors crossed open.', audioText: 'メ', examples: [{ word: 'メニュー', reading: 'menyuu', meaning: 'menu' }, { word: 'メール', reading: 'meeru', meaning: 'email' }] },
  { id: 'katakana-mo', char: 'モ', romaji: 'mo', row: 'ma', group: 'gojuon', strokeCount: 3, mnemonic: 'Similar to Hiragana も with straight lines.', audioText: 'モ', examples: [{ word: 'モデル', reading: 'moderu', meaning: 'model' }] },

  // ── Row Ya ──
  { id: 'katakana-ya', char: 'ヤ', romaji: 'ya', row: 'ya', group: 'gojuon', strokeCount: 2, mnemonic: 'A yacht sail cutting the wind.', audioText: 'ヤ', examples: [{ word: 'ヤード', reading: 'yaado', meaning: 'yard' }] },
  { id: 'katakana-yu', char: 'ユ', romaji: 'yu', row: 'ya', group: 'gojuon', strokeCount: 2, mnemonic: 'A hook hook forming a U turn: "You".', audioText: 'ユ', examples: [{ word: 'ユーザー', reading: 'yuuzaa', meaning: 'user' }] },
  { id: 'katakana-yo', char: 'ヨ', romaji: 'yo', row: 'ya', group: 'gojuon', strokeCount: 3, mnemonic: 'Spells the letter "E" backwards.', audioText: 'ヨ', examples: [{ word: 'ヨーロッパ', reading: 'yooroppa', meaning: 'Europe' }] },

  // ── Row Ra ──
  { id: 'katakana-ra', char: 'ラ', romaji: 'ra', row: 'ra', group: 'gojuon', strokeCount: 2, mnemonic: 'A radio antenna.', audioText: 'ラ', examples: [{ word: 'ラジオ', reading: 'rajio', meaning: 'radio' }, { word: 'ラーメン', reading: 'raamen', meaning: 'ramen' }] },
  { id: 'katakana-ri', char: 'リ', romaji: 'ri', row: 'ra', group: 'gojuon', strokeCount: 2, mnemonic: 'Two straight river reeds.', audioText: 'リ', examples: [{ word: 'リーダー', reading: 'riidaa', meaning: 'leader' }] },
  { id: 'katakana-ru', char: 'ル', romaji: 'ru', row: 'ra', group: 'gojuon', strokeCount: 2, mnemonic: 'Two roots extending into the soil.', audioText: 'ル', examples: [{ word: 'ルール', reading: 'ruuru', meaning: 'rule' }] },
  { id: 'katakana-re', char: 'レ', romaji: 're', row: 'ra', group: 'gojuon', strokeCount: 1, mnemonic: 'A single checkmark ready to go.', audioText: 'レ', examples: [{ word: 'レストラン', reading: 'resutoran', meaning: 'restaurant' }] },
  { id: 'katakana-ro', char: 'ロ', romaji: 'ro', row: 'ra', group: 'gojuon', strokeCount: 3, mnemonic: 'A square robot mouth.', audioText: 'ロ', examples: [{ word: 'ロシア', reading: 'roshia', meaning: 'Russia' }, { word: 'ロビー', reading: 'robii', meaning: 'lobby' }] },

  // ── Row Wa & N ──
  { id: 'katakana-wa', char: 'ワ', romaji: 'wa', row: 'wa', group: 'gojuon', strokeCount: 2, mnemonic: 'A wine glass silhouette.', audioText: 'ワ', examples: [{ word: 'ワイン', reading: 'wain', meaning: 'wine' }] },
  { id: 'katakana-wo', char: 'ヲ', romaji: 'wo', row: 'wa', group: 'gojuon', strokeCount: 3, mnemonic: 'Rarely used katakana particle.', audioText: 'ヲ' },
  { id: 'katakana-n', char: 'ン', romaji: 'n', row: 'wa', group: 'gojuon', strokeCount: 2, mnemonic: 'One eye winking from bottom-left up.', audioText: 'ン', examples: [{ word: 'パン', reading: 'pan', meaning: 'bread' }, { word: 'ペン', reading: 'pen', meaning: 'pen' }] },

  // ── Katakana Dakuten & Handakuten (25 entries) ──
  { id: 'katakana-ga', char: 'ガ', romaji: 'ga', row: 'ka', group: 'dakuten', strokeCount: 4, audioText: 'ガ' },
  { id: 'katakana-gi', char: 'ギ', romaji: 'gi', row: 'ka', group: 'dakuten', strokeCount: 5, audioText: 'ギ' },
  { id: 'katakana-gu', char: 'グ', romaji: 'gu', row: 'ka', group: 'dakuten', strokeCount: 4, audioText: 'グ' },
  { id: 'katakana-ge', char: 'ゲ', romaji: 'ge', row: 'ka', group: 'dakuten', strokeCount: 5, audioText: 'ゲ' },
  { id: 'katakana-go', char: 'ゴ', romaji: 'go', row: 'ka', group: 'dakuten', strokeCount: 4, audioText: 'ゴ' },

  { id: 'katakana-za', char: 'ザ', romaji: 'za', row: 'sa', group: 'dakuten', strokeCount: 5, audioText: 'ザ' },
  { id: 'katakana-ji', char: 'ジ', romaji: 'ji', row: 'sa', group: 'dakuten', strokeCount: 5, audioText: 'ジ' },
  { id: 'katakana-zu', char: 'ズ', romaji: 'zu', row: 'sa', group: 'dakuten', strokeCount: 4, audioText: 'ズ' },
  { id: 'katakana-ze', char: 'ゼ', romaji: 'ze', row: 'sa', group: 'dakuten', strokeCount: 4, audioText: 'ゼ' },
  { id: 'katakana-zo', char: 'ゾ', romaji: 'zo', row: 'sa', group: 'dakuten', strokeCount: 4, audioText: 'ゾ' },

  { id: 'katakana-da', char: 'ダ', romaji: 'da', row: 'ta', group: 'dakuten', strokeCount: 5, audioText: 'ダ' },
  { id: 'katakana-dji', char: 'ヂ', romaji: 'ji (dji)', row: 'ta', group: 'dakuten', strokeCount: 5, audioText: 'ヂ' },
  { id: 'katakana-dzu', char: 'ヅ', romaji: 'zu (dzu)', row: 'ta', group: 'dakuten', strokeCount: 5, audioText: 'ヅ' },
  { id: 'katakana-de', char: 'デ', romaji: 'de', row: 'ta', group: 'dakuten', strokeCount: 5, audioText: 'デ' },
  { id: 'katakana-do', char: 'ド', romaji: 'do', row: 'ta', group: 'dakuten', strokeCount: 4, audioText: 'ド' },

  { id: 'katakana-ba', char: 'バ', romaji: 'ba', row: 'ha', group: 'dakuten', strokeCount: 4, audioText: 'バ' },
  { id: 'katakana-bi', char: 'ビ', romaji: 'bi', row: 'ha', group: 'dakuten', strokeCount: 4, audioText: 'ビ' },
  { id: 'katakana-bu', char: 'ブ', romaji: 'bu', row: 'ha', group: 'dakuten', strokeCount: 3, audioText: 'ブ' },
  { id: 'katakana-be', char: 'ベ', romaji: 'be', row: 'ha', group: 'dakuten', strokeCount: 3, audioText: 'ベ' },
  { id: 'katakana-bo', char: 'ボ', romaji: 'bo', row: 'ha', group: 'dakuten', strokeCount: 6, audioText: 'ボ' },

  { id: 'katakana-pa', char: 'パ', romaji: 'pa', row: 'ha', group: 'dakuten', strokeCount: 3, audioText: 'パ' },
  { id: 'katakana-pi', char: 'ピ', romaji: 'pi', row: 'ha', group: 'dakuten', strokeCount: 3, audioText: 'ピ' },
  { id: 'katakana-pu', char: 'プ', romaji: 'pu', row: 'ha', group: 'dakuten', strokeCount: 2, audioText: 'プ' },
  { id: 'katakana-pe', char: 'ペ', romaji: 'pe', row: 'ha', group: 'dakuten', strokeCount: 2, audioText: 'ペ' },
  { id: 'katakana-po', char: 'ポ', romaji: 'po', row: 'ha', group: 'dakuten', strokeCount: 5, audioText: 'ポ' },

  // ── Katakana Combinations & Loanwords (33+ entries) ──
  { id: 'katakana-kya', char: 'キャ', romaji: 'kya', row: 'ka', group: 'yoon', strokeCount: 5, audioText: 'キャ' },
  { id: 'katakana-kyu', char: 'キュ', romaji: 'kyu', row: 'ka', group: 'yoon', strokeCount: 5, audioText: 'キュ' },
  { id: 'katakana-kyo', char: 'キョ', romaji: 'kyo', row: 'ka', group: 'yoon', strokeCount: 6, audioText: 'キョ' },

  { id: 'katakana-gya', char: 'ギャ', romaji: 'gya', row: 'ka', group: 'yoon', strokeCount: 7, audioText: 'ギャ' },
  { id: 'katakana-gyu', char: 'ギュ', romaji: 'gyu', row: 'ka', group: 'yoon', strokeCount: 7, audioText: 'ギュ' },
  { id: 'katakana-gyo', char: 'ギョ', romaji: 'gyo', row: 'ka', group: 'yoon', strokeCount: 8, audioText: 'ギョ' },

  { id: 'katakana-sha', char: 'シャ', romaji: 'sha', row: 'sa', group: 'yoon', strokeCount: 5, audioText: 'シャ' },
  { id: 'katakana-shu', char: 'シュ', romaji: 'shu', row: 'sa', group: 'yoon', strokeCount: 5, audioText: 'シュ' },
  { id: 'katakana-sho', char: 'ショ', romaji: 'sho', row: 'sa', group: 'yoon', strokeCount: 6, audioText: 'ショ' },

  { id: 'katakana-ja', char: 'ジャ', romaji: 'ja', row: 'sa', group: 'yoon', strokeCount: 7, audioText: 'ジャ' },
  { id: 'katakana-ju', char: 'ジュ', romaji: 'ju', row: 'sa', group: 'yoon', strokeCount: 7, audioText: 'ジュ' },
  { id: 'katakana-jo', char: 'ジョ', romaji: 'jo', row: 'sa', group: 'yoon', strokeCount: 8, audioText: 'ジョ' },

  { id: 'katakana-cha', char: 'チャ', romaji: 'cha', row: 'ta', group: 'yoon', strokeCount: 5, audioText: 'チャ' },
  { id: 'katakana-chu', char: 'チュ', romaji: 'chu', row: 'ta', group: 'yoon', strokeCount: 5, audioText: 'チュ' },
  { id: 'katakana-cho', char: 'チョ', romaji: 'cho', row: 'ta', group: 'yoon', strokeCount: 6, audioText: 'チョ' },

  { id: 'katakana-nya', char: 'ニャ', romaji: 'nya', row: 'na', group: 'yoon', strokeCount: 4, audioText: 'ニャ' },
  { id: 'katakana-nyu', char: 'ニュ', romaji: 'nyu', row: 'na', group: 'yoon', strokeCount: 4, audioText: 'ニュ' },
  { id: 'katakana-nyo', char: 'ニョ', romaji: 'nyo', row: 'na', group: 'yoon', strokeCount: 5, audioText: 'ニョ' },

  { id: 'katakana-hya', char: 'ヒャ', romaji: 'hya', row: 'ha', group: 'yoon', strokeCount: 4, audioText: 'ヒャ' },
  { id: 'katakana-hyu', char: 'ヒュ', romaji: 'hyu', row: 'ha', group: 'yoon', strokeCount: 4, audioText: 'ヒュ' },
  { id: 'katakana-hyo', char: 'ヒョ', romaji: 'hyo', row: 'ha', group: 'yoon', strokeCount: 5, audioText: 'ヒョ' },

  { id: 'katakana-bya', char: 'ビャ', romaji: 'bya', row: 'ha', group: 'yoon', strokeCount: 6, audioText: 'ビャ' },
  { id: 'katakana-byu', char: 'ビュ', romaji: 'byu', row: 'ha', group: 'yoon', strokeCount: 6, audioText: 'ビュ' },
  { id: 'katakana-byo', char: 'ビョ', romaji: 'byo', row: 'ha', group: 'yoon', strokeCount: 7, audioText: 'ビョ' },

  { id: 'katakana-pya', char: 'ピャ', romaji: 'pya', row: 'ha', group: 'yoon', strokeCount: 5, audioText: 'ピャ' },
  { id: 'katakana-pyu', char: 'ピュ', romaji: 'pyu', row: 'ha', group: 'yoon', strokeCount: 5, audioText: 'ピュ' },
  { id: 'katakana-pyo', char: 'ピョ', romaji: 'pyo', row: 'ha', group: 'yoon', strokeCount: 6, audioText: 'ピョ' },

  { id: 'katakana-mya', char: 'ミャ', romaji: 'mya', row: 'ma', group: 'yoon', strokeCount: 5, audioText: 'ミャ' },
  { id: 'katakana-myu', char: 'ミュ', romaji: 'myu', row: 'ma', group: 'yoon', strokeCount: 5, audioText: 'ミュ' },
  { id: 'katakana-myo', char: 'ミョ', romaji: 'myo', row: 'ma', group: 'yoon', strokeCount: 6, audioText: 'ミョ' },

  { id: 'katakana-rya', char: 'リャ', romaji: 'rya', row: 'ra', group: 'yoon', strokeCount: 4, audioText: 'リャ' },
  { id: 'katakana-ryu', char: 'リュ', romaji: 'ryu', row: 'ra', group: 'yoon', strokeCount: 4, audioText: 'リュ' },
  { id: 'katakana-ryo', char: 'リョ', romaji: 'ryo', row: 'ra', group: 'yoon', strokeCount: 5, audioText: 'リョ' },

  // Special loanword pairs
  { id: 'katakana-fa', char: 'ファ', romaji: 'fa', row: 'ha', group: 'yoon', strokeCount: 3, audioText: 'ファ' },
  { id: 'katakana-fi', char: 'フィ', romaji: 'fi', row: 'ha', group: 'yoon', strokeCount: 3, audioText: 'フィ' },
  { id: 'katakana-fe', char: 'フェ', romaji: 'fe', row: 'ha', group: 'yoon', strokeCount: 4, audioText: 'フェ' },
  { id: 'katakana-fo', char: 'フォ', romaji: 'fo', row: 'ha', group: 'yoon', strokeCount: 4, audioText: 'フォ' },
  { id: 'katakana-ti', char: 'ティ', romaji: 'ti', row: 'ta', group: 'yoon', strokeCount: 5, audioText: 'ティ' },
  { id: 'katakana-di', char: 'ディ', romaji: 'di', row: 'ta', group: 'yoon', strokeCount: 7, audioText: 'ディ' },
];

// ── 3. ESSENTIAL N5 KANJI (50 High-Frequency Characters) ────────────────────
export const kanjiN5Data = [
  // Numbers
  { id: 'kanji-01', kanji: '一', meaning: 'One (1)', onyomi: ['ICHI', 'ITSU'], kunyomi: ['hito(tsu)', 'hito'], radicals: '一', strokeCount: 1, level: 'N5', category: 'Numbers', examples: [{ word: '一つ', reading: 'ひとつ', meaning: 'one thing' }, { word: '一日', reading: 'ついたち', meaning: '1st of month' }] },
  { id: 'kanji-02', kanji: '二', meaning: 'Two (2)', onyomi: ['NI'], kunyomi: ['futa(tsu)', 'futa'], radicals: '二', strokeCount: 2, level: 'N5', category: 'Numbers', examples: [{ word: '二つ', reading: 'ふたつ', meaning: 'two things' }, { word: '二月', reading: 'にがつ', meaning: 'February' }] },
  { id: 'kanji-03', kanji: '三', meaning: 'Three (3)', onyomi: ['SAN'], kunyomi: ['mit(tsu)', 'mi'], radicals: '一', strokeCount: 3, level: 'N5', category: 'Numbers', examples: [{ word: '三つ', reading: 'みっつ', meaning: 'three things' }, { word: '三人', reading: 'さんにん', meaning: 'three people' }] },
  { id: 'kanji-04', kanji: '四', meaning: 'Four (4)', onyomi: ['SHI'], kunyomi: ['yot(tsu)', 'yon', 'yo'], radicals: '囗', strokeCount: 5, level: 'N5', category: 'Numbers', examples: [{ word: '四日', reading: 'よっか', meaning: '4th day' }, { word: '四年', reading: 'よねん', meaning: 'four years' }] },
  { id: 'kanji-05', kanji: '五', meaning: 'Five (5)', onyomi: ['GO'], kunyomi: ['itsu(tsu)', 'itsu'], radicals: '二', strokeCount: 4, level: 'N5', category: 'Numbers', examples: [{ word: '五つ', reading: 'いつつ', meaning: 'five things' }, { word: '五月', reading: 'ごがつ', meaning: 'May' }] },
  { id: 'kanji-06', kanji: '六', meaning: 'Six (6)', onyomi: ['ROKU'], kunyomi: ['mut(tsu)', 'mui'], radicals: '八', strokeCount: 4, level: 'N5', category: 'Numbers', examples: [{ word: '六つ', reading: 'むっつ', meaning: 'six things' }, { word: '六月', reading: 'ろくがつ', meaning: 'June' }] },
  { id: 'kanji-07', kanji: '七', meaning: 'Seven (7)', onyomi: ['SHICHI'], kunyomi: ['nana(tsu)', 'nana'], radicals: '一', strokeCount: 2, level: 'N5', category: 'Numbers', examples: [{ word: '七つ', reading: 'ななつ', meaning: 'seven things' }, { word: '七月', reading: 'しちがつ', meaning: 'July' }] },
  { id: 'kanji-08', kanji: '八', meaning: 'Eight (8)', onyomi: ['HACHI'], kunyomi: ['yat(tsu)', 'you'], radicals: '八', strokeCount: 2, level: 'N5', category: 'Numbers', examples: [{ word: '八つ', reading: 'やっつ', meaning: 'eight things' }, { word: '八百屋', reading: 'やおや', meaning: 'greengrocer' }] },
  { id: 'kanji-09', kanji: '九', meaning: 'Nine (9)', onyomi: ['KU', 'KYUU'], kunyomi: ['kokono(tsu)', 'kokono'], radicals: '乙', strokeCount: 2, level: 'N5', category: 'Numbers', examples: [{ word: '九つ', reading: 'ここのつ', meaning: 'nine things' }, { word: '九月', reading: 'くがつ', meaning: 'September' }] },
  { id: 'kanji-10', kanji: '十', meaning: 'Ten (10)', onyomi: ['JUU', 'JITSU'], kunyomi: ['too', 'to'], radicals: '十', strokeCount: 2, level: 'N5', category: 'Numbers', examples: [{ word: '十', reading: 'とお', meaning: 'ten' }, { word: '十分', reading: 'じゅっぷん', meaning: 'ten minutes' }] },
  { id: 'kanji-11', kanji: '百', meaning: 'Hundred (100)', onyomi: ['HYAKU'], kunyomi: ['momo'], radicals: '白', strokeCount: 6, level: 'N5', category: 'Numbers', examples: [{ word: '百円', reading: 'ひゃくえん', meaning: '100 yen' }, { word: '三百', reading: 'さんびゃく', meaning: '300' }] },
  { id: 'kanji-12', kanji: '千', meaning: 'Thousand (1,000)', onyomi: ['SEN'], kunyomi: ['chi'], radicals: '十', strokeCount: 3, level: 'N5', category: 'Numbers', examples: [{ word: '千円', reading: 'せんえん', meaning: '1,000 yen' }, { word: '三千', reading: 'さんぜん', meaning: '3,000' }] },
  { id: 'kanji-13', kanji: '万', meaning: 'Ten Thousand (10,000)', onyomi: ['MAN', 'BAN'], kunyomi: ['yorozu'], radicals: '一', strokeCount: 3, level: 'N5', category: 'Numbers', examples: [{ word: '一万円', reading: 'いちまんえん', meaning: '10,000 yen' }] },

  // Calendar & Nature Elements
  { id: 'kanji-14', kanji: '日', meaning: 'Day / Sun', onyomi: ['NICHI', 'JITSU'], kunyomi: ['hi', '-bi', '-ka'], radicals: '日', strokeCount: 4, level: 'N5', category: 'Nature & Time', examples: [{ word: '日本', reading: 'にほん', meaning: 'Japan' }, { word: '日曜日', reading: 'にちようび', meaning: 'Sunday' }] },
  { id: 'kanji-15', kanji: '月', meaning: 'Moon / Month', onyomi: ['GETSU', 'GATSU'], kunyomi: ['tsuki'], radicals: '月', strokeCount: 4, level: 'N5', category: 'Nature & Time', examples: [{ word: '月曜日', reading: 'げつようび', meaning: 'Monday' }, { word: '今月', reading: 'こんげつ', meaning: 'this month' }] },
  { id: 'kanji-16', kanji: '火', meaning: 'Fire', onyomi: ['KA'], kunyomi: ['hi', 'bi'], radicals: '火', strokeCount: 4, level: 'N5', category: 'Nature & Time', examples: [{ word: '火曜日', reading: 'かようび', meaning: 'Tuesday' }, { word: '花火', reading: 'はなび', meaning: 'fireworks' }] },
  { id: 'kanji-17', kanji: '水', meaning: 'Water', onyomi: ['SUI'], kunyomi: ['mizu'], radicals: '水', strokeCount: 4, level: 'N5', category: 'Nature & Time', examples: [{ word: '水', reading: 'みず', meaning: 'water' }, { word: '水曜日', reading: 'すいようび', meaning: 'Wednesday' }] },
  { id: 'kanji-18', kanji: '木', meaning: 'Tree / Wood', onyomi: ['MOKU', 'BOKU'], kunyomi: ['ki', 'ko'], radicals: '木', strokeCount: 4, level: 'N5', category: 'Nature & Time', examples: [{ word: '木', reading: 'き', meaning: 'tree' }, { word: '木曜日', reading: 'もくようび', meaning: 'Thursday' }] },
  { id: 'kanji-19', kanji: '金', meaning: 'Gold / Money', onyomi: ['KIN', 'KON'], kunyomi: ['kane', 'kana'], radicals: '金', strokeCount: 8, level: 'N5', category: 'Nature & Time', examples: [{ word: 'お金', reading: 'おかね', meaning: 'money' }, { word: '金曜日', reading: 'きんようび', meaning: 'Friday' }] },
  { id: 'kanji-20', kanji: '土', meaning: 'Earth / Soil', onyomi: ['DO', 'TO'], kunyomi: ['tsuchi'], radicals: '土', strokeCount: 3, level: 'N5', category: 'Nature & Time', examples: [{ word: '土曜日', reading: 'どようび', meaning: 'Saturday' }, { word: '土地', reading: 'とち', meaning: 'land' }] },
  { id: 'kanji-21', kanji: '年', meaning: 'Year', onyomi: ['NEN'], kunyomi: ['toshi'], radicals: '干', strokeCount: 6, level: 'N5', category: 'Nature & Time', examples: [{ word: '今年', reading: 'ことし', meaning: 'this year' }, { word: '来年', reading: 'らいねん', meaning: 'next year' }] },
  { id: 'kanji-22', kanji: '時', meaning: 'Time / Hour', onyomi: ['JI'], kunyomi: ['toki'], radicals: '日', strokeCount: 10, level: 'N5', category: 'Nature & Time', examples: [{ word: '一時', reading: 'いちじ', meaning: 'one o\'clock' }, { word: '時間', reading: 'じかん', meaning: 'time' }] },
  { id: 'kanji-23', kanji: '分', meaning: 'Minute / Part / Understand', onyomi: ['BUN', 'FUN', 'BU'], kunyomi: ['wa(karu)', 'wa(keru)'], radicals: '刀', strokeCount: 4, level: 'N5', category: 'Nature & Time', examples: [{ word: '五分', reading: 'ごふん', meaning: 'five minutes' }, { word: '分かる', reading: 'わかる', meaning: 'to understand' }] },

  // People & Relations
  { id: 'kanji-24', kanji: '人', meaning: 'Person / Human', onyomi: ['JIN', 'NIN'], kunyomi: ['hito'], radicals: '人', strokeCount: 2, level: 'N5', category: 'People', examples: [{ word: '日本人', reading: 'にほんじん', meaning: 'Japanese person' }, { word: 'あの人', reading: 'あのひと', meaning: 'that person' }] },
  { id: 'kanji-25', kanji: '男', meaning: 'Man / Male', onyomi: ['DAN', 'NAN'], kunyomi: ['otoko'], radicals: '田', strokeCount: 7, level: 'N5', category: 'People', examples: [{ word: '男の人', reading: 'おとこのひと', meaning: 'man' }, { word: '男子', reading: 'だんし', meaning: 'boy' }] },
  { id: 'kanji-26', kanji: '女', meaning: 'Woman / Female', onyomi: ['JO', 'NYO'], kunyomi: ['onna', 'me'], radicals: '女', strokeCount: 3, level: 'N5', category: 'People', examples: [{ word: '女の人', reading: 'おんなのひと', meaning: 'woman' }, { word: '彼女', reading: 'かのじょ', meaning: 'she / girlfriend' }] },
  { id: 'kanji-27', kanji: '子', meaning: 'Child', onyomi: ['SHI', 'SU'], kunyomi: ['ko'], radicals: '子', strokeCount: 3, level: 'N5', category: 'People', examples: [{ word: '子ども', reading: 'こども', meaning: 'child' }, { word: '女の子', reading: 'おんなのこ', meaning: 'girl' }] },
  { id: 'kanji-28', kanji: '友', meaning: 'Friend', onyomi: ['YUU'], kunyomi: ['tomo'], radicals: '又', strokeCount: 4, level: 'N5', category: 'People', examples: [{ word: '友達', reading: 'ともだち', meaning: 'friend' }, { word: '親友', reading: 'しんゆう', meaning: 'best friend' }] },
  { id: 'kanji-29', kanji: '目', meaning: 'Eye', onyomi: ['MOKU', 'BOKU'], kunyomi: ['me', 'ma'], radicals: '目', strokeCount: 5, level: 'N5', category: 'People', examples: [{ word: '目', reading: 'め', meaning: 'eye' }, { word: '一番目', reading: 'いちばんめ', meaning: 'first (ordinal)' }] },
  { id: 'kanji-30', kanji: '手', meaning: 'Hand', onyomi: ['SHU'], kunyomi: ['te', 'ta'], radicals: '手', strokeCount: 4, level: 'N5', category: 'People', examples: [{ word: '手紙', reading: 'てがみ', meaning: 'letter' }, { word: '上手', reading: 'じょうず', meaning: 'skillful' }] },

  // Nature, Scale & Directions
  { id: 'kanji-31', kanji: '山', meaning: 'Mountain', onyomi: ['SAN', 'ZAN'], kunyomi: ['yama'], radicals: '山', strokeCount: 3, level: 'N5', category: 'Nature & Space', examples: [{ word: '富士山', reading: 'ふじさん', meaning: 'Mt. Fuji' }, { word: '山', reading: 'やま', meaning: 'mountain' }] },
  { id: 'kanji-32', kanji: '川', meaning: 'River', onyomi: ['SEN'], kunyomi: ['kawa', 'gawa'], radicals: '川', strokeCount: 3, level: 'N5', category: 'Nature & Space', examples: [{ word: '川', reading: 'かわ', meaning: 'river' }] },
  { id: 'kanji-33', kanji: '天', meaning: 'Heaven / Sky', onyomi: ['TEN'], kunyomi: ['ama'], radicals: '大', strokeCount: 4, level: 'N5', category: 'Nature & Space', examples: [{ word: '天気', reading: 'てんき', meaning: 'weather' }, { word: '天才', reading: 'てんさい', meaning: 'genius' }] },
  { id: 'kanji-34', kanji: '気', meaning: 'Spirit / Air / Energy', onyomi: ['KI', 'KE'], kunyomi: ['ki'], radicals: '气', strokeCount: 6, level: 'N5', category: 'Nature & Space', examples: [{ word: '元気', reading: 'げんき', meaning: 'healthy / energetic' }, { word: '気持ち', reading: 'きもち', meaning: 'feeling' }] },
  { id: 'kanji-35', kanji: '上', meaning: 'Up / Above', onyomi: ['JOU', 'SHOU'], kunyomi: ['ue', 'kami', 'a(garu)'], radicals: '一', strokeCount: 3, level: 'N5', category: 'Nature & Space', examples: [{ word: '机の上', reading: 'つくえのうえ', meaning: 'on the desk' }, { word: '上手', reading: 'じょうず', meaning: 'good at' }] },
  { id: 'kanji-36', kanji: '下', meaning: 'Down / Below', onyomi: ['KA', 'GE'], kunyomi: ['shita', 'shimo', 'sa(garu)'], radicals: '一', strokeCount: 3, level: 'N5', category: 'Nature & Space', examples: [{ word: '下', reading: 'した', meaning: 'below' }, { word: '下手', reading: 'へた', meaning: 'poor at' }] },
  { id: 'kanji-37', kanji: '中', meaning: 'Middle / Inside', onyomi: ['CHUU'], kunyomi: ['naka'], radicals: '丨', strokeCount: 4, level: 'N5', category: 'Nature & Space', examples: [{ word: '部屋の中', reading: 'へやのなか', meaning: 'inside the room' }, { word: '一日中', reading: 'いちにちじゅう', meaning: 'all day long' }] },
  { id: 'kanji-38', kanji: '大', meaning: 'Big / Large', onyomi: ['DAI', 'TAI'], kunyomi: ['oo(kii)', 'oo'], radicals: '大', strokeCount: 3, level: 'N5', category: 'Nature & Space', examples: [{ word: '大きい', reading: 'おおきい', meaning: 'big' }, { word: '大学', reading: 'だいがく', meaning: 'university' }] },
  { id: 'kanji-39', kanji: '小', meaning: 'Small / Little', onyomi: ['SHOU'], kunyomi: ['chii(sai)', 'ko', 'o'], radicals: '小', strokeCount: 3, level: 'N5', category: 'Nature & Space', examples: [{ word: '小さい', reading: 'ちいさい', meaning: 'small' }, { word: '小学校', reading: 'しょうがっこう', meaning: 'elementary school' }] },
  { id: 'kanji-40', kanji: '本', meaning: 'Book / Origin / Main', onyomi: ['HON'], kunyomi: ['moto'], radicals: '木', strokeCount: 5, level: 'N5', category: 'Nature & Space', examples: [{ word: '本', reading: 'ほん', meaning: 'book' }, { word: '日本', reading: 'にほん', meaning: 'Japan' }] },
  { id: 'kanji-41', kanji: '国', meaning: 'Country', onyomi: ['KOKU'], kunyomi: ['kuni'], radicals: '囗', strokeCount: 8, level: 'N5', category: 'Nature & Space', examples: [{ word: '外国', reading: 'がいこく', meaning: 'foreign country' }, { word: '国', reading: 'くに', meaning: 'country' }] },
  { id: 'kanji-42', kanji: '車', meaning: 'Car / Vehicle / Wheel', onyomi: ['SHA'], kunyomi: ['kuruma'], radicals: '車', strokeCount: 7, level: 'N5', category: 'Nature & Space', examples: [{ word: '電車', reading: 'でんしゃ', meaning: 'train' }, { word: '車', reading: 'くるま', meaning: 'car' }] },
  { id: 'kanji-43', kanji: '前', meaning: 'Before / Front', onyomi: ['ZEN'], kunyomi: ['mae'], radicals: '刀', strokeCount: 9, level: 'N5', category: 'Nature & Space', examples: [{ word: '名前', reading: 'なまえ', meaning: 'name' }, { word: '駅の前', reading: 'えきのまえ', meaning: 'in front of the station' }] },
  { id: 'kanji-44', kanji: '後', meaning: 'After / Behind', onyomi: ['GO', 'KOU'], kunyomi: ['ushi(ro)', 'ato'], radicals: '彳', strokeCount: 9, level: 'N5', category: 'Nature & Space', examples: [{ word: '後ろ', reading: 'うしろ', meaning: 'behind' }, { word: '午後', reading: 'ごご', meaning: 'afternoon / PM' }] },

  // Core Action Verbs
  { id: 'kanji-45', kanji: '行', meaning: 'Go / Act', onyomi: ['KOU', 'GYOU'], kunyomi: ['i(ku)', 'yu(ku)', 'okona(u)'], radicals: '行', strokeCount: 6, level: 'N5', category: 'Actions', examples: [{ word: '行く', reading: 'いく', meaning: 'to go' }, { word: '旅行', reading: 'りょこう', meaning: 'travel' }] },
  { id: 'kanji-46', kanji: '来', meaning: 'Come / Next', onyomi: ['RAI'], kunyomi: ['ku(ru)', 'kita(ru)'], radicals: '木', strokeCount: 7, level: 'N5', category: 'Actions', examples: [{ word: '来る', reading: 'くる', meaning: 'to come' }, { word: '来週', reading: 'らいしゅう', meaning: 'next week' }] },
  { id: 'kanji-47', kanji: '見', meaning: 'See / Look', onyomi: ['KEN'], kunyomi: ['mi(ru)', 'mi(seru)'], radicals: '見', strokeCount: 7, level: 'N5', category: 'Actions', examples: [{ word: '見る', reading: 'みる', meaning: 'to see' }, { word: '見せる', reading: 'みせる', meaning: 'to show' }] },
  { id: 'kanji-48', kanji: '食', meaning: 'Eat / Food', onyomi: ['SHOKU'], kunyomi: ['ta(beru)', 'ku(u)'], radicals: '食', strokeCount: 9, level: 'N5', category: 'Actions', examples: [{ word: '食べる', reading: 'たべる', meaning: 'to eat' }, { word: '食べ物', reading: 'たべもの', meaning: 'food' }] },
  { id: 'kanji-49', kanji: '飲', meaning: 'Drink', onyomi: ['IN'], kunyomi: ['no(mu)'], radicals: '食', strokeCount: 12, level: 'N5', category: 'Actions', examples: [{ word: '飲む', reading: 'のむ', meaning: 'to drink' }, { word: '飲み物', reading: 'のみもの', meaning: 'beverage' }] },
  { id: 'kanji-50', kanji: '話', meaning: 'Talk / Speak / Story', onyomi: ['WA'], kunyomi: ['hana(su)', 'hanashi'], radicals: '言', strokeCount: 13, level: 'N5', category: 'Actions', examples: [{ word: '話す', reading: 'はなす', meaning: 'to speak' }, { word: '会話', reading: 'かいわ', meaning: 'conversation' }] },
];
