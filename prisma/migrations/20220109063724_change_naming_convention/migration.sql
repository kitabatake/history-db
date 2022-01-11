/*
  Warnings:

  - You are about to drop the column `source_id` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `activity_id` on the `ActivityPerson` table. All the data in the column will be lost.
  - You are about to drop the column `person_id` on the `ActivityPerson` table. All the data in the column will be lost.
  - You are about to drop the column `person_relation_id` on the `PersonRelationPerson` table. All the data in the column will be lost.
  - You are about to drop the column `person_id` on the `PersonRelationPerson` table. All the data in the column will be lost.
  - Added the required column `activityId` to the `ActivityPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personId` to the `ActivityPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personRelationId` to the `PersonRelationPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personId` to the `PersonRelationPerson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_source_id_fkey";

-- DropForeignKey
ALTER TABLE "ActivityPerson" DROP CONSTRAINT "ActivityPerson_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "ActivityPerson" DROP CONSTRAINT "ActivityPerson_person_id_fkey";

-- DropForeignKey
ALTER TABLE "PersonRelationPerson" DROP CONSTRAINT "PersonRelationPerson_person_id_fkey";

-- DropForeignKey
ALTER TABLE "PersonRelationPerson" DROP CONSTRAINT "PersonRelationPerson_person_relation_id_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "source_id",
ADD COLUMN     "sourceId" INTEGER;

-- AlterTable
ALTER TABLE "ActivityPerson" DROP COLUMN "activity_id",
DROP COLUMN "person_id",
ADD COLUMN     "activityId" INTEGER NOT NULL,
ADD COLUMN     "personId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PersonRelationPerson" DROP COLUMN "person_relation_id",
DROP COLUMN "person_id",
ADD COLUMN     "personRelationId" INTEGER NOT NULL,
ADD COLUMN     "personId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Activity" ADD FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPerson" ADD FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPerson" ADD FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonRelationPerson" ADD FOREIGN KEY ("personRelationId") REFERENCES "PersonRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonRelationPerson" ADD FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
