/*
  Warnings:

  - You are about to drop the column `nome` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `user_ref` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `sponsored_content` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "verification_seal" DROP CONSTRAINT "verification_seal_user_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nome",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "user_ref" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sponsored_content" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sponsored_content" ADD CONSTRAINT "sponsored_content_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_seal" ADD CONSTRAINT "verification_seal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
