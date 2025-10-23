/*
  Warnings:

  - A unique constraint covering the columns `[customerId,productId]` on the table `CustomerProductPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomerProductPrice_customerId_productId_key" ON "CustomerProductPrice"("customerId", "productId");
