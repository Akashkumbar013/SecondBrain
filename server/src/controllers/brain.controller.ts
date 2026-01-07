import { Request, Response } from "express"
import Brain from "../models/Brain"
import Content from "../models/Content"

interface AuthRequest extends Request {
  userId?: string
}

export const createBrain = async (req: AuthRequest, res: Response) => {
  try {
    const { title, isPublic = false } = req.body

    const brain = await Brain.create({
      title,
      userId: req.userId,
      isPublic,
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

// Get all public brains
export const getPublicBrains = async (req: Request, res: Response) => {
  try {
    const brains = await Brain.find({ isPublic: true })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100) // Limit for performance

    res.json(brains)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch public brains" })
  }
}

// Get specific public brain by ID
export const getPublicBrain = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const brain = await Brain.findOne({ _id: id, isPublic: true })
      .populate('userId', 'name email')

    if (!brain) {
      return res.status(404).json({ message: "Public brain not found" })
    }

    res.json(brain)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch public brain" })
  }
}

// Delete brain and all associated content
export const deleteBrain = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // Find brain and verify ownership
    const brain = await Brain.findOne({ _id: id, userId: req.userId })

    if (!brain) {
      return res.status(404).json({ message: "Brain not found or unauthorized" })
    }

    // Delete all content associated with this brain
    await Content.deleteMany({ brainId: id })

    // Delete the brain itself
    await Brain.findByIdAndDelete(id)

    res.json({ message: "Brain and associated content deleted successfully" })
  } catch (error) {
    console.error("DELETE BRAIN ERROR:", error)
    res.status(500).json({ message: "Failed to delete brain" })
  }
}
