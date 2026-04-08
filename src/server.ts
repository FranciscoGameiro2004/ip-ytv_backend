import express from "express"
import type { Application } from "express"
import cors from "cors"
import { env } from "node:process"
import { router } from "./routes/index.ts"

const app: Application = express()

app.use(cors())
app.use('/', router)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`)
})