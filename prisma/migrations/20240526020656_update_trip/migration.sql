/*
  Warnings:

  - Added the required column `itinerary` to the `trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trip" ADD COLUMN     "itinerary" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;
