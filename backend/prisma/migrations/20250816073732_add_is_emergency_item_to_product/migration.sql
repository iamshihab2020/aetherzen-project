-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isEmergencyItem" BOOLEAN DEFAULT false,
ADD COLUMN     "isTaxExempt" BOOLEAN NOT NULL DEFAULT false;
