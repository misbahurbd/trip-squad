/*
  Warnings:

  - You are about to drop the column `address` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country";
