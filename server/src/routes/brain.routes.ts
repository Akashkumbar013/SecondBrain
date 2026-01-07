import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware"
import {
  createBrain,
  getBrains,
  getPublicBrains,
  getPublicBrain,
  deleteBrain,
} from "../controllers/brain.controller"

const router = Router()

// Public routes (no auth required)
router.get("/public", getPublicBrains)
router.get("/public/:id", getPublicBrain)

// Protected routes
router.post("/", authMiddleware, createBrain)
router.get("/", authMiddleware, getBrains)
router.delete("/:id", authMiddleware, deleteBrain)

export default router
