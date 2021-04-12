/*
  Warnings:

  - You are about to drop the column `from_person_id` on the `PersonRelation` table. All the data in the column will be lost.
  - You are about to drop the column `to_person_id` on the `PersonRelation` table. All the data in the column will be lost.
  - Added the required column `from_id` to the `PersonRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `PersonRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonRelation" DROP COLUMN "from_person_id",
DROP COLUMN "to_person_id",
ADD COLUMN     "from_id" INTEGER NOT NULL,
ADD COLUMN     "to_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PersonRelation" ADD FOREIGN KEY ("from_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonRelation" ADD FOREIGN KEY ("to_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
