-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ALTER COLUMN "createdAt" DROP NOT NULL;
