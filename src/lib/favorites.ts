import { EntryLocation } from '@prisma/client';
import { auth } from './auth';
import { prisma } from './prisma';

export const getCurrentUserFavoriteLocations = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return [];
  }

  const favorites = await prisma.favoritePlace.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      location: true,
    },
  });

  return favorites.map((favorite) => favorite.location);
};

export const getCurrentUserFavoriteLocationSet = async () => {
  const favorites = await getCurrentUserFavoriteLocations();

  return new Set<EntryLocation>(favorites);
};
