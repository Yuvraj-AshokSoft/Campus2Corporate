import Admin from "../models/admin.js";
import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import Student from "../models/student.js";
import College from "../models/college.js";

import Recruiter from "../models/recruiter.js";
import Company from "../models/company.js";
import Project from "../models/project.js";
import Application from "../models/application.js";




// Register Admin (Temporary)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
      return errorResponse(res, "All fields are required", 400);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return errorResponse(res, "Admin already exists", 400);
    }

    // Create Admin
    const admin = await Admin.create({
      name,
      email,
      phone,
      password,
    });

    return successResponse(
      res,
      "Admin registered successfully",
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      201
    );
  } catch (error) {
  console.error(error.stack);

  return errorResponse(res, error.message, 500);
}
};



// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate JWT
    const token = generateToken(admin._id);

    return successResponse(
      res,
      "Login successful",
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Logged In Admin
export const getAdminProfile = async (req, res) => {
  try {
    return successResponse(
      res,
      "Admin profile fetched successfully",
      req.admin,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};


// Dashboard Analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalColleges = await College.countDocuments();
    const totalRecruiters = await Recruiter.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalApplications = await Application.countDocuments();

    const activeProjects = await Project.countDocuments({
      status: "Open",
    });

    return successResponse(
      res,
      "Dashboard analytics fetched successfully",
      {
        totalStudents,
        totalColleges,
        totalRecruiters,
        totalCompanies,
        totalProjects,
        totalApplications,
        activeProjects,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
