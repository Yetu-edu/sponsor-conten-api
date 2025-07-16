-- CreateTable
CREATE TABLE "verification_seal" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_seal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_seal_user_id_key" ON "verification_seal"("user_id");
