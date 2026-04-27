/*
  Warnings:

  - The `location` column on the `Entry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EntryLocation" AS ENUM ('HamiltonLibrary', 'WarriorRecreationCenter', 'CampusCenterFoodCourt', 'CampusCenterOutdoorCourt', 'TacoBellFoodCourt', 'ParadisePalms', 'POST2ndFloor');

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "location",
ADD COLUMN     "location" "EntryLocation" NOT NULL DEFAULT 'HamiltonLibrary';

-- DropEnum
DROP TYPE "Location";
