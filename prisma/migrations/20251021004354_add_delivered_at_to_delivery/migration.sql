/*
  Warnings:

  - You are about to alter the column `total` on the `CashClosure` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to drop the column `deliveryId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryPersonId` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - A unique constraint covering the columns `[orderId]` on the table `Delivery` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Made the column `deliveryPersonId` on table `Delivery` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `method` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Made the column `deliveryId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Delivery" DROP CONSTRAINT "Delivery_deliveryPersonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_deliveryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_deliveryPersonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_deliveryId_fkey";

-- AlterTable
ALTER TABLE "CashClosure" ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "orderId" INTEGER NOT NULL,
ALTER COLUMN "deliveryPersonId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryId",
DROP COLUMN "deliveryPersonId",
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "method" TEXT NOT NULL,
ALTER COLUMN "deliveryId" SET NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "DeliveryRoute" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "deliveryPersonId" INTEGER NOT NULL,

    CONSTRAINT "DeliveryRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringOrder" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderId_key" ON "Delivery"("orderId");

-- AddForeignKey
ALTER TABLE "DeliveryRoute" ADD CONSTRAINT "DeliveryRoute_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryRoute" ADD CONSTRAINT "DeliveryRoute_deliveryPersonId_fkey" FOREIGN KEY ("deliveryPersonId") REFERENCES "DeliveryPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringOrder" ADD CONSTRAINT "RecurringOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringOrder" ADD CONSTRAINT "RecurringOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_deliveryPersonId_fkey" FOREIGN KEY ("deliveryPersonId") REFERENCES "DeliveryPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
