/**
 * Second Brain - Backend API
 * 
 * Copyright (c) 2026 Akash Kumbar
 * Licensed under the MIT License
 * 
 * This file is part of the Second Brain application.
 * Original repository: https://github.com/Akashkumbar013/SecondBrain
 */

import express from "express"
import cors from "cors"
import passport from "passport";
import "./config/passport"; // Import passport config
import cookieSession from "cookie-session";
import connectDB from "./config/db"
import authRoutes from "./routes/auth.routes"
import brainRoutes from "./routes/brain.routes"
import contentRoutes from "./routes/content.routes"
import morgan from "morgan"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// Middleware
app.use(morgan("tiny"))
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))

app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/brain", brainRoutes)
app.use("/api/content", contentRoutes)

app.get("/", (req, res) => {
    res.send("Second Brain API - Created by Akash Kumbar")
})

// Connect to DB and start server
connectDB()

export default app
