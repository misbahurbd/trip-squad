/*
  Warnings:

  - Added the required column `address` to the `travel-buddy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `travel-buddy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `travel-buddy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `travel-buddy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `travel-buddy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "travel-buddy" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
