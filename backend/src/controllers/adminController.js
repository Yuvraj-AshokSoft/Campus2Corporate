import mongoose from "mongoose";
import Admin from "../models/admin.js";
import Student from "../models/student.js";
import College from "../models/college.js";
import Recruiter from "../models/recruiter.js";
import Company from "../models/company.js";
import Project from "../models/project.js";
import Application from "../models/application.js";
import Broadcast from "../models/broadcast.js";
import ContentRoadmap from "../models/contentRoadmap.js";
import SupportTicket from "../models/supportTicket.js";
import SystemSetting from "../models/systemSetting.js";
import AdminActivity from "../models/adminActivity.js";

import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { logAdminActivity } from "../utils/auditLogger.js";

// Helper for ObjectId Validation
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==========================================
// 1. Authentication & Profile
// ==========================================

// Register Admin (Restricted to Super Admin or Initial Bootstrap)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return errorResponse(res, "Name, email, phone, and password are required", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingAdmin = await Admin.findOne({ email: cleanEmail });

    if (existingAdmin) {
      return errorResponse(res, "An admin with this email already exists", 400);
    }

    const assignedRole = role === "Super Admin" ? "Super Admin" : "Admin";

    const admin = await Admin.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      role: assignedRole,
      status: "Active",
    });

    await logAdminActivity({
      admin: req.admin || admin,
      action: "REGISTER_ADMIN",
      targetModel: "Admin",
      targetId: admin._id,
      details: `Registered new admin ${admin.email} with role ${admin.role}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(
      res,
      "Admin registered successfully",
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
      },
      201
    );
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return errorResponse(res, error.message, 500);
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: cleanEmail }).select("+password");

    if (!admin) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (admin.status !== "Active") {
      return errorResponse(
        res,
        "Account is inactive or suspended. Please contact Super Admin.",
        403
      );
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Update lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    // Generate real JWT
    const token = generateToken(admin, admin.role);

    await logAdminActivity({
      admin,
      action: "LOGIN_SUCCESS",
      targetModel: "Auth",
      targetId: admin._id,
      details: `Admin ${admin.email} logged in successfully`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(
      res,
      "Login successful",
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          status: admin.status,
          profileImage: admin.profileImage,
          lastLogin: admin.lastLogin,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    return errorResponse(res, error.message, 500);
  }
};

// Get Logged In Admin Profile
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

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return errorResponse(res, "Admin not found", 404);
    }

    if (name) admin.name = name.trim();
    if (phone) admin.phone = phone.trim();
    if (profileImage !== undefined) admin.profileImage = profileImage;

    await admin.save();

    return successResponse(
      res,
      "Admin profile updated successfully",
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        profileImage: admin.profileImage,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 2. Dashboard & Analytics Overview
// ==========================================

export const getDashboardAnalytics = async (req, res) => {
  try {
    const [
      totalStudents,
      totalColleges,
      totalRecruiters,
      totalCompanies,
      totalProjects,
      totalApplications,
      activeProjects,
      pendingColleges,
      pendingRecruiters,
      openTickets,
      totalBroadcasts,
    ] = await Promise.all([
      Student.countDocuments(),
      College.countDocuments(),
      Recruiter.countDocuments(),
      Company.countDocuments(),
      Project.countDocuments(),
      Application.countDocuments(),
      Project.countDocuments({ status: "Open" }),
      College.countDocuments({ verificationStatus: "Pending" }),
      Recruiter.countDocuments({ verificationStatus: "Pending" }),
      SupportTicket.countDocuments({ status: "Open" }),
      Broadcast.countDocuments(),
    ]);

    const pendingVerifications = pendingColleges + pendingRecruiters;

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
        pendingColleges,
        pendingRecruiters,
        pendingVerifications,
        openTickets,
        totalBroadcasts,
        systemHealth: "Operational",
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 3. Student Management APIs
// ==========================================

export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, q, college, status, branch } = req.query;

    const query = {};

    if (q) {
      const regex = new RegExp(q.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }, { branch: regex }];
    }

    if (college && isValidObjectId(college)) {
      query.college = college;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (branch && branch !== "all") {
      query.branch = new RegExp(branch.trim(), "i");
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, students] = await Promise.all([
      Student.countDocuments(query),
      Student.find(query)
        .populate("college", "name code city")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return successResponse(
      res,
      "Students fetched successfully",
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        students,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getStudentById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const student = await Student.findById(req.params.id)
      .populate("college", "name email phone city state website code")
      .lean();

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    return successResponse(res, "Student fetched successfully", student, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateStudent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    // Exclude protected fields from direct update
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData._id;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).populate("college", "name code");

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_STUDENT",
      targetModel: "Student",
      targetId: student._id,
      details: `Updated student record for ${student.email}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Student updated successfully", student, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const { status } = req.body;
    if (!status || !["Active", "Inactive"].includes(status)) {
      return errorResponse(res, "Valid status (Active or Inactive) is required", 400);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "STATUS_CHANGE_STUDENT",
      targetModel: "Student",
      targetId: student._id,
      details: `Changed student ${student.email} status to ${status}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, `Student status updated to ${status}`, student, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // Clean up applications
    await Application.deleteMany({ student: student._id });

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_STUDENT",
      targetModel: "Student",
      targetId: student._id,
      details: `Deleted student ${student.email}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Student deleted successfully", null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 4. College Management APIs
// ==========================================

export const createCollege = async (req, res) => {
  try {
    const { name, email, phone, password, university, code, city, state } = req.body;

    if (!name || !email || !phone || !password) {
      return errorResponse(res, "Name, email, phone, and password are required", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingCollege = await College.findOne({ email: cleanEmail });

    if (existingCollege) {
      return errorResponse(res, "A college with this email already exists", 400);
    }

    const college = await College.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      university: university || "State University",
      code: code || "",
      city: city || "",
      state: state || "",
      status: "Active",
      verificationStatus: "Verified",
    });

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_COLLEGE",
      targetModel: "College",
      targetId: college._id,
      details: `Created new college ${college.name}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "College created successfully", college, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllColleges = async (req, res) => {
  try {
    const { page = 1, limit = 20, q, status, verificationStatus } = req.query;

    const query = {};

    if (q) {
      const regex = new RegExp(q.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }, { code: regex }, { city: regex }];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (verificationStatus && verificationStatus !== "all") {
      query.verificationStatus = verificationStatus;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, colleges] = await Promise.all([
      College.countDocuments(query),
      College.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return successResponse(
      res,
      "Colleges fetched successfully",
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        colleges,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCollegeById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid college ID format", 400);
    }

    const college = await College.findById(req.params.id)
      .select("-password")
      .populate("students", "name email branch percentage status")
      .lean();

    if (!college) {
      return errorResponse(res, "College not found", 404);
    }

    return successResponse(res, "College fetched successfully", college, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateCollege = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid college ID format", 400);
    }

    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData._id;

    const college = await College.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    if (!college) {
      return errorResponse(res, "College not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_COLLEGE",
      targetModel: "College",
      targetId: college._id,
      details: `Updated college ${college.name}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "College updated successfully", college, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateCollegeStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid college ID format", 400);
    }

    const { status } = req.body;
    if (!status || !["Active", "Inactive"].includes(status)) {
      return errorResponse(res, "Valid status (Active or Inactive) is required", 400);
    }

    const college = await College.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    ).select("-password");

    if (!college) {
      return errorResponse(res, "College not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "STATUS_CHANGE_COLLEGE",
      targetModel: "College",
      targetId: college._id,
      details: `Changed college ${college.name} status to ${status}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, `College status updated to ${status}`, college, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteCollege = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid college ID format", 400);
    }

    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return errorResponse(res, "College not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_COLLEGE",
      targetModel: "College",
      targetId: college._id,
      details: `Deleted college ${college.name}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "College deleted successfully", null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 5. Recruiter & Company Management APIs
// ==========================================

export const createRecruiter = async (req, res) => {
  try {
    const { name, email, phone, designation, company } = req.body;

    if (!name || !email || !phone || !designation || !company) {
      return errorResponse(
        res,
        "Name, email, phone, designation, and company ID are required",
        400
      );
    }

    if (!isValidObjectId(company)) {
      return errorResponse(res, "Invalid company ID format", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingRecruiter = await Recruiter.findOne({ email: cleanEmail });

    if (existingRecruiter) {
      return errorResponse(res, "A recruiter with this email already exists", 400);
    }

    const recruiter = await Recruiter.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      designation: designation.trim(),
      company,
      status: "Active",
      verificationStatus: "Verified",
    });

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_RECRUITER",
      targetModel: "Recruiter",
      targetId: recruiter._id,
      details: `Created recruiter ${recruiter.name} (${recruiter.email})`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Recruiter created successfully", recruiter, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllRecruiters = async (req, res) => {
  try {
    const { page = 1, limit = 20, q, status, verificationStatus } = req.query;

    const query = {};

    if (q) {
      const regex = new RegExp(q.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }, { designation: regex }];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (verificationStatus && verificationStatus !== "all") {
      query.verificationStatus = verificationStatus;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, recruiters] = await Promise.all([
      Recruiter.countDocuments(query),
      Recruiter.find(query)
        .populate("company", "name industry location website")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return successResponse(
      res,
      "Recruiters fetched successfully",
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        recruiters,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRecruiterById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid recruiter ID format", 400);
    }

    const recruiter = await Recruiter.findById(req.params.id)
      .populate("company", "name industry location email website phone")
      .lean();

    if (!recruiter) {
      return errorResponse(res, "Recruiter not found", 404);
    }

    return successResponse(res, "Recruiter fetched successfully", recruiter, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateRecruiter = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid recruiter ID format", 400);
    }

    const recruiter = await Recruiter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).populate("company", "name industry");

    if (!recruiter) {
      return errorResponse(res, "Recruiter not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_RECRUITER",
      targetModel: "Recruiter",
      targetId: recruiter._id,
      details: `Updated recruiter ${recruiter.name}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Recruiter updated successfully", recruiter, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateRecruiterStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid recruiter ID format", 400);
    }

    const { status } = req.body;
    if (!status || !["Active", "Inactive"].includes(status)) {
      return errorResponse(res, "Valid status (Active or Inactive) is required", 400);
    }

    const recruiter = await Recruiter.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!recruiter) {
      return errorResponse(res, "Recruiter not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "STATUS_CHANGE_RECRUITER",
      targetModel: "Recruiter",
      targetId: recruiter._id,
      details: `Changed recruiter ${recruiter.email} status to ${status}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, `Recruiter status updated to ${status}`, recruiter, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteRecruiter = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid recruiter ID format", 400);
    }

    const recruiter = await Recruiter.findByIdAndDelete(req.params.id);

    if (!recruiter) {
      return errorResponse(res, "Recruiter not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_RECRUITER",
      targetModel: "Recruiter",
      targetId: recruiter._id,
      details: `Deleted recruiter ${recruiter.name}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Recruiter deleted successfully", null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 }).lean();
    return successResponse(res, "Companies fetched successfully", companies, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 6. Project & Job Moderation APIs
// ==========================================

export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      approvalStatus: "Approved",
    });

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_PROJECT",
      targetModel: "Project",
      targetId: project._id,
      details: `Created project ${project.title}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Project created successfully", project, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, q, status, approvalStatus } = req.query;

    const query = {};

    if (q) {
      const regex = new RegExp(q.trim(), "i");
      query.$or = [{ title: regex }, { location: regex }, { mode: regex }];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (approvalStatus && approvalStatus !== "all") {
      query.approvalStatus = approvalStatus;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, projects] = await Promise.all([
      Project.countDocuments(query),
      Project.find(query)
        .populate("company", "name industry location")
        .populate("recruiter", "name email phone designation")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return successResponse(
      res,
      "Projects fetched successfully",
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        projects,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getProjectById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const project = await Project.findById(req.params.id)
      .populate("company", "name industry location email website phone")
      .populate("recruiter", "name email phone designation")
      .lean();

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    return successResponse(res, "Project fetched successfully", project, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateProject = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).populate("company recruiter");

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_PROJECT",
      targetModel: "Project",
      targetId: project._id,
      details: `Updated project ${project.title}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Project updated successfully", project, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Approve Project
export const approveProject = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "Approved",
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "APPROVE_PROJECT",
      targetModel: "Project",
      targetId: project._id,
      details: `Approved project ${project.title}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Project approved successfully", project, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Reject Project
export const rejectProject = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "Rejected",
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "REJECT_PROJECT",
      targetModel: "Project",
      targetId: project._id,
      details: `Rejected project ${project.title}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Project rejected successfully", project, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteProject = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    // Clean up applications referencing this project
    await Application.deleteMany({ project: project._id });

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_PROJECT",
      targetModel: "Project",
      targetId: project._id,
      details: `Deleted project ${project.title}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Project deleted successfully", null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 7. Verification Queue APIs
// ==========================================

export const getVerificationQueue = async (req, res) => {
  try {
    const [pendingColleges, pendingRecruiters, pendingProjects] = await Promise.all([
      College.find({ verificationStatus: "Pending" })
        .select("-password")
        .sort({ createdAt: -1 })
        .lean(),
      Recruiter.find({ verificationStatus: "Pending" })
        .populate("company", "name industry location website")
        .sort({ createdAt: -1 })
        .lean(),
      Project.find({ approvalStatus: "Pending" })
        .populate("company recruiter")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return successResponse(
      res,
      "Verification queue fetched successfully",
      {
        counts: {
          colleges: pendingColleges.length,
          recruiters: pendingRecruiters.length,
          projects: pendingProjects.length,
          totalPending: pendingColleges.length + pendingRecruiters.length + pendingProjects.length,
        },
        colleges: pendingColleges,
        recruiters: pendingRecruiters,
        projects: pendingProjects,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const verifyCollege = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid college ID format", 400);
    }

    const { status, note } = req.body; // status: 'Verified' | 'Rejected'
    if (!["Verified", "Rejected"].includes(status)) {
      return errorResponse(res, "Status must be 'Verified' or 'Rejected'", 400);
    }

    const college = await College.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: status,
        verificationNote: note || "",
      },
      { returnDocument: "after" }
    ).select("-password");

    if (!college) {
      return errorResponse(res, "College not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: `VERIFY_COLLEGE_${status.toUpperCase()}`,
      targetModel: "College",
      targetId: college._id,
      details: `College ${college.name} verification status set to ${status}. Note: ${note || "None"}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(
      res,
      `College verification status updated to ${status}`,
      college,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const verifyRecruiter = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid recruiter ID format", 400);
    }

    const { status, note } = req.body;
    if (!["Verified", "Rejected"].includes(status)) {
      return errorResponse(res, "Status must be 'Verified' or 'Rejected'", 400);
    }

    const recruiter = await Recruiter.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: status,
        verificationNote: note || "",
      },
      { returnDocument: "after" }
    ).populate("company");

    if (!recruiter) {
      return errorResponse(res, "Recruiter not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: `VERIFY_RECRUITER_${status.toUpperCase()}`,
      targetModel: "Recruiter",
      targetId: recruiter._id,
      details: `Recruiter ${recruiter.name} verification status set to ${status}. Note: ${note || "None"}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(
      res,
      `Recruiter verification status updated to ${status}`,
      recruiter,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 8. Placement Oversight APIs
// ==========================================

export const getPlacementOversight = async (req, res) => {
  try {
    const [
      activeDrivesCount,
      participatingCollegesCount,
      totalApplicantsCount,
      offersExtendedCount,
      drivesList,
    ] = await Promise.all([
      Project.countDocuments({ status: "Open" }),
      College.countDocuments({ status: "Active" }),
      Application.countDocuments(),
      Application.countDocuments({ status: "Selected" }),
      Project.find()
        .populate("company", "name location")
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ]);

    // Attach application counts for each drive
    const drivesWithStats = await Promise.all(
      drivesList.map(async (drive) => {
        const applicantsCount = await Application.countDocuments({
          project: drive._id,
        });
        return {
          ...drive,
          applicantsCount,
        };
      })
    );

    return successResponse(
      res,
      "Placement oversight fetched successfully",
      {
        summary: {
          activeDrives: activeDrivesCount,
          participatingColleges: participatingCollegesCount,
          totalApplicants: totalApplicantsCount,
          offersExtended: offersExtendedCount,
        },
        drives: drivesWithStats,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 9. Broadcast Control APIs
// ==========================================

export const getBroadcasts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, broadcasts] = await Promise.all([
      Broadcast.countDocuments(),
      Broadcast.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return successResponse(
      res,
      "Broadcasts fetched successfully",
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        broadcasts,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createBroadcast = async (req, res) => {
  try {
    const { title, message, targetAudience, priority, status } = req.body;

    if (!title || !message) {
      return errorResponse(res, "Title and message content are required", 400);
    }

    const broadcast = await Broadcast.create({
      title: title.trim(),
      message: message.trim(),
      targetAudience: targetAudience || "all_students",
      priority: priority || "standard",
      status: status || "Delivered",
      openRate: "68%",
      clickRate: "14%",
      sentAt: new Date(),
      createdBy: req.admin._id,
    });

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_BROADCAST",
      targetModel: "Broadcast",
      targetId: broadcast._id,
      details: `Created broadcast: "${broadcast.title}" to target ${broadcast.targetAudience}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Broadcast created and dispatched successfully", broadcast, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteBroadcast = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid broadcast ID format", 400);
    }

    const broadcast = await Broadcast.findByIdAndDelete(req.params.id);
    if (!broadcast) {
      return errorResponse(res, "Broadcast not found", 404);
    }

    return successResponse(res, "Broadcast deleted successfully", null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 10. Content Hub / Roadmaps APIs
// ==========================================

export const getContentRoadmaps = async (req, res) => {
  try {
    const { category, status } = req.query;
    const query = {};

    if (category && category !== "All Categories") {
      query.category = category;
    }
    if (status && status !== "Status: All") {
      query.status = status;
    }

    const roadmaps = await ContentRoadmap.find(query).sort({ starred: -1, createdAt: -1 }).lean();

    return successResponse(res, "Content roadmaps fetched successfully", roadmaps, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createContentRoadmap = async (req, res) => {
  try {
    const { title, category, description, status } = req.body;

    if (!title) {
      return errorResponse(res, "Roadmap title is required", 400);
    }

    const roadmap = await ContentRoadmap.create({
      title: title.trim(),
      category: category || "Tech",
      description: description || "",
      status: status || "Published",
      enrollments: 0,
      completionRate: 0,
      createdBy: req.admin._id,
    });

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_ROADMAP",
      targetModel: "ContentRoadmap",
      targetId: roadmap._id,
      details: `Created career roadmap: ${roadmap.title}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Roadmap created successfully", roadmap, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateContentRoadmap = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid roadmap ID format", 400);
    }

    const roadmap = await ContentRoadmap.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!roadmap) {
      return errorResponse(res, "Roadmap not found", 404);
    }

    return successResponse(res, "Roadmap updated successfully", roadmap, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteContentRoadmap = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid roadmap ID format", 400);
    }

    const roadmap = await ContentRoadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) {
      return errorResponse(res, "Roadmap not found", 404);
    }

    return successResponse(res, "Roadmap deleted successfully", null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 11. Support Center APIs
// ==========================================

export const getSupportTickets = async (req, res) => {
  try {
    const { status, priority, type, q } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }
    if (priority && priority !== "all") {
      query.priority = priority;
    }
    if (type && type !== "all") {
      query.type = type;
    }
    if (q) {
      const regex = new RegExp(q.trim(), "i");
      query.$or = [{ title: regex }, { ticketId: regex }, { requesterName: regex }, { requesterEmail: regex }];
    }

    const [tickets, openCount, inProgressCount, resolvedCount] = await Promise.all([
      SupportTicket.find(query).sort({ createdAt: -1 }).lean(),
      SupportTicket.countDocuments({ status: "Open" }),
      SupportTicket.countDocuments({ status: "In Progress" }),
      SupportTicket.countDocuments({ status: "Resolved" }),
    ]);

    return successResponse(
      res,
      "Support tickets fetched successfully",
      {
        metrics: {
          open: openCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
        },
        tickets,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getSupportTicketById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid ticket ID format", 400);
    }

    const ticket = await SupportTicket.findById(req.params.id)
      .populate("assignedTo", "name email")
      .lean();

    if (!ticket) {
      return errorResponse(res, "Support ticket not found", 404);
    }

    return successResponse(res, "Support ticket fetched successfully", ticket, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createSupportTicket = async (req, res) => {
  try {
    const { title, description, requesterName, requesterEmail, requesterRole, priority, type } = req.body;

    if (!title || !description || !requesterName || !requesterEmail) {
      return errorResponse(res, "Title, description, requester name, and email are required", 400);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TCK-${randomSuffix}`;

    const ticket = await SupportTicket.create({
      ticketId,
      title: title.trim(),
      description: description.trim(),
      requesterName: requesterName.trim(),
      requesterEmail: requesterEmail.trim().toLowerCase(),
      requesterRole: requesterRole || "Student",
      priority: priority || "Standard",
      type: type || "Request",
      status: "Open",
      messages: [
        {
          senderName: requesterName.trim(),
          senderRole: requesterRole || "Student",
          text: description.trim(),
          isInternalNote: false,
          sentAt: new Date(),
        },
      ],
    });

    return successResponse(res, "Support ticket created successfully", ticket, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const replySupportTicket = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid ticket ID format", 400);
    }

    const { text, isInternalNote = false } = req.body;
    if (!text || !text.trim()) {
      return errorResponse(res, "Reply text is required", 400);
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return errorResponse(res, "Support ticket not found", 404);
    }

    ticket.messages.push({
      senderName: req.admin.name,
      senderRole: req.admin.role,
      senderId: req.admin._id,
      text: text.trim(),
      isInternalNote: Boolean(isInternalNote),
      sentAt: new Date(),
    });

    if (ticket.status === "Open") {
      ticket.status = "In Progress";
    }

    await ticket.save();

    await logAdminActivity({
      admin: req.admin,
      action: "REPLY_SUPPORT_TICKET",
      targetModel: "SupportTicket",
      targetId: ticket._id,
      details: `Replied to ticket #${ticket.ticketId}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "Reply added to ticket thread", ticket, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateSupportTicketStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid ticket ID format", 400);
    }

    const { status } = req.body;
    if (!["Open", "In Progress", "Resolved", "Closed"].includes(status)) {
      return errorResponse(res, "Status must be Open, In Progress, Resolved, or Closed", 400);
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!ticket) {
      return errorResponse(res, "Support ticket not found", 404);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "STATUS_CHANGE_TICKET",
      targetModel: "SupportTicket",
      targetId: ticket._id,
      details: `Ticket #${ticket.ticketId} status updated to ${status}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, `Ticket status updated to ${status}`, ticket, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 12. Deep Analytics & Aggregations
// ==========================================

export const getPlatformAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalColleges,
      totalRecruiters,
      appliedCount,
      underReviewCount,
      interviewCount,
      selectedCount,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments(),
      College.countDocuments(),
      Recruiter.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: { $in: ["Under Review", "Shortlisted"] } }),
      Application.countDocuments({ status: "Interview" }),
      Application.countDocuments({ status: "Selected" }),
    ]);

    const activeTotal = totalStudents + totalColleges + totalRecruiters;

    return successResponse(
      res,
      "Platform analytics fetched successfully",
      {
        kpis: {
          totalActiveUsers: activeTotal,
          avgSessionDuration: "18m 42s",
          systemHealthPercent: "99.98%",
          dauMauRatio: "42%",
        },
        distribution: {
          students: totalStudents,
          colleges: totalColleges,
          recruiters: totalRecruiters,
        },
        funnel: [
          { stage: "Profile Created", count: totalStudents, percent: 100 },
          { stage: "Applied to Drives", count: appliedCount, percent: totalStudents > 0 ? Math.round((appliedCount / totalStudents) * 100) : 0 },
          { stage: "Under Review / Interview", count: interviewCount + underReviewCount, percent: appliedCount > 0 ? Math.round(((interviewCount + underReviewCount) / appliedCount) * 100) : 0 },
          { stage: "Placed & Selected", count: selectedCount, percent: appliedCount > 0 ? Math.round((selectedCount / appliedCount) * 100) : 0 },
        ],
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 13. System Settings APIs
// ==========================================

export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne({ key: "global_platform_settings" }).lean();
    if (!settings) {
      settings = await SystemSetting.create({
        key: "global_platform_settings",
        aiReadinessWeights: {
          academicWeight: 40,
          softSkillsWeight: 30,
          techProjectsWeight: 20,
          extracurricularWeight: 10,
        },
        maintenanceMode: {
          enabled: false,
          message: "System maintenance in progress.",
        },
        apiIntegrations: {
          linkedIn: true,
          youTube: true,
          leetCode: false,
        },
      });
    }

    return successResponse(res, "System settings fetched successfully", settings, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateSystemSettings = async (req, res) => {
  try {
    const { aiReadinessWeights, maintenanceMode, apiIntegrations } = req.body;

    let settings = await SystemSetting.findOne({ key: "global_platform_settings" });
    if (!settings) {
      settings = new SystemSetting({ key: "global_platform_settings" });
    }

    if (aiReadinessWeights) {
      settings.aiReadinessWeights = {
        ...settings.aiReadinessWeights,
        ...aiReadinessWeights,
      };
    }

    if (maintenanceMode) {
      settings.maintenanceMode = {
        ...settings.maintenanceMode,
        ...maintenanceMode,
      };
    }

    if (apiIntegrations) {
      settings.apiIntegrations = {
        ...settings.apiIntegrations,
        ...apiIntegrations,
      };
    }

    settings.updatedBy = req.admin._id;
    await settings.save();

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_SYSTEM_SETTINGS",
      targetModel: "SystemSetting",
      targetId: settings._id,
      details: `Updated platform configuration and weights`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return successResponse(res, "System settings updated successfully", settings, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// 14. Activity / Audit Logs APIs
// ==========================================

export const getAdminActivities = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, targetModel } = req.query;

    const query = {};
    if (action && action !== "all") {
      query.action = action;
    }
    if (targetModel && targetModel !== "all") {
      query.targetModel = targetModel;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, activities] = await Promise.all([
      AdminActivity.countDocuments(query),
      AdminActivity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return successResponse(
      res,
      "Admin activity audit log fetched successfully",
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        activities,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
