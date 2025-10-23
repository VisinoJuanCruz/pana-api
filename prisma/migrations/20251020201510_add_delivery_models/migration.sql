/*
  Warnings:

  - You are about to drop the column `deliveredAt` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `driverId` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Delivery` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `quantity` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `unitPrice` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to drop the `Driver` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Delivery" DROP CONSTRAINT "Delivery_driverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Delivery" DROP CONSTRAINT "Delivery_orderId_fkey";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "deliveredAt",
DROP COLUMN "driverId",
DROP COLUMN "orderId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryPersonId" INTEGER;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryId" INTEGER,
ADD COLUMN     "deliveryPersonId" INTEGER,
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "status" SET DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "unitPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "public"."Driver";

-- CreateTable
CREATE TABLE "DeliveryPerson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "vehicle" TEXT,

    CONSTRAINT "DeliveryPerson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryPersonId_fkey" FOREIGN KEY ("deliveryPersonId") REFERENCES "DeliveryPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_deliveryPersonId_fkey" FOREIGN KEY ("deliveryPersonId") REFERENCES "DeliveryPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
