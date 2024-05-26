/*
  Warnings:

  - You are about to drop the column `createdId` on the `trip` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `trip` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `trip` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startDate` on the `trip` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endDate` on the `trip` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_userId_fkey";

-- AlterTable
ALTER TABLE "trip" DROP COLUMN "createdId",
DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
DROP COLUMN "startDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "trip_description_startDate_endDate_idx" ON "trip"("description", "startDate", "endDate");

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
