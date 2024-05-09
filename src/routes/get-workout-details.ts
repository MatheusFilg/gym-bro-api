import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getWorkoutDetails(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/workouts/:workoutId', {
        schema: {
            summary: 'Search details about a specific workout',
            tags: ['workouts'],
            params: z.object({
                workoutId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    workoutId: z.string().uuid(),
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
                workoutId: true,
                aerobic: true,
                workoutCategory: true,
                createdAt: true,
            },
            where: {
                workoutId: workoutId
            }
        })

        if (workout === null) {
            throw new BadRequest('Workout not found')
        } 

        return reply.send({
            workoutId: workout.workoutId,
            aerobic: workout.aerobic,
            workoutCategory: workout.workoutCategory,
            createdAt: workout.createdAt,
        })
    })
}