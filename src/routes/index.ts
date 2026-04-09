import express  from "express";
import { userRouter } from "./users.routes.ts";
import { loginRouter } from "./login.routes.ts";
import { channelRouter } from "./channels.routes.ts";

export const router = express.Router()

router.use('/users', userRouter)
router.use('/login', loginRouter)
router.use('/channels', channelRouter)
