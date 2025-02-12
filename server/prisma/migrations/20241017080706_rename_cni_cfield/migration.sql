/*
  Warnings:

  - You are about to drop the column `cninc` on the `User` table. All the data in the column will be lost.
  - Added the required column `cnic` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cninc",
ADD COLUMN     "cnic" VARCHAR(20) NOT NULL;
