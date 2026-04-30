'use server';

import { Condition, EntryLocation, Role, Stuff } from '@prisma/client';
import { hash } from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { prisma } from './prisma';

const requireAdmin = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('You must be logged in.');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user || user.role !== Role.ADMIN) {
    throw new Error('You must be an admin to perform this action.');
  }

  return user;
};

/**
 * Adds an entry into the database.
 * @param entry, an object with the following properties: location, busyLevel, comment.
 */
export async function submitUpdate(entry: { location: string; busyLevel: number; comment?: string }) {
  const session = await auth();

  const validLocations = Object.values(EntryLocation);

  if (!validLocations.includes(entry.location as EntryLocation)) {
    throw new Error(`Invalid location: ${entry.location}`);
  }

  if (entry.busyLevel < 1 || entry.busyLevel > 10) {
    throw new Error('Busy level must be between 1 and 10');
  }

  const location = entry.location as EntryLocation;

  await prisma.entry.create({
    data: {
      location,
      busyLevel: entry.busyLevel,
      comment: entry.comment ?? '',
      submittedBy: session?.user?.email ?? 'Unknown',
    },
  });

  revalidatePath('/pulse-feed');
  revalidatePath('/map-view');
  revalidatePath('/locations');
  revalidatePath('/locations/[slug]', 'page');
  revalidatePath('/admin');

  redirect('/pulse-feed');
}

/**
 * Deletes a pulse submission from the admin page.
 */
export async function deletePulseSubmission(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));

  if (!Number.isInteger(id)) {
    throw new Error('Invalid submission id.');
  }

  await prisma.entry.delete({
    where: {
      id,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/pulse-feed');
  revalidatePath('/map-view');
  revalidatePath('/locations');
  revalidatePath('/locations/[slug]', 'page');
}

/**
 * Updates a user's role from the admin page.
 */
export async function updateUserRole(formData: FormData) {
  const currentAdmin = await requireAdmin();

  const id = Number(formData.get('id'));
  const role = formData.get('role');

  if (!Number.isInteger(id)) {
    throw new Error('Invalid user id.');
  }

  if (role !== Role.USER && role !== Role.ADMIN) {
    throw new Error('Invalid role.');
  }

  if (id === currentAdmin.id && role !== Role.ADMIN) {
    throw new Error('You cannot remove your own admin role.');
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });

  revalidatePath('/admin');
}

/**
 * Deletes a user from the admin page.
 */
export async function deleteUser(formData: FormData) {
  const currentAdmin = await requireAdmin();

  const id = Number(formData.get('id'));

  if (!Number.isInteger(id)) {
    throw new Error('Invalid user id.');
  }

  if (id === currentAdmin.id) {
    throw new Error('You cannot delete your own admin account.');
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  revalidatePath('/admin');
}

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  let condition: Condition = 'good';

  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }

  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });

  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });

  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  await prisma.stuff.delete({
    where: { id },
  });

  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);

  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);

  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}