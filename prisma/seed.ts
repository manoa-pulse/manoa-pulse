import { prisma } from '../src/lib/prisma';
import { Role, EntryLocation } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database');

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

  let id = 1;

  for (const data of config.defaultData) {
    const location = data.location as EntryLocation;

    console.log(`Adding entry: ${JSON.stringify(data)}`);

    await prisma.entry.upsert({
      where: { id },
      update: {
        location,
        busyLevel: data.busyLevel,
        comment: data.comment,
      },
      create: {
        id,
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