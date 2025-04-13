/*
  Warnings:

  - Made the column `expireAt` on table `Verification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Verification" ALTER COLUMN "expireAt" SET NOT NULL;
