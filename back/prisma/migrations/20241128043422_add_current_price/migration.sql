/*
  Warnings:

  - You are about to drop the `AccountInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "stock" ADD COLUMN     "currentPrice" DOUBLE PRECISION;

-- DropTable
DROP TABLE "AccountInfo";
