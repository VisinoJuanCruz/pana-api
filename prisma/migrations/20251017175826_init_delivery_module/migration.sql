/*
  Warnings:

  - The values [SCHEDULED,IN_TRANSIT,COMPLETED,PARTIAL] on the enum `DeliveryStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `countedCash` on the `CashClosure` table. All the data in the column will be lost.
  - You are about to drop the column `difference` on the `CashClosure` table. All the data in the column will be lost.
  - You are about to drop the column `driverId` on the `CashClosure` table. All the data in the column will be lost.
  - You are about to drop the column `expectedCash` on the `CashClosure` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `CashClosure` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `route` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `routeName` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `DeliveryItem` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `DeliveryItem` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `DeliveryItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `DeliveryItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `route` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `driverId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `createdAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `CustomerProductPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Return` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockMovement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total` to the `CashClosure` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `orderId` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `total` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeliveryStatus_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."Delivery" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Delivery" ALTER COLUMN "status" TYPE "DeliveryStatus_new" USING ("status"::text::"DeliveryStatus_new");
ALTER TYPE "DeliveryStatus" RENAME TO "DeliveryStatus_old";
ALTER TYPE "DeliveryStatus_new" RENAME TO "DeliveryStatus";
DROP TYPE "public"."DeliveryStatus_old";
ALTER TABLE "Delivery" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."CashClosure" DROP CONSTRAINT "CashClosure_driverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CustomerProductPrice" DROP CONSTRAINT "CustomerProductPrice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CustomerProductPrice" DROP CONSTRAINT "CustomerProductPrice_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DeliveryItem" DROP CONSTRAINT "DeliveryItem_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_driverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PriceHistory" DROP CONSTRAINT "PriceHistory_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Return" DROP CONSTRAINT "Return_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Return" DROP CONSTRAINT "Return_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Return" DROP CONSTRAINT "Return_productId_fkey";

-- AlterTable
ALTER TABLE "CashClosure" DROP COLUMN "countedCash",
DROP COLUMN "difference",
DROP COLUMN "driverId",
DROP COLUMN "expectedCash",
DROP COLUMN "note",
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "balance",
DROP COLUMN "createdAt",
DROP COLUMN "route",
DROP COLUMN "updatedAt",
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "routeName",
DROP COLUMN "scheduledAt",
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "orderId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "DeliveryItem" DROP COLUMN "createdAt",
DROP COLUMN "customerId",
DROP COLUMN "subtotal",
DROP COLUMN "unitPrice";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "createdAt",
DROP COLUMN "phone",
DROP COLUMN "route",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "driverId",
DROP COLUMN "note",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "total" DROP DEFAULT,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "createdAt",
DROP COLUMN "subtotal",
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "customerId",
DROP COLUMN "method",
DROP COLUMN "note",
DROP COLUMN "orderId",
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "createdAt",
DROP COLUMN "stock",
DROP COLUMN "unit",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "public"."CustomerProductPrice";

-- DropTable
DROP TABLE "public"."PriceHistory";

-- DropTable
DROP TABLE "public"."Return";

-- DropTable
DROP TABLE "public"."StockMovement";

-- DropEnum
DROP TYPE "public"."MovementType";

-- DropEnum
DROP TYPE "public"."OrderStatus";

-- DropEnum
DROP TYPE "public"."PaymentMethod";

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
