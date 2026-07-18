import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getDashboardAnalytics,
    getAllStudents ,
    getStudentById  ,
    updateStudent ,
    deleteStudent 

} from "../controllers/adminController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", registerAdmin);

// Public Route
router.post("/login", loginAdmin);

// Protected Route
router.get("/profile", adminAuth, getAdminProfile);

router.get("/dashboard", adminAuth, getDashboardAnalytics);

router.get("/students", adminAuth, getAllStudents);
router.get("/students/:id", adminAuth, getStudentById);
router.put("/students/:id", adminAuth, updateStudent);
router.delete("/students/:id", adminAuth, deleteStudent);




export default router;