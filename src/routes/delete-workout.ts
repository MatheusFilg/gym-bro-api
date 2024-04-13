import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function deleteWorkout(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/workouts/:workoutId', {
        schema: {
            params: z.object({
                workoutId: z.string().uuid(),
            })
        }
    },async (request, reply) => {
        const { workoutId } = request.params

        const workoutDeleted = await prisma.workout.delete({
            where: {
                id: workoutId,
            }
        })

        if (workoutDeleted === null) {
            throw new Error('Workout not found')
        } 

        return reply.status(204).send()
    })
}