import { prisma } from '@/lib/prisma';

export type PulseData = {
  location: string;
  busyLevel: number;
  occupancy: number;
  lastUpdated: string | null;
  samples: number;
};

export type HourlyPulseData = {
  hour: number;
  label: string;
  busyLevel: number;
  occupancy: number;
  lastUpdated: string | null;
  samples: number;
};

export type LocationHourlyPulseData = {
  location: string;
  hours: HourlyPulseData[];
};

const HAWAII_TIME_ZONE = 'Pacific/Honolulu';
export const HISTORICAL_START_HOUR = 7;
export const HISTORICAL_END_HOUR = 22;

const getHawaiiHour = (date: Date) => {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: HAWAII_TIME_ZONE,
    hour: '2-digit',
    hour12: false,
  }).format(date);

  return Number(hour) % 24;
};

export const getCurrentHawaiiHour = () => getHawaiiHour(new Date());

export const getCurrentHistoricalHour = () => {
  const currentHour = getCurrentHawaiiHour();

  if (currentHour < HISTORICAL_START_HOUR) {
    return HISTORICAL_START_HOUR;
  }

  if (currentHour > HISTORICAL_END_HOUR) {
    return HISTORICAL_END_HOUR;
  }

  return currentHour;
};

export const formatHourLabel = (hour: number) => {
  const date = new Date(Date.UTC(2026, 0, 1, hour));

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    hour12: true,
  }).format(date);
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
      samples: values.busyLevels.length,
    };
  });
};

export const getHourlyPulseData = async (): Promise<LocationHourlyPulseData[]> => {
  const raw = await prisma.entry.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  const grouped: Record<
    string,
    Record<number, { busyLevels: number[]; latestDate: Date | null }>
  > = {};

  raw.forEach((entry) => {
    const location = entry.location;
    const hour = getHawaiiHour(entry.createdAt);

    if (hour < HISTORICAL_START_HOUR || hour > HISTORICAL_END_HOUR) {
      return;
    }

    if (!grouped[location]) {
      grouped[location] = {};
    }

    if (!grouped[location][hour]) {
      grouped[location][hour] = {
        busyLevels: [],
        latestDate: null,
      };
    }

    grouped[location][hour].busyLevels.push(entry.busyLevel);

    const currentLatestDate = grouped[location][hour].latestDate;

    if (currentLatestDate === null || entry.createdAt > currentLatestDate) {
      grouped[location][hour].latestDate = entry.createdAt;
    }
  });

  return Object.entries(grouped).map(([location, hours]) => ({
    location,
    hours: Object.entries(hours)
      .map(([hour, values]) => {
        const averageBusyLevel =
          values.busyLevels.reduce((sum, value) => sum + value, 0) /
          values.busyLevels.length;

        return {
          hour: Number(hour),
          label: formatHourLabel(Number(hour)),
          busyLevel: averageBusyLevel,
          occupancy: Math.round(averageBusyLevel * 10),
          lastUpdated: values.latestDate ? values.latestDate.toISOString() : null,
          samples: values.busyLevels.length,
        };
      })
      .sort((a, b) => a.hour - b.hour),
  }));
};
