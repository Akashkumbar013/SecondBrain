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

        // Get redirect parameter from query
        const redirect = req.query.redirect;

        // Redirect to client with token and optional redirect parameter
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const redirectParam = redirect ? `&redirect=${encodeURIComponent(redirect as string)}` : '';
        res.redirect(`${clientUrl}/auth/success?token=${token}${redirectParam}`)
    }
)

export default router
