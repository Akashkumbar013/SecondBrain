# SecondBrain 🧠

**A modern second brain application for organizing and remembering what you learn forever.**

Created by **Akash Kumbar** | [GitHub](https://github.com/Akashkumbar013)

---

## 📋 Features

- 🔐 Secure authentication (Email/Password + Google OAuth)
- 🧠 Create and manage multiple "brains" for different topics
- 📝 Add content (links, notes, documents, videos)
- 🌐 Share your brains publicly
- 📱 Responsive design for mobile and desktop
- ⚡ Fast and optimized performance

---

## 🚀 Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- React Router
- Axios
- JS-Cookie

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Bcrypt
- Nodemailer

---

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Google OAuth credentials (for Google login)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Akashkumbar013/SecondBrain.git
cd SecondBrain
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Configure environment variables**

Create `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

4. **Run the application**

```bash
# Start backend (in server directory)
npm run dev

# Start frontend (in client directory)
npm run dev
```

---

## 📄 License & Copyright

**Copyright © 2026 Akash Kumbar. All Rights Reserved.**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### ⚠️ Usage Requirements

If you use this software or any portion of it, you **MUST**:
1. ✅ Keep the license and copyright notice
2. ✅ Credit **Akash Kumbar** as the original author
3. ✅ Link back to the original repository
4. ✅ Not claim this work as your own

**Violation of these terms is illegal and subject to legal action.**

---

## 👨‍💻 Author

**Akash Kumbar**
- GitHub: [@Akashkumbar013](https://github.com/Akashkumbar013)
- Project: [SecondBrain](https://github.com/Akashkumbar013/SecondBrain)

---

## 🤝 Contributing

While this is a personal project, suggestions and feedback are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear description

---

## ⭐ Support

If you find this project useful, please give it a star on GitHub!

---

**Note:** This is a personal project created for learning and portfolio purposes. Unauthorized commercial use without permission is prohibited.
