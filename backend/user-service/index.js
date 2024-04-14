import express from "express"
import cors from "cors"
import morgan from "morgan"

import userRoutes from "./routes/user-service-routes.js"
import authRoutes from "./routes/auth-routes.js"

const app = express()

app.use(morgan("tiny"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options("*", cors())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

// Handle When No Route Match Is Found
app.use((req, res, next) => {
  const error = new Error("Route Not Found")
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

export default app
