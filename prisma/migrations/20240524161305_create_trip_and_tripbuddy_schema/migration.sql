/*
  Warnings:

  - The values [Deactivate] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TravelBuddyStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('Active', 'Deactivated');
ALTER TABLE "user" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'Active';
COMMIT;

-- CreateTable
CREATE TABLE "trip" (
    "id" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "photos" TEXT[],
    "budget" INTEGER NOT NULL,
    "createdId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel-buddy" (
    "id" TEXT NOT NULL,
    "status" "TravelBuddyStatus" NOT NULL DEFAULT 'Pending',
    "tripId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel-buddy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trip_description_startDate_endDate_idx" ON "trip"("description", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "travel-buddy_userId_tripId_key" ON "travel-buddy"("userId", "tripId");

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel-buddy" ADD CONSTRAINT "travel-buddy_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel-buddy" ADD CONSTRAINT "travel-buddy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
