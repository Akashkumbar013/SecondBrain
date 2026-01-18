
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from "../models/User";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt"
import { registerSchema, loginSchema } from "../schemas/auth.schema"
import { sendWelcomeEmail, sendVerificationEmail } from "../services/emailService"


export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)

    const exists = await User.findOne({ email: data.email })
    if (exists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const crypto = require("crypto");
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      isVerified: false
    })

    // Send Verification Email (Welcome Email moved to after verification)
    await sendVerificationEmail(user.email, verificationToken).catch(err => console.error("Verification Email failed:", err));

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
      // token: generateToken(user._id.toString()), // Don't send token yet!
      // user: { ... } 
    })
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = await User.findOne({ email: data.email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check if user is a Google OAuth user
    if (user.isGoogleUser || !user.password) {
      return res.status(400).json({
        message: "This account uses Google Sign-In. Please log in with Google.",
        isGoogleUser: true
      })
    }

    const isMatch = await bcrypt.compare(
      data.password,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    res.json({
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(400).json({ message: "Login failed", error })
  }
}

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send("Invalid or expired verification token.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // NOW Send Welcome Email
    await sendWelcomeEmail(user.email, user.name).catch(err => console.error("Welcome Email failed:", err));

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/login?verified=true`);
  } catch (error) {
    res.status(500).send("Server Error");
  }
}
