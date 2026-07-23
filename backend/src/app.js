import express from "express";
import cors from "cors";

import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFoundMiddleware.js";

import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Campus2Corporate Backend Running",
  });
});

// Admin Routes
app.use("/api/admin", adminRoutes);

// Student Routes
app.use("/api/auth", studentAuthRoutes);
app.use("/api/student", studentRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;