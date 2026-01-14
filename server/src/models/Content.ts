import mongoose from "mongoose"

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["youtube", "tweet", "text", "link", "image", "video", "pdf", "doc", "instagram"],
      required: true,
      index: true, // Index for type-based filtering
    },
    value: {
      type: String,
      required: true,
    },
    brainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brain",
      required: true,
      index: true, // Index for brain-specific content queries
    },
    metadata: {
      width: String,
      height: String
    }
  },
  { timestamps: true }
)

// Compound indexes for common queries
contentSchema.index({ brainId: 1, createdAt: -1 }) // Brain content sorted by date
contentSchema.index({ brainId: 1, type: 1 }) // Brain content filtered by type

export default mongoose.model("Content", contentSchema)
