import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";


export async function getWorkout(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/workouts', {
        schema: {
            summary: 'Search all workouts',
            tags: ['workouts'],
            querystring: z.object({
                workoutCategory: z.enum(['upper','lower']).optional(),
            }),
            response: {
                200: z.object({
                    workouts: z.array(
                        z.object({
                            workoutId: z.string().uuid(),
                            aerobic: z.boolean(),
                            workoutCategory: z.enum(['upper','lower']),
                            createdAt: z.date(),
                            exercises: z.array(
                                z.object({
                                    exercise: z.string(),
                                    sets: z.number(),
                                    reps: z.number(),
                                    weight: z.number(),
                                    note: z.string().nullable(),
                                })
                            )
                        })
                    ) 
                })
            }
        }
    }, async (request, reply) => {
        const { workoutCategory } = request.query

        const workouts = await prisma.workout.findMany({
            select: {
                workoutId: true,
                aerobic: true,
                workoutCategory: true,
                createdAt: true,
                exercises: true,
            },
            where: workoutCategory ? {
                workoutCategory: {
                    equals: workoutCategory
                }
            }: {},
            orderBy: {
                createdAt: 'desc'
            }
        })
    
        if (workouts === null ) {
            throw new BadRequest('Workout not found')
        }

        return reply.send({
            workouts: workouts.map(workout => {
                return {
                    workoutId: workout.workoutId,
                    aerobic: workout.aerobic,
                    workoutCategory: workout.workoutCategory,
                    createdAt: workout.createdAt,
                    exercises: workout.exercises
                }
            })
        })
    })
}


