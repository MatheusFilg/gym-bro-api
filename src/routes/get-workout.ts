import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";


export async function getWorkout(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/workouts', {
        schema: {
            querystring: z.object({
                workoutCategory: z.enum(['upper','lower']).optional(),
            }),
            response: {
                200: z.object({
                    workouts: z.array(
                        z.object({
                            id: z.string().uuid(),
                            aerobic: z.boolean(),
                            workoutCategory: z.enum(['upper','lower']),
                            createdAt: z.date(),
                        })
                    ) 
                })
            }
        }
    }, async (request, reply) => {
        const { workoutCategory } = request.query

        const workouts = await prisma.workout.findMany({
            select: {
                id: true,
                aerobic: true,
                workoutCategory: true,
                createdAt: true
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
    
        return reply.send({
            workouts: workouts.map(workout => {
                return {
                    id: workout.id,
                    aerobic: workout.aerobic,
                    workoutCategory: workout.workoutCategory,
                    createdAt: workout.createdAt,
                }
            })
        })
    })
}


