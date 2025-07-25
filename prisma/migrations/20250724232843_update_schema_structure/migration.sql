/*
  Warnings:

  - You are about to drop the column `amount` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - Added the required column `monthly_price` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "purchase_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "amount",
ADD COLUMN     "monthly_price" DECIMAL(12,2) NOT NULL,
ALTER COLUMN "frequency" SET DEFAULT 'monthly',
ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "next_due" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "password",
ADD COLUMN     "last_login" TIMESTAMPTZ,
ADD COLUMN     "name" VARCHAR(200) NOT NULL,
ADD COLUMN     "password_hash" VARCHAR(255) NOT NULL,
ADD COLUMN     "preferences" JSONB;

-- AlterTable
ALTER TABLE "vehicles" ALTER COLUMN "purchase_date" DROP NOT NULL;
