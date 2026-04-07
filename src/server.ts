import express from "express"
import type { Application } from "express"
import { env } from "node:process"

const app: Application = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`)
})