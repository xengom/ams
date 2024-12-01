-- CreateTable
CREATE TABLE "regularPayment" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentDate" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regularPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planItem" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "ratio" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transferPlan" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "transferDate" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bank" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transferPlan_pkey" PRIMARY KEY ("id")
);
