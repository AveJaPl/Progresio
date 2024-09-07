/*
  Warnings:

  - A unique constraint covering the columns `[parameterId,date]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Progress_parameterId_date_key" ON "Progress"("parameterId", "date");
