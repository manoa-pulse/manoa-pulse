import { LOCATION_CONFIG } from './locationConfig';

type LocationKey = keyof typeof LOCATION_CONFIG;

type DayHours = {
  open: string;
  close: string;
};

type LocationHours = Record<
  'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday',
  DayHours[] | 'OPEN_24_HOURS' | null
>;

export type ClientHoursStatus = {
  isOpen: boolean;
  statusText: string;
  todayHoursText: string;
};

const HAWAII_TIME_ZONE = 'Pacific/Honolulu';

const LOCATION_HOURS: Record<LocationKey, LocationHours> = {
  HamiltonLibrary: {
    sunday: [{ open: '12:00', close: '22:00' }],
    monday: [{ open: '08:00', close: '22:00' }],
    tuesday: [{ open: '08:00', close: '22:00' }],
    wednesday: [{ open: '08:00', close: '22:00' }],
    thursday: [{ open: '08:00', close: '22:00' }],
    friday: [{ open: '08:00', close: '18:00' }],
    saturday: [{ open: '09:00', close: '17:00' }],
  },
  WarriorRecreationCenter: {
    sunday: [{ open: '09:00', close: '18:00' }],
    monday: [{ open: '06:00', close: '22:30' }],
    tuesday: [{ open: '06:00', close: '22:30' }],
    wednesday: [{ open: '06:00', close: '22:30' }],
    thursday: [{ open: '06:00', close: '22:30' }],
    friday: [{ open: '06:00', close: '21:00' }],
    saturday: [{ open: '09:00', close: '18:00' }],
  },
  CampusCenterFoodCourt: {
    sunday: null,
    monday: [{ open: '07:00', close: '15:00' }],
    tuesday: [{ open: '07:00', close: '15:00' }],
    wednesday: [{ open: '07:00', close: '15:00' }],
    thursday: [{ open: '07:00', close: '15:00' }],
    friday: [{ open: '10:00', close: '14:00' }],
    saturday: null,
  },
  CampusCenterOutdoorCourt: {
    sunday: 'OPEN_24_HOURS',
    monday: 'OPEN_24_HOURS',
    tuesday: 'OPEN_24_HOURS',
    wednesday: 'OPEN_24_HOURS',
    thursday: 'OPEN_24_HOURS',
    friday: 'OPEN_24_HOURS',
    saturday: 'OPEN_24_HOURS',
  },
  TacoBellFoodCourt: {
    sunday: null,
    monday: [{ open: '10:00', close: '15:00' }],
    tuesday: [{ open: '10:00', close: '15:00' }],
    wednesday: [{ open: '10:00', close: '15:00' }],
    thursday: [{ open: '10:00', close: '15:00' }],
    friday: [{ open: '10:00', close: '15:00' }],
    saturday: null,
  },
  ParadisePalms: {
    sunday: null,
    monday: [{ open: '10:00', close: '15:00' }],
    tuesday: [{ open: '10:00', close: '15:00' }],
    wednesday: [{ open: '10:00', close: '15:00' }],
    thursday: [{ open: '10:00', close: '15:00' }],
    friday: [{ open: '10:00', close: '15:00' }],
    saturday: null,
  },
  POST2ndFloor: {
    sunday: null,
    monday: [{ open: '06:00', close: '20:30' }],
    tuesday: [{ open: '06:00', close: '20:30' }],
    wednesday: [{ open: '06:00', close: '20:30' }],
    thursday: [{ open: '06:00', close: '20:30' }],
    friday: [{ open: '06:00', close: '20:30' }],
    saturday: null,
  },
};

const getHawaiiDateParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: HAWAII_TIME_ZONE,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === 'weekday')?.value.toLowerCase();
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0) % 24;
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);

  return {
    dayKey: weekday as keyof LocationHours,
    currentMinutes: hour * 60 + minute,
  };
};

const timeToMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);

  return hour * 60 + minute;
};

const formatTime = (time: string) => {
  const [hourString, minuteString] = time.split(':');
  const hour = Number(hourString);
  const minute = Number(minuteString);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute === 0 ? '' : `:${minuteString}`;

  return `${displayHour}${displayMinute} ${suffix}`;
};

const formatHoursText = (hours: DayHours[] | 'OPEN_24_HOURS' | null) => {
  if (hours === 'OPEN_24_HOURS') return 'Open 24 hours';
  if (hours === null) return 'Closed today';

  return hours
    .map((range) => `${formatTime(range.open)} - ${formatTime(range.close)}`)
    .join(', ');
};

export const getClientLocationHoursStatus = (
  location: LocationKey,
  date: Date = new Date(),
): ClientHoursStatus => {
  const locationHours = LOCATION_HOURS[location];
  const { dayKey, currentMinutes } = getHawaiiDateParts(date);
  const todayHours = locationHours[dayKey];

  if (todayHours === 'OPEN_24_HOURS') {
    return {
      isOpen: true,
      statusText: 'Open 24 hours',
      todayHoursText: 'Open 24 hours',
    };
  }

  if (todayHours === null) {
    return {
      isOpen: false,
      statusText: 'Closed today',
      todayHoursText: 'Closed today',
    };
  }

  const currentRange = todayHours.find((range) => {
    const openMinutes = timeToMinutes(range.open);
    const closeMinutes = timeToMinutes(range.close);

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  });

  if (currentRange) {
    return {
      isOpen: true,
      statusText: `Open until ${formatTime(currentRange.close)}`,
      todayHoursText: formatHoursText(todayHours),
    };
  }

  const nextOpening = todayHours.find((range) => currentMinutes < timeToMinutes(range.open));

  if (nextOpening) {
    return {
      isOpen: false,
      statusText: `Closed, opens at ${formatTime(nextOpening.open)}`,
      todayHoursText: formatHoursText(todayHours),
    };
  }

  return {
    isOpen: false,
    statusText: 'Closed now',
    todayHoursText: formatHoursText(todayHours),
  };
};
