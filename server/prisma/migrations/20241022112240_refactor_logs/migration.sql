/*
  Warnings:

  - You are about to drop the column `betOptionNo` on the `Logs` table. All the data in the column will be lost.
  - You are about to drop the column `randomDegree` on the `Logs` table. All the data in the column will be lost.
  - You are about to drop the column `spinNumber` on the `Logs` table. All the data in the column will be lost.
  - You are about to drop the column `tossNumber` on the `Logs` table. All the data in the column will be lost.
  - You are about to drop the column `winningIcon` on the `Logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "betOptionNo",
DROP COLUMN "randomDegree",
DROP COLUMN "spinNumber",
DROP COLUMN "tossNumber",
DROP COLUMN "winningIcon";
