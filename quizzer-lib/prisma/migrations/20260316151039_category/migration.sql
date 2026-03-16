-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "file_num" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_file_num_key" ON "category"("name", "file_num");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_file_num_fkey" FOREIGN KEY ("file_num") REFERENCES "quiz_file"("file_num") ON DELETE RESTRICT ON UPDATE CASCADE;
