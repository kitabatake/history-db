/*
  Warnings:

  - You are about to drop the column `from` on the `PersonRelation` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `PersonRelation` table. All the data in the column will be lost.
  - Added the required column `from_user_id` to the `PersonRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_user_id` to the `PersonRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonRelation" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "from_user_id" INTEGER NOT NULL,
ADD COLUMN     "to_user_id" INTEGER NOT NULL;
