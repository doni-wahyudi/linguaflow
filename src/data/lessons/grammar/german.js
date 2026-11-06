/**
 * @file german.js
 * @description Authentic German grammar micro-guides aligned to CEFR levels (A1 Einstieg, A2 Grundlagen, B1 Mittelstufe).
 */

export const germanGrammar = {
  'de-basics-1': {
    id: 'de-grammar-basics-1',
    title: 'Verb Conjugation (Sein & Heißen) and V2 Word Order',
    subtitle: 'The foundation of German sentence architecture',
    readTimeMinutes: 1,
    concept: 'In German main declarative clauses, the finite conjugated verb ALWAYS occupies the second position (V2 rule). The irregular auxiliary verb "sein" (to be) and regular verb "heißen" (to be called) form the bedrock of daily greetings and basic introductions.',
    rules: [
      {
        rule: 'Verb Second (V2): Place the conjugated verb in position 2',
        pattern: 'Position 1 (Subject or Adverb) + Verb (conjugated) + rest of clause',
        example: 'Heute bin ich in Berlin.',
        translation: 'Today I am in Berlin.',
      },
      {
        rule: 'Conjugate "sein" in present tense',
        pattern: 'ich bin, du bist, er/sie/es ist, wir sind, ihr seid, Sie/sie sind',
        example: 'Ich bin sehr froh, Sie kennenzulernen.',
        translation: 'I am very glad to meet you.',
      },
    ],
    tip: 'German capitalizes all nouns without exception: "Guten Tag", "Guten Morgen", "Guten Abend" all capitalize their time nouns.',
  },

  'de-basics-2': {
    id: 'de-grammar-basics-2',
    title: 'Du vs. Sie & Modal Politeness (Könnten Sie / Bitte)',
    subtitle: 'Formal etiquette and courteous requests in DACH countries',
    readTimeMinutes: 1,
    concept: 'German maintains a strict distinction between informal "du" (friends, family, children) and formal "Sie" (capitalized: strangers, business associates, officials, shopkeepers). Courteous requests employ the Konjunktiv II conditional ("könnten", "hätten", "würden").',
    rules: [
      {
        rule: 'Use capitalized "Sie" with 3rd-person plural verb ending (-en)',
        pattern: 'Sie + Verb (-en) vs. du + Verb (-st)',
        example: 'Könnten Sie das bitte wiederholen?',
        translation: 'Could you please repeat that?',
      },
      {
        rule: 'The multipurpose particle "bitte" functions as both "please" and "you\'re welcome"',
        pattern: 'Danke! — Bitte sehr! / Bitte schön!',
        example: '— Vielen Dank für die Hilfe! — Bitte schön!',
        translation: '— Many thanks for the help! — You are very welcome!',
      },
    ],
    tip: 'Always use "Sie" unless the other person explicitly offers "das Du" (e.g. "Wir können uns gerne duzen").',
  },

  'de-greetings-1': {
    id: 'de-grammar-greetings-1',
    title: 'Nominative & Dative Pronouns in Greetings (Wie geht es dir / Ihnen?)',
    subtitle: 'Why "How are you?" takes the dative case',
    readTimeMinutes: 1,
    concept: 'In German, asking "How are you?" literally translates to "How goes it to you?" using the impersonal verb "gehen" + dative pronoun. Therefore, "dir" (informal singular), "Ihnen" (formal), or "euch" (informal plural) is used instead of nominative subject pronouns.',
    rules: [
      {
        rule: 'Form inquiries with "Wie geht es" + Dative pronoun',
        pattern: 'Wie geht es + dir (informal) / Ihnen (formal) / euch (plural)',
        example: 'Wie geht es Ihnen heute, Frau Weber?',
        translation: 'How are you today, Ms. Weber?',
      },
      {
        rule: 'Respond using dative pronoun "mir" + "geht es"',
        pattern: 'Mir geht es + gut / sehr gut / wunderbar',
        example: 'Mir geht es prima, danke der Nachfrage!',
        translation: 'I am doing great, thanks for asking!',
      },
    ],
    tip: 'In casual conversation, Germans compress "Wie geht es dir?" down to the snappy contraction "Wie geht\'s?".',
  },

  'de-numbers-1': {
    id: 'de-grammar-numbers-1',
    title: 'Numbers & Telling Time (Offiziell vs. Umgangssprachlich)',
    subtitle: 'Counting nouns, prices, and mastering quarter hours',
    readTimeMinutes: 1,
    concept: 'German numbers 1–12 have distinct single-word roots. "Eins" drops its final "-s" to become an indefinite article ("ein", "eine", "einen") before nouns. For numbers 21–99, German uniquely places the unit before the ten joined by "und" (einundzwanzig = 21).',
    rules: [
      {
        rule: 'Unit before ten construction for two-digit numbers above 20',
        pattern: '[Einer] + und + [Zehner] (z.B. einundzwanzig, fünfunddreißig)',
        example: 'Das Ticket kostet fünfundzwanzig Euro.',
        translation: 'The ticket costs twenty-five euros.',
      },
      {
        rule: 'State official time with "Uhr" and minutes',
        pattern: 'Es ist [Stunde] Uhr [Minute]',
        example: 'Es ist genau zehn Uhr fünfzehn.',
        translation: 'It is exactly 10:15.',
      },
    ],
    tip: 'In informal German time, "halb drei" means 2:30 (halfway towards 3), not 3:30!',
  },

  'de-food-1': {
    id: 'de-grammar-food-1',
    title: 'Gender of Nouns (Der, Die, Das) & Accusative Direct Objects',
    subtitle: 'Articles in the bakery, café, and restaurant',
    readTimeMinutes: 1,
    concept: 'Every German noun has grammatical gender: masculine (der), feminine (die), or neuter (das). When ordering food or drinks as a direct object, masculine articles change in the accusative case (der -> den, ein -> einen), while feminine and neuter stay unchanged.',
    rules: [
      {
        rule: 'Masculine nouns change from "ein" to "einen" in the accusative',
        pattern: 'Ich möchte / Ich hätte gern + einen [mask.] / eine [fem.] / ein [neut.]',
        example: 'Ich hätte gern einen Kaffee und ein Croissant, bitte.',
        translation: 'I would like a coffee and a croissant, please.',
      },
      {
        rule: 'Plural nouns generally take "die" in nominative and accusative',
        pattern: 'Zwei / Drei + Substantiv im Plural',
        example: 'Zwei Brötchen und drei Stück Kuchen, bitte.',
        translation: 'Two bread rolls and three pieces of cake, please.',
      },
    ],
    tip: 'Use "Ich hätte gern..." (I would like to have) when ordering—it is universally polite and natural across Germany, Austria, and Switzerland.',
  },

  'de-travel-1': {
    id: 'de-grammar-travel-1',
    title: 'Two-Way Prepositions (Wechselpräpositionen) with Dative vs. Accusative',
    subtitle: 'Location (Wo?) vs. Destination (Wohin?) at stations and airports',
    readTimeMinutes: 1,
    concept: 'Nine German prepositions (an, auf, in, über, unter, vor, hinter, neben, zwischen) take the DATIVE case when indicating stationary position (Wo? / Where at?), but the ACCUSATIVE case when indicating direction or motion toward a target (Wohin? / Where to?).',
    rules: [
      {
        rule: 'Location takes Dative (an dem -> am, in dem -> im)',
        pattern: 'Wo? -> an / auf / in + Dativ',
        example: 'Der Zug steht am Bahnhof auf Gleis vier.',
        translation: 'The train is standing at the station on platform four.',
      },
      {
        rule: 'Destination takes Accusative (in den / ans / ins)',
        pattern: 'Wohin? -> in / an + Akkusativ',
        example: 'Wir steigen jetzt in den Zug ein.',
        translation: 'We are boarding the train right now.',
      },
    ],
    tip: 'Common contractions: an + dem = am; in + dem = im; zu + dem = zum; zu + der = zur.',
  },

  'de-travel-2': {
    id: 'de-grammar-travel-2',
    title: 'Imperative Form & Separable Verbs in Directions (Abbiegen, Einbiegen)',
    subtitle: 'Giving precise navigational guidance',
    readTimeMinutes: 1,
    concept: 'Giving directions in German heavily uses separable prefix verbs (abbiegen = to turn off, weitergehen = to walk further, einbiegen = to turn into). In main clauses, the prefix splits off and lands at the very end of the sentence.',
    rules: [
      {
        rule: 'Separable prefix moves to the sentence end in present & imperative',
        pattern: 'Biegen Sie + [Richtung] + ab! / Gehen Sie + geradeaus!',
        example: 'Biegen Sie an der Kreuzung nach links ab!',
        translation: 'Turn left at the intersection!',
      },
      {
        rule: 'Directional adverbs with prepositions take the dative case',
        pattern: 'nach links / rechts; an der Ampel / Kreuzung (Dativ feminin)',
        example: 'An der nächsten Ampel gehen Sie bitte geradeaus weiter.',
        translation: 'At the next traffic light, please continue straight ahead.',
      },
    ],
    tip: 'For formal imperative, simply invert "Sie" and the infinitive: "Gehen Sie", "Biegen Sie ab", "Folgen Sie".',
  },

  'de-family-1': {
    id: 'de-grammar-family-1',
    title: 'Possessive Determiners (Mein, Dein, Sein, Ihr) & Case Endings',
    subtitle: 'Talking about family, relatives, and relationships',
    readTimeMinutes: 1,
    concept: 'Possessive determiners in German (mein, dein, sein, ihr, unser, euer, Ihr) take case and gender endings matching the family member described: -e for feminine and plural (meine Mutter, meine Kinder), and -en for masculine in accusative (meinen Vater).',
    rules: [
      {
        rule: 'Add "-e" for feminine and plural nouns in the nominative',
        pattern: 'mein (m./n.) vs. meine (f./pl.)',
        example: 'Mein Vater und meine Mutter wohnen in Hamburg.',
        translation: 'My father and my mother live in Hamburg.',
      },
      {
        rule: 'Masculine possessives add "-en" in the accusative case',
        pattern: 'Ich besuche meinen Bruder / meinen Großvater',
        example: 'Am Wochenende besuche ich meinen älteren Bruder.',
        translation: 'On the weekend I am visiting my older brother.',
      },
    ],
    tip: '"Ihr" (capitalized) means "your" (formal), while "ihr" (lowercase) can mean "her", "their", or "you all" (nominative plural pronoun).',
  },

  'de-work-1': {
    id: 'de-grammar-work-1',
    title: 'The Perfect Tense (Perfekt) with Haben & Sein in Business',
    subtitle: 'Reporting completed tasks and professional milestones',
    readTimeMinutes: 1,
    concept: 'The Perfekt is the primary spoken past tense in German. It is formed with auxiliary "haben" (for most verbs) or "sein" (for movement or change of state verbs) in Position 2, with the past participle (Partizip II) at the very end of the clause (sentence bracket / Satzklammer).',
    rules: [
      {
        rule: 'Form Perfekt with "haben" and place Partizip II at clause end',
        pattern: 'Subjekt + haben (konjugiert) + ... + Partizip II (ge-...-t / ge-...-en)',
        example: 'Wir haben den Bericht gestern erfolgreich abgeschlossen.',
        translation: 'We successfully completed the report yesterday.',
      },
      {
        rule: 'Verbs ending in "-ieren" do not take the "ge-" prefix in Partizip II',
        pattern: 'Infinitive in -ieren -> Partizip II in -iert (ohne ge-)',
        example: 'Die Kollegin hat das Projekt ausgezeichnet präsentiert.',
        translation: 'The colleague presented the project excellently.',
      },
    ],
    tip: 'German sentence structure creates a "bracket" (Satzklammer): the auxiliary verb opens the bracket in Position 2, and the participle closes it at the very end.',
  },

  'de-opinions-1': {
    id: 'de-grammar-opinions-1',
    title: 'Subordinate Clauses with "Dass", "Weil" & Verb-Final Word Order',
    subtitle: 'Constructing arguments and nuanced viewpoints',
    readTimeMinutes: 1,
    concept: 'Subordinating conjunctions like "dass" (that), "weil" (because), and "obwohl" (although) introduce subordinate clauses (Nebensätze) where the conjugated verb moves to the absolute END of the clause.',
    rules: [
      {
        rule: 'Subordinate conjunction pushes the conjugated verb to the very end',
        pattern: 'Hauptsatz, dass / weil + Subjekt + ... + konjugiertes Verb.',
        example: 'Ich bin der Ansicht, dass diese Strategie sinnvoll ist.',
        translation: 'I am of the view that this strategy is sensible.',
      },
      {
        rule: '"Meiner Meinung nach" occupies Position 1, triggering immediate verb inversion',
        pattern: 'Meiner Meinung nach + konjugiertes Verb + Subjekt',
        example: 'Meiner Meinung nach sollten wir diese Chance nutzen.',
        translation: 'In my opinion, we should seize this opportunity.',
      },
    ],
    tip: 'Always place a comma before "dass", "weil", and other subordinating conjunctions in written German.',
  },
};

export default germanGrammar;
