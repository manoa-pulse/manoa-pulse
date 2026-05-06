-- CreateTable
CREATE TABLE "FavoritePlace" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "location" "EntryLocation" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritePlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoritePlace_location_idx" ON "FavoritePlace"("location");

-- CreateIndex
CREATE UNIQUE INDEX "FavoritePlace_userId_location_key" ON "FavoritePlace"("userId", "location");

-- AddForeignKey
ALTER TABLE "FavoritePlace" ADD CONSTRAINT "FavoritePlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
