/*
  Warnings:

  - You are about to drop the `assetHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "assetHistory";

-- CreateTable
CREATE TABLE "dividend" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "symbol" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'KRW',
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dividend_pkey" PRIMARY KEY ("id")
);
