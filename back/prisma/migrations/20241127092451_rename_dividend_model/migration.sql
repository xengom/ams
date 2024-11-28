/*
  Warnings:

  - You are about to drop the `Dividend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Dividend";

-- CreateTable
CREATE TABLE "dividend" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "symbol" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dividend_pkey" PRIMARY KEY ("id")
);
