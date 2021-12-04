/*
  Warnings:

  - You are about to drop the column `from_id` on the `PersonRelation` table. All the data in the column will be lost.
  - You are about to drop the column `to_id` on the `PersonRelation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PersonRelation" DROP CONSTRAINT "PersonRelation_from_id_fkey";

-- DropForeignKey
ALTER TABLE "PersonRelation" DROP CONSTRAINT "PersonRelation_to_id_fkey";

-- AlterTable
ALTER TABLE "PersonRelation" DROP COLUMN "from_id",
DROP COLUMN "to_id";

-- CreateTable
CREATE TABLE "PersonRelationPerson" (
    "id" SERIAL NOT NULL,
    "person_relation_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonRelationPerson" ADD FOREIGN KEY ("person_relation_id") REFERENCES "PersonRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonRelationPerson" ADD FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
