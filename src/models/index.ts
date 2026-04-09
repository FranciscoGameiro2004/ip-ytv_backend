import mongoose from "mongoose"
import { env } from "node:process"

export function connectDB() {
    mongoose.connect(env.MONGODB_URI!)
        .then(() => console.log('Connected to a MongoDB database!'))
        .catch((err) => console.error(err))        
}