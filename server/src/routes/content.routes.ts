import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware"
import {
  createContent,
  getContentByBrain,
  deleteContent,
  getAllUserContent,
  updateContent,
  getPublicBrainContent
} from "../controllers/content.controller"

const router = Router()

// Public route (no auth required)
router.get("/public/:brainId", getPublicBrainContent)

// Protected routes
router.post("/", authMiddleware, createContent)
router.get("/all", authMiddleware, getAllUserContent) // Must come before /:brainId to avoid conflict
router.get("/:brainId", authMiddleware, getContentByBrain)
router.put("/:id", authMiddleware, updateContent)
router.delete("/:id", authMiddleware, deleteContent)

export default router
