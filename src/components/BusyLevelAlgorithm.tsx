import { prisma } from '@/lib/prisma';

/**
 * Function that takes the average of all of the entries with the specified names and returns it as a number.
 * @param location 
 * @returns The average
 */

async function getBusyLevel(location : string) : Promise<number> {
    const entries = (await prisma.entry.findMany()).filter((entry) => entry.location === location); // Pull entries w/ given location from database.
    const average : number = entries.reduce(( total : number, entry: { busyLevel: number; }) => total + entry.busyLevel, 0) / entries.length; // Get average of all entry busyLevels
    return average;
}

export default getBusyLevel;