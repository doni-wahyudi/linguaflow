# Phase 3: Foundational Literacy, Script Mastery & Multi-Skill Curriculum Design

> **Author:** Qoder Engine & Architecture Team  
> **Status:** Approved (Approach 1 - Hybrid Script Academy & Comprehensive Foundations)  
> **Date:** 2026-11-09  
> **Target Release:** LinguaFlow v1.3.0  
> **Deployment Constraint:** 100% Client-Side, Zero-Backend, Zero-Paid AI, GitHub Pages Free Hosting  

---

## 1. Executive Summary & Problem Framing

### 1.1 The Gap in Real-World Fluency
LinguaFlow successfully delivers structured grammar micro-guides (Phase 1) and browser-native oral production evaluations (Phase 2). However, a critical pedagogical vulnerability persists across its curriculum:
1. **The Japanese Script Void:** Japanese Lesson 1 (`ja-basics-1`) currently assumes the learner already knows Japanese scripts, immediately prompting phrases like `こんにちは` and `おはようございます` mixed with Kanji. A true beginner cannot read or pronounce these without relying entirely on Latin Romaji.
2. **Katakana & Kanji Neglect:** Katakana (vital for menus, loanwords like `コーヒー` and `ホテル`, and international signage) is completely absent. Kanji is introduced without stroke orders, radicals, or Onyomi/Kunyomi distinctions.
3. **Absence of Reading Aids:** Beginners in Japanese lack toggleable `<ruby>` Furigana annotations, creating an intimidating wall of characters.
4. **European Phonics Deficits:** Spanish, French, and German lack dedicated phonics and orthography instruction for critical language-specific rules: Spanish rolled *rr* and accent-stress rules; French nasal vowels (`an/en/in/on/un`), silent letters, and liaisons; German umlauts (`ä, ö, ü`), consonant clusters (`ch, sch, sp, st`), and `ß`.
5. **Lack of Syntax Builders:** Exercises do not teach sentence construction or word order (Subject-Object-Verb with particles in Japanese vs Subject-Verb-Object in European languages).
6. **Lack of Conversational Continuity:** All exercises are isolated single questions; learners never engage in multi-turn contextual dialogues.

### 1.2 Core Objectives
- **Foundational Literacy for Japanese:** Provide complete, interactive coverage of Hiragana (46 Gojūon + 25 Dakuten + 33 Yōon), Katakana (46 basic + loanwords), and Core N5 Kanji (50 essential characters with radicals and stroke order).
- **Phonics & Orthography for ES, FR, DE:** Provide interactive sound charts and pronunciation guides for letters, diacritics, and phonemic rules.
- **Dedicated Script & Alphabet Studio (`/characters`):** Transform the standalone `/writing` canvas into a full Character & Alphabet Studio with interactive 50-sound charts, stroke-order guidance, and quick drills.
- **Reading Scaffolding (`<FuriganaText>`):** Standard HTML5 `<ruby>`/`<rt>` annotations with user-controlled toggle (On/Off) in lesson and practice headers.
- **Two New Interactive Exercise Engines:**
  - `SentenceBuilder` (`type: 'scramble'`): Word-tile reordering for grammar syntax.
  - `DialoguePlayer` (`type: 'dialogue'`): Multi-turn situational roleplays with continuous context.
- **Zero-Cost Architecture:** Maintain 100% client-side execution using HTML5 Canvas, Web Speech API, and static reactive datasets.

---

## 2. Architectural Structure & Data Models

### 2.1 File Map

```
src/
├── data/
│   ├── characters/
│   │   ├── index.js                     # Master character registry & lookup helpers
│   │   ├── japanese.js                  # Complete Hiragana, Katakana & N5 Kanji catalog
│   │   └── phonics.js                   # Spanish, French, German alphabet & phonics rules
│   ├── categories.js                    # Adds 'foundations' category (order: 0)
│   └── lessons/
│       ├── spanish.js                   # Enriched with es-phonics-1 + scramble/dialogue
│       ├── japanese.js                  # Enriched with ja-kana-1..3, ja-kanji-1 + scramble/dialogue
│       ├── french.js                    # Enriched with fr-phonics-1 + scramble/dialogue
│       └── german.js                    # Enriched with de-phonics-1 + scramble/dialogue
├── components/
│   ├── ui/
│   │   └── FuriganaText.jsx             # Accessible HTML5 <ruby> renderer with toggle support
│   ├── lesson/
│   │   ├── SentenceBuilder.jsx          # Interactive word-tile scramble exercise
│   │   ├── DialoguePlayer.jsx           # Multi-turn conversational roleplay exercise
│   │   └── ExerciseRenderer.jsx         # Dispatches 'scramble' and 'dialogue'
│   └── characters/
│       ├── SoundChartGrid.jsx           # 50-sound interactive Gojūon/Alphabet table
│       ├── CharacterInspectorModal.jsx  # Character details, mnemonics, stroke hints & words
│       └── StrokeGuideCanvas.jsx        # Animated stroke order & directional guidelines
└── pages/
    ├── CharacterStudio.jsx              # Upgraded studio hub (formerly WritingPractice.jsx)
    └── LessonPlayer.jsx                 # Furigana/Romaji toggle header controls
```

### 2.2 Character Data Schema

#### 2.2.1 Japanese Character Schema (`src/data/characters/japanese.js`)
```javascript
export const hiraganaData = [
  {
    id: 'hiragana-a',
    char: 'あ',
    romaji: 'a',
    row: 'a',         // 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa' | 'n'
    group: 'gojuon',   // 'gojuon' (basic 46) | 'dakuten' (25) | 'yoon' (33)
    strokeCount: 3,
    mnemonic: 'Looks like an apple with a stem and swirl.',
    audioText: 'あ',
    examples: [
      { word: 'あさ', reading: 'asa', meaning: 'morning' },
      { word: 'あめ', reading: 'ame', meaning: 'rain / candy' }
    ],
  },
  // ... all 46 basic, 25 dakuten/handakuten (が, ざ, だ, ば, ぱ...), 33 yōon (きゃ, しゃ, ちゃ...)
];

export const katakanaData = [
  {
    id: 'katakana-a',
    char: 'ア',
    romaji: 'a',
    row: 'a',
    group: 'gojuon',
    strokeCount: 2,
    mnemonic: 'Sharp angle looking like an axe.',
    audioText: 'ア',
    examples: [
      { word: 'アメリカ', reading: 'amerika', meaning: 'America' },
      { word: 'アイス', reading: 'aisu', meaning: 'ice cream' }
    ],
  },
  // ... all 46 basic, 25 dakuten, 33 yōon, and loanword combinations (ファ, ティ, ディ, シェ...)
];

export const kanjiN5Data = [
  {
    id: 'kanji-n5-01',
    kanji: '日',
    onyomi: ['NICHI', 'JITSU'],
    kunyomi: ['hi', '-bi', '-ka'],
    meaning: 'Day / Sun',
    radicals: '日 (sun)',
    strokeCount: 4,
    level: 'N5',
    category: 'Nature & Time',
    examples: [
      { word: '日本', reading: 'にほん', meaning: 'Japan' },
      { word: '日曜日', reading: 'にちようび', meaning: 'Sunday' },
      { word: '今日', reading: 'きょう', meaning: 'Today' }
    ]
  },
  // ... 50 high-frequency N5 Kanji
];
```

#### 2.2.2 European Phonics Schema (`src/data/characters/phonics.js`)
```javascript
export const phonicsByLanguage = {
  es: {
    title: 'Spanish Alphabet & Phonics Rules',
    alphabet: [
      { letter: 'A', ipa: '/a/', soundTip: 'Open vowel like "father"', sampleWord: 'Amigo', translation: 'Friend' },
      { letter: 'Ñ', ipa: '/ɲ/', soundTip: 'Like the "ny" in canyon', sampleWord: 'Niño', translation: 'Child' },
      { letter: 'RR', ipa: '/r/', soundTip: 'Vibrant alveolar trill (rolling r)', sampleWord: 'Perro', translation: 'Dog' },
      // ... complete 27 letters + digraphs (ch, ll, rr)
    ],
    rules: [
      { title: 'C and Z Pronunciation', rule: 'C before E/I sounds like S (Latin America) or TH (Spain). Before A/O/U it sounds like K.' },
      { title: 'Written Accents (Tildes)', rule: 'Vowels with accents (á, é, í, ó, ú) always carry the primary spoken stress.' }
    ]
  },
  fr: {
    title: 'French Orthography, Nasals & Liaisons',
    alphabet: [
      { letter: 'É', ipa: '/e/', soundTip: 'Closed acute e like "hay"', sampleWord: 'Été', translation: 'Summer' },
      { letter: 'È / Ê', ipa: '/ɛ/', soundTip: 'Open grave/circumflex e like "bed"', sampleWord: 'Fête', translation: 'Party' },
      { letter: 'Ç', ipa: '/s/', soundTip: 'Cedilla forces soft "s" sound before a/o/u', sampleWord: 'Français', translation: 'French' },
      // ... complete French diacritics & alphabet
    ],
    rules: [
      { title: 'Silent Final Consonants', rule: 'Final consonants d, p, s, t, x, z are generally silent unless followed by a vowel.' },
      { title: 'Nasal Vowels', rule: 'Vowels before m/n in the same syllable (an, en, in, on, un) produce air through the nose without sounding m/n.' },
      { title: 'Liaison', rule: 'A silent final consonant becomes pronounced to link smoothly into a following word starting with a vowel.' }
    ]
  },
  de: {
    title: 'German Alphabet, Umlauts & Consonants',
    alphabet: [
      { letter: 'Ä', ipa: '/ɛː/', soundTip: 'Open e like "fair" or "bed"', sampleWord: 'Äpfel', translation: 'Apples' },
      { letter: 'Ö', ipa: '/øː/', soundTip: 'Round lips and say "ay"', sampleWord: 'Öl', translation: 'Oil' },
      { letter: 'Ü', ipa: '/yː/', soundTip: 'Pucker lips to whistle and say "ee"', sampleWord: 'Über', translation: 'Over/About' },
      { letter: 'ß', ipa: '/s/', soundTip: 'Eszett: sharp voiceless double-s after long vowels', sampleWord: 'Straße', translation: 'Street' },
      // ... complete German alphabet
    ],
    rules: [
      { title: 'The Two "CH" Sounds', rule: 'After a, o, u: gutteral Ach-Laut (Bach). After e, i, ä, ö, ü: soft hiss Ich-Laut (ich, mich).' },
      { title: 'Initial SP and ST', rule: 'At syllable beginnings, sp and st are pronounced "shp" and "sht" (Sport, Stadt).' },
      { title: 'V and W Sounds', rule: 'W is pronounced like English V (Wasser = "vah-ser"). V is usually pronounced like English F (Vogel = "foh-gel").' }
    ]
  }
};
```

---

## 3. UI Components & Interaction Design

### 3.1 `<FuriganaText>` Reading Helper Component
* **Purpose:** Render Kanji with top-aligned small Hiragana ruby annotations, dynamically responsive to user preferences.
* **Component Interface:**
  ```jsx
  <FuriganaText
    text="今日はいい天気ですね。"
    reading="きょうはいいてんきですね。"
    furigana={[{ kanji: '今日', rt: 'きょう' }, { kanji: '天気', rt: 'てんき' }]}
    showFurigana={showFurigana}
    showRomaji={showRomaji}
    romaji="Kyou wa ii tenki desu ne."
    className="text-display-sm"
  />
  ```
* **HTML Rendering:**
  ```html
  <ruby class="ruby-group">
    今日<rp>(</rp><rt class="text-[0.6em] text-brand-700 select-none">きょう</rt><rp>)</rp>
  </ruby>
  はいい
  <ruby class="ruby-group">
    天気<rp>(</rp><rt class="text-[0.6em] text-brand-700 select-none">てんき</rt><rp>)</rp>
  </ruby>
  ですね。
  ```
* **Header Controls in `LessonPlayer.jsx`:**
  A compact toggle popover/pill in the top bar:
  - `Furigana: ON/OFF` (default ON for beginner/N5 lessons)
  - `Romaji: ON/OFF` (default OFF, provides escape hatch if beginner is stuck)

### 3.2 `<SentenceBuilder>` (Word-Tile Scramble Exercise)
* **Purpose:** Teach natural word order and syntactic particles through tactile, accessible chip manipulation.
* **Schema:**
  ```javascript
  {
    id: 'ja-scramble-101',
    type: 'scramble',
    prompt: 'Construct the sentence: "I eat an apple."',
    targetSentence: '私はりんごを食べます。',
    tokens: ['私', 'は', 'りんご', 'を', '食べます', '。'],
    distractors: ['に', '飲みます'], // Optional tricky extra tiles
    translation: 'I eat an apple.',
    hint: 'Japanese SOV order: Topic (私 + は) + Object (りんご + を) + Verb (食べます).'
  }
  ```
* **User Interaction:**
  1. Top answer tray: Contains placed chips in order. Clicking a placed chip returns it to the pool.
  2. Bottom tile bank: Contains available chips in scrambled order. Clicking an available chip appends it to the answer tray.
  3. "Reset" button clears the tray back to the bank.
  4. "Check Answer" activates once at least 1 tile is placed. Compares normalized tokens.
  5. Fully keyboard navigable (focusable chips, Space/Enter to move, Left/Right arrow keys to navigate).

### 3.3 `<DialoguePlayer>` (Multi-Turn Conversational Roleplay)
* **Purpose:** Move beyond isolated sentences into coherent conversational exchanges.
* **Schema:**
  ```javascript
  {
    id: 'es-diag-101',
    type: 'dialogue',
    title: 'At the Madrid Café',
    scenario: 'You are ordering breakfast from the waiter.',
    dialogue: [
      {
        speaker: 'Camarero',
        avatar: 'waiter',
        text: '¡Buenos días! ¿Qué le pongo?',
        translation: 'Good morning! What can I get you?',
        audio: true
      },
      {
        speaker: 'Tú',
        avatar: 'user',
        role: 'user', // Requires user action
        prompt: 'Order a coffee with milk and a croissant.',
        options: [
          'Un café con leche y un cruasán, por favor.',
          'La cuenta, por favor.',
          'Adiós, hasta luego.'
        ],
        correctIndex: 0,
        explanation: '"Un café con leche y un cruasán" is the appropriate breakfast order.'
      },
      {
        speaker: 'Camarero',
        avatar: 'waiter',
        text: 'Muy bien. ¿Algo más?',
        translation: 'Very well. Anything else?',
        audio: true
      },
      {
        speaker: 'Tú',
        avatar: 'user',
        role: 'user',
        prompt: 'Say that is all, thank you.',
        options: [
          'Nada más, gracias.',
          'Tengo dos hermanos.',
          'Buenos días, señor.'
        ],
        correctIndex: 0,
        explanation: '"Nada más, gracias" politely indicates you are finished ordering.'
      }
    ]
  }
  ```
* **User Interaction:**
  1. Displays chat-style cards sequentially.
  2. Speaker turns play native audio and display translations on tap.
  3. Learner turns prompt interactive option selection or typing, providing immediate contextual feedback before moving to the waiter's response.
  4. Upon completing all turns, the full transcript can be reviewed or replayed.

---

## 4. Upgraded Character & Alphabet Studio Hub (`/characters`)

The current `/writing` route will be enhanced and aliased to `/characters`:
- **Navigation:** Updated in `Navbar.jsx` with label "Characters & Scripts" (or "Writing & Scripts") with icon `PenTool`.
- **Top Header Bar:**
  - Language indicator with flag (`Flag`).
  - Segmented control switcher:
    1. **Sound Charts (`charts`):** Gojūon (Hiragana/Katakana) / Kanji / European Alphabet tables.
    2. **Handwriting Lab (`canvas`):** Digital stylus canvas with Rice (田) / Lined (≡) guidelines, stroke counter, and animated stroke sequence.
    3. **Character Gym (`quiz`):** 10-item rapid recognition practice.

