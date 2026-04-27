import { prisma } from '../src/lib/prisma';
import { Role, EntryLocation } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database');

  const password = await hash('changeme', 10);

  // ✅ FIX 1: Use for...of instead of forEach
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;

    console.log(`Creating user: ${account.email} with role: ${role}`);

    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
  }

  // ✅ FIX 2: safer loop + simpler enum handling
  let id = 1;

  for (const data of config.defaultData) {
    const location = data.location as EntryLocation;

    console.log(`Adding entry: ${JSON.stringify(data)}`);

    await prisma.entry.upsert({
      where: { id },
      update: {},
      create: {
        location,
        busyLevel: data.busyLevel,
        comment: data.comment,
      },
    });

    id++;
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });