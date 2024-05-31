/*
  Warnings:

  - Added the required column `country` to the `travel-buddy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "travel-buddy" ADD COLUMN     "country" TEXT NOT NULL;
