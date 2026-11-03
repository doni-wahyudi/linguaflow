/**
 * @file french.js
 * @description Official DELF (Diplôme d'Études en Langue Française) Mock Examinations for A1, A2, and B1.
 * Formatted according to France Éducation International and CEFR standards.
 */

export const frenchExams = [
  {
    id: 'delf-a1',
    languageId: 'fr',
    level: 'A1',
    framework: 'CEFR',
    title: 'DELF A1: Débutant',
    subtitle: 'Épreuve Officielle Blanche France Éducation International',
    certifyingBody: 'France Éducation International & Ministère de l\'Éducation',
    description: 'Validates basic language skills as a breakthrough user: everyday interactions, ordering food, basic train schedules, and simple emails.',
    durationMinutes: 20,
    passingScore: 60,
    badge: 'DELF A1 Certified',
    xpReward: 150,
    sections: [
      {
        id: 'reading',
        name: 'Épreuve 1: Compréhension des Écrits',
        weight: 35,
        passage: {
          title: 'Affiche: Fête de la Musique à Paris',
          text: `Venez célébrer la Fête de la Musique le vendredi 21 juin dans tout le quartier de Montmartre !
Plus de 40 concerts gratuits en plein air de 18h00 à minuit : jazz, chanson française, pop et musique du monde.
Restauration sur place : crêpes, gaufres et boissons fraîches.
Métro recommandé : Ligne 12 (station Abbesses).
Événement gratuit et ouvert à tous !`,
        },
        questions: [
          {
            id: 'fr-a1-r1',
            prompt: 'À quelle date a lieu la fête ?',
            options: ['Le 12 juin', 'Le 18 juin', 'Le 21 juin', 'Le 25 juin'],
            correctIndex: 2,
            explanation: 'L\'affiche indique : "le vendredi 21 juin dans tout le quartier de Montmartre".',
          },
          {
            id: 'fr-a1-r2',
            prompt: 'Quelle station de métro est recommandée pour venir ?',
            options: ['Gare de Lyon', 'Abbesses', 'Châtelet', 'Opéra'],
            correctIndex: 1,
            explanation: 'Il est écrit : "Métro recommandé : Ligne 12 (station Abbesses)".',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Épreuve 2: Grammaire et Vocabulaire',
        weight: 35,
        questions: [
          {
            id: 'fr-a1-g1',
            prompt: 'Choisissez le bon article partitif :',
            sentence: 'Au petit-déjeuner, je bois (　) café avec (　) croissants.',
            options: ['du / des', 'de la / un', 'le / du', 'un / de la'],
            correctIndex: 0,
            explanation: '"Café" est masculin singulier indénombrable (du café), et "croissants" est au pluriel (des croissants).',
          },
          {
            id: 'fr-a1-g2',
            prompt: 'Conjuguez le verbe "aller" au présent :',
            sentence: 'Nous (　) à la bibliothèque cet après-midi.',
            options: ['allons', 'va', 'vont', 'allez'],
            correctIndex: 0,
            explanation: 'La première personne du pluriel du verbe aller est "nous allons".',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Épreuve 3: Compréhension de l\'Oral',
        weight: 30,
        questions: [
          {
            id: 'fr-a1-l1',
            prompt: 'Écoutez l\'annonce en gare : Quel est le quai de départ du TGV pour Lyon ?',
            audioScript: 'Votre attention s\'il vous plaît. Le TGV numéro 6620 à destination de Lyon Part-Dieu, départ prévu à 14h15, va partir quai numéro trois. Prenez garde à la fermeture automatique des portes.',
            options: ['Quai 1', 'Quai 3', 'Quai 6', 'Quai 14'],
            correctIndex: 1,
            explanation: 'La voix annonce : "...va partir quai numéro trois".',
          },
        ],
      },
    ],
  },
  {
    id: 'delf-a2',
    languageId: 'fr',
    level: 'A2',
    framework: 'CEFR',
    title: 'DELF A2: Élémentaire',
    subtitle: 'Épreuve Officielle Blanche France Éducation International',
    certifyingBody: 'France Éducation International & Ministère de l\'Éducation',
    description: 'Demonstrates basic communicative social skills: can understand messages and simple standard announcements, talk about past vacations, and describe personal experiences.',
    durationMinutes: 25,
    passingScore: 60,
    badge: 'DELF A2 Certified',
    xpReward: 200,
    sections: [
      {
        id: 'reading',
        name: 'Épreuve 1: Compréhension des Écrits',
        weight: 35,
        passage: {
          title: 'Invitation d\'Anniversaire',
          text: `Salut Thomas !
Je fête mes 30 ans samedi prochain, le 16 novembre, à partir de 19h30 chez moi.
Je prépare un grand buffet dînatoire avec des spécialités régionales.
Si tu le souhaites, tu peux apporter une bouteille de jus ou un dessert.
Merci de me confirmer ta présence avant mercredi soir pour l'organisation.
J'espère vraiment que tu pourras venir !
À samedi,
Camille`,
        },
        questions: [
          {
            id: 'fr-a2-r1',
            prompt: 'Quelle est la date limite pour répondre à l\'invitation ?',
            options: ['Lundi matin', 'Mercredi soir', 'Vendredi midi', 'Samedi à 19h'],
            correctIndex: 1,
            explanation: 'Camille précise : "Merci de me confirmer ta présence avant mercredi soir".',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Épreuve 2: Grammaire (Passé Composé & Pronoms)',
        weight: 35,
        questions: [
          {
            id: 'fr-a2-g1',
            prompt: 'Choisissez le bon auxiliaire pour le passé composé :',
            sentence: 'Hier matin, Marie (　) partie à 7 heures pour son stage.',
            options: ['est', 'a', 'va', 'fait'],
            correctIndex: 0,
            explanation: 'Le verbe partir exprime un déplacement et se conjugue avec l\'auxiliaire être : "Marie est partie".',
          },
          {
            id: 'fr-a2-g2',
            prompt: 'Remplacez le complément de lieu par le pronom adéquat :',
            sentence: 'Tu vas souvent au musée ? — Oui, j\'(　) vais chaque dimanche.',
            options: ['y', 'en', 'le', 'lui'],
            correctIndex: 0,
            explanation: 'Le pronom adverbial "y" remplace un lieu introduit par la préposition "à" ("au musée").',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Épreuve 3: Compréhension de l\'Oral',
        weight: 30,
        questions: [
          {
            id: 'fr-a2-l1',
            prompt: 'Quel temps fera-t-il demain après-midi selon le bulletin météo ?',
            audioScript: 'Voici les prévisions météo pour demain. Après une matinée brumeuse et fraîche, un large soleil illuminera l\'ensemble du pays dans l\'après-midi avec des températures printanières de 22 degrés.',
            options: ['De la pluie continue', 'Un ciel très orageux', 'Un large soleil avec 22 degrés', 'De la neige'],
            correctIndex: 2,
            explanation: 'Le bulletin annonce : "un large soleil illuminera l\'ensemble du pays dans l\'après-midi avec des températures de 22 degrés".',
          },
        ],
      },
    ],
  },
  {
    id: 'delf-b1',
    languageId: 'fr',
    level: 'B1',
    framework: 'CEFR',
    title: 'DELF B1: Indépendant',
    subtitle: 'Épreuve Officielle Blanche France Éducation International',
    certifyingBody: 'France Éducation International & Ministère de l\'Éducation',
    description: 'Validates independent communication: can maintain conversation on familiar topics, express personal thoughts and viewpoints, and present a problem or project clearly.',
    durationMinutes: 30,
    passingScore: 60,
    badge: 'DELF B1 Certified',
    xpReward: 300,
    sections: [
      {
        id: 'reading',
        name: 'Épreuve 1: Compréhension des Écrits',
        weight: 35,
        passage: {
          title: 'Article : Les Livres Numériques face au Papier',
          text: `Alors que certains prédisaient la disparition rapide du livre imprimé face aux liseuses électroniques, le marché éditorial démontre une surprenante résistance du format papier.
Les lecteurs apprécient la dimension sensorielle de l'objet : l'odeur de l'encre, le grain des pages et le plaisir de posséder une bibliothèque physique chez soi.
Cependant, le format numérique conserve un avantage indéniable pour les étudiants et grands voyageurs, grâce à sa légèreté et à la possibilité de stocker des milliers d'ouvrages dans un seul appareil.
La majorité des usagers privilégient désormais un usage hybride selon les circonstances.`,
        },
        questions: [
          {
            id: 'fr-b1-r1',
            prompt: 'Selon l\'article, que préfère la majorité des lecteurs aujourd\'hui ?',
            options: [
              'L\'abandon total des livres papier',
              'Un usage hybride alternant papier et numérique selon les circonstances',
              'L\'achat exclusif de livres audio',
              'La fermeture des bibliothèques municipales',
            ],
            correctIndex: 1,
            explanation: 'L\'article conclut : "La majorité des usagers privilégient désormais un usage hybride selon les circonstances."',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Épreuve 2: Subjonctif et Pronoms Relatifs',
        weight: 35,
        questions: [
          {
            id: 'fr-b1-g1',
            prompt: 'Conjuguez le verbe au subjonctif présent :',
            sentence: 'Il faut absolument que tu (　) ton passeport avant de partir.',
            options: ['prennes', 'prends', 'prenais', 'prendras'],
            correctIndex: 0,
            explanation: 'La structure d\'obligation "Il faut que..." commande le subjonctif présent : "que tu prennes".',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Épreuve 3: Compréhension de l\'Oral',
        weight: 30,
        questions: [
          {
            id: 'fr-b1-l1',
            prompt: 'Quel service gratuit la ville vient-elle de mettre en place pour les seniors ?',
            audioScript: 'La municipalité est heureuse d\'annoncer la mise en place d\'un service d\'accompagnement bénévole à domicile pour aider les personnes âgées à accomplir leurs démarches administratives en ligne.',
            options: [
              'Des cours de danse de salon',
              'Un service bénévole pour les démarches administratives en ligne',
              'La distribution gratuite de repas tous les soirs',
              'Des voyages gratuits à l\'étranger',
            ],
            correctIndex: 1,
            explanation: 'L\'annonce précise : "...un service d\'accompagnement bénévole à domicile pour aider les personnes âgées à accomplir leurs démarches administratives en ligne".',
          },
        ],
      },
    ],
  },
];

