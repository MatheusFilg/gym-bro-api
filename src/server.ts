import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { createWorkout } from "./routes/create-workout";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getWorkout } from "./routes/get-workout";
import { deleteWorkout } from "./routes/delete-workout";
import { getWorkoutDetails } from "./routes/get-workout-details";
import { updateWorkout } from "./routes/update-workout";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./error-handler";

const app = fastify()

app.register(fastifyCors, {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info:{
            title: 'gym.bro',
            description: 'Especificações da API para o back-end da aplicação',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getWorkout)
app.register(getWorkoutDetails)
app.register(createWorkout)
app.register(deleteWorkout)
app.register(updateWorkout)

app.setErrorHandler(errorHandler)

app.listen({ port: 3333, host:'0.0.0.0' }).then(() => {
    console.log('💻 Server Running!')
})