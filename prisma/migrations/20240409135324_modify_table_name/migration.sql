/*
  Warnings:

  - You are about to drop the `Workout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Workout";

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "aerobic" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workout_category" "WorkoutType" NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);
