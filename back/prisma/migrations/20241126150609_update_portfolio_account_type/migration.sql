/*
  Warnings:

  - Changed the type of `account` on the `portfolio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "portfolio" DROP COLUMN "account",
ADD COLUMN     "account" "Account" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_account_key" ON "portfolio"("account");
