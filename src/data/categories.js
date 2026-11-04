/**
 * @file categories.js
 * @description Lesson categories catalog with progressive unlocking hierarchy and CEFR/JLPT level mapping.
 * Spans Beginner (A1 / N5), Elementary (A2 / N4), and Intermediate (B1 / N3).
 *
 * `icon` is a semantic key resolved by `components/brand/icons.jsx`. It replaced
 * an `emoji` field: emoji render inconsistently across operating systems and
 * cannot be recoloured to the design tokens.
 */

export const categories = [
  {
    id: 'basics',
    name: 'Basics & Essentials',
    icon: 'basics',
    description: 'Core words, greetings, yes/no, and everyday conversational foundation.',
    order: 1,
    unlockAfter: null, // Unlocked by default
    cefrLevel: 'A1',
    jlptLevel: 'N5',
    tierLabel: 'Beginner Foundation',
  },
  {
    id: 'greetings',
    name: 'Greetings & Introductions',
    icon: 'greetings',
    description: 'Polite welcomes, introductions, formal etiquette, and friendly farewells.',
    order: 2,
    unlockAfter: 'basics',
    cefrLevel: 'A1',
    jlptLevel: 'N5',
    tierLabel: 'Beginner Foundation',
  },
  {
    id: 'numbers',
    name: 'Numbers & Time',
    icon: 'numbers',
    description: 'Count 1 to 100, express quantities, prices, hours, and calendar time.',
    order: 3,
    unlockAfter: 'greetings',
    cefrLevel: 'A1',
    jlptLevel: 'N5',
    tierLabel: 'Beginner Foundation',
  },
  {
    id: 'food-drink',
    name: 'Food & Dining',
    icon: 'dining',
    description: 'Ordering food, dining at restaurants, café drinks, and culinary phrases.',
    order: 4,
    unlockAfter: 'numbers',
    cefrLevel: 'A1',
    jlptLevel: 'N5',
    tierLabel: 'Beginner Foundation',
  },
  {
    id: 'travel',
    name: 'Travel & Directions',
    icon: 'travel',
    description: 'Airports, train stations, asking for directions, hotels, and exploring a city.',
    order: 5,
    unlockAfter: 'food-drink',
    cefrLevel: 'A2',
    jlptLevel: 'N4',
    tierLabel: 'Elementary & Travel',
  },
  {
    id: 'family',
    name: 'Family & People',
    icon: 'family',
    description: 'Describe family members, relationships, personalities, professions, and feelings.',
    order: 6,
    unlockAfter: 'travel',
    cefrLevel: 'A2',
    jlptLevel: 'N4',
    tierLabel: 'Elementary & Social',
  },
  {
    id: 'work-career',
    name: 'Work & Professional Life',
    icon: 'work',
    description: 'Office communication, team meetings, job applications, deadlines, and careers.',
    order: 7,
    unlockAfter: 'family',
    cefrLevel: 'B1',
    jlptLevel: 'N3',
    tierLabel: 'Intermediate Professional',
  },
  {
    id: 'opinions-culture',
    name: 'Opinions & Modern Culture',
    icon: 'ideas',
    description: 'Expressing viewpoints, agreeing/disagreeing, discussing hobbies, media, and society.',
    order: 8,
    unlockAfter: 'work-career',
    cefrLevel: 'B1',
    jlptLevel: 'N3',
    tierLabel: 'Intermediate Fluency',
  },
];

export default categories;
