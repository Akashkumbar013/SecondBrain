import mongoose from "mongoose"

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["youtube", "tweet", "text", "link", "image", "video", "pdf", "doc", "instagram"],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    brainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brain",
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model("Content", contentSchema)
