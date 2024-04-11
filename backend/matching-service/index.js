import express from "express"
import cors from "cors"
import morgan from "morgan"
import matchingRoutes from "./routes/matching-service-routes.js"

const app = express()

app.use(morgan("combined"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use("/api/match", matchingRoutes)

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