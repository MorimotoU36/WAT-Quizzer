-- CreateTable
CREATE TABLE "category_parent_child" (
    "id" SERIAL NOT NULL,
    "parent_category_id" INTEGER NOT NULL,
    "child_category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "category_parent_child_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_parent_child_parent_category_id_child_category_id_key" ON "category_parent_child"("parent_category_id", "child_category_id");

-- AddForeignKey
ALTER TABLE "category_parent_child" ADD CONSTRAINT "category_parent_child_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_parent_child" ADD CONSTRAINT "category_parent_child_child_category_id_fkey" FOREIGN KEY ("child_category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
