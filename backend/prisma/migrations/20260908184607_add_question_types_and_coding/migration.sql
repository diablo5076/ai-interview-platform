-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('BEHAVIORAL', 'TECHNICAL', 'SITUATIONAL', 'CASE_STUDY', 'CODING', 'NUMERICAL');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "language" TEXT,
ADD COLUMN     "starterCode" TEXT,
ADD COLUMN     "testCases" JSONB,
ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'TECHNICAL';
