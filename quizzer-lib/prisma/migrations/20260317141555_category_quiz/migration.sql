-- CreateTable
CREATE TABLE "category_quiz" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "category_quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_quiz_quiz_id_category_id_key" ON "category_quiz"("quiz_id", "category_id");

-- AddForeignKey
ALTER TABLE "category_quiz" ADD CONSTRAINT "category_quiz_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_quiz" ADD CONSTRAINT "category_quiz_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
