-- CreateEnum
CREATE TYPE "Location" AS ENUM ('Keller', 'Art', 'Kuykendall', 'Bilger', 'CampusCenter', 'Moore', 'ParadisePalms', 'POST');

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "location" "Location" NOT NULL DEFAULT 'Keller',
    "busyLevel" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);
