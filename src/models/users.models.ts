import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    }
})

export const User = mongoose.model('User', userSchema)