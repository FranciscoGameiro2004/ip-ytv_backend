import express  from "express";
import { userRouter } from "./users.routes.ts";

export const router = express.Router()

router.use('/users', userRouter)

