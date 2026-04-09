import express from "express"
import { login } from "../controllers/login.controller.ts"

export const loginRouter = express.Router()

loginRouter.post('/', login)