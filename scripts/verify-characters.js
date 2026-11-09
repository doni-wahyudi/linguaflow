/**
 * @file verify-characters.js
 * @description Unit test verification harness for Japanese kana, kanji, and European phonics datasets.
 */

import { pathToFileURL } from 'url';
import path from 'path';

const charactersIndexPath = path.resolve('src/data/characters/index.js');

async function runTests() {
  console.log('====================================================');
  console.log('  LinguaFlow Character & Phonics Dataset Verification');
  console.log('====================================================\n');

  let errors = [];
  const addError = (test, msg) => {
    errors.push(`[FAIL] ${test}: ${msg}`);
  };

  try {
    const mod = await import(pathToFileURL(charactersIndexPath).href);
    const {
      hiraganaData,
      katakanaData,
      kanjiN5Data,
      phonicsByLanguage,
      getHiragana,
      getKatakana,
      getKanji,
      getPhonics,
      getCharacterById,
    } = mod;

    // ── 1. Hiragana Verification ──────────────────────────────────────────
    console.log('-> Validating Hiragana Dataset...');
    if (!Array.isArray(hiraganaData) || hiraganaData.length < 100) {
      addError('Hiragana:Count', `Expected >= 100 Hiragana entries, got ${hiraganaData?.length}`);
    } else {
      const basic46 = hiraganaData.filter((h) => h.group === 'gojuon');
      const dakuten = hiraganaData.filter((h) => h.group === 'dakuten');
      const yoon = hiraganaData.filter((h) => h.group === 'yoon');

      if (basic46.length !== 46) {
        addError('Hiragana:Gojuon', `Expected exactly 46 Gojūon basic characters, got ${basic46.length}`);
      }
      if (dakuten.length < 20) {
        addError('Hiragana:Dakuten', `Expected >= 20 Dakuten/Handakuten, got ${dakuten.length}`);
      }
      if (yoon.length < 30) {
        addError('Hiragana:Yoon', `Expected >= 30 Yōon combination characters, got ${yoon.length}`);
      }

      // Check fields
      for (const item of hiraganaData) {
        if (!item.id || !item.char || !item.romaji || typeof item.strokeCount !== 'number') {
          addError('Hiragana:Schema', `Invalid item schema: ${JSON.stringify(item)}`);
          break;
        }
      }
      console.log(`   [OK] Loaded ${hiraganaData.length} Hiragana entries (46 basic, ${dakuten.length} dakuten, ${yoon.length} yōon)`);
    }

    // ── 2. Katakana Verification ──────────────────────────────────────────
    console.log('-> Validating Katakana Dataset...');
    if (!Array.isArray(katakanaData) || katakanaData.length < 100) {
      addError('Katakana:Count', `Expected >= 100 Katakana entries, got ${katakanaData?.length}`);
    } else {
      const basic46 = katakanaData.filter((k) => k.group === 'gojuon');
      if (basic46.length !== 46) {
        addError('Katakana:Gojuon', `Expected exactly 46 Gojūon basic characters, got ${basic46.length}`);
      }

      for (const item of katakanaData) {
        if (!item.id || !item.char || !item.romaji || typeof item.strokeCount !== 'number') {
          addError('Katakana:Schema', `Invalid item schema: ${JSON.stringify(item)}`);
          break;
        }
      }
      console.log(`   [OK] Loaded ${katakanaData.length} Katakana entries`);
    }

    // ── 3. N5 Kanji Verification ──────────────────────────────────────────
    console.log('-> Validating N5 Kanji Dataset...');
    if (!Array.isArray(kanjiN5Data) || kanjiN5Data.length < 50) {
      addError('Kanji:Count', `Expected >= 50 N5 Kanji entries, got ${kanjiN5Data?.length}`);
    } else {
      for (const item of kanjiN5Data) {
        if (!item.id || !item.kanji || !item.meaning || !Array.isArray(item.onyomi) || !Array.isArray(item.kunyomi)) {
          addError('Kanji:Schema', `Invalid kanji schema for ${item?.kanji || 'unknown'}: ${JSON.stringify(item)}`);
          break;
        }
        if (!Array.isArray(item.examples) || item.examples.length === 0) {
          addError('Kanji:Examples', `Kanji ${item.kanji} is missing example vocabulary`);
          break;
        }
      }
      console.log(`   [OK] Loaded ${kanjiN5Data.length} essential N5 Kanji entries with readings & examples`);
    }

    // ── 4. European Phonics Verification ──────────────────────────────────
    console.log('-> Validating European Phonics Datasets (ES, FR, DE)...');
    for (const lang of ['es', 'fr', 'de']) {
      const p = phonicsByLanguage?.[lang];
      if (!p || !Array.isArray(p.alphabet) || p.alphabet.length < 20 || !Array.isArray(p.rules) || p.rules.length < 2) {
        addError(`Phonics:${lang}`, `Missing or invalid phonics schema for ${lang}`);
      } else {
        console.log(`   [OK] Loaded ${lang.toUpperCase()} phonics: ${p.alphabet.length} alphabet entries, ${p.rules.length} pronunciation rules`);
      }
    }

    // ── 5. Query Helper Functions ─────────────────────────────────────────
    console.log('-> Validating Query Helper Functions...');
    if (typeof getHiragana !== 'function' || getHiragana().length === 0) {
      addError('Helpers:getHiragana', 'getHiragana function missing or returned empty');
    }
    if (typeof getKatakana !== 'function' || getKatakana().length === 0) {
      addError('Helpers:getKatakana', 'getKatakana function missing or returned empty');
    }
    if (typeof getKanji !== 'function' || getKanji().length === 0) {
      addError('Helpers:getKanji', 'getKanji function missing or returned empty');
    }
    if (typeof getPhonics !== 'function' || !getPhonics('es')) {
      addError('Helpers:getPhonics', 'getPhonics function missing or returned empty for "es"');
    }

    const testChar = getCharacterById('hiragana-a');
    if (!testChar || testChar.char !== 'あ') {
      addError('Helpers:getCharacterById', `Expected char "あ" for id "hiragana-a", got ${testChar?.char}`);
    } else {
      console.log('   [OK] All query helper functions operational');
    }

  } catch (err) {
    addError('Runtime', `Failed to import character datasets: ${err.message}`);
  }

  console.log('\n----------------------------------------------------');
  if (errors.length > 0) {
    console.error(`Verification FAILED with ${errors.length} error(s):`);
    for (const err of errors) {
      console.error(`  ${err}`);
    }
    process.exit(1);
  } else {
    console.log('PASSED: All character & phonics integrity assertions satisfied (0 errors).');
  }
  console.log('----------------------------------------------------\n');
}

runTests();
