-- CreateEnum
CREATE TYPE "WorkoutType" AS ENUM ('upper', 'lower');

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "aerobic" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workout_category" "WorkoutType" NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);
