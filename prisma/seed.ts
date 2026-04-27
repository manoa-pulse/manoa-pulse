import { prisma } from '../src/lib/prisma';
import { Role, EntryLocation } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  for (const data of config.defaultData) {
    const location = EntryLocation[data.location as keyof typeof EntryLocation];;
    console.log(`  Adding entry: ${JSON.stringify(data)}`);
     
    await prisma.entry.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        location,
        busyLevel: data.busyLevel,
        comment: data.comment,
      },
    });
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
