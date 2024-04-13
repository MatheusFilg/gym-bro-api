import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { createWorkout } from "./routes/create-workout";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getWorkout } from "./routes/get-workout";
import { deleteWorkout } from "./routes/delete-workout";
import { getWorkoutDetails } from "./routes/get-workout-details";

const app = fastify()

app.register(fastifyCors, {
    origin: 'http://localhost:5173'
})


app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createWorkout)
app.register(getWorkout)
app.register(deleteWorkout)
app.register(getWorkoutDetails)


app.listen({ port: 3333, host:'0.0.0.0' }).then(() => {
    console.log('💻 Server Running!')
})