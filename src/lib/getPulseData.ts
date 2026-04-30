import { EntryLocation } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  getLocationHoursStatus,
  isWithinLocationHours,
} from '@/lib/locationHours';
import { unstable_noStore } from 'next/cache';

export type PulseData = {
  location: string;
  busyLevel: number | null;
  occupancy: number | null;
  lastUpdated: string | null;
  samples: number;
  dataSource: 'LIVE' | 'PREDICTED' | 'NO_DATA' | 'AFTER_HOURS';
  isOpen: boolean;
  hoursStatus: string;
  todayHours: string;
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

const ALL_LOCATIONS = Object.values(EntryLocation);

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

const getClosestHourData = (
  hours: Record<number, { busyLevels: number[]; latestDate: Date | null }>,
  targetHour: number,
) => {
  const availableHours = Object.keys(hours).map(Number);

  if (availableHours.length === 0) {
    return null;
  }

  const closestHour = availableHours.reduce((closest, current) => {
    const closestDistance = Math.abs(closest - targetHour);
    const currentDistance = Math.abs(current - targetHour);

    return currentDistance < closestDistance ? current : closest;
  });

  return hours[closestHour];
};

export const getPulseData = async (): Promise<PulseData[]> => {
  unstable_noStore();

  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  const currentHistoricalHour = getCurrentHistoricalHour();

  const recentEntries = await prisma.entry.findMany({
    where: {
      createdAt: {
        gte: oneHourAgo,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const historicalEntries = await prisma.entry.findMany({
    where: {
      createdAt: {
        lt: oneHourAgo,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const recentGrouped: Record<
    string,
    {
      busyLevels: number[];
      latestDate: Date | null;
    }
  > = {};

  const predictionGrouped: Record<
    string,
    Record<number, { busyLevels: number[]; latestDate: Date | null }>
  > = {};

  ALL_LOCATIONS.forEach((location) => {
    recentGrouped[location] = {
      busyLevels: [],
      latestDate: null,
    };

    predictionGrouped[location] = {};
  });

  recentEntries.forEach((entry) => {
    const location = entry.location;

    if (!isWithinLocationHours(location, entry.createdAt)) {
      return;
    }

    recentGrouped[location].busyLevels.push(entry.busyLevel);

    const currentLatestDate = recentGrouped[location].latestDate;

    if (currentLatestDate === null || entry.createdAt > currentLatestDate) {
      recentGrouped[location].latestDate = entry.createdAt;
    }
  });

  historicalEntries.forEach((entry) => {
    const location = entry.location;
    const hour = getHawaiiHour(entry.createdAt);

    if (!isWithinLocationHours(location, entry.createdAt)) {
      return;
    }

    if (hour < HISTORICAL_START_HOUR || hour > HISTORICAL_END_HOUR) {
      return;
    }

    if (!predictionGrouped[location][hour]) {
      predictionGrouped[location][hour] = {
        busyLevels: [],
        latestDate: null,
      };
    }

    predictionGrouped[location][hour].busyLevels.push(entry.busyLevel);

    const currentLatestDate = predictionGrouped[location][hour].latestDate;

    if (currentLatestDate === null || entry.createdAt > currentLatestDate) {
      predictionGrouped[location][hour].latestDate = entry.createdAt;
    }
  });

  return ALL_LOCATIONS.map((location) => {
    const hoursStatus = getLocationHoursStatus(location);
    const baseHoursData = {
      isOpen: hoursStatus.isOpen,
      hoursStatus: hoursStatus.statusText,
      todayHours: hoursStatus.todayHoursText,
    };

    if (!hoursStatus.isOpen) {
      return {
        location,
        busyLevel: null,
        occupancy: null,
        lastUpdated: null,
        samples: 0,
        dataSource: 'AFTER_HOURS',
        ...baseHoursData,
      };
    }

    const recentValues = recentGrouped[location];

    if (recentValues.busyLevels.length > 0) {
      const averageBusyLevel =
        recentValues.busyLevels.reduce((sum, value) => sum + value, 0) /
        recentValues.busyLevels.length;

      return {
        location,
        busyLevel: averageBusyLevel,
        occupancy: Math.round(averageBusyLevel * 10),
        lastUpdated: recentValues.latestDate ? recentValues.latestDate.toISOString() : null,
        samples: recentValues.busyLevels.length,
        dataSource: 'LIVE',
        ...baseHoursData,
      };
    }

    const predictionValues = getClosestHourData(
      predictionGrouped[location],
      currentHistoricalHour,
    );

    if (predictionValues && predictionValues.busyLevels.length > 0) {
      const predictedBusyLevel =
        predictionValues.busyLevels.reduce((sum, value) => sum + value, 0) /
        predictionValues.busyLevels.length;

      return {
        location,
        busyLevel: predictedBusyLevel,
        occupancy: Math.round(predictedBusyLevel * 10),
        lastUpdated: null,
        samples: predictionValues.busyLevels.length,
        dataSource: 'PREDICTED',
        ...baseHoursData,
      };
    }

    return {
      location,
      busyLevel: 0,
      occupancy: 0,
      lastUpdated: null,
      samples: 0,
      dataSource: 'NO_DATA',
      ...baseHoursData,
    };
  });
};

export const getHourlyPulseData = async (): Promise<LocationHourlyPulseData[]> => {
  unstable_noStore();

  const raw = await prisma.entry.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  const grouped: Record<
    string,
    Record<number, { busyLevels: number[]; latestDate: Date | null }>
  > = {};

  ALL_LOCATIONS.forEach((location) => {
    grouped[location] = {};
  });

  raw.forEach((entry) => {
    const location = entry.location;
    const hour = getHawaiiHour(entry.createdAt);

    if (!isWithinLocationHours(location, entry.createdAt)) {
      return;
    }

    if (hour < HISTORICAL_START_HOUR || hour > HISTORICAL_END_HOUR) {
      return;
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

  return ALL_LOCATIONS.map((location) => ({
    location,
    hours: Object.entries(grouped[location])
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