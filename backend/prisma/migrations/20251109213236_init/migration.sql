-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_adult" REAL NOT NULL,
    "price_child" REAL NOT NULL,
    "language" TEXT NOT NULL,
    "itinerary" TEXT NOT NULL,
    "duration_value" INTEGER NOT NULL,
    "duration_unit" TEXT NOT NULL,
    "cover_image" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "includes" TEXT NOT NULL,
    "excludes" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tour_dates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tour_id" TEXT NOT NULL,
    "date_start" DATETIME NOT NULL,
    "date_end" DATETIME,
    "capacity_min" INTEGER NOT NULL DEFAULT 1,
    "capacity_max" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Rome',
    "price_override" REAL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "tour_dates_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "tour_date_id" TEXT NOT NULL,
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
    CONSTRAINT "bookings_tour_date_id_fkey" FOREIGN KEY ("tour_date_id") REFERENCES "tour_dates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tours_slug_key" ON "tours"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_qr_code_key" ON "bookings"("qr_code");
