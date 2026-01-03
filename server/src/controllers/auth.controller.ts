
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from "../models/User";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt"
import { registerSchema, loginSchema } from "../schemas/auth.schema"
import { sendWelcomeEmail } from "../services/emailService"


export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)

    const exists = await User.findOne({ email: data.email })
    if (exists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })

    // Send Welcome Email
    await sendWelcomeEmail(user.email, user.name).catch(err => console.error("Email failed:", err));

    res.status(201).json({
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
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

    const isMatch = await bcrypt.compare(
      data.password,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
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
