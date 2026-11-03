/**
 * @file spanish.js
 * @description Official DELE (Diplomas de Español como Lengua Extranjera) Mock Examinations for A1, A2, and B1.
 * Formatted according to Instituto Cervantes official grading and CEFR competencies.
 */

export const spanishExams = [
  {
    id: 'dele-a1',
    languageId: 'es',
    level: 'A1',
    framework: 'CEFR',
    title: 'DELE A1: Acceso',
    subtitle: 'Examen Oficial de Prueba Instituto Cervantes',
    certifyingBody: 'Instituto Cervantes & Universidad de Salamanca',
    description: 'Certifies basic linguistic competence to understand and use familiar everyday expressions and very basic phrases directed to satisfaction of immediate needs.',
    durationMinutes: 20,
    passingScore: 60,
    badge: 'DELE A1 Certified',
    xpReward: 150,
    sections: [
      {
        id: 'reading',
        name: 'Prueba 1: Comprensión de Lectura',
        weight: 35,
        passage: {
          title: 'Horario del Restaurante La Tasca de Madrid',
          text: `¡Bienvenidos a La Tasca!
Servimos la mejor comida casera española desde 1985.
Horario de apertura:
De martes a domingo:
- Almuerzo: de 13:00 a 16:30 h.
- Cena: de 20:30 a 23:30 h.
Lunes cerrado por descanso del personal.
Menú del día de martes a viernes por 12,50 € (incluye primer plato, segundo plato, pan, bebida y postre o café).
Para reservas de grupos de más de 6 personas, llame al 91 555 0123.`,
        },
        questions: [
          {
            id: 'es-a1-r1',
            prompt: '¿Qué día está cerrado el restaurante?',
            options: ['El martes', 'El viernes', 'El domingo', 'El lunes'],
            correctIndex: 3,
            explanation: 'En el cartel dice textualmente: "Lunes cerrado por descanso del personal."',
          },
          {
            id: 'es-a1-r2',
            prompt: '¿Cuánto cuesta el menú del día?',
            options: ['10,00 €', '12,50 €', '15,00 €', '16,30 €'],
            correctIndex: 1,
            explanation: 'El cartel indica: "Menú del día de martes a viernes por 12,50 €".',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Prueba 2: Uso de la Lengua y Gramática',
        weight: 35,
        questions: [
          {
            id: 'es-a1-g1',
            prompt: 'Selecciona la opción correcta (Ser vs Estar):',
            sentence: 'Madrid (　) la capital de España y hoy (　) muy nublado.',
            options: ['es / está', 'está / es', 'es / es', 'está / está'],
            correctIndex: 0,
            explanation: 'La identidad fija ("la capital") usa el verbo "ser" (es), mientras que las condiciones meteorológicas del momento usan "estar" (está nublado).',
          },
          {
            id: 'es-a1-g2',
            prompt: 'Selecciona la forma correcta del verbo gustar:',
            sentence: 'A mis amigos y a mí nos (　) mucho las tapas españolas.',
            options: ['gusta', 'gustan', 'gustamos', 'gustas'],
            correctIndex: 1,
            explanation: 'El sujeto gramatical es "las tapas españolas" (plural), por lo que el verbo debe concordar en plural: "nos gustan".',
          },
          {
            id: 'es-a1-g3',
            prompt: 'Elige la preposición adecuada:',
            sentence: 'Este regalo es (　) mi abuela por su cumpleaños.',
            options: ['por', 'para', 'de', 'en'],
            correctIndex: 1,
            explanation: '"Para" indica el destinatario o beneficiario del regalo.',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Prueba 3: Comprensión Auditiva',
        weight: 30,
        questions: [
          {
            id: 'es-a1-l1',
            prompt: 'Escucha el anuncio en la estación: ¿A qué hora sale el tren hacia Barcelona?',
            audioScript: 'Atención señores pasajeros. El tren de alta velocidad AVE con destino a Barcelona saldrá a las diez y media de la mañana por la vía número siete. Por favor, tengan preparados sus billetes.',
            options: ['A las 9:30', 'A las 10:00', 'A las 10:30', 'A las 11:30'],
            correctIndex: 2,
            explanation: 'La megafonía dice claramente: "...saldrá a las diez y media de la mañana (10:30)".',
          },
          {
            id: 'es-a1-l2',
            prompt: 'Escucha el mensaje telefónico: ¿Qué día van al cine Carlos y Elena?',
            audioScript: 'Hola Elena, soy Carlos. El viernes tengo que trabajar hasta tarde, así que ¿podemos ir al cine el sábado por la tarde? Hay una película muy divertida a las siete. Llámame cuando puedas.',
            options: ['El jueves', 'El viernes', 'El sábado', 'El domingo'],
            correctIndex: 2,
            explanation: 'Carlos explica que el viernes trabaja y propone: "¿podemos ir al cine el sábado por la tarde?".',
          },
        ],
      },
    ],
  },
  {
    id: 'dele-a2',
    languageId: 'es',
    level: 'A2',
    framework: 'CEFR',
    title: 'DELE A2: Plataforma',
    subtitle: 'Examen Oficial de Prueba Instituto Cervantes',
    certifyingBody: 'Instituto Cervantes & Universidad de Salamanca',
    description: 'Certifies ability to understand commonly used phrases related to areas of direct relevance (basic personal and family information, shopping, places of interest, occupations).',
    durationMinutes: 25,
    passingScore: 60,
    badge: 'DELE A2 Certified',
    xpReward: 200,
    sections: [
      {
        id: 'reading',
        name: 'Prueba 1: Comprensión de Lectura',
        weight: 35,
        passage: {
          title: 'Correo de Vacaciones en Valencia',
          text: `Querida Lucía:
Te escribo desde Valencia. ¡La ciudad es maravillosa!
Llegamos el lunes por la mañana y fuimos directamente a la playa de la Malvarrosa. Hacía un sol increíble y comimos una auténtica paella valenciana frente al mar.
Ayer visitamos la Ciudad de las Artes y las Ciencias; el acuario es enorme y vimos tiburones y pingüinos.
Mañana alquilaremos unas bicicletas para recorrer los jardines del río Turia.
El viernes regresamos a Madrid en tren. Te llevaré unos dulces típicos.
Un abrazo muy fuerte,
Carmen`,
        },
        questions: [
          {
            id: 'es-a2-r1',
            prompt: '¿Qué hicieron Carmen y sus acompañantes el lunes al llegar?',
            options: [
              'Visitaron la Ciudad de las Artes y las Ciencias.',
              'Fueron a la playa de la Malvarrosa y comieron paella.',
              'Alquilaron bicicletas para ir al río Turia.',
              'Compraron dulces típicos en el centro.',
            ],
            correctIndex: 1,
            explanation: 'En el correo dice: "Llegamos el lunes por la mañana y fuimos directamente a la playa de la Malvarrosa... y comimos una auténtica paella".',
          },
          {
            id: 'es-a2-r2',
            prompt: '¿Cómo planean recorrer los jardines del río Turia mañana?',
            options: ['A pie', 'En autobús turístico', 'En bicicleta', 'En barco'],
            correctIndex: 2,
            explanation: 'Carmen escribe: "Mañana alquilaremos unas bicicletas para recorrer los jardines...".',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Prueba 2: Uso de la Lengua (Pasados y Pronombres)',
        weight: 35,
        questions: [
          {
            id: 'es-a2-g1',
            prompt: 'Elige la combinación correcta de tiempos pasados (Indefinido vs Imperfecto):',
            sentence: 'Cuando yo (　) niño, siempre (　) las vacaciones en el pueblo.',
            options: ['era / pasaba', 'fui / pasé', 'era / pasé', 'fui / pasaba'],
            correctIndex: 0,
            explanation: 'Tanto la descripción habitual de una época continuada ("era niño") como las acciones repetidas/habituales ("siempre pasaba") requieren el pretérito imperfecto.',
          },
          {
            id: 'es-a2-g2',
            prompt: 'Sustituye el objeto directo con el pronombre adecuado:',
            sentence: '¿Has comprado las entradas para el concierto? — Sí, ya (　) he comprado.',
            options: ['los', 'la', 'las', 'les'],
            correctIndex: 2,
            explanation: '"Las entradas" es femenino plural, por lo que el pronombre de objeto directo correspondiente es "las".',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Prueba 3: Comprensión Auditiva',
        weight: 30,
        questions: [
          {
            id: 'es-a2-l1',
            prompt: '¿Por qué no puede ir Martín a la fiesta esta noche?',
            audioScript: 'Hola Sofía, te llamo para avisarte de que no podré ir a tu fiesta de cumpleaños esta noche. He tenido una reunión de trabajo imprevista y además tengo un poco de fiebre. Lo siento muchísimo. ¡Que lo paséis genial!',
            options: [
              'Porque perdió las llaves de su coche.',
              'Por una reunión imprevista y porque tiene algo de fiebre.',
              'Porque tiene que viajar a otra ciudad.',
              'Porque olvidó comprar un regalo.',
            ],
            correctIndex: 1,
            explanation: 'Martín indica que tuvo una reunión imprevista y tiene fiebre.',
          },
        ],
      },
    ],
  },
  {
    id: 'dele-b1',
    languageId: 'es',
    level: 'B1',
    framework: 'CEFR',
    title: 'DELE B1: Umbral',
    subtitle: 'Examen Oficial de Prueba Instituto Cervantes',
    certifyingBody: 'Instituto Cervantes & Universidad de Salamanca',
    description: 'Certifies ability to understand main points of clear standard input on familiar matters, deal with most situations likely to arise whilst travelling, and produce simple connected text on topics of personal interest.',
    durationMinutes: 30,
    passingScore: 60,
    badge: 'DELE B1 Certified',
    xpReward: 300,
    sections: [
      {
        id: 'reading',
        name: 'Prueba 1: Comprensión de Lectura',
        weight: 35,
        passage: {
          title: 'Artículo: El Futuro del Transporte Urbano',
          text: `En las grandes metrópolis hispanohablantes, desde Bogotá hasta Madrid, la movilidad urbana está experimentando una revolución ecológica.
El auge de los carriles bici y los vehículos compartidos ha demostrado que reducir el tráfico motorizado no solo disminuye las emisiones contaminantes, sino que revitaliza los barrios comerciales y fomenta hábitos más saludables.
No obstante, los expertos señalan que el verdadero reto radica en integrar estos servicios con la red de metro y trenes de cercanías en las zonas periféricas, garantizando un transporte asequible e inclusivo para toda la ciudadanía.`,
        },
        questions: [
          {
            id: 'es-b1-r1',
            prompt: 'Según el texto, ¿cuál es el verdadero reto actual en las ciudades?',
            options: [
              'Prohibir completamente todos los coches privados.',
              'Integrar los nuevos transportes con metro y trenes en zonas periféricas.',
              'Subir el precio de las bicicletas de alquiler.',
              'Construir autopistas más anchas en los centros históricos.',
            ],
            correctIndex: 1,
            explanation: 'El texto concluye: "...el verdadero reto radica en integrar estos servicios con la red de metro y trenes de cercanías en las zonas periféricas...".',
          },
        ],
      },
      {
        id: 'grammar',
        name: 'Prueba 2: Subjuntivo y Estructuras Complejas',
        weight: 35,
        questions: [
          {
            id: 'es-b1-g1',
            prompt: 'Selecciona la forma correcta del presente de subjuntivo:',
            sentence: 'Es fundamental que todos los estudiantes (　) el examen a tiempo.',
            options: ['terminan', 'terminen', 'terminaron', 'terminarían'],
            correctIndex: 1,
            explanation: 'Las expresiones impersonales de necesidad o valoración ("es fundamental que...") rigen subjuntivo: "terminen".',
          },
          {
            id: 'es-b1-g2',
            prompt: 'Selecciona el conector de causa adecuado:',
            sentence: 'No pudimos hacer la excursión al volcán (　) las malas condiciones climáticas.',
            options: ['debido a', 'a fin de', 'para que', 'aunque'],
            correctIndex: 0,
            explanation: '"Debido a" introduce la causa ("las malas condiciones climáticas").',
          },
        ],
      },
      {
        id: 'listening',
        name: 'Prueba 3: Comprensión Auditiva',
        weight: 30,
        questions: [
          {
            id: 'es-b1-l1',
            prompt: '¿Cuál es el objetivo principal del festival cultural mencionado en la radio?',
            audioScript: 'Bienvenidos a Cultura Viva. Este fin de semana se celebra en la plaza mayor el festival intercultural anual, cuyo objetivo prioritario es difundir el patrimonio gastronómico y artesanal de los pueblos indígenas mediante talleres gratuitos para todas las edades.',
            options: [
              'Vender entradas para conciertos de música electrónica.',
              'Difundir el patrimonio gastronómico y artesanal indígena mediante talleres gratuitos.',
              'Elegir al mejor cocinero profesional de la región.',
              'Inaugurar un nuevo centro comercial.',
            ],
            correctIndex: 1,
            explanation: 'El locutor resalta: "...cuyo objetivo prioritario es difundir el patrimonio gastronómico y artesanal de los pueblos indígenas mediante talleres gratuitos".',
          },
        ],
      },
    ],
  },
];

