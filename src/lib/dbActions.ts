'use server';

import { Condition, EntryLocation, Role, Stuff } from '@prisma/client';
import bcrypt, { hash } from 'bcrypt';
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
    return {
      success: false,
      error: `Invalid location: ${entry.location}`,
    };
  }

  if (entry.busyLevel < 1 || entry.busyLevel > 10) {
    return {
      success: false,
      error: 'Busy level must be between 1 and 10',
    };
  }

  const location = entry.location as EntryLocation;

  try {
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

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: 'Unable to submit update.',
    };
  }
}

/**
 * Toggles the current user's favorite state for a campus location.
 */
export async function toggleFavoritePlace(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('You must be logged in to bookmark a place.');
  }

  const locationValue = formData.get('location');

  if (typeof locationValue !== 'string') {
    throw new Error('Invalid location.');
  }

  const validLocations = Object.values(EntryLocation);

  if (!validLocations.includes(locationValue as EntryLocation)) {
    throw new Error(`Invalid location: ${locationValue}`);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error('User account not found.');
  }

  const location = locationValue as EntryLocation;
  const favoritedValue = formData.get('favorited');

  if (favoritedValue === 'true') {
    await prisma.favoritePlace.upsert({
      where: {
        userId_location: {
          userId: user.id,
          location,
        },
      },
      update: {},
      create: {
        userId: user.id,
        location,
      },
    });

    return;
  }

  if (favoritedValue === 'false') {
    await prisma.favoritePlace.deleteMany({
      where: {
        userId: user.id,
        location,
      },
    });

    return;
  }

  const existingFavorite = await prisma.favoritePlace.findUnique({
    where: {
      userId_location: {
        userId: user.id,
        location,
      },
    },
  });

  if (existingFavorite) {
    await prisma.favoritePlace.delete({
      where: {
        id: existingFavorite.id,
      },
    });
  } else {
    await prisma.favoritePlace.create({
      data: {
        userId: user.id,
        location,
      },
    });
  }
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
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists.',
      };
    }

    const password = await hash(credentials.password, 10);

    await prisma.user.create({
      data: {
        email: credentials.email,
        password,
      },
    });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, oldpassword, password.
 */
export async function changePassword(credentials: {
  email: string;
  oldpassword: string;
  password: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User account not found.',
      };
    }

    const oldPasswordMatches = await bcrypt.compare(credentials.oldpassword, user.password);

    if (!oldPasswordMatches) {
      return {
        success: false,
        error: 'Current password is incorrect.',
      };
    }

    const password = await hash(credentials.password, 10);

    await prisma.user.update({
      where: {
        email: credentials.email,
      },
      data: {
        password,
      },
    });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: 'Unable to change password. Please try again.',
    };
  }
}