/*
  Warnings:

  - The `location` column on the `Entry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EntryLocation" AS ENUM ('Keller', 'Art', 'Kuykendall', 'Bilger', 'CampusCenter', 'Moore', 'ParadisePalms', 'POST');

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "location",
ADD COLUMN     "location" "EntryLocation" NOT NULL DEFAULT 'Keller';

-- DropEnum
DROP TYPE "Location";
