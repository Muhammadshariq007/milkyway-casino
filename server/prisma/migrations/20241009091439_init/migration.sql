-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('SPIN', 'FLIP');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('ACTIVE', 'IN_ACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "whatsappNumber" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "cninc" VARCHAR(20) NOT NULL,
    "role" "RoleType" NOT NULL,
    "status" "StatusType" NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "betOption" INTEGER,
    "betNumber" INTEGER,
    "coins" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "debit" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "credit" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "transactionStatus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverSeed" TEXT NOT NULL,
    "clientSeed" TEXT NOT NULL,
    "combinedSeed" TEXT NOT NULL,
    "hashedSeed" TEXT NOT NULL,
    "hashedServerSeed" TEXT NOT NULL,
    "logsOf" "GameType" NOT NULL,
    "results" TEXT NOT NULL,
    "tossNumber" INTEGER NOT NULL,
    "winningIcon" TEXT NOT NULL,
    "randomDegree" INTEGER NOT NULL,
    "spinNumber" INTEGER NOT NULL,
    "betOptionNo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBet" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "GameType" NOT NULL,
    "betOption" INTEGER,
    "betNumber" INTEGER,
    "coins" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "transactionStatus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsappNumber_key" ON "User"("whatsappNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBet" ADD CONSTRAINT "UserBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
