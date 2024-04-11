import express from "express"
import cors from "cors"
import morgan from "morgan"

import collabRoutes from "./routes/collab-service-routes.js"

const app = express()

app.use(morgan("combined"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use(collabRoutes);

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

export default app
