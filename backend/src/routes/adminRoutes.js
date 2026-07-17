import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getDashboardAnalytics,
} from "../controllers/adminController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", registerAdmin);

// Public Route
router.post("/login", loginAdmin);

// Protected Route
router.get("/profile", adminAuth, getAdminProfile);

router.get("/dashboard", adminAuth, getDashboardAnalytics);



export default router;