-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'CLP');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'CLP';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'CLP';
