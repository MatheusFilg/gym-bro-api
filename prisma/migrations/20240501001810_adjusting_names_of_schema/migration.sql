/*
  Warnings:

  - You are about to drop the column `workoutId` on the `exercises` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workout_id]` on the table `exercises` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workout_id` to the `exercises` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_workoutId_fkey";

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "workoutId",
ADD COLUMN     "workout_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "exercises_workout_id_key" ON "exercises"("workout_id");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
