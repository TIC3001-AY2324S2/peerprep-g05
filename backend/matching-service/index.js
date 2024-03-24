import express from "express"
import cors from "cors"
import morgan from "morgan"
import matchingRoutes from "./routes/matching-service-routes.js"
import ongoingRoutes from "./routes/ongoing-service-routes.js"

const app = express()

app.use(morgan("combined"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use("/api/match", matchingRoutes)
app.use("/api/ongoing", ongoingRoutes)

export default app