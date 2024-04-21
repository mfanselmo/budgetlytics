-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "periodStartDay" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Settings_userId_idx" ON "Settings"("userId");
