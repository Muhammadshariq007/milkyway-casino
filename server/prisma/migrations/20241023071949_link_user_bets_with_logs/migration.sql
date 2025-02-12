/*
  Warnings:

  - Added the required column `betFor` to the `UserBet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBet" ADD COLUMN     "betFor" INTEGER NOT NULL,
ADD COLUMN     "lastLogId" INTEGER;

-- AddForeignKey
ALTER TABLE "UserBet" ADD CONSTRAINT "UserBet_lastLogId_fkey" FOREIGN KEY ("lastLogId") REFERENCES "Logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
