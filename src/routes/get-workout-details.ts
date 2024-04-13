import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getWorkoutDetails(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/workouts/:workoutId', {
        schema: {
            params: z.object({
                workoutId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    id: z.string().uuid(),
                    aerobic: z.boolean(),
                    workoutCategory: z.enum(['upper','lower']),
                    createdAt: z.date(),
                })
            }
        },
    }, async (request, reply) => {
        const { workoutId } = request.params

        const workout = await prisma.workout.findUnique({
            select: {
                id: true,
                aerobic: true,
                workoutCategory: true,
                createdAt: true,
            },
            where: {
                id: workoutId
            }
        })

        if (workout === null) {
            throw new Error('Workout not found')
        } 

        return reply.send({
            id: workout.id,
            aerobic: workout.aerobic,
            workoutCategory: workout.workoutCategory,
            createdAt: workout.createdAt,
        })
    })
}