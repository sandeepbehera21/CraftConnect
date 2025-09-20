import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

dotenv.config(); // Load .env variables at the start

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(express.json());

// Basic rate limiting for auth and chatbot endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

// Static file serving for uploaded images - map /uploads to backend/upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadStaticDir = path.join(__dirname, "upload");
if (!fs.existsSync(uploadStaticDir)) {
  fs.mkdirSync(uploadStaticDir, { recursive: true });
}
app.use("/uploads", express.static(uploadStaticDir));

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chatbot", chatLimiter, chatbotRoutes);

// Database connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    // Note: These options are default in modern Mongoose and can be omitted if using latest version
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    console.log("Using GEMINI_API_KEY length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "Missing");
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is not set. AI features will be disabled.');
}
