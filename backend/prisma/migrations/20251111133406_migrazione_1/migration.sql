/*
  Warnings:

  - You are about to drop the column `date` on the `tours` table. All the data in the column will be lost.
  - Added the required column `date_end` to the `tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_start` to the `tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_seats` to the `tours` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_adult" REAL NOT NULL,
    "price_child" REAL NOT NULL,
    "language" TEXT NOT NULL,
    "cover_image" TEXT NOT NULL,
    "images" TEXT,
    "gallery" TEXT,
    "date_start" DATETIME NOT NULL,
    "date_end" DATETIME NOT NULL,
    "itinerary" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "includes" TEXT,
    "excludes" TEXT,
    "duration_value" INTEGER,
    "duration_unit" TEXT,
    "max_seats" INTEGER NOT NULL,
    "difficulty" TEXT,
    "is_multi_day" BOOLEAN DEFAULT false,
    "created_by" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tours" ("cover_image", "created_at", "created_by", "description", "difficulty", "duration_unit", "duration_value", "excludes", "id", "images", "includes", "itinerary", "language", "price_adult", "price_child", "slug", "terms", "title") SELECT "cover_image", "created_at", "created_by", "description", "difficulty", "duration_unit", "duration_value", "excludes", "id", "images", "includes", "itinerary", "language", "price_adult", "price_child", "slug", "terms", "title" FROM "tours";
DROP TABLE "tours";
ALTER TABLE "new_tours" RENAME TO "tours";
CREATE UNIQUE INDEX "tours_slug_key" ON "tours"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
