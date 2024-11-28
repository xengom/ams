-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('INVESTMENT', 'PENSION', 'SAVINGS');

-- CreateTable
CREATE TABLE "income" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "type" "IncomeType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "netAmount" INTEGER NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salary_pkey" PRIMARY KEY ("id")
);
