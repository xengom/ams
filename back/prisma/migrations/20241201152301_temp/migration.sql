/*
  Warnings:

  - A unique constraint covering the columns `[item]` on the table `transferPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transferPlan_item_key" ON "transferPlan"("item");
