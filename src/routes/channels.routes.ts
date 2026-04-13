import express from "express"
import { authCheck } from "../controllers/login.controller.ts"
import { addChannel, addProgram, deleteChannel, deleteProgram, editChannel, editProgram, getChannel, getChannels } from "../controllers/channels.controller.ts"

export const channelRouter = express.Router()

channelRouter.post('/', authCheck, addChannel)
channelRouter.get('/', getChannels)
channelRouter.get('/:channel', getChannel)
channelRouter.patch('/:channel', authCheck, editChannel)
channelRouter.delete('/:channel', authCheck, deleteChannel)
channelRouter.post('/:channel', authCheck, addProgram)
channelRouter.patch('/:channel/:programId', authCheck, editProgram)
channelRouter.delete('/:channel/:programId', authCheck, deleteProgram)