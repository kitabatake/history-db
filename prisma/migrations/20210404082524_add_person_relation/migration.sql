-- CreateTable
CREATE TABLE "PersonRelation" (
    "id" SERIAL NOT NULL,
    "person1Id" INTEGER NOT NULL,
    "person2Id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
