import express from "express"
import cors from "cors"
import passport from "passport";
import "./config/passport"; // Import passport config

import path from "path"
import authRoutes from "./routes/auth.routes"
import brainRoutes from "./routes/brain.routes"
import contentRoutes from "./routes/content.routes"
import uploadRoutes from "./routes/upload.routes"
import userRoutes from "./routes/user.routes"

const app = express()

app.use(cors())
app.use(express.json())
app.use(passport.initialize());

// Serve static files from "uploads" directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/brains", brainRoutes)
app.use("/api/content", contentRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/users", userRoutes)

export default app
