/*
  Warnings:

  - You are about to drop the column `basePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `rawMaterialId` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Recipe" DROP CONSTRAINT "Recipe_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Recipe" DROP CONSTRAINT "Recipe_rawMaterialId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "basePrice",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "recipeId" INTEGER,
ADD COLUMN     "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'unidad',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "RawMaterial" ALTER COLUMN "stock" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "productId",
DROP COLUMN "quantity",
DROP COLUMN "rawMaterialId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "RecipeItem" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "rawMaterialId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" SERIAL NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "rawMaterialId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeItem_productId_rawMaterialId_key" ON "RecipeItem"("productId", "rawMaterialId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
