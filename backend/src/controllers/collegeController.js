import mongoose from "mongoose";
import College from "../models/college.js";
import Student from "../models/student.js";
import Project from "../models/project.js";
import Application from "../models/application.js";

import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleControllerError = (res, error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return errorResponse(res, error.message, 400);
  }
  return errorResponse(res, error.message || "Internal Server Error", 500);
};

// ================= Register College =================

export const registerCollege = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address = "",
      website = "",
      university = "",
      city = "",
      state = "",
      description = "",
      code = "",
      placementOfficerName = "",
      placementOfficerEmail = "",
      placementOfficerPhone = "",
    } = req.body;

    if (!name || !email || !phone || !password) {
      return errorResponse(
        res,
        "Name, email, phone, and password are required",
        400
      );
    }

    if (password.length < 8) {
      return errorResponse(
        res,
        "Password must be at least 8 characters",
        400
      );
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return errorResponse(
        res,
        "Please enter a valid 10-digit phone number",
        400
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingCollege = await College.findOne({ email: normalizedEmail });

    if (existingCollege) {
      return errorResponse(
        res,
        "College with this email already exists",
        400
      );
    }

    const college = await College.create({
      name,
      email: normalizedEmail,
      phone,
      password,
      address,
      website,
      university,
      city,
      state,
      description,
      code,
      placementOfficerName,
      placementOfficerEmail,
      placementOfficerPhone,
    });

    const token = generateToken(college, "college");

    return successResponse(
      res,
      "College registered successfully",
      {
        token,
        id: college._id,
        _id: college._id,
        college: {
          id: college._id,
          _id: college._id,
          name: college.name,
          email: college.email,
          university: college.university,
        },
        name: college.name,
        email: college.email,
        university: college.university,
      },
      201
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// ================= Login College =================

export const loginCollege = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const college = await College.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!college) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isMatch = await college.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (college.status !== "Active") {
      return errorResponse(res, "College account is inactive", 403);
    }

    const token = generateToken(college, "college");

    return successResponse(
      res,
      "Login successful",
      {
        token,
        college: {
          id: college._id,
          _id: college._id,
          name: college.name,
          email: college.email,
          university: college.university,
        },
      },
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
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
    return handleControllerError(res, error);
  }
};

// ================= Update Profile =================

export const updateCollegeProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      university,
      address,
      city,
      state,
      website,
      description,
      code,
      placementOfficerName,
      placementOfficerEmail,
      placementOfficerPhone,
    } = req.body;

    if (phone && phone !== req.college.phone) {
      if (!/^[0-9]{10}$/.test(phone)) {
        return errorResponse(
          res,
          "Please enter a valid 10-digit phone number",
          400
        );
      }
      req.college.phone = phone;
    }

    if (name) req.college.name = name;
    if (university !== undefined) req.college.university = university;
    if (address !== undefined) req.college.address = address;
    if (city !== undefined) req.college.city = city;
    if (state !== undefined) req.college.state = state;
    if (website !== undefined) req.college.website = website;
    if (description !== undefined) req.college.description = description;
    if (code !== undefined) req.college.code = code;
    if (placementOfficerName !== undefined) req.college.placementOfficerName = placementOfficerName;
    if (placementOfficerEmail !== undefined) req.college.placementOfficerEmail = placementOfficerEmail;
    if (placementOfficerPhone !== undefined) req.college.placementOfficerPhone = placementOfficerPhone;

    await req.college.save();

    return successResponse(
      res,
      "College profile updated successfully",
      req.college,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// ================= Dashboard =================

export const getCollegeDashboard = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?.id;
    const studentIds = await Student.find({
      college: collegeId,
    }).distinct("_id");

    const totalStudents = await Student.countDocuments({
      college: collegeId,
    });

    const activeStudents = await Student.countDocuments({
      college: collegeId,
      status: "Active",
    });

    const totalProjects = await Project.countDocuments();
    const totalApplications = await Application.countDocuments({
      student: { $in: studentIds },
    });

    const selectedStudents = await Application.distinct("student", {
      student: { $in: studentIds },
      status: "Selected",
    });

    const pendingReviews = await Application.countDocuments({
      student: { $in: studentIds },
      status: { $in: ["Applied", "Under Review"] },
    });

    const shortlistedCount = await Application.countDocuments({
      student: { $in: studentIds },
      status: "Shortlisted",
    });

    const interviewCount = await Application.countDocuments({
      student: { $in: studentIds },
      status: "Interview",
    });

    const activeDrivesCount = await Project.countDocuments({ status: "Open" });

    const recentApplications = await Application.find({
      student: { $in: studentIds },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("student", "name email branch semester skills")
      .populate("project", "title location stipend")
      .populate("company", "name location");

    return successResponse(
      res,
      "Dashboard fetched successfully",
      {
        totalStudents,
        activeStudents,
        totalProjects,
        totalApplications,
        stats: {
          totalStudents,
          placedStudentsCount: selectedStudents.length,
          placementPercentage:
            totalStudents > 0
              ? ((selectedStudents.length / totalStudents) * 100).toFixed(1)
              : 0,
          totalApplications,
          pendingReviews,
          shortlistedCount,
          interviewCount,
          activeDrivesCount,
        },
        recentApplications,
        college: req.college,
      },
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// ================= Placement Drives =================

export const getCollegeDrives = async (req, res) => {
  try {
    const drives = await Project.find({ status: "Open" })
      .sort({ createdAt: -1 })
      .populate("company", "name industry location website")
      .populate("recruiter", "name email designation");

    return successResponse(
      res,
      "Placement drives fetched successfully",
      drives,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// ================= Create Student =================

export const createStudent = async (req, res) => {
  try {
    const { name, email, phone = "", branch = "Computer Science", semester = 6, skills = [] } = req.body;

    if (!name || !email) {
      return errorResponse(
        res,
        "Student name and email are required",
        400
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingStudent = await Student.findOne({ email: normalizedEmail });
    if (existingStudent) {
      return errorResponse(
        res,
        "Student with this email already exists",
        400
      );
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const student = await Student.create({
      ...req.body,
      name,
      email: normalizedEmail,
      phone,
      branch,
      semester: Number(semester) || 6,
      skills: skillsArray,
      status: req.body.status || "Active",
      college: req.college._id,
    });

    await College.findByIdAndUpdate(req.college._id, {
      $addToSet: { students: student._id },
    });

    return successResponse(
      res,
      "Student created successfully",
      student,
      201
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const addStudentToCollege = createStudent;

// ================= Get All Students =================

export const getAllStudents = async (req, res) => {
  try {
    const { search, branch, semester, status, page, limit } = req.query;

    const query = { college: req.college._id };

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    if (branch) query.branch = new RegExp(branch, "i");
    if (semester) query.semester = Number(semester);
    if (status) query.status = status;

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 10);
      const total = await Student.countDocuments(query);
      const students = await Student.find(query)
        .select("-password")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return successResponse(
        res,
        "Students fetched successfully",
        {
          students,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        },
        200
      );
    }

    const students = await Student.find(query).select("-password");

    return successResponse(
      res,
      "Students fetched successfully",
      students,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getCollegeStudents = getAllStudents;

// ================= Get Student By ID =================

export const getStudentById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const student = await Student.findOne({
      _id: req.params.id,
      college: req.college._id,
    }).select("-password");

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    const studentObj = student.toObject ? student.toObject() : student;

    return successResponse(
      res,
      "Student fetched successfully",
      {
        ...studentObj,
        student,
      },
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getCollegeStudentById = getStudentById;

// ================= Update Student =================

export const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    if (!isValidObjectId(studentId)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const student = await Student.findOne({
      _id: studentId,
      college: req.college._id,
    });

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    if (req.body.email) {
      const newEmail = req.body.email.toLowerCase().trim();
      if (newEmail !== student.email) {
        const existingEmail = await Student.findOne({
          email: newEmail,
          _id: { $ne: studentId },
        });
        if (existingEmail) {
          return errorResponse(
            res,
            "Student with this email already exists",
            400
          );
        }
        req.body.email = newEmail;
      }
    }

    // Strip sensitive / immutable fields
    delete req.body.password;
    delete req.body.college;

    const updateData = { ...req.body };
    if (updateData.skills && typeof updateData.skills === "string") {
      updateData.skills = updateData.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    return successResponse(
      res,
      "Student updated successfully",
      updatedStudent,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const updateCollegeStudent = updateStudent;

// ================= Delete Student =================

export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    if (!isValidObjectId(studentId)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const student = await Student.findOneAndDelete({
      _id: studentId,
      college: req.college._id,
    });

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // Cascade delete linked applications
    await Application.deleteMany({ student: studentId });

    // Clean up student reference in college document
    await College.findByIdAndUpdate(req.college._id, {
      $pull: { students: studentId },
    });

    return successResponse(
      res,
      "Student deleted successfully",
      null,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const deleteCollegeStudent = deleteStudent;

// ================= Get Eligible Students =================

export const getEligibleStudents = async (req, res) => {
  try {
    const query = {
      college: req.college._id,
      status: "Active",
    };

    if (req.query.branch) query.branch = new RegExp(req.query.branch, "i");
    if (req.query.semester) query.semester = Number(req.query.semester);

    const students = await Student.find(query).select("-password");

    return successResponse(
      res,
      "Eligible students fetched successfully",
      students,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// ================= Application Management =================

export const createApplication = async (req, res) => {
  try {
    const { student, recruiter, company, project } = req.body;

    if (!student || !recruiter || !company) {
      return errorResponse(
        res,
        "Student, recruiter, and company are required",
        400
      );
    }

    if (!isValidObjectId(student)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }
    if (!isValidObjectId(recruiter)) {
      return errorResponse(res, "Invalid recruiter ID format", 400);
    }
    if (!isValidObjectId(company)) {
      return errorResponse(res, "Invalid company ID format", 400);
    }
    if (project && !isValidObjectId(project)) {
      return errorResponse(res, "Invalid project ID format", 400);
    }

    const studentObj = await Student.findOne({
      _id: student,
      college: req.college._id,
    });

    if (!studentObj) {
      return errorResponse(
        res,
        "Student not found or does not belong to your college",
        403
      );
    }

    const application = await Application.create(req.body);

    const populatedApp = await Application.findById(application._id)
      .populate("student", "-password")
      .populate("recruiter")
      .populate("company")
      .populate("project");

    return successResponse(
      res,
      "Application created successfully",
      populatedApp,
      201
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { status, page, limit } = req.query;

    const studentIds = await Student.find({
      college: req.college._id,
    }).distinct("_id");

    const query = {
      student: { $in: studentIds },
    };

    if (status) {
      query.status = status;
    }

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 10);
      const total = await Application.countDocuments(query);
      const applications = await Application.find(query)
        .populate("student", "-password")
        .populate("recruiter")
        .populate("company")
        .populate("project")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return successResponse(
        res,
        "Applications fetched successfully",
        {
          applications,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        },
        200
      );
    }

    const applications = await Application.find(query)
      .populate("student", "-password")
      .populate("recruiter")
      .populate("company")
      .populate("project");

    return successResponse(
      res,
      "Applications fetched successfully",
      applications,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getApplicationById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid application ID format", 400);
    }

    const application = await Application.findById(req.params.id)
      .populate("student", "-password")
      .populate("recruiter")
      .populate("company")
      .populate("project");

    if (
      !application ||
      !application.student ||
      application.student.college.toString() !== req.college._id.toString()
    ) {
      return errorResponse(res, "Application not found", 404);
    }

    return successResponse(
      res,
      "Application fetched successfully",
      application,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// Update Application
export const updateApplication = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid application ID format", 400);
    }

    const existingApp = await Application.findById(req.params.id).populate(
      "student"
    );

    if (
      !existingApp ||
      !existingApp.student ||
      existingApp.student.college.toString() !== req.college._id.toString()
    ) {
      return errorResponse(res, "Application not found or access denied", 404);
    }

    delete req.body.student;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    )
      .populate("student", "-password")
      .populate("recruiter")
      .populate("company")
      .populate("project");

    return successResponse(
      res,
      "Application updated successfully",
      application,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// Delete Application
export const deleteApplication = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid application ID format", 400);
    }

    const existingApp = await Application.findById(req.params.id).populate(
      "student"
    );

    if (
      !existingApp ||
      !existingApp.student ||
      existingApp.student.college.toString() !== req.college._id.toString()
    ) {
      return errorResponse(res, "Application not found or access denied", 404);
    }

    await Application.findByIdAndDelete(req.params.id);

    return successResponse(
      res,
      "Application deleted successfully",
      null,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// ================= Project Management (Preserved) =================

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    return successResponse(
      res,
      "Project created successfully",
      project,
      201
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("company")
      .populate("recruiter");

    return successResponse(
      res,
      "Projects fetched successfully",
      projects,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("company")
      .populate("recruiter");

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    return successResponse(
      res,
      "Project fetched successfully",
      project,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    return successResponse(
      res,
      "Project updated successfully",
      project,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    return successResponse(
      res,
      "Project deleted successfully",
      null,
      200
    );
  } catch (error) {
    return handleControllerError(res, error);
  }
};