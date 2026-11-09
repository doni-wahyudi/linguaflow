/**
 * @file spanish.js
 * @description Authentic, pedagogically structured grammar micro-guides for Spanish curriculum (CEFR A1–B1).
 */

export const spanishGrammar = {
  'es-foundations-1': {
    id: 'es-grammar-foundations-1',
    title: 'Spanish Orthography, Accents & Vowel Clarity',
    subtitle: 'The 5 Pure Vowels and Stress Rules',
    readTimeMinutes: 1,
    concept: 'Spanish is one of the most phonetic languages in the world: almost every letter corresponds to a single, consistent sound. The five vowels (A, E, I, O, U) are pure and unwavering. Spoken stress follows strict rules based on ending letters, and any exception is marked with a written accent mark (tilde).',
    rules: [
      {
        rule: 'The Five Pure Spanish Vowels',
        pattern: 'A (/a/), E (/e/), I (/i/), O (/o/), U (/u/)',
        example: 'amigo (/aˈmiɣo/), café (/kaˈfe/), luna (/ˈluna/)',
        translation: 'Spanish vowels never glide into extra sounds at the end.',
      },
      {
        rule: 'Natural Stress vs. Written Accents (La Tilde)',
        pattern: 'Vowel/N/S ending -> penult; other consonants -> final syllable',
        example: 'casa (CA-sa) vs. hablar (ha-BLAR) vs. música (MÚ-si-ca)',
        translation: 'A written accent always overrides the default syllable stress.',
      },
    ],
    tip: 'The letter H in Spanish is 100% silent in all contexts! Never pronounce the H in "hola" or "hablar".',
  },

  'es-basics-1': {
    id: 'es-grammar-basics-1',
    title: 'Subject Pronouns & Word Order',
    subtitle: 'Understanding Subject Pronouns and Sentence Flow',
    readTimeMinutes: 1,
    concept: 'In Spanish, basic sentence structure follows Subject-Verb-Object (SVO). However, subject pronouns (yo, tú, él, ella...) are commonly omitted because Spanish verb conjugations explicitly indicate the subject.',
    rules: [
      {
        rule: 'Subject Pronoun Omission (Pro-Drop)',
        pattern: '(Pronombre sujeto) + Verbo conjugado + Objeto',
        example: '(Yo) Hablo español con mis amigos.',
        translation: 'I speak Spanish with my friends.',
      },
      {
        rule: 'Standard Declarative Word Order (SVO)',
        pattern: 'Sujeto + Verbo + Predicado',
        example: 'Carlos aprende idiomas todos los días.',
        translation: 'Carlos learns languages every day.',
      },
      {
        rule: 'Direct Questions with Inverted Order',
        pattern: '¿(Palabra interrogativa) + Verbo + Sujeto?',
        example: '¿Hablas tú inglés en el trabajo?',
        translation: 'Do you speak English at work?',
      },
    ],
    tip: 'Native speakers drop subject pronouns like "yo" or "tú" unless emphasizing who did the action. Saying "Yo hablo" all the time sounds unnatural!',
  },

  'es-basics-2': {
    id: 'es-grammar-basics-2',
    title: 'Gender & Number Agreement',
    subtitle: 'Mastering Articles and Endings (-o / -a, -os / -as)',
    readTimeMinutes: 1,
    concept: 'Every Spanish noun has a grammatical gender (masculine or feminine) and number (singular or plural). Definite articles (el, la, los, las) and adjectives must match the noun in gender and number.',
    rules: [
      {
        rule: 'Regular Gender Endings (-o masculine, -a feminine)',
        pattern: 'el + sustantivo en -o / la + sustantivo en -a',
        example: 'El amigo es simpático; la amiga es amable.',
        translation: 'The friend (m) is nice; the friend (f) is kind.',
      },
      {
        rule: 'Plural Formation with Vowels and Consonants',
        pattern: 'Vocal + -s / Consonante + -es',
        example: 'El libro -> los libros; la ciudad -> las ciudades.',
        translation: 'The book -> the books; the city -> the cities.',
      },
      {
        rule: 'Adjective Agreement with Nouns',
        pattern: 'Sustantivo + Adjetivo (mismo género y número)',
        example: 'Muchas gracias por las palabras amables.',
        translation: 'Thank you very much for the kind words.',
      },
    ],
    tip: 'Watch out for common exceptions: "el día" is masculine despite ending in -a, and "la mano" is feminine despite ending in -o!',
  },

  'es-greetings-1': {
    id: 'es-grammar-greetings-1',
    title: 'Formal vs. Informal Address (Tú vs. Usted)',
    subtitle: 'Navigating Social Hierarchy and Respect in Spanish',
    readTimeMinutes: 1,
    concept: 'Spanish distinguishes between informal address (tú) for friends, family, and peers, and formal address (usted) for professionals, elders, and strangers. The verb changes between 2nd and 3rd person forms.',
    rules: [
      {
        rule: 'Informal Second-Person Address (Tú)',
        pattern: 'Tú + Verbo(-s) / ¿Cómo te llamas?',
        example: 'Hola Elena, ¿cómo estás hoy?',
        translation: 'Hello Elena, how are you today?',
      },
      {
        rule: 'Formal Third-Person Address (Usted)',
        pattern: 'Usted + Verbo(3ª persona) / ¿Cómo se llama usted?',
        example: 'Buenos días señor Gómez, ¿cómo está usted?',
        translation: 'Good morning Mr. Gomez, how are you?',
      },
      {
        rule: 'Formal vs Informal Meeting Greetings',
        pattern: 'Encantado de conocerte (tú) vs. Mucho gusto en conocerle (usted)',
        example: 'Es un placer conocerle, doctora Sánchez.',
        translation: 'It is a pleasure to meet you, Dr. Sanchez.',
      },
    ],
    tip: 'When in doubt in a professional or administrative situation, start with "usted". If the speaker prefers informal, they will invite you with "¿Nos tuteamos?"',
  },

  'es-numbers-1': {
    id: 'es-grammar-numbers-1',
    title: 'Telling Time & Scheduling',
    subtitle: 'Using "Son las..." vs. "A las..." with Hours',
    readTimeMinutes: 1,
    concept: 'To state what time it is currently, use "Es la una" for 1:00 (singular) and "Son las [número]" for other hours. To specify when an event happens, use "A la una" or "A las [número]".',
    rules: [
      {
        rule: 'Stating Current Time',
        pattern: 'Es la una [minutos] / Son las [dos...doce] [minutos]',
        example: 'Son las cuatro y media de la tarde.',
        translation: 'It is 4:30 in the afternoon.',
      },
      {
        rule: 'Scheduled Event Times',
        pattern: 'A la una / A las [dos...doce]',
        example: 'La reunión de trabajo empieza a las diez en punto.',
        translation: 'The work meeting starts at 10:00 sharp.',
      },
      {
        rule: 'Quarter and Half Hours',
        pattern: 'hora + y cuarto (15 min) / y media (30 min) / menos cuarto (-15 min)',
        example: 'El tren sale a las siete menos cuarto de la mañana.',
        translation: 'The train departs at a quarter to seven in the morning.',
      },
    ],
    tip: 'Use "de la mañana" (AM), "de la tarde" (PM before sunset), and "de la noche" (night) when telling time conversationally in Spanish.',
  },

  'es-food-1': {
    id: 'es-grammar-food-1',
    title: 'Polite Ordering & Requests',
    subtitle: 'Using Conditional Forms: Quisiera & Me gustaría',
    readTimeMinutes: 1,
    concept: 'When ordering food or drinks at a restaurant, native speakers soften their requests using polite conditional forms ("Quisiera...", "Me gustaría...") instead of the direct "Quiero..." (I want).',
    rules: [
      {
        rule: 'Polite Request with Quisiera / Me gustaría',
        pattern: 'Quisiera / Me gustaría + [sustantivo / infinitivo], por favor',
        example: 'Quisiera un café con leche y una botella de agua, por favor.',
        translation: 'I would like a coffee with milk and a bottle of water, please.',
      },
      {
        rule: 'Asking Waitstaff with Inverted Questions',
        pattern: '¿Me trae / Nos puede traer + [artículo + plato/cuenta]?',
        example: '¿Nos trae la cuenta cuando pueda, por favor?',
        translation: 'Could you bring us the bill when you can, please?',
      },
      {
        rule: 'Ordering for the Group (Para mí / Para él)',
        pattern: 'Para mí + plato, y para ella + plato',
        example: 'Para mí la paella, y para él el pescado del día.',
        translation: 'For me the paella, and for him the fish of the day.',
      },
    ],
    tip: 'To get the waiter’s attention respectfully in Spain and Latin America, raise a hand slightly and say "¡Disculpe!" or "¡Perdón!", never snap fingers or yell across the room.',
  },

  'es-travel-1': {
    id: 'es-grammar-travel-1',
    title: 'Ser vs. Estar (Essential Differences)',
    subtitle: 'Inherent Characteristics vs. Locations & Temporary States',
    readTimeMinutes: 1,
    concept: 'Spanish has two verbs for "to be": "ser" describes intrinsic identity, origin, nationality, and permanent attributes; "estar" describes geographic location, physical condition, and temporary states.',
    rules: [
      {
        rule: 'Ser for Inherent Traits, Origin, and Identity',
        pattern: 'Sujeto + ser (soy, eres, es, somos, son) + profesión/origen/cualidad',
        example: 'El hotel es muy céntrico, moderno y tranquilo.',
        translation: 'The hotel is very central, modern, and quiet.',
      },
      {
        rule: 'Estar for Location and Transient States',
        pattern: 'Sujeto + estar (estoy, estás, está, estamos, están) + en + lugar / condición',
        example: 'El aeropuerto está a veinte kilómetros de la ciudad.',
        translation: 'The airport is twenty kilometers from the city.',
      },
      {
        rule: 'Meaning Change with Ser vs. Estar',
        pattern: 'ser [adjetivo] (cualidad) vs. estar [adjetivo] (estado actual)',
        example: 'La sopa es deliciosa (en general) vs. La sopa está caliente (ahora).',
        translation: 'The soup is delicious (attribute) vs. The soup is hot (current state).',
      },
    ],
    tip: 'Mnemonic: "For how you feel and where you are, always use the verb ESTAR! For who you are and where you are from, use SER until kingdom come!"',
  },

  'es-travel-2': {
    id: 'es-grammar-travel-2',
    title: 'Spatial Prepositions & Direction Commands',
    subtitle: 'Navigating with Mandatory Contraction "del" and Imperatives',
    readTimeMinutes: 1,
    concept: 'Spatial prepositions in Spanish frequently combine with "de". When "de" is followed by the masculine article "el", they contract into "del". Directions typically use formal imperatives (Gire, Siga, Cruce).',
    rules: [
      {
        rule: 'Spatial Prepositions with Mandatory Contraction "del"',
        pattern: 'cerca de / lejos de / al lado de + el -> del + sustantivo',
        example: 'El museo histórico está al lado del parque central.',
        translation: 'The historical museum is next to the central park.',
      },
      {
        rule: 'Directional Verbs and Imperatives',
        pattern: 'Gire / Doble + a la derecha/izquierda; Siga + todo recto',
        example: 'Siga todo recto dos calles y gire a la derecha en el semáforo.',
        translation: 'Go straight ahead two streets and turn right at the traffic light.',
      },
      {
        rule: 'Expressing Proximity and Distance',
        pattern: 'estar + a + [distancia / tiempo] + de + [lugar]',
        example: 'La estación está a cinco minutos a pie de aquí.',
        translation: 'The station is five minutes on foot from here.',
      },
    ],
    tip: '"De + el" ALWAYS contracts to "del", and "a + el" ALWAYS contracts to "al" (e.g. "al lado del hotel"). This contraction is required in both spoken and written Spanish.',
  },

  'es-family-1': {
    id: 'es-grammar-family-1',
    title: 'Possessive Adjectives',
    subtitle: 'Expressing Ownership and Family Relations',
    readTimeMinutes: 1,
    concept: 'Possessive adjectives in Spanish (mi/mis, tu/tus, su/sus, nuestro/a/os/as) precede the noun and agree in number with the item or person possessed, NOT the owner. "Nuestro" also agrees in gender.',
    rules: [
      {
        rule: 'Number Agreement for mi, tu, su',
        pattern: 'mi / tu / su + singular; mis / tus / sus + plural',
        example: 'Mi hermano vive en Sevilla y mis padres viven en Madrid.',
        translation: 'My brother lives in Seville and my parents live in Madrid.',
      },
      {
        rule: 'Gender and Number Agreement for nuestro/a',
        pattern: 'nuestro(a)(s) + sustantivo concordante',
        example: 'Nuestra familia es numerosa y nuestros abuelos son cariñosos.',
        translation: 'Our family is large and our grandparents are affectionate.',
      },
      {
        rule: 'Clarifying Ambiguous Third-Person "su/sus"',
        pattern: 'el/la + sustantivo + de él / de ella / de ellos',
        example: 'El coche de él es nuevo; la casa de ellos es grande.',
        translation: 'His car is new; their house is big.',
      },
    ],
    tip: '"Su" and "sus" can mean his, her, its, their, or your (formal). If context doesn’t make it obvious, use "el hijo de ella" or "la madre de él" for absolute clarity.',
  },

  'es-work-1': {
    id: 'es-grammar-work-1',
    title: 'The Present Perfect (Pretérito Perfecto)',
    subtitle: 'Reporting Recent Workplace Actions and Accomplishments',
    readTimeMinutes: 1,
    concept: 'The Pretérito Perfecto Compuesto expresses completed actions that have current relevance or took place within a timeframe that includes the present (hoy, esta semana, este año). It is formed with "haber" plus the past participle.',
    rules: [
      {
        rule: 'Regular Participle Formation (-ado / -ido)',
        pattern: 'haber (he, has, ha, hemos, han) + raíz + -ado / -ido',
        example: 'He trabajado en este proyecto durante toda la semana.',
        translation: 'I have worked on this project throughout the week.',
      },
      {
        rule: 'Key Irregular Participles in the Workplace',
        pattern: 'haber + hecho (hacer) / escrito (escribir) / visto (ver)',
        example: 'Hemos escrito el contrato y hemos hecho la presentación ejecutiva.',
        translation: 'We have written the contract and made the executive presentation.',
      },
      {
        rule: 'Time Markers with Present Perfect',
        pattern: 'hoy / esta mañana / este mes / nunca / ya + pretérito perfecto',
        example: 'Ya he enviado el informe financiero a la jefa.',
        translation: 'I have already sent the financial report to the manager.',
      },
    ],
    tip: 'In Spanish, never place pronouns, negation ("no"), or adverbs between the auxiliary "haber" and the participle. Say "No he terminado todavía", never "He no terminado"!',
  },

  'es-opinions-1': {
    id: 'es-grammar-opinions-1',
    title: 'Indicative vs. Subjunctive in Viewpoints',
    subtitle: 'Expressing Conviction, Doubt, and Value Judgments',
    readTimeMinutes: 1,
    concept: 'When expressing opinions, affirmative statements of conviction or perception (Creo que..., Pienso que...) take the indicative mood. Negative opinions (No creo que...) and impersonal value judgments (Es importante que...) require the subjunctive mood.',
    rules: [
      {
        rule: 'Affirmative Belief Triggers Indicative',
        pattern: 'Creo que / Pienso que / Me parece que + indicativo',
        example: 'Creo que este nuevo enfoque es muy eficiente para el equipo.',
        translation: 'I believe that this new approach is very efficient for the team.',
      },
      {
        rule: 'Negative Belief and Doubt Trigger Subjunctive',
        pattern: 'No creo que / Dudo que + subjuntivo',
        example: 'No creo que tengamos suficiente presupuesto para viajar este mes.',
        translation: 'I do not believe that we have enough budget to travel this month.',
      },
      {
        rule: 'Impersonal Evaluations Trigger Subjunctive',
        pattern: 'Es importante / Es necesario / Es mejor que + subjuntivo',
        example: 'Es importante que mantengamos una comunicación clara y constante.',
        translation: 'It is important that we maintain clear and constant communication.',
      },
    ],
    tip: 'Quick litmus test: Certainty triggers the indicative ("Creo que es verdad"). Negation of certainty or doubt triggers the subjunctive ("No creo que sea verdad")!',
  },
};

export default spanishGrammar;
