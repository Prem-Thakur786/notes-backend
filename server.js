import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/notes.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.endsWith(".vercel.app") ||
      origin.startsWith("http://localhost")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => res.json({ msg: "Notes API running ✅" }));

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  isConnected = true;
  console.log("✅ MongoDB Connected");
};

connectDB().catch((err) => console.error("❌ MongoDB error:", err.message));

export default app;
