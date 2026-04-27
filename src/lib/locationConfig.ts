export const LOCATION_CONFIG = {
  HamiltonLibrary: {
    label: 'Hamilton Library',
    category: 'Study',
    description: 'Large multi-floor library with many study areas.',
    scale: {
      1: 'Very quiet, lots of open seating',
      3: 'Light traffic, easy to find spots',
      5: 'Moderate usage, some areas filling',
      7: 'Busy, limited seating in popular areas',
      8: 'Very crowded, hard to find seating',
      10: 'Packed, no seating available',
    },
  },

  WarriorRecreationCenter: {
    label: 'Warrior Recreation Center',
    category: 'Fitness',
    description: 'Large 2-floor gym with many machines and spaces.',
    scale: {
      1: 'Empty, all equipment available',
      3: 'Light usage',
      5: 'Moderate crowd, short waits',
      7: 'Busy, some equipment taken',
      8: 'Very crowded, waiting for machines',
      10: 'Packed, long waits for equipment',
    },
  },

  CampusCenterFoodCourt: {
    label: 'Campus Center Food Court',
    category: 'Dining',
    description: 'Large indoor food court with many tables. Used for dining and studying.',
    scale: {
      1: 'Empty, no lines, plenty of seating',
      3: 'Short lines, lots of space',
      5: 'Moderate lines, seating available',
      7: 'Busy, seating filling up',
      8: 'Long lines, difficult to find seating',
      10: 'Very crowded, long waits and no seating',
    },
  },

  CampusCenterOutdoorCourt: {
    label: 'Campus Center Outdoor Court',
    category: 'Dining',
    description: 'Outdoor seating area with many tables. Used for dining and studying.',
    scale: {
      1: 'Empty, lots of open tables',
      3: 'Light use',
      5: 'Moderate usage',
      7: 'Busy, fewer open tables',
      8: 'Very busy, hard to find seating',
      10: 'Full, no available tables',
    },
  },

  TacoBellFoodCourt: {
    label: 'Taco Bell Food Court',
    category: 'Dining',
    description: 'Medium-sized food court, often used for dining and casual study.',
    scale: {
      1: 'No line, plenty of seating',
      3: 'Short line',
      5: 'Moderate wait',
      7: 'Busy, longer wait times',
      8: 'Very busy, long lines and limited seating',
      10: 'Packed, long wait and no seating',
    },
  },

  ParadisePalms: {
    label: 'Paradise Palms',
    category: 'Dining',
    description: 'Large open seating area used for dining and studying.',
    scale: {
      1: 'Empty, very open',
      3: 'Light use',
      5: 'Moderate crowd',
      7: 'Busy, fewer tables open',
      8: 'Very crowded',
      10: 'Full, no seating available',
    },
  },

  POST2ndFloor: {
    label: 'POST 2nd Floor',
    category: 'Study',
    description: 'Small study area with whiteboards and limited seating.',
    scale: {
      1: 'Empty, all tables open',
      3: 'Light usage',
      5: 'Half full',
      7: 'Nearly full',
      8: 'Very crowded, limited space',
      10: 'Full, no available seating',
    },
  },
} as const;