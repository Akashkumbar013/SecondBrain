import { Request, Response } from "express"
import Content from "../models/Content"
import Brain from "../models/Brain"

/**
 * Create Content
 */
export const createContent = async (req: any, res: Response) => {
  try {
    const { type, value, brainId } = req.body

    if (!type || !value || !brainId) {
      return res.status(400).json({ message: "Missing fields" })
    }

    // Verify brain belongs to user
    const brain = await Brain.findOne({
      _id: brainId,
      userId: req.userId,
    })

    if (!brain) {
      return res.status(403).json({ message: "Unauthorized brain access" })
    }

    const content = await Content.create({
      type,
      value,
      brainId,
    })

    res.status(201).json(content)
  } catch (error) {
    console.error("CREATE CONTENT ERROR:", error)
    res.status(500).json({ message: "Failed to add content" })
  }
}

/**
 * Get contents of a brain
 */
export const getContentByBrain = async (req: any, res: Response) => {
  try {
    const { brainId } = req.params

    // Verify ownership
    const brain = await Brain.findOne({
      _id: brainId,
      userId: req.userId,
    })

    if (!brain) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const contents = await Content.find({ brainId }).sort({
      createdAt: -1,
    })

    res.json(contents)
  } catch (error) {
    console.error("FETCH CONTENT ERROR:", error)
    res.status(500).json({ message: "Failed to fetch content" })
  }
}

/**
 * Delete Content (FIXED 🔥)
 */
export const deleteContent = async (req: any, res: Response) => {
  try {
    const { id } = req.params

    const content = await Content.findById(id)
    if (!content) {
      return res.status(404).json({ message: "Content not found" })
    }

    // Find brain and verify ownership
    const brain = await Brain.findOne({
      _id: content.brainId,
      userId: req.userId,
    })

    if (!brain) {
      return res.status(403).json({ message: "Unauthorized delete" })
    }

    await content.deleteOne()

    res.json({ message: "Content deleted successfully" })
  } catch (error) {
    console.error("DELETE CONTENT ERROR:", error)
    res.status(500).json({ message: "Failed to delete content" })
  }
}
