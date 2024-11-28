/*
  Warnings:

  - A unique constraint covering the columns `[account]` on the table `portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "portfolio_account_key" ON "portfolio"("account");
