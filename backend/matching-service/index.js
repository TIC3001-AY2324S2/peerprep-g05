import express from "express"
import matchingRoutes from "./routes/matching-service-routes.js"

const app = express()

app.use("/api/matching", matchingRoutes)


export default app