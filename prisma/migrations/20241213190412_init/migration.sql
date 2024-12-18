-- CreateTable
CREATE TABLE "Movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genre" TEXT NOT NULL,
    "releaseYear" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL
);
