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
  const email = req.query.email as string;
  if (!email) {
    return res.status(400).json({ error: "Please provide an email query param: /debug-email?email=your@email.com" });
  }
  try {
    const result = await sendWelcomeEmail(email, "Debug User");
    if (result) {
      res.json({ message: `Email sent successfully to ${email}`, data: result });
    } else {
      res.status(500).json({ error: "Email function returned null (check server logs)" });
    }
  } catch (error) {
    res.status(500).json({ error: "Email failed", details: error });
  }
});
