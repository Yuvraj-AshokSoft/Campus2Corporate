import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFoundMiddleware.js";

import adminRoutes from "./routes/adminRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import aiInterviewRoutes from "./routes/aiInterviewRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Campus2Corporate Backend API is running successfully",
  });
});

// ---------------------------------------------------------
// Admin Routes
// ---------------------------------------------------------

app.use("/api/admin", adminRoutes);

app.use("/api/v1/admin", adminRoutes);

// ---------------------------------------------------------
// College Routes
// ---------------------------------------------------------

app.use("/api/college", collegeRoutes);

// ---------------------------------------------------------
// Student & Authentication Routes
// ---------------------------------------------------------

app.use("/api/auth", studentAuthRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/students", studentRoutes);

// ---------------------------------------------------------
// AI Services Routes
// ---------------------------------------------------------

app.use("/api/ai", aiRoutes);

// ---------------------------------------------------------
// AI Interview Routes
// ---------------------------------------------------------

app.use(
  "/api/ai-interview",
  aiInterviewRoutes,
);

// ---------------------------------------------------------
// 404 Handler
// ---------------------------------------------------------

app.use(notFound);

// ---------------------------------------------------------
// Global Error Handler
// ---------------------------------------------------------

app.use(errorHandler);

export default app;