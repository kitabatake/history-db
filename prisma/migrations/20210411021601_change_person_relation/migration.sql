/*
  Warnings:

  - You are about to drop the column `person1Id` on the `PersonRelation` table. All the data in the column will be lost.
  - You are about to drop the column `person2Id` on the `PersonRelation` table. All the data in the column will be lost.
  - Added the required column `from` to the `PersonRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `PersonRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonRelation" DROP COLUMN "person1Id",
DROP COLUMN "person2Id",
ADD COLUMN     "from" INTEGER NOT NULL,
ADD COLUMN     "to" INTEGER NOT NULL;
