import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { BadRequest } from "./_errors/bad-request";


export async function createWorkout(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/workouts', {
       schema: {
        summary: 'Create a workout',
        tags: ['workouts'],
        body: z.object({
            aerobic: z.boolean(),
            workoutCategory: z.enum(['upper', 'lower']),
        }),
        response: {
            201: z.object({
                workout: z.object({
                    aerobic: z.boolean(),
                    workoutCategory: z.enum(['upper', 'lower']),
                    workoutId: z.string().uuid(),
                })
            })
        }
       }
    }, async (request, reply) => {
        const { aerobic, workoutCategory  } = request.body

        const workout = await prisma.workout.create({
            data: {
                aerobic,
                workoutCategory,
            }
        })

        if(workout === null) {
            throw new BadRequest('Workout not found')
        }

        return reply.status(201).send({ workout: workout })
    })
}