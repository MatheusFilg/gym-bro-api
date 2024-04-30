import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const exerciseSchema = z.object({
    exercise: z.string(),
    sets: z.number(),
    reps: z.number(),
    weight: z.number(),
    note: z.string().optional(),
})

const createWorkoutSchema = z.object({
    aerobic: z.boolean(),
    workoutCategory: z.enum(['upper', 'lower']),
    exercises: z.array(exerciseSchema)
})

export async function createWorkout(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/workouts', {
       schema: {
        body: createWorkoutSchema,
       }
    }, async (request, reply) => {
        const { aerobic, workoutCategory, exercises } = request.body

        const workout = await prisma.workout.create({
            data: {
                aerobic,
                workoutCategory,
            }
        })

        const createdExercises = []

        for (const exerciseData of exercises) {
            try {
                const createdExercise = await prisma.exercise.create({
                    data: {
                        ...exerciseData,
                        workout: {connect: {id: workout.id } }

                    }
                })
                createdExercises.push(createdExercise)
            } catch (error) {
                console.error('Erro ao criar exercício:', error)
                return reply.status(500).send({ error: 'Erro ao criar exercício' })
            }
        }

        const updatedWorkout = await prisma.workout.update({
            where: {
                id: workout.id
            },
            data: {
                exercise: {
                    connect: createdExercises.map(exercise => ({ id: exercise.id }))
                }
            },
            include: {
                exercise: true
            }
        })

        return reply.status(201).send({ workout: updatedWorkout })
    })
}