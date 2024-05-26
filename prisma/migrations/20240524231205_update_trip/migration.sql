/*
  Warnings:

  - You are about to drop the column `isDelated` on the `trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trip" DROP COLUMN "isDelated",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
