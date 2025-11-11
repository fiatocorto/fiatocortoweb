-- DropForeignKey
DROP INDEX IF EXISTS "bookings_tour_date_id_fkey";

-- AlterTable
CREATE TABLE "bookings_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "tour_id" TEXT NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "total_price" REAL NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_method" TEXT NOT NULL DEFAULT 'ONSITE',
    "qr_code" TEXT NOT NULL,
    "notes" TEXT,
    "checked_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy data from old table to new table
INSERT INTO "bookings_new" SELECT "id", "user_id", (SELECT "tour_id" FROM "tour_dates" WHERE "tour_dates"."id" = "bookings"."tour_date_id"), "adults", "children", "total_price", "payment_status", "payment_method", "qr_code", "notes", "checked_in", "created_at" FROM "bookings";

-- Drop old table and rename new table
DROP TABLE "bookings";
ALTER TABLE "bookings_new" RENAME TO "bookings";

-- CreateIndex
CREATE UNIQUE INDEX "bookings_qr_code_key" ON "bookings"("qr_code");

-- DropTable
DROP TABLE "tour_dates";
