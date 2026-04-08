import express from "express"
import type { Application } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { env } from "node:process"
import { router } from "./routes/index.ts"
import { connectDB } from "./models/index.ts"

const app: Application = express()

connectDB()

app.use(cors())
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use('/', router)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`)
})