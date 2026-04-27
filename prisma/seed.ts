import { prisma } from '../src/lib/prisma';
import { Role, EntryLocation } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const CAMPUS_HOURS = Array.from({ length: 16 }, (_, index) => index + 7);
const DAYS_TO_SAMPLE = 60;
const GENERATED_ENTRIES_PER_LOCATION = 1200;
const HAWAII_UTC_OFFSET = 10;
const includeRandomHistoricalEntries = process.env.SEED_RANDOM_HISTORY === 'true';

type SeedEntry = {
  location: EntryLocation;
  busyLevel: number;
  comment: string;
  createdAt: Date;
};

type LocationProfile = {
  location: EntryLocation;
  baseline: number;
  hourlyAdjustments: Record<number, number>;
  comments: string[];
};

const profiles: LocationProfile[] = [
  {
    location: EntryLocation.HamiltonLibrary,
    baseline: 4,
    hourlyAdjustments: {
      7: -2,
      8: -1,
      9: 0,
      10: 1,
      11: 2,
      12: 1,
      13: 2,
      14: 3,
      15: 3,
      16: 2,
      17: 1,
      18: 1,
      19: 0,
      20: 0,
      21: -1,
      22: -2,
    },
    comments: [
      'Study tables are easy to find',
      'Quiet floors are filling up',
      'Group study rooms are popular',
      'Main floor has steady traffic',
    ],
  },
  {
    location: EntryLocation.WarriorRecreationCenter,
    baseline: 4,
    hourlyAdjustments: {
      7: 1,
      8: 0,
      9: -1,
      10: -1,
      11: 0,
      12: 1,
      13: 0,
      14: 1,
      15: 2,
      16: 3,
      17: 4,
      18: 4,
      19: 3,
      20: 2,
      21: 1,
      22: 0,
    },
    comments: [
      'Weight room has short waits',
      'Cardio machines are available',
      'After-class traffic is building',
      'Courts and machines are busy',
    ],
  },
  {
    location: EntryLocation.CampusCenterFoodCourt,
    baseline: 4,
    hourlyAdjustments: {
      7: -2,
      8: -1,
      9: -1,
      10: 0,
      11: 3,
      12: 5,
      13: 4,
      14: 1,
      15: 0,
      16: 0,
      17: 2,
      18: 3,
      19: 2,
      20: 0,
      21: -1,
      22: -2,
    },
    comments: [
      'Lines are moving quickly',
      'Lunch crowd is heavy',
      'Tables are turning over',
      'Food court seating is tight',
    ],
  },
  {
    location: EntryLocation.CampusCenterOutdoorCourt,
    baseline: 3,
    hourlyAdjustments: {
      7: -1,
      8: -1,
      9: 0,
      10: 0,
      11: 2,
      12: 3,
      13: 2,
      14: 1,
      15: 1,
      16: 1,
      17: 2,
      18: 2,
      19: 1,
      20: 0,
      21: -1,
      22: -2,
    },
    comments: [
      'Outdoor tables are open',
      'Shaded seats are popular',
      'Lunch traffic is moderate',
      'Plenty of space near the edges',
    ],
  },
  {
    location: EntryLocation.TacoBellFoodCourt,
    baseline: 4,
    hourlyAdjustments: {
      7: -2,
      8: -1,
      9: -1,
      10: 0,
      11: 2,
      12: 4,
      13: 3,
      14: 1,
      15: 0,
      16: 1,
      17: 3,
      18: 4,
      19: 2,
      20: 1,
      21: 0,
      22: -1,
    },
    comments: [
      'Line is short',
      'Counter line is growing',
      'Dinner rush is busy',
      'Seating nearby is limited',
    ],
  },
  {
    location: EntryLocation.ParadisePalms,
    baseline: 3,
    hourlyAdjustments: {
      7: -1,
      8: -1,
      9: 0,
      10: 1,
      11: 3,
      12: 4,
      13: 3,
      14: 2,
      15: 1,
      16: 0,
      17: 1,
      18: 2,
      19: 1,
      20: 0,
      21: -1,
      22: -2,
    },
    comments: [
      'Food truck area is calm',
      'Tables near the trucks are filling',
      'Lunch crowd is active',
      'Open seating is still available',
    ],
  },
  {
    location: EntryLocation.POST2ndFloor,
    baseline: 4,
    hourlyAdjustments: {
      7: -2,
      8: -1,
      9: 0,
      10: 1,
      11: 1,
      12: 1,
      13: 2,
      14: 3,
      15: 3,
      16: 2,
      17: 2,
      18: 1,
      19: 1,
      20: 0,
      21: -1,
      22: -2,
    },
    comments: [
      'Whiteboards are available',
      'Small study area is filling',
      'Only a few tables are open',
      'Quiet but limited seating',
    ],
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const hawaiiLocalTimeToUtc = (localDate: Date, hour: number, minute: number) =>
  new Date(
    Date.UTC(
      localDate.getUTCFullYear(),
      localDate.getUTCMonth(),
      localDate.getUTCDate(),
      hour + HAWAII_UTC_OFFSET,
      minute,
      randomInt(0, 59),
    ),
  );

const randomHistoricalTimestamp = () => {
  const now = new Date();
  const daysAgo = randomInt(1, DAYS_TO_SAMPLE);
  const localDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo),
  );
  const hour = CAMPUS_HOURS[randomInt(0, CAMPUS_HOURS.length - 1)];

  return {
    hour,
    createdAt: hawaiiLocalTimeToUtc(localDate, hour, randomInt(0, 59)),
  };
};

const getPastCampusTimestamp = () => {
  let timestamp = randomHistoricalTimestamp().createdAt;

  while (timestamp > new Date()) {
    timestamp = randomHistoricalTimestamp().createdAt;
  }

  return timestamp;
};

const generateHistoricalEntries = (): SeedEntry[] => {
  const entries: SeedEntry[] = [];
  const generatedProfiles = profiles.filter(
    (profile) => profile.location !== EntryLocation.HamiltonLibrary,
  );

  generatedProfiles.forEach((profile) => {
    for (let index = 0; index < GENERATED_ENTRIES_PER_LOCATION; index++) {
      const { hour, createdAt } = randomHistoricalTimestamp();
      const dayOfWeek = createdAt.getUTCDay();
      const weekendAdjustment = dayOfWeek === 0 || dayOfWeek === 6 ? -1 : 0;
      const noise = randomInt(-1, 1) + (Math.random() < 0.2 ? randomInt(-1, 1) : 0);
      const busyLevel = clamp(
        Math.round(
          profile.baseline +
            profile.hourlyAdjustments[hour] +
            weekendAdjustment +
            noise,
        ),
        1,
        10,
      );
      const comment = profile.comments[randomInt(0, profile.comments.length - 1)];

      entries.push({
        location: profile.location,
        busyLevel,
        comment,
        createdAt,
      });
    }
  });

  return entries;
};

async function main() {
  console.log('Seeding the database');
  const now = new Date();

  const password = await hash('changeme', 10);

  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;

    console.log(`Creating user: ${account.email} with role: ${role}`);

    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        role,
      },
      create: {
        email: account.email,
        password,
        role,
      },
    });
  }

  const configuredEntries = config.defaultData.map((data) => ({
    location: data.location as EntryLocation,
    busyLevel: data.busyLevel,
    comment: data.comment,
    createdAt: new Date(data.createdAt) > now ? getPastCampusTimestamp() : new Date(data.createdAt),
  }));
  const generatedEntries = includeRandomHistoricalEntries ? generateHistoricalEntries() : [];
  const entries = [...configuredEntries, ...generatedEntries];

  console.log(
    `Seeding ${entries.length} historical entries${
      includeRandomHistoricalEntries ? ' with random history' : ''
    }`,
  );

  await prisma.entry.deleteMany();
  await prisma.entry.createMany({
    data: entries,
  });

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Entry"', 'id'), COALESCE((SELECT MAX(id) FROM "Entry"), 1))`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
