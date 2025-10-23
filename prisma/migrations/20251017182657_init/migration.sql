/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `DeliveryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "DeliveryStatus_new" AS ENUM ('PENDING', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."Delivery" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Delivery" ALTER COLUMN "status" TYPE "DeliveryStatus_new" USING ("status"::text::"DeliveryStatus_new");
ALTER TYPE "DeliveryStatus" RENAME TO "DeliveryStatus_old";
ALTER TYPE "DeliveryStatus_new" RENAME TO "DeliveryStatus";
DROP TYPE "public"."DeliveryStatus_old";
ALTER TABLE "Delivery" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
