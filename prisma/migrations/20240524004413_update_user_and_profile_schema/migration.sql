/*
  Warnings:

  - Made the column `name` on table `profile` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SuperAdmin', 'Admin', 'User');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Deactivate');

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "bio" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'User',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'Active';
