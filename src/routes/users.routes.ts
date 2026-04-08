import express from "express"
import { addUser } from "../controllers/users.controller.ts"
import { authCheck } from "../controllers/login.controller.ts"

export const userRouter = express.Router()

userRouter.post('/', addUser)
userRouter.delete('/:user', authCheck)