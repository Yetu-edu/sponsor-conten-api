-- CreateTable
CREATE TABLE "sponsored_content" (
    "id" TEXT NOT NULL,
    "ref_content" TEXT NOT NULL,
    "type_content" TEXT NOT NULL,
    "price_per_day" DECIMAL(65,30) NOT NULL,
    "days" INTEGER NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "area_of_study" TEXT NOT NULL,
    "interest" TEXT[],
    "localization" TEXT NOT NULL,
    "curse" TEXT NOT NULL,
    "academic_level" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsored_content_pkey" PRIMARY KEY ("id")
);
