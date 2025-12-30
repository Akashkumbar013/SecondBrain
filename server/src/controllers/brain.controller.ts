import { Request, Response } from "express"
import Brain from "../models/Brain"

interface AuthRequest extends Request {
  userId?: string
}

export const createBrain = async (req: AuthRequest, res: Response) => {
  try {
    const brain = await Brain.create({
      title: req.body.title,
      userId: req.userId,
    })

    res.status(201).json(brain)
  } catch (error) {
    res.status(400).json({ message: "Failed to create brain" })
  }
}

export const getBrains = async (req: AuthRequest, res: Response) => {
  const brains = await Brain.find({ userId: req.userId })
  res.json(brains)
}
