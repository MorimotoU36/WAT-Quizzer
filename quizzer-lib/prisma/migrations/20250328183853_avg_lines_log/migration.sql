-- CreateTable
CREATE TABLE "avg_lines_log" (
    "id" SERIAL NOT NULL,
    "avg_line" DECIMAL NOT NULL,
    "total_lines" INTEGER NOT NULL,
    "total_files" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "avg_lines_log_pkey" PRIMARY KEY ("id")
);
