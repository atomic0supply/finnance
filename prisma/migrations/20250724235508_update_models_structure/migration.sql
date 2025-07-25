/*
  Warnings:

  - You are about to drop the column `current_value` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_date` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_price` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `monthly_price` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `next_due` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `current_value` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `license_plate` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_date` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_price` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `amount` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `next_payment` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plate` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "properties_is_active_idx";

-- DropIndex
DROP INDEX "services_category_idx";

-- DropIndex
DROP INDEX "services_next_due_idx";

-- DropIndex
DROP INDEX "vehicles_is_active_idx";

-- AlterTable for properties - preserve current_value as value
ALTER TABLE "properties" 
ADD COLUMN "value" DECIMAL(12,2);

-- Copy current_value to value for existing records
UPDATE "properties" SET "value" = "current_value" WHERE "current_value" IS NOT NULL;

-- Drop old columns
ALTER TABLE "properties" 
DROP COLUMN "current_value",
DROP COLUMN "is_active",
DROP COLUMN "purchase_date",
DROP COLUMN "purchase_price";

-- AlterTable for services - handle existing data
ALTER TABLE "services" 
ADD COLUMN "amount" DECIMAL(12,2),
ADD COLUMN "next_payment" DATE,
ADD COLUMN "notes" TEXT,
ADD COLUMN "property_id" UUID,
ADD COLUMN "type" VARCHAR(100),
ADD COLUMN "vehicle_id" UUID;

-- Migrate existing data
UPDATE "services" SET 
  "amount" = "monthly_price",
  "next_payment" = COALESCE("next_due", CURRENT_DATE + INTERVAL '1 month'),
  "type" = COALESCE("category", 'other')
WHERE "amount" IS NULL;

-- Make columns NOT NULL after data migration
ALTER TABLE "services" 
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "next_payment" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "frequency" DROP DEFAULT;

-- Drop old columns
ALTER TABLE "services" 
DROP COLUMN "category",
DROP COLUMN "description",
DROP COLUMN "end_date",
DROP COLUMN "monthly_price",
DROP COLUMN "next_due",
DROP COLUMN "start_date";

-- AlterTable for vehicles - handle existing data
ALTER TABLE "vehicles" 
ADD COLUMN "plate" VARCHAR(20),
ADD COLUMN "type" VARCHAR(50);

-- Migrate existing data
UPDATE "vehicles" SET 
  "plate" = COALESCE("license_plate", 'N/A'),
  "type" = 'car'
WHERE "plate" IS NULL;

-- Make columns NOT NULL after data migration
ALTER TABLE "vehicles" 
ALTER COLUMN "plate" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL;

-- Drop old columns
ALTER TABLE "vehicles" 
DROP COLUMN "current_value",
DROP COLUMN "is_active",
DROP COLUMN "license_plate",
DROP COLUMN "purchase_date",
DROP COLUMN "purchase_price";

-- CreateIndex
CREATE INDEX "services_type_idx" ON "services"("type");

-- CreateIndex
CREATE INDEX "services_next_payment_idx" ON "services"("next_payment");

-- CreateIndex
CREATE INDEX "services_property_id_idx" ON "services"("property_id");

-- CreateIndex
CREATE INDEX "services_vehicle_id_idx" ON "services"("vehicle_id");

-- CreateIndex
CREATE INDEX "vehicles_type_idx" ON "vehicles"("type");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
