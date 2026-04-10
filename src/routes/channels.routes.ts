import express from "express"
import { authCheck } from "../controllers/login.controller.ts"
import { addChannel, getChannels } from "../controllers/channels.controller.ts"

export const channelRouter = express.Router()

channelRouter.post('/', authCheck, addChannel)
channelRouter.get('/', getChannels)