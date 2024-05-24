-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('Verify', 'Reset');

-- CreateTable
CREATE TABLE "verification_token" (
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenType" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("email","token")
);
