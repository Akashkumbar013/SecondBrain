import mongoose from "mongoose"

const brainSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster user-specific queries
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true, // Index for public brain queries
    },
  },
  { timestamps: true }
)

// Compound indexes for common query patterns
brainSchema.index({ userId: 1, createdAt: -1 }) // User brains sorted by date
brainSchema.index({ isPublic: 1, createdAt: -1 }) // Public brains sorted by date

export default mongoose.model("Brain", brainSchema)
