/*
  Warnings:

  - Made the column `createdAt` on table `Interview` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "startedAt" TIMESTAMP(3),
ALTER COLUMN "createdAt" SET NOT NULL;
