import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function updateWorkout(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .put('/workouts/:workoutId/exercises', {
        schema: {
            summary: 'Add exercises a workout',
            tags: ['workouts'],
            body: z.object({
                exercise: z.string(),
                sets: z.number(),
                reps: z.number(),
                weight: z.number(),
                note: z.string().nullable(),
            }),
            response: {
                201: z.object({
                    data: z.object({
                        id: z.number(),
                        exercise: z.string(),
                        sets: z.number(),
                        reps: z.number(),
                        weight: z.number(),
                        note: z.string().nullable(),
                        workoutId: z.string().uuid()
                    })
                }),
            },
            params: z.object({
                workoutId: z.string().uuid()
            })
        }
    },async (request, reply) => {
        const { workoutId } = request.params
        const { exercise, sets, reps, weight, note } = request.body

        if (workoutId === null) {
            throw new BadRequest('Workout not found')
        }

        const newExercise = await prisma.exercise.create({
            data: {
                exercise,
                sets,
                reps,
                weight,
                note,
                workout: { connect: { workoutId: workoutId } }
            }
        })

        return reply.status(201).send({ data: newExercise })
    })
}