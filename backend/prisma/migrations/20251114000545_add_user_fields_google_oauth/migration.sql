/*
  Warnings:

  - You are about to drop the column `gpx_track` on the `tours` table. All the data in the column will be lost.

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
INSERT INTO "new_tours" ("cover_image", "created_at", "created_by", "date_end", "date_start", "description", "difficulty", "duration_unit", "duration_value", "excludes", "gallery", "id", "images", "includes", "is_multi_day", "itinerary", "language", "max_seats", "price_adult", "price_child", "slug", "terms", "title") SELECT "cover_image", "created_at", "created_by", "date_end", "date_start", "description", "difficulty", "duration_unit", "duration_value", "excludes", "gallery", "id", "images", "includes", "is_multi_day", "itinerary", "language", "max_seats", "price_adult", "price_child", "slug", "terms", "title" FROM "tours";
DROP TABLE "tours";
ALTER TABLE "new_tours" RENAME TO "tours";
CREATE UNIQUE INDEX "tours_slug_key" ON "tours"("slug");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT,
    "last_name" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "google_id" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("created_at", "email", "id", "name", "password_hash", "role") SELECT "created_at", "email", "id", "name", "password_hash", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
