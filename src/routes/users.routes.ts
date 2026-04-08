import express from "express"
import { addUser } from "../controllers/users.controller.ts"

export const userRouter = express.Router()

userRouter.post('/', addUser)