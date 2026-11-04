/**
 * @file languages.js
 * @description Master catalog of available languages in LinguaFlow with official proficiency frameworks (CEFR & JLPT).
 */

export const languages = [
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flagCode: 'ES',
    description: 'Vibrant, melodic language spoken by over 500 million people worldwide.',
    accent: 'brand',
    tint: 'from-brand-50 to-amber-50',
    speakers: '500M+',
    code: 'es-ES',
    popularPhrases: ['Hola', 'Gracias', 'Por favor', 'Buenos días'],
    framework: {
      name: 'CEFR',
      fullName: 'Common European Framework of Reference',
      levels: [
        { code: 'A1', name: 'Breakthrough', tag: 'Beginner', desc: 'Everyday greetings, basic needs & simple phrases' },
        { code: 'A2', name: 'Waystage', tag: 'Elementary', desc: 'Travel, family, shopping & direct conversations' },
        { code: 'B1', name: 'Threshold', tag: 'Intermediate', desc: 'Expressing viewpoints, stories & routine work' },
        { code: 'B2', name: 'Vantage', tag: 'Upper-Intermediate', desc: 'Fluent spontaneous interactions' },
      ],
    },
  },
  {
    id: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flagCode: 'JP',
    description: 'Fascinating language blending traditional etiquette, culture, and innovation.',
    accent: 'coral',
    tint: 'from-coral-50 to-amber-50',
    speakers: '125M+',
    code: 'ja-JP',
    popularPhrases: ['こんにちは', 'ありがとう', 'すみません', 'はじめまして'],
    framework: {
      name: 'JLPT',
      fullName: 'Japanese-Language Proficiency Test (日本語能力試験)',
      levels: [
        { code: 'N5', name: 'Foundation', tag: 'Beginner', desc: 'Hiragana, Katakana, basic Kanji & daily welcomes' },
        { code: 'N4', name: 'Elementary', tag: 'Elementary', desc: 'Daily conversations, trains, dining & family' },
        { code: 'N3', name: 'Bridge', tag: 'Intermediate', desc: 'Everyday scenarios at near-natural speed' },
        { code: 'N2', name: 'Business', tag: 'Upper-Intermediate', desc: 'Complex topics, essays & news' },
      ],
    },
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    flagCode: 'FR',
    description: 'The global language of romance, cuisine, philosophy, and diplomacy.',
    accent: 'info',
    tint: 'from-info-bg to-surface-100',
    speakers: '280M+',
    code: 'fr-FR',
    popularPhrases: ['Bonjour', 'Merci', "S'il vous plaît", 'Enchanté'],
    framework: {
      name: 'CEFR',
      fullName: 'Common European Framework of Reference',
      levels: [
        { code: 'A1', name: 'Découverte', tag: 'Beginner', desc: 'Essential greetings, café dining, numbers' },
        { code: 'A2', name: 'Survie', tag: 'Elementary', desc: 'Directions, train stations, family & city life' },
        { code: 'B1', name: 'Seuil', tag: 'Intermediate', desc: 'Travel experiences, opinions & debates' },
      ],
    },
  },
  {
    id: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flagCode: 'DE',
    description: 'Rich, structured language of thinkers, science, and European commerce.',
    accent: 'amber',
    tint: 'from-amber-50 to-surface-100',
    speakers: '130M+',
    code: 'de-DE',
    popularPhrases: ['Hallo', 'Guten Tag', 'Danke', 'Auf Wiedersehen'],
    framework: {
      name: 'CEFR',
      fullName: 'Gemeinsamer Europäischer Referenzrahmen (GER)',
      levels: [
        { code: 'A1', name: 'Einstieg', tag: 'Beginner', desc: 'Alltägliche Ausdrücke, Begrüßung, Bäckerei' },
        { code: 'A2', name: 'Grundlagen', tag: 'Elementary', desc: 'Bahnhof, Wegbeschreibung, Familie & Freizeit' },
        { code: 'B1', name: 'Mittelstufe', tag: 'Intermediate', desc: 'Reiseerlebnisse, Meinungen & Pläne' },
      ],
    },
  },
];

export default languages;

