/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profile_email_key" ON "profile"("email");
