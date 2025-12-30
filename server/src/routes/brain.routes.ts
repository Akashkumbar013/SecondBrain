import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware"
import {
  createBrain,
  getBrains,
} from "../controllers/brain.controller"

const router = Router()

router.post("/", authMiddleware, createBrain)
router.get("/", authMiddleware, getBrains)

export default router
