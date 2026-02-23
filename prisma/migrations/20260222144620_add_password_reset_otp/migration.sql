-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetOtp" TEXT,
ADD COLUMN     "resetOtpExpires" TIMESTAMP(3);
