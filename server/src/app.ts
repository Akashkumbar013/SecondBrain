import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes"
import brainRoutes from "./routes/brain.routes"
import contentRoutes from "./routes/content.routes"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/brains", brainRoutes)
app.use("/api/content", contentRoutes)

export default app
