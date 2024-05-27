/*
  Warnings:

  - The `status` column on the `travel-buddy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TripBuddyStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "travel-buddy" DROP COLUMN "status",
ADD COLUMN     "status" "TripBuddyStatus" NOT NULL DEFAULT 'Pending';

-- DropEnum
DROP TYPE "TravelBuddyStatus";
