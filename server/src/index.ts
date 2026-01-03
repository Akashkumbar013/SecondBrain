import dotenv from "dotenv"
import app from "./app"
import connectDB from "./config/db"

dotenv.config()

const PORT = process.env.PORT || 5000

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

// Connect DB first
connectDB()

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

// DEBUG ROUTE: Remove in production later
import { sendWelcomeEmail } from "./services/emailService";
app.get('/debug-email', async (req, res) => {
  try {
    await sendWelcomeEmail(process.env.EMAIL_USER || "", "Test User");
    res.json({ message: "Email Sent potentially. Check server logs." });
  } catch (error) {
    res.status(500).json({ error });
  }
});
