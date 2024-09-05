-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_parameterId_fkey";

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
