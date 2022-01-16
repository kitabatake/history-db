-- CreateTable
CREATE TABLE "PersonAlias" (
    "id" SERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "personId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonAlias" ADD FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
