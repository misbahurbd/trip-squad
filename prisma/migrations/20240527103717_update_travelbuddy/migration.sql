/*
  Warnings:

  - The primary key for the `travel-buddy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `travel-buddy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "travel-buddy" DROP CONSTRAINT "travel-buddy_pkey",
DROP COLUMN "id";
