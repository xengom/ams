-- AlterTable
ALTER TABLE "dividend" ALTER COLUMN "currency" SET DEFAULT 'KRW';

-- CreateTable
CREATE TABLE "assetHistory" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investmentAmount" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "returnRate" DOUBLE PRECISION NOT NULL,
    "totalReturn" DOUBLE PRECISION NOT NULL,
    "dividendReturn" DOUBLE PRECISION NOT NULL,
    "pureReturn" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assetHistory_pkey" PRIMARY KEY ("id")
);
