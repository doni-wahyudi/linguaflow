/**
 * @file french.js
 * @description Authentic French grammar micro-guides aligned to CEFR levels (A1 Breakthrough, A2 Waystage, B1 Threshold).
 */

export const frenchGrammar = {
  'fr-foundations-1': {
    id: 'fr-grammar-foundations-1',
    title: 'French Phonetics, Silent Consonants & Liaisons',
    subtitle: 'The Melody and Orthography of Spoken French',
    readTimeMinutes: 1,
    concept: 'French writing has a rich history that creates distinct orthographic patterns. Most final consonants (d, p, s, t, x, z) are silent, vowels followed by n or m produce nasal resonance, and liaisons connect final letters into subsequent vowels for smooth vocal flow.',
    rules: [
      {
        rule: 'Silent Final Consonants (D, P, S, T, X, Z)',
        pattern: 'Consonants at the end of words remain unpronounced',
        example: 'chat (/ʃa/ - cat), vous (/vu/ - you), grand (/ɡʁɑ̃/ - tall)',
        translation: 'The final consonant is dropped unless linked through liaison.',
      },
      {
        rule: 'Liaison with Following Vowel',
        pattern: '[Silent consonant] + [Vowel sound] -> consonant links',
        example: 'vous avez (/vu.za.ve/), un grand ami (/œ̃.ɡʁɑ̃.ta.mi/)',
        translation: 'Final "s" sounds like /z/; final "d" sounds like /t/.',
      },
    ],
    tip: 'Remember the acronym CaReFuL (C, R, F, L): these consonants at word ends are usually PRONOUNCED, while others are silent!',
  },

  'fr-basics-1': {
    id: 'fr-grammar-basics-1',
    title: 'Subject Pronouns & Present Tense of Être',
    subtitle: 'The foundation of French sentence structure',
    readTimeMinutes: 1,
    concept: 'French is an SVO language requiring explicit subject pronouns (je, tu, il/elle, nous, vous, ils/elles), unlike Spanish or Italian. The irregular auxiliary verb être (to be) is indispensable for introducing yourself, describing origin, and stating current condition.',
    rules: [
      {
        rule: 'Conjugate "être" across subject persons',
        pattern: 'Je suis, Tu es, Il/Elle est, Nous sommes, Vous êtes, Ils/Elles sont',
        example: 'Je suis ravi de vous rencontrer aujourd\'hui.',
        translation: 'I am delighted to meet you today.',
      },
      {
        rule: 'Elision: "Je" elides to "J\'" before vowels or mute h',
        pattern: 'J\' + voyelle / h muet',
        example: 'J\'habite à Paris depuis trois ans.',
        translation: 'I have lived in Paris for three years.',
      },
    ],
    tip: 'Always pronounce the liaison in "vous êtes" (sounds like "voo-zette") and "nous sommes" for authentic French cadence.',
  },

  'fr-basics-2': {
    id: 'fr-grammar-basics-2',
    title: 'Polite Inversion & Tu vs. Vous (Vouvoiement)',
    subtitle: 'Manners and formal register in francophone culture',
    readTimeMinutes: 1,
    concept: 'French culture places paramount importance on politeness registers. Use "vous" (vouvoiement) with strangers, professionals, elders, and shopkeepers. Reserve "tu" (tutoiement) for friends, family, and children.',
    rules: [
      {
        rule: 'Use "S\'il vous plaît" in public and "S\'il te plaît" with peers',
        pattern: 'S\'il vous plaît (formal/plural) vs. S\'il te plaît (informal singular)',
        example: 'Un croissant et un café noir, s\'il vous plaît.',
        translation: 'A croissant and a black coffee, please.',
      },
      {
        rule: 'Invert subject and verb or use modal verbs for polite inquiries',
        pattern: 'Pourriez-vous + infinitif / Auriez-vous + nom',
        example: 'Pourriez-vous répéter plus lentement, s\'il vous plaît ?',
        translation: 'Could you please repeat more slowly?',
      },
    ],
    tip: 'When entering any French boutique, bakery, or café, always greet the proprietor with "Bonjour monsieur/madame" before making any request.',
  },

  'fr-greetings-1': {
    id: 'fr-grammar-greetings-1',
    title: 'Reflexive Verbs & Introducing Yourself (S\'appeler)',
    subtitle: 'How reflexive pronouns work in French introductions',
    readTimeMinutes: 1,
    concept: 'In French, stating your name uses the reflexive verb "s\'appeler" (literally: to call oneself). Reflexive pronouns match the subject: je m\'appelle, tu t\'appelles, il/elle s\'appelle, vous vous appelez.',
    rules: [
      {
        rule: 'Match reflexive pronoun to the subject pronoun',
        pattern: 'Sujet + me / te / se / nous / vous + verbe conjugué',
        example: 'Je m\'appelle Sophie et voici mon collègue.',
        translation: 'My name is Sophie and here is my colleague.',
      },
      {
        rule: 'Inquire identity politely with inversion or question words',
        pattern: 'Comment vous appelez-vous ? / Comment tu t\'appelles ?',
        example: 'Comment vous appelez-vous, madame ?',
        translation: 'What is your name, madam?',
      },
    ],
    tip: 'When someone introduces themselves and you reply "Enchanté", write "Enchantée" with an extra "e" if you are female, though both sound identical.',
  },

  'fr-numbers-1': {
    id: 'fr-grammar-numbers-1',
    title: 'Numbers, Prices & Counting Nouns',
    subtitle: 'Plural agreement and pronouncing terminal consonants',
    readTimeMinutes: 1,
    concept: 'French numbers precede nouns directly without requiring counter particles. Unlike English, final consonants in numbers like six, huit, and dix change pronunciation depending on whether they precede a consonant, vowel, or stand alone.',
    rules: [
      {
        rule: 'Numbers precede nouns directly without gender change, except "un / une"',
        pattern: 'Nombre + Nom (pluriel)',
        example: 'Trois cafés et une brioche, s\'il vous plaît.',
        translation: 'Three coffees and one brioche, please.',
      },
      {
        rule: 'Consonant liaison with numbers ending in -s, -x, or -t before vowels',
        pattern: 'deux / trois / six / dix + voyelle -> liaison en /z/',
        example: 'Deux amis arrivent dans six heures.',
        translation: 'Two friends are arriving in six hours.',
      },
    ],
    tip: 'When ordering numbers in French bakeries or bistros, hold up your thumb for "un", thumb + index for "deux".',
  },

  'fr-food-1': {
    id: 'fr-grammar-food-1',
    title: 'Partitive Articles (Du, De la, Des)',
    subtitle: 'Expressing unspecified quantities of food and drink',
    readTimeMinutes: 1,
    concept: 'When speaking of food or drinks in non-specific amounts ("some water", "some bread"), French requires partitive articles: "du" (masculine), "de la" (feminine), "de l\'" (before vowel), and "des" (plural).',
    rules: [
      {
        rule: 'Use "du / de la / de l\'" for uncountable food items',
        pattern: 'du (m.) / de la (f.) / de l\' (voyelle) + nom',
        example: 'Je voudrais du pain et de la confiture.',
        translation: 'I would like some bread and some jam.',
      },
      {
        rule: 'In negative sentences, partitive articles reduce simply to "de / d\'"',
        pattern: 'ne ... pas + de / d\' + nom',
        example: 'Je ne prends pas de sucre avec mon café.',
        translation: 'I do not take sugar with my coffee.',
      },
    ],
    tip: 'To order politely like a local, use the conditional "Je voudrais..." rather than "Je veux..." (which sounds demanding).',
  },

  'fr-travel-1': {
    id: 'fr-grammar-travel-1',
    title: 'Prepositions of Transportation & Movement (À vs. En)',
    subtitle: 'Getting around cities and countries accurately',
    readTimeMinutes: 1,
    concept: 'French distinguishes between enclosed vehicles you get inside ("en train", "en voiture", "en avion") and modes of transport you mount or walk upon ("à vélo", "à pied").',
    rules: [
      {
        rule: 'Use "en" for enclosed transport and feminine countries',
        pattern: 'en + train / métro / bus / voiture / avion / France',
        example: 'Nous voyageons en TGV de Paris à Marseille.',
        translation: 'We are traveling by TGV from Paris to Marseille.',
      },
      {
        rule: 'Use "à" for open transport, walking, and cities',
        pattern: 'à + pied / vélo / Paris / Lyon',
        example: 'La gare est accessible à pied en dix minutes.',
        translation: 'The train station is accessible on foot in ten minutes.',
      },
    ],
    tip: 'Contract preposition "à" with masculine "le" to form "au": "au musée", "au guichet", but "à la gare".',
  },

  'fr-travel-2': {
    id: 'fr-grammar-travel-2',
    title: 'The Imperative Mood for Directions',
    subtitle: 'Giving and following navigation instructions',
    readTimeMinutes: 1,
    concept: 'Giving directions in French uses the imperative form of regular verbs (tourner, continuer, traverser, prendre). For polite or public address, use the "vous" imperative (-ez ending).',
    rules: [
      {
        rule: 'Form the formal imperative with the present "vous" verb form without the pronoun',
        pattern: 'Verbe au présent (forme vous) sans pronom',
        example: 'Tournez à gauche au carrefour, puis continuez tout droit.',
        translation: 'Turn left at the intersection, then continue straight ahead.',
      },
      {
        rule: 'Directional prepositions combine with definite articles',
        pattern: 'à côté de / en face de + article contracté (du / des)',
        example: 'La pharmacie se trouve en face du musée.',
        translation: 'The pharmacy is located opposite the museum.',
      },
    ],
    tip: 'Remember that -er verbs in the informal "tu" imperative drop their final "s": "Tourne à droite !" but "Tournez à droite !"',
  },

  'fr-family-1': {
    id: 'fr-grammar-family-1',
    title: 'Possessive Adjectives & Gender Agreement',
    subtitle: 'Expressing relationships with mon, ma, mes',
    readTimeMinutes: 1,
    concept: 'Possessive adjectives in French agree with the gender and number of the noun possessed (the family member), NOT the owner. "Mon père" (my father), "ma mère" (my mother), "mes parents" (my parents).',
    rules: [
      {
        rule: 'Select possessive by possessor person and noun gender/number',
        pattern: 'Mon/Ma/Mes (1st sing), Ton/Ta/Tes (2nd sing), Son/Sa/Ses (3rd sing), Notre/Nos, Votre/Vos, Leur/Leurs',
        example: 'Son frère et sa sœur vivent à Lyon.',
        translation: 'His/Her brother and his/her sister live in Lyon.',
      },
      {
        rule: 'Feminine singular nouns starting with a vowel take "mon", "ton", "son" for phonetic harmony',
        pattern: 'mon / ton / son + nom féminin commençant par une voyelle',
        example: 'Mon amie s\'appelle Élodie.',
        translation: 'My friend is named Élodie.',
      },
    ],
    tip: 'Never say "ma amie" — French forbids vowel clash here and replaces "ma" with "mon" even though "amie" is feminine.',
  },

  'fr-work-1': {
    id: 'fr-grammar-work-1',
    title: 'The Passé Composé with Avoir & Être',
    subtitle: 'Narrating completed professional achievements and past events',
    readTimeMinutes: 1,
    concept: 'The passé composé is the primary past tense for completed actions. Most verbs take auxiliary "avoir" + past participle (-é, -i, -u), while movement verbs (DR MRS VANDERTRAMP) and reflexive verbs take auxiliary "être" with gender/number agreement.',
    rules: [
      {
        rule: 'Form passé composé with "avoir" for most transitive actions',
        pattern: 'Sujet + avoir (présent) + participe passé',
        example: 'Nous avons envoyé le compte rendu ce matin.',
        translation: 'We sent the minutes / summary this morning.',
      },
      {
        rule: 'Verbs conjugated with "être" agree in gender and number with the subject',
        pattern: 'Sujet + être (présent) + participe passé (+e / +s / +es)',
        example: 'La directrice est arrivée à la réunion à dix heures.',
        translation: 'The director (female) arrived at the meeting at ten o\'clock.',
      },
    ],
    tip: 'Regular -er verbs form their past participle by replacing -er with -é (travailler -> travaillé; envoyer -> envoyé).',
  },

  'fr-opinions-1': {
    id: 'fr-grammar-opinions-1',
    title: 'Indicative vs. Subjunctive with Opinion Verbs',
    subtitle: 'Expressing certainty vs. doubt and nuance',
    readTimeMinutes: 1,
    concept: 'Verbs of thinking and belief (penser que, croire que, trouver que) take the indicative mood in the affirmative because certainty is expressed. However, in the negative or interrogative, they often trigger the subjunctive mood because doubt is introduced.',
    rules: [
      {
        rule: 'Affirmative belief verbs take the standard indicative mood',
        pattern: 'Je pense que / Je crois que + indicatif',
        example: 'Je pense que ce projet est tout à fait réalisable.',
        translation: 'I think that this project is entirely feasible.',
      },
      {
        rule: 'Negative opinion verbs or necessity triggers the subjunctive mood',
        pattern: 'Je ne pense pas que / Il faut que + subjonctif',
        example: 'Je ne crois pas que ce soit la meilleure approche.',
        translation: 'I do not believe that this is the best approach.',
      },
    ],
    tip: 'The irregular subjunctive forms of "être" (soit) and "avoir" (ait) are the most frequent in French debates and opinion discussions.',
  },
};

export default frenchGrammar;
