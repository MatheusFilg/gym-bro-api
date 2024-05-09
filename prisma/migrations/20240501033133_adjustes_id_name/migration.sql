/*
  Warnings:

  - The primary key for the `workouts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `workouts` table. All the data in the column will be lost.
  - The required column `workoutId` was added to the `workouts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_workout_id_fkey";

-- AlterTable
ALTER TABLE "workouts" DROP CONSTRAINT "workouts_pkey",
DROP COLUMN "id",
ADD COLUMN     "workoutId" TEXT NOT NULL,
ADD CONSTRAINT "workouts_pkey" PRIMARY KEY ("workoutId");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("workoutId") ON DELETE CASCADE ON UPDATE CASCADE;
