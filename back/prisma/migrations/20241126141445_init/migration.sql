-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'KRW');

-- CreateEnum
CREATE TYPE "AssetClass" AS ENUM ('US_EQUITY', 'KR_EQUITY', 'BOND', 'CASH', 'COMMODITY');

-- CreateEnum
CREATE TYPE "Account" AS ENUM ('KW', 'MA', 'ISA', 'KRX', 'MA_CMA', 'CASH', 'IRA');

-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('NYS', 'NAS', 'AMS', 'KRX');

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "avgPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "assetClass" "AssetClass" NOT NULL DEFAULT 'US_EQUITY',
    "account" "Account" NOT NULL DEFAULT 'MA',
    "excd" "Exchange" NOT NULL DEFAULT 'NYS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assetHistory" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "return" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assetHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "rate" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_symbol_key" ON "stock"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_currency_key" ON "ExchangeRate"("currency");
