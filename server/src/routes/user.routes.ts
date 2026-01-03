import express from "express"
import User from "../models/User"

const router = express.Router()

// Update user profile (name, profilePicture)
router.put("/:id", async (req, res) => {
    try {
        const { name, profilePicture } = req.body
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { name, profilePicture } },
            { new: true }
        ).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json(user)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// Get user profile
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// Delete user account
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json({ message: "User deleted successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

export default router
