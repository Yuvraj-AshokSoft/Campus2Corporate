import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/ai.routes.js"; // Adjust filename if different

// Prioritize IPv4 DNS lookups
dns.setDefaultResultOrder("ipv4first");

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, "../.env");

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Failed to load .env:", result.error);
} else {
  console.log("✅ Loaded .env from:", envPath);
}

// Load environment variables
if (result.error) {
  console.error("❌ Failed to load .env:", result.error);
} else {
  console.log("✅ Loaded .env from:", envPath);
}

console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log(
  "GEMINI_API_KEY prefix:",
  process.env.GEMINI_API_KEY?.substring(0, 10)
);
console.log(
  "GEMINI_MODEL:",
  process.env.GEMINI_MODEL || "gemini-2.5-flash"
);

// Connect MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Campus2Corporate Backend API is running successfully",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});