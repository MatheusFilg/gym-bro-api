import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { z } from "zod";



export async function createWorkout(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/workouts', {
       schema: {
        body: z.object({
            aerobic: z.boolean(),
            workoutCategory: z.enum(['upper', 'lower'])
        })
       }
    }, async (request, reply) => {
        const { aerobic, workoutCategory } = request.body

        const workout = await prisma.workout.create({
            data: {
                aerobic,
                workoutCategory
            }
        })

        return reply.status(201).send({ workoutId: workout.id })
    })
}