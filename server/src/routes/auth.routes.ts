import express from "express"
import { register, login } from "../controllers/auth.controller"
import passport from "passport"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)

// Google Auth Routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req: any, res) => {
        // Successful authentication, redirect home.
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        )

        // Redirect to client with token
        res.redirect(`http://localhost:5173/auth/success?token=${token}`)
    }
)

export default router
