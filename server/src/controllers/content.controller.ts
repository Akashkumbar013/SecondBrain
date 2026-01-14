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
    }).lean()

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
    }).lean()

    if (!brain) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const contents = await Content.find({ brainId })
      .sort({ createdAt: -1 })
      .lean()

    res.json(contents)
  } catch (error) {
    console.error("FETCH CONTENT ERROR:", error)
    res.status(500).json({ message: "Failed to fetch content" })
  }
}

/**
 * Get ALL content for a user (Filtered or All)
 */
export const getAllUserContent = async (req: any, res: Response) => {
  try {
    // 1. Find all brains belonging to this user
    const brains = await Brain.find({ userId: req.userId }).select("_id").lean()
    const brainIds = brains.map((b) => b._id)

    // 2. Build query
    const query: any = { brainId: { $in: brainIds } }

    // 3. Filter by type if provided (e.g., ?type=video)
    const { type } = req.query
    if (type) {
      // Map frontend "videos" -> backend "video" / "youtube"
      // This mapping should ideally happen on frontend, but we can support plurals here too if we want
      query.type = type
    }

    const contents = await Content.find(query)
      .sort({ createdAt: -1 })
      .populate("brainId", "title")
      .lean()

    res.json(contents)
  } catch (error) {
    console.error("FETCH ALL CONTENT ERROR:", error)
    res.status(500).json({ message: "Failed to fetch all content" })
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

/**
 * Update Content (e.g., Resize)
 */
export const updateContent = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const content = await Content.findById(id)
    if (!content) {
      return res.status(404).json({ message: "Content not found" })
    }

    // Verify ownership
    const brain = await Brain.findOne({
      _id: content.brainId,
      userId: req.userId,
    }).lean()

    if (!brain) {
      return res.status(403).json({ message: "Unauthorized update" })
    }

    // Update fields
    if (updates.metadata) {
      content.metadata = { ...content.metadata, ...updates.metadata }
    }
    // Add other fields here if needed in future

    await content.save()

    res.json(content)
  } catch (error) {
    console.error("UPDATE CONTENT ERROR:", error)
    res.status(500).json({ message: "Failed to update content" })
  }
}

/**
 * Get content for a public brain (no auth required)
 */
export const getPublicBrainContent = async (req: Request, res: Response) => {
  try {
    const { brainId } = req.params

    // Verify the brain is public
    const brain = await Brain.findOne({ _id: brainId, isPublic: true }).lean()

    if (!brain) {
      return res.status(404).json({ message: "Public brain not found" })
    }

    const contents = await Content.find({ brainId })
      .sort({ createdAt: -1 })
      .lean()

    res.json(contents)
  } catch (error) {
    console.error("FETCH PUBLIC CONTENT ERROR:", error)
    res.status(500).json({ message: "Failed to fetch public brain content" })
  }
}
