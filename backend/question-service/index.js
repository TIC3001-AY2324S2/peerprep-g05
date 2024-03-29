import express from "express"
import cors from "cors"
import morgan from "morgan"

import questionRoutes from "./routes/question-service-routes.js"

const app = express()

app.use(morgan("combined"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use(questionRoutes);


app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

export default app
