import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware"
import {
  createContent,
  getContentByBrain,
  deleteContent,
} from "../controllers/content.controller"

const router = Router()

router.post("/", authMiddleware, createContent)
router.get("/:brainId", authMiddleware, getContentByBrain)
router.delete("/:id", authMiddleware, deleteContent)

export default router