---

## 5. Curriculum Expansion (Level 0 Foundations)

### 5.1 Japanese Level 0 Milestone Lessons
We prepend 4 foundational lessons in `src/data/lessons/japanese.js`:
1. **`ja-kana-1` — Hiragana Fundamentals: The 46 Syllables**
   - Vowels (`あ, い, う, え, お`), K-row, S-row, T-row, N-row, H-row, M-row, Y-row, R-row, W-row & N (`ん`).
   - Teaches reading, writing, and word examples (`あさ`, `いぬ`, `さくら`, `ねこ`).
2. **`ja-kana-2` — Hiragana Variations: Dakuten, Handakuten & Combos**
   - Voiced sounds (`が, ざ, だ, ば`), semi-voiced (`ぱ`), small *tsu* double consonants (`っ` as in `ちょっと`), and small *ya/yu/yo* combos (`きゃ, しゃ, ちゃ`).
3. **`ja-kana-3` — Katakana Essentials & Global Words**
   - Katakana alphabet, long vowel dashes (`ー` as in `コーヒー`), and essential loanwords (`ホテル`, `メニュー`, `バス`, `タクシー`, `パン`).
4. **`ja-kanji-1` — Core N5 Kanji Foundations**
   - Numbers (1–10: 一 to 十), Calendar & Nature (日, 月, 火, 水, 木, 金, 土), People (人, 男, 女).
   - Radicals, stroke order principles (top-to-bottom, left-to-right), Onyomi vs Kunyomi basics.

### 5.2 European Phonics Lessons
We prepend 1 foundational lesson per European language:
1. **`es-phonics-1` — Spanish Alphabet, Sounds & Accent Marks**
   - Pronunciation of `ñ`, `rr`, `c`/`z`, `g`/`j`, silent `h`, and the 3 golden stress-accent rules.
2. **`fr-phonics-1` — French Pronunciation: Accents, Nasals & Silent Letters**
   - Acute (`é`), grave (`è`), circumflex (`ê`), cedilla (`ç`), nasal vowels (`an/on/in`), silent end consonants, and liaison.
3. **`de-phonics-1` — German Alphabet, Umlauts & Consonant Clusters**
   - Pronunciation of `ä, ö, ü`, `ß`, `ei` vs `ie`, `ch` (ach vs ich), initial `sp`/`st`, and noun capitalization rule.

---

## 6. Verification & Test Plan

1. **Curriculum & Data Integrity (`scripts/verify-characters.js`):**
   - Assert all 46 basic Hiragana, 25 Dakuten, 33 Yōon exist with valid stroke counts and examples.
   - Assert all 46 basic Katakana and loanword combinations exist.
   - Assert 50 N5 Kanji exist with Onyomi, Kunyomi, stroke count, and examples.
   - Assert Spanish, French, and German phonics catalogs exist and have audio text.
   - Assert all 7 new foundational lessons (`ja-kana-1..3`, `ja-kanji-1`, `es-phonics-1`, `fr-phonics-1`, `de-phonics-1`) satisfy lesson schema requirements.

2. **Unit Tests for Interactive Components:**
   - Test `FuriganaText` HTML output with Furigana enabled and disabled.
   - Test `SentenceBuilder` tile placement, undo/return, and answer verification logic.
   - Test `DialoguePlayer` turn-taking state machine and option validation.

3. **Live Headless Browser E2E Interaction Suite (`scripts/verify-live-interactions.js`):**
   - Test 12: Character Studio (`/characters`) loads, displays 50-sound Gojūon chart, and plays character audio.
   - Test 13: LessonPlayer renders `FuriganaText` with ruby annotations and toggles visibility via header control.
   - Test 14: SentenceBuilder renders word tiles, accepts click placement, and validates assembled order.
   - Test 15: DialoguePlayer renders multi-turn conversational chat, plays audio, and completes user dialogue prompt.
   - Ensure all 15 E2E tests pass with 0 errors across Chromium CDP.

4. **Production Build:**
   - Execute `npm run build` and ensure bundle compilation completes cleanly with zero errors or asset warnings.
