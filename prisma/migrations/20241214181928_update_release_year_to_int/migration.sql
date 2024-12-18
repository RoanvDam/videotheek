/*
  Warnings:

  - You are about to alter the column `releaseYear` on the `Movies` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genre" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Movies" ("description", "genre", "id", "releaseYear", "title") SELECT "description", "genre", "id", "releaseYear", "title" FROM "Movies";
DROP TABLE "Movies";
ALTER TABLE "new_Movies" RENAME TO "Movies";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
