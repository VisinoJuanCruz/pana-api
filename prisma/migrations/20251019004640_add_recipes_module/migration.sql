/*
  Warnings:

  - You are about to drop the column `createdAt` on the `RecipeItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `RecipeItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."RecipeItem_productId_rawMaterialId_key";

-- AlterTable
ALTER TABLE "RecipeItem" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "recipeId" INTEGER;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
