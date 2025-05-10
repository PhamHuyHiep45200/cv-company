/*
  Warnings:

  - Added the required column `category_id` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "category_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CategoryJob" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryJob_name_key" ON "CategoryJob"("name");

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategoryJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
