import { prisma } from '@/lib/prisma';

export type PulseData = {
  location: string;
  busyLevel: number;
  occupancy: number;
  lastUpdated: string | null;
};

export const getPulseData = async (): Promise<PulseData[]> => {
  const raw = await prisma.entry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const grouped: Record<string, { busyLevels: number[]; latestDate: Date | null }> = {};

  raw.forEach((entry) => {
    const location = entry.location;

    if (!grouped[location]) {
      grouped[location] = {
        busyLevels: [],
        latestDate: null,
      };
    }

    grouped[location].busyLevels.push(entry.busyLevel);

    const currentLatestDate = grouped[location].latestDate;

    if (currentLatestDate === null || entry.createdAt > currentLatestDate) {
      grouped[location].latestDate = entry.createdAt;
    }
  });

  return Object.entries(grouped).map(([location, values]) => {
    const averageBusyLevel =
      values.busyLevels.reduce((sum, value) => sum + value, 0) / values.busyLevels.length;

    return {
      location,
      busyLevel: averageBusyLevel,
      occupancy: Math.round(averageBusyLevel * 10),
      lastUpdated: values.latestDate ? values.latestDate.toISOString() : null,
    };
  });
};