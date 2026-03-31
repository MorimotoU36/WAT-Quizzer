/*
  Warnings:

  - You are about to drop the `quiz_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "quiz_category" DROP CONSTRAINT "quiz_category_quiz_id_fkey";

-- DropTable
DROP TABLE "quiz_category";
