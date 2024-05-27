-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('Open', 'Closed');

-- AlterTable
ALTER TABLE "trip" ADD COLUMN     "tripStatus" "TripStatus" NOT NULL DEFAULT 'Open';
