/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `RecipeItem` table. All the data in the column will be lost.
  - You are about to drop the `RecipeIngredient` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `basePrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `recipeId` on table `RecipeItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_rawMaterialId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecipeItem" DROP CONSTRAINT "RecipeItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecipeItem" DROP CONSTRAINT "RecipeItem_recipeId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "RecipeItem" DROP COLUMN "productId",
ALTER COLUMN "recipeId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."RecipeIngredient";

-- CreateTable
CREATE TABLE "CustomerProductPrice" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "customPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CustomerProductPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProductPrice" ADD CONSTRAINT "CustomerProductPrice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProductPrice" ADD CONSTRAINT "CustomerProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
