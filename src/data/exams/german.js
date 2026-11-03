/**
 * @file german.js
 * @description Official Goethe-Zertifikat / telc Mock Examinations for German A1, A2, and B1.
 * Formatted according to the Common European Framework of Reference (CEFR) & Goethe-Institut standards.
 */

export const germanExams = [
  {
    id: 'goethe-a1',
    languageId: 'de',
    level: 'A1',
    framework: 'CEFR',
    title: 'Goethe-Zertifikat A1: Start Deutsch 1',
    subtitle: 'Offizielle Goethe-Institut A1 Modellprüfung',
    certifyingBody: 'Goethe-Institut & telc GmbH',
    description: 'Proves basic German skills at breakthrough level: simple personal questions, daily notices, numbers, and basic café/transit dialogues.',
    durationMinutes: 20,
    passingScore: 60,
    badge: 'Goethe A1 Certified',
    xpReward: 150,
    sections: [
      {
        id: 'reading',
        name: 'Teil 1: Lesen (Reading Comprehension)',
        weight: 35,
        passage: {
          title: 'Hinweisschild am Hauptbahnhof Frankfurt (Train Station Notice)',
          text: `Achtung Fahrgäste!
Wegen Gleisbauarbeiten fährt der ICE 724 nach München heute nicht von Gleis 4, sondern von Gleis 9 ab.
Die Abfahrtszeit verschiebt sich um 15 Minuten von 14:30 Uhr auf 14:45 Uhr.
Sitzplatzreservierungen bleiben gültig. Der Speisewagen ist heute leider geschlossen.
Wir bitten um Ihr Verständnis.`,
        },
        questions: [
          {
            id: 'de-a1-r1',
            prompt: 'Von welchem Gleis fährt der ICE nach München heute ab?',
            options: ['Gleis 4', 'Gleis 7', 'Gleis 9', 'Gleis 15'],
            correctIndex: 2,
            explanation: 'Im Text steht: "...fährt der ICE 724 nach München heute nicht von Gleis 4, sondern von Gleis 9 ab."',
          },
          {
            id: 'de-a1-r2',
            prompt: 'Wann fährt der Zug heute ab?',
            options: ['Um 14:15 Uhr', 'Um 14:30 Uhr', 'Um 14:45 Uhr', 'Um 15:00 Uhr'],
            correctIndex: 2,
            explanation: 'Die Abfahrtszeit verschiebt sich um 15 Minuten auf 14:45 Uhr.',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Teil 2: Sprachbausteine & Grammatik (Structures & Vocab)',
        weight: 35,
        questions: [
          {
            id: 'de-a1-g1',
            prompt: 'Welches Wort passt in die Lücke? (Which word fits in the gap?)',
            sentence: 'Ich trinke morgens gerne einen Kaffee mit (　) Milch.',
            options: ['viel', 'viele', 'vielen', 'vieles'],
            correctIndex: 0,
            explanation: '"Milch" ist ein unzählbares Nomen, daher steht das undeklinierte "viel Milch".',
          },
          {
            id: 'de-a1-g2',
            prompt: 'Wählen Sie den richtigen Artikel (Akkusativ):',
            sentence: 'Ich suche (　) Bahnhof. Können Sie mir helfen?',
            options: ['der', 'den', 'dem', 'das'],
            correctIndex: 1,
            explanation: '"Der Bahnhof" steht hier als direktes Objekt im Akkusativ maskulin: "den Bahnhof".',
          },
          {
            id: 'de-a1-g3',
            prompt: 'Wählen Sie das passende Modalverb:',
            sentence: 'Entschuldigung, (　) man hier mit Kreditkarte bezahlen?',
            options: ['kann', 'muss', 'will', 'darfst'],
            correctIndex: 0,
            explanation: 'Mit dem unpersönlichen Pronomen "man" verwendet man "kann": "Kann man hier...?"',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Teil 3: Hören (Listening Comprehension)',
        weight: 30,
        questions: [
          {
            id: 'de-a1-l1',
            prompt: 'Hören Sie die Ansage: Was kostet der Apfelkuchen heute?',
            audioScript: 'Guten Tag, liebe Kundinnen und Kunden. Heute in unserer Bäckerei im Angebot: Frischer warmer Apfelkuchen für nur zwei Euro fünfzig pro Stück! Probieren Sie auch unseren Kaffee.',
            options: ['1,50 €', '2,00 €', '2,50 €', '3,50 €'],
            correctIndex: 2,
            explanation: 'In der Durchsage heißt es: "...für nur zwei Euro fünfzig (2,50 €) pro Stück!"',
          },
          {
            id: 'de-a1-l2',
            prompt: 'Hören Sie die Nachricht: Wann findet der Deutschkurs statt?',
            audioScript: 'Hallo Sarah, hier ist Thomas. Unser Deutschkurs beginnt morgen nicht um 18 Uhr, sondern schon um 17 Uhr im Raum 302. Vergiss dein Lehrbuch nicht!',
            options: ['Um 16:00 Uhr', 'Um 17:00 Uhr', 'Um 18:00 Uhr', 'Um 19:00 Uhr'],
            correctIndex: 1,
            explanation: 'Thomas sagt: "...beginnt morgen nicht um 18 Uhr, sondern schon um 17 Uhr..."',
          },
        ],
      },
    ],
  },
  {
    id: 'goethe-a2',
    languageId: 'de',
    level: 'A2',
    framework: 'CEFR',
    title: 'Goethe-Zertifikat A2: Fit in Deutsch',
    subtitle: 'Offizielle Goethe-Institut A2 Modellprüfung',
    certifyingBody: 'Goethe-Institut & telc GmbH',
    description: 'Proves elementary German: can understand sentences and frequently used expressions related to areas of most immediate relevance (family, shopping, local geography, employment).',
    durationMinutes: 25,
    passingScore: 60,
    badge: 'Goethe A2 Certified',
    xpReward: 200,
    sections: [
      {
        id: 'reading',
        name: 'Teil 1: Lesen (Reading)',
        weight: 35,
        passage: {
          title: 'Wohnungsanzeige in Berlin-Kreuzberg (Apartment Listing)',
          text: `Schöne, helle 2-Zimmer-Wohnung ab 1. November zu vermieten.
Größe: 62 m², 3. Obergeschoss mit Aufzug und sonnigem Südbalkon.
Einbauküche mit Geschirrspüler vorhanden.
Kaltmiete: 780 Euro, Nebenkosten: 160 Euro inklusive Heizung.
Haustiere sind nach Vereinbarung erlaubt.
Besichtigungstermin: Samstag, 19. Oktober zwischen 10 und 14 Uhr.
Bitte bringen Sie Ihre Schufa-Auskunft und die letzten drei Gehaltsnachweise mit.`,
        },
        questions: [
          {
            id: 'de-a2-r1',
            prompt: 'Wie hoch ist die Warmmiete (Kaltmiete plus Nebenkosten)?',
            options: ['780 Euro', '840 Euro', '940 Euro', '1.040 Euro'],
            correctIndex: 2,
            explanation: '780 Euro Kaltmiete + 160 Euro Nebenkosten = 940 Euro Warmmiete.',
          },
          {
            id: 'de-a2-r2',
            prompt: 'Welche Unterlagen müssen Interessenten zur Besichtigung mitbringen?',
            options: [
              'Reisepass und Flugticket',
              'Schufa-Auskunft und drei Gehaltsnachweise',
              'Empfehlungsschreiben des alten Vermieters',
              'Führerschein',
            ],
            correctIndex: 1,
            explanation: 'Am Ende steht: "Bitte bringen Sie Ihre Schufa-Auskunft und die letzten drei Gehaltsnachweise mit."',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Teil 2: Sprachbausteine (Grammar & Cases)',
        weight: 35,
        questions: [
          {
            id: 'de-a2-g1',
            prompt: 'Wählen Sie die richtige Perfekt-Form:',
            sentence: 'Gestern (　) wir mit dem Zug nach München gefahren.',
            options: ['haben', 'sind', 'wurden', 'hatten'],
            correctIndex: 1,
            explanation: 'Verben der Ortsveränderung (fahren, gehen, reisen) bilden das Perfekt mit "sein": "wir sind gefahren".',
          },
          {
            id: 'de-a2-g2',
            prompt: 'Wählen Sie die passende Konjunktion:',
            sentence: 'Ich bleibe heute zu Hause, (　) ich erkältet bin.',
            options: ['weil', 'denn', 'obwohl', 'deshalb'],
            correctIndex: 0,
            explanation: '"Weil" leitet einen Kausalsatz mit Verb am Ende ("...ich erkältet bin") ein.',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Teil 3: Hören (Listening Comprehension)',
        weight: 30,
        questions: [
          {
            id: 'de-a2-l1',
            prompt: 'Was soll Herr Meier zur Arztpraxis mitbringen?',
            audioScript: 'Guten Tag Herr Meier, hier ist die Praxis Dr. Weber. Wir bestätigen Ihren Termin am Donnerstag um 10:15 Uhr. Bitte denken Sie unbedingt an Ihre Versichertenkarte und Ihren Impfpass. Bis Donnerstag!',
            options: ['Ein Passfoto', 'Seine Versichertenkarte und den Impfpass', 'Bargeld für die Rezeptgebühr', 'Alte Röntgenbilder'],
            correctIndex: 1,
            explanation: 'Die Sprecherin bittet ausdrücklich: "...denken Sie unbedingt an Ihre Versichertenkarte und Ihren Impfpass."',
          },
        ],
      },
    ],
  },
  {
    id: 'goethe-b1',
    languageId: 'de',
    level: 'B1',
    framework: 'CEFR',
    title: 'Goethe-Zertifikat B1: Zertifikat Deutsch',
    subtitle: 'Offizielle Goethe-Institut B1 Modellprüfung',
    certifyingBody: 'Goethe-Institut & ÖSD',
    description: 'Certifies independent language ability: understand main points of clear standard input on familiar matters, deal with most situations while travelling, and produce connected text.',
    durationMinutes: 30,
    passingScore: 60,
    badge: 'Goethe B1 Certified',
    xpReward: 300,
    sections: [
      {
        id: 'reading',
        name: 'Teil 1: Lesen (Reading Comprehension)',
        weight: 35,
        passage: {
          title: 'Homeoffice – Die Arbeitswelt im Wandel (Remote Work)',
          text: `In den letzten Jahren hat sich die Arbeitswelt grundlegend verändert. Immer mehr Unternehmen bieten ihren Angestellten die Möglichkeit, flexibel im Homeoffice zu arbeiten.
Befürworter betonen die Zeitersparnis durch den Wegfall des täglichen Arbeitswegs sowie eine bessere Vereinbarkeit von Familie und Beruf.
Gleichzeitig warnen Arbeitspsychologen vor der Gefahr sozialer Isolation und der ständigen Erreichbarkeit. Viele Arbeitnehmer finden es schwierig, nach Feierabend abzuschalten, wenn der Schreibtisch mitten im Wohnzimmer steht.
Experten empfehlen deshalb klare Arbeitszeitvereinbarungen und regelmäßige persönliche Teamtreffen.`,
        },
        questions: [
          {
            id: 'de-b1-r1',
            prompt: 'Was nennen Befürworter als klaren Vorteil von Homeoffice?',
            options: [
              'Höheres Gehalt und mehr Urlaubstage',
              'Zeitersparnis durch wegfallende Fahrtwege und bessere Vereinbarkeit von Beruf und Familie',
              'Kostenlose Büroausstattung durch den Staat',
              'Keine Notwendigkeit mehr, mit Kollegen zu kommunizieren',
            ],
            correctIndex: 1,
            explanation: 'Im Text: "Befürworter betonen die Zeitersparnis durch den Wegfall des täglichen Arbeitswegs sowie eine bessere Vereinbarkeit von Familie und Beruf."',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Teil 2: Sprachbausteine (Konjunktiv & Passiv)',
        weight: 35,
        questions: [
          {
            id: 'de-b1-g1',
            prompt: 'Wählen Sie die richtige Konjunktiv II Form für einen höflichen Wunsch:',
            sentence: 'Wenn ich mehr Zeit hätte, (　) ich eine Weltreise machen.',
            options: ['würde', 'werde', 'wäre', 'wollte'],
            correctIndex: 0,
            explanation: 'Der Konjunktiv II von machen wird meist mit "würde + Infinitiv" gebildet: "würde ich machen".',
          },
          {
            id: 'de-b1-g2',
            prompt: 'Wählen Sie das richtige Passiv Präsens:',
            sentence: 'In dieser Fabrik (　) täglich tausende Autos produziert.',
            options: ['werden', 'worden', 'haben', 'sein'],
            correctIndex: 0,
            explanation: 'Vorgangspassiv im Präsens Plural: "werden ... produziert".',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Teil 3: Hören (Listening Comprehension)',
        weight: 30,
        questions: [
          {
            id: 'de-b1-l1',
            prompt: 'Welche Maßnahme gegen den Klimawandel wird im Radiobeitrag empfohlen?',
            audioScript: 'Im heutigen Umweltmagazin sprechen wir über nachhaltigen Stadtverkehr. Experten fordern mehr Fahrradwege und einen günstigeren öffentlichen Nahverkehr, um die Schadstoffbelastung in den Innenstädten spürbar zu reduzieren.',
            options: [
              'Den Bau neuer Autobahnen',
              'Mehr Fahrradwege und günstigeren öffentlichen Nahverkehr',
              'Die Schließung aller U-Bahnen am Wochenende',
              'Den Verzicht auf Busse im Winter',
            ],
            correctIndex: 1,
            explanation: 'Der Beitrag fordert ausdrücklich "mehr Fahrradwege und einen günstigeren öffentlichen Nahverkehr".',
          },
        ],
      },
    ],
  },
];

