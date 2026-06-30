-- CreateIndex
CREATE INDEX "answer_log_quiz_id_is_corrected_created_at_idx" ON "answer_log"("quiz_id", "is_corrected", "created_at");
