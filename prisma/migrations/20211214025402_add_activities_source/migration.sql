-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "source_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Activity" ADD FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
