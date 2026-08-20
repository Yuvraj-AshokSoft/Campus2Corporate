import mongoose from "mongoose";
import College from "../models/college.js";
import Student from "../models/student.js";
import Project from "../models/project.js";
import Application from "../models/application.js";
import PlacementDrive from "../models/placementDrive.js";
import Broadcast from "../models/broadcast.js";
import Company from "../models/company.js";
import Recruiter from "../models/recruiter.js";

import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// ================= Register College =================

export const registerCollege = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      website,
      university,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !address ||
      !website ||
      !university
    ) {
      return errorResponse(res, "All fields are required", 400);
    }

    const existingCollege = await College.findOne({ email });

    if (existingCollege) {
      return errorResponse(res, "College already exists", 400);
    }

    const college = await College.create({
      name,
      email,
      phone,
      password,
      address,
      website,
      university,
    });

    return successResponse(
      res,
      "College registered successfully",
      {
        id: college._id,
        name: college.name,
        email: college.email,
      },
      201
    );
  } catch (error) {
     console.error(error);  
    return errorResponse(res, error.message, 500);
  }
};

// ================= Login College =================

export const loginCollege = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    if (!email || !password) {
      return errorResponse(res, "Email and Password are required", 400);
    }

    const college = await College.findOne({ email });

    if (!college) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isMatch = await college.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const token = generateToken(college._id);

    return successResponse(
      res,
      "Login successful",
      {
        token,
        college: {
          id: college._id,
          name: college.name,
          email: college.email,
        },
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Get Profile =================

export const getCollegeProfile = async (req, res) => {
  try {
    return successResponse(
      res,
      "College profile fetched successfully",
      req.college,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Dashboard Stats =================

export const getCollegeDashboardStats = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    // Get all student IDs associated with this college
    const collegeStudents = await Student.find({ college: collegeId }).select("_id status");
    const collegeStudentIds = collegeStudents.map((s) => s._id);

    // Compute metrics
    const totalStudents = collegeStudents.length;
    const activeStudents = collegeStudents.filter((s) => s.status === "Active").length;
    const verifiedStudents = activeStudents;

    // Scoped application metrics for this college's students
    const totalApplications = await Application.countDocuments({
      student: { $in: collegeStudentIds },
    });

    const placedStudents = await Application.countDocuments({
      student: { $in: collegeStudentIds },
      status: "Selected",
    });

    // Active drives / projects
    const activeProjects = await Project.countDocuments({ status: "Open" });

    return successResponse(
      res,
      "College dashboard statistics fetched successfully",
      {
        totalStudents,
        activeStudents,
        verifiedStudents,
        totalProjects: activeProjects,
        activeProjects,
        totalApplications,
        placedStudents,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCollegeDashboard = getCollegeDashboardStats;

// ================= Create Student =================
export const createStudent = async (req, res) => {
  try {
    const student = await Student.create({
      ...req.body,
      college: req.college._id, // Logged-in college
    });

    return successResponse(
      res,
      "Student created successfully",
      student,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Get All Students =================
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({
      college: req.college._id,
    });

    return successResponse(
      res,
      "Students fetched successfully",
      students,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Get Student By ID =================
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      college: req.college._id,
    });

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    return successResponse(
      res,
      "Student fetched successfully",
      student,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Update Student =================
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      {
        _id: req.params.id,
        college: req.college._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    return successResponse(
      res,
      "Student updated successfully",
      student,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Delete Student =================
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      college: req.college._id,
    });

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    return successResponse(
      res,
      "Student deleted successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ====================== APPLICATION MANAGEMENT ======================

// Create Application
export const createApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);

    return successResponse(
      res,
      "Application created successfully",
      application,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get All Applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "student",
        match: { college: req.college._id },
      })
      .populate("project");

    const filteredApplications = applications.filter(
      (app) => app.student !== null
    );

    return successResponse(
      res,
      "Applications fetched successfully",
      filteredApplications,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Application By ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: "student",
        match: { college: req.college._id },
      })
      .populate("project");

    if (!application || !application.student) {
      return errorResponse(res, "Application not found", 404);
    }

    return successResponse(
      res,
      "Application fetched successfully",
      application,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Application
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return errorResponse(res, "Application not found", 404);
    }

    return successResponse(
      res,
      "Application updated successfully",
      application,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Delete Application
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return errorResponse(res, "Application not found", 404);
    }

    return successResponse(
      res,
      "Application deleted successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};  

// ====================== COLLEGE PROJECT MANAGEMENT ======================

// Create Project for Authenticated College
export const createCollegeProject = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const {
      title,
      description,
      requiredSkills,
      skills,
      duration,
      stipend,
      location,
      mode,
      openings,
      applicationDeadline,
      status,
    } = req.body;

    if (!title || !description) {
      return errorResponse(res, "Project title and description are required", 400);
    }

    const projectSkills = requiredSkills || skills || ["General"];

    const project = await Project.create({
      title,
      description,
      college: collegeId,
      requiredSkills: Array.isArray(projectSkills) && projectSkills.length > 0 ? projectSkills : ["General"],
      duration: duration || "3 Months",
      stipend: stipend !== undefined ? stipend : 0,
      location: location || "Remote",
      mode: mode || "Remote",
      openings: openings || 1,
      applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: status || "Open",
    });

    return successResponse(
      res,
      "Project created successfully",
      project,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Get All Projects for Authenticated College
export const getCollegeProjects = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = { college: collegeId };

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.mode) {
      filter.mode = req.query.mode;
    }
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    return successResponse(
      res,
      "Projects fetched successfully",
      projects,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Single Project By ID for Authenticated College
export const getCollegeProjectById = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    if (project.college && project.college.toString() !== collegeId.toString()) {
      return errorResponse(res, "Access denied. Project belongs to another college", 403);
    }

    return successResponse(
      res,
      "Project fetched successfully",
      project,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Project for Authenticated College
export const updateCollegeProject = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    if (project.college && project.college.toString() !== collegeId.toString()) {
      return errorResponse(res, "Access denied. Project belongs to another college", 403);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return successResponse(
      res,
      "Project updated successfully",
      updatedProject,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Delete Project for Authenticated College
export const deleteCollegeProject = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    if (project.college && project.college.toString() !== collegeId.toString()) {
      return errorResponse(res, "Access denied. Project belongs to another college", 403);
    }

    await Project.findByIdAndDelete(req.params.id);

    return successResponse(
      res,
      "Project deleted successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Legacy exports / aliases
export const createProject = createCollegeProject;
export const getAllProjects = getCollegeProjects;
export const getProjectById = getCollegeProjectById;
export const updateProject = updateCollegeProject;
export const deleteProject = deleteCollegeProject;

// Get Eligible Students (70% and above)
export const getEligibleStudents = async (req, res) => {
  try {
    const students = await Student.find({
      percentage:  80 ,
      status: "Active",
    }).select("-password");

    return successResponse(
      res,
      "Eligible students fetched successfully",
      students,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ====================== PLACEMENT DRIVE MANAGEMENT ======================

// Create Placement Drive
export const createPlacementDrive = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const {
      companyName,
      jobRole,
      packageLPA,
      driveDate,
      deadlineDate,
      deadline,
      mode,
      eligibleBranches,
      eligibilityCriteria,
      eligibility,
      capacityLimit,
      status,
      stageStatus,
      location,
      description,
      company,
    } = req.body;

    if (!companyName || !jobRole || !packageLPA) {
      return errorResponse(
        res,
        "Company name, job role, and package LPA are required",
        400
      );
    }

    const resolvedDate = driveDate || deadlineDate || deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const drive = await PlacementDrive.create({
      college: collegeId,
      company,
      companyName,
      jobRole,
      packageLPA,
      driveDate: resolvedDate,
      mode: mode || "Virtual",
      eligibleBranches: eligibleBranches || [],
      eligibilityCriteria: eligibilityCriteria || eligibility || "CGPA > 6.0",
      capacityLimit: capacityLimit ? parseInt(capacityLimit) : 200,
      status: status || stageStatus || "Upcoming",
      deadline: deadline || deadlineDate || resolvedDate,
      location: location || "",
      description: description || "",
    });

    return successResponse(
      res,
      "Placement drive created successfully",
      drive,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Get All Placement Drives for Authenticated College
export const getPlacementDrives = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = { college: collegeId };

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.mode) {
      filter.mode = req.query.mode;
    }
    if (req.query.search) {
      filter.$or = [
        { companyName: { $regex: req.query.search, $options: "i" } },
        { jobRole: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const drives = await PlacementDrive.find(filter).sort({
      driveDate: 1,
      createdAt: -1,
    });

    return successResponse(
      res,
      "Placement drives fetched successfully",
      drives,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Single Placement Drive By ID for Authenticated College
export const getPlacementDriveById = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid placement drive ID format", 400);
    }

    const drive = await PlacementDrive.findById(req.params.id);

    if (!drive) {
      return errorResponse(res, "Placement drive not found", 404);
    }

    if (drive.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Placement drive belongs to another college",
        403
      );
    }

    return successResponse(
      res,
      "Placement drive fetched successfully",
      drive,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Placement Drive for Authenticated College
export const updatePlacementDrive = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid placement drive ID format", 400);
    }

    const drive = await PlacementDrive.findById(req.params.id);

    if (!drive) {
      return errorResponse(res, "Placement drive not found", 404);
    }

    if (drive.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Placement drive belongs to another college",
        403
      );
    }

    const updatedDrive = await PlacementDrive.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return successResponse(
      res,
      "Placement drive updated successfully",
      updatedDrive,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Delete Placement Drive for Authenticated College
export const deletePlacementDrive = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid placement drive ID format", 400);
    }

    const drive = await PlacementDrive.findById(req.params.id);

    if (!drive) {
      return errorResponse(res, "Placement drive not found", 404);
    }

    if (drive.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Placement drive belongs to another college",
        403
      );
    }

    await PlacementDrive.findByIdAndDelete(req.params.id);

    return successResponse(
      res,
      "Placement drive deleted successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ====================== BROADCAST / ANNOUNCEMENT MANAGEMENT ======================

// Create Broadcast
export const createBroadcast = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const {
      title,
      message,
      content,
      body,
      snippet,
      targetAudience,
      priority,
      isUrgent,
      category,
      type,
      status,
      readCount,
      totalCount,
      expiresAt,
    } = req.body;

    const finalMessage = message || content || body;

    if (!title || !finalMessage) {
      return errorResponse(
        res,
        "Title and message content are required",
        400
      );
    }

    const finalSnippet =
      snippet ||
      (finalMessage.length > 100
        ? `${finalMessage.slice(0, 100)}...`
        : finalMessage);

    const resolvedPriority =
      priority ||
      (isUrgent ? "Urgent" : "Normal");

    const broadcast = await Broadcast.create({
      college: collegeId,
      title,
      message: finalMessage,
      content: finalMessage,
      snippet: finalSnippet,
      targetAudience: targetAudience || "All",
      priority: resolvedPriority,
      isUrgent: isUrgent !== undefined ? Boolean(isUrgent) : resolvedPriority === "Urgent",
      category: category || type || "General",
      status: status || "Sent",
      readCount: readCount ? parseInt(readCount) : 0,
      totalCount: totalCount ? parseInt(totalCount) : 0,
      expiresAt: expiresAt || null,
    });

    return successResponse(
      res,
      "Broadcast created successfully",
      broadcast,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Get All Broadcasts for Authenticated College
export const getBroadcasts = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = { college: collegeId };

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { message: { $regex: req.query.search, $options: "i" } },
        { targetAudience: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const broadcasts = await Broadcast.find(filter).sort({ createdAt: -1 });

    return successResponse(
      res,
      "Broadcasts fetched successfully",
      broadcasts,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Single Broadcast By ID for Authenticated College
export const getBroadcastById = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid broadcast ID format", 400);
    }

    const broadcast = await Broadcast.findById(req.params.id);

    if (!broadcast) {
      return errorResponse(res, "Broadcast not found", 404);
    }

    if (broadcast.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Broadcast belongs to another college",
        403
      );
    }

    return successResponse(
      res,
      "Broadcast fetched successfully",
      broadcast,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Broadcast for Authenticated College
export const updateBroadcast = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid broadcast ID format", 400);
    }

    const broadcast = await Broadcast.findById(req.params.id);

    if (!broadcast) {
      return errorResponse(res, "Broadcast not found", 404);
    }

    if (broadcast.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Broadcast belongs to another college",
        403
      );
    }

    const updatedBroadcast = await Broadcast.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return successResponse(
      res,
      "Broadcast updated successfully",
      updatedBroadcast,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Delete Broadcast for Authenticated College
export const deleteBroadcast = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid broadcast ID format", 400);
    }

    const broadcast = await Broadcast.findById(req.params.id);

    if (!broadcast) {
      return errorResponse(res, "Broadcast not found", 404);
    }

    if (broadcast.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Broadcast belongs to another college",
        403
      );
    }

    await Broadcast.findByIdAndDelete(req.params.id);

    return successResponse(
      res,
      "Broadcast deleted successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ====================== RECRUITER / COMPANY COORDINATION ======================

// Get Coordinating Companies for Authenticated College
export const getCoordinatingCompanies = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = {};

    if (req.query.industry) {
      filter.industry = { $regex: req.query.industry, $options: "i" };
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { industry: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const rawCompanies = await Company.find(filter).lean();

    // Enrich companies with drive statistics for this specific college
    const enrichedCompanies = await Promise.all(
      rawCompanies.map(async (company) => {
        const drives = await PlacementDrive.find({
          college: collegeId,
          $or: [
            { company: company._id },
            { companyName: { $regex: new RegExp(`^${company.name}$`, "i") } },
          ],
        }).lean();

        const activeDrivesCount = drives.filter(
          (d) => d.status === "Upcoming" || d.status === "Ongoing" || d.status === "REGISTRATION OPEN" || d.status === "INTERVIEWING"
        ).length;

        return {
          ...company,
          placementDrives: drives,
          totalDrivesCount: drives.length,
          activeDrivesCount,
          status: drives.length > 0 ? "Active Partner" : "Registered Partner",
        };
      })
    );

    return successResponse(
      res,
      "Coordinating companies fetched successfully",
      enrichedCompanies,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Single Company Details with Drives for Authenticated College
export const getCompanyDetailsForCollege = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid company ID format", 400);
    }

    const company = await Company.findById(req.params.id).populate("recruiters").lean();

    if (!company) {
      return errorResponse(res, "Company not found", 404);
    }

    const drives = await PlacementDrive.find({
      college: collegeId,
      $or: [
        { company: company._id },
        { companyName: { $regex: new RegExp(`^${company.name}$`, "i") } },
      ],
    }).sort({ driveDate: -1 });

    return successResponse(
      res,
      "Company details fetched successfully",
      {
        ...company,
        placementDrives: drives,
        totalDrives: drives.length,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Coordinating Recruiters for Authenticated College
export const getCoordinatingRecruiters = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { designation: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const recruiters = await Recruiter.find(filter)
      .populate("company")
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      "Coordinating recruiters fetched successfully",
      recruiters,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};