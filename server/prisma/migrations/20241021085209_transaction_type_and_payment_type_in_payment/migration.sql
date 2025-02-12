/*
  Warnings:

  - Added the required column `paymentType` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionType` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "paymentType" AS ENUM ('DEBIT', 'CREDIT', 'COINS');

-- CreateEnum
CREATE TYPE "transactionType" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentType" "paymentType" NOT NULL,
ADD COLUMN     "transactionType" "transactionType" NOT NULL;
