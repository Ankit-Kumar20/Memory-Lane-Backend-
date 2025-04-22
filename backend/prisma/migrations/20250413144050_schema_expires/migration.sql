/*
  Warnings:

  - You are about to drop the column `expireAt` on the `Verification` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "expireAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
