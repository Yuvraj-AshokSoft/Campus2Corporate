import mongoose from "mongoose";
import College from "../models/college.js";
import Student from "../models/student.js";
import Project from "../models/project.js";
import Application from "../models/application.js";
import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// ==========================================
// AUTHENTICATION
// ==========================================

// Register College
export const registerCollege = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      code,
      website,
      address,
      city,
      state,
      description,
      placementOfficerName,
      placementOfficerEmail,
      placementOfficerPhone,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return errorResponse(
        res,
        "Please provide required fields: name, email, phone, password",
        400
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingCollege = await College.findOne({ email: cleanEmail });
    if (existingCollege) {
      return errorResponse(res, "A college account with this email already exists", 400);
    }

    const college = await College.create({
      name,
      email: cleanEmail,
      phone,
      password,
      code: code || "",
      website: website || "",
      address: address || "",
      city: city || "",
      state: state || "",
      description: description || "",
      placementOfficerName: placementOfficerName || "",
      placementOfficerEmail: placementOfficerEmail || "",
      placementOfficerPhone: placementOfficerPhone || "",
      status: "Active",
    });

    const token = generateToken(college._id, "college");
    const safeCollege = await College.findById(college._id).select("-password");

    return successResponse(
      res,
      "College registered successfully",
      {
        token,
        college: safeCollege,
      },
      201
    );
  } catch (error) {
    console.error("College registration error:", error);
    return errorResponse(res, error.message || "College registration failed", 500);
  }
};

// Login College
export const loginCollege = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Please provide email and password", 400);
    }

    const cleanEmail = email.toLowerCase().trim();

    const college = await College.findOne({ email: cleanEmail }).select("+password");
    if (!college) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isMatch = await college.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (college.status === "Inactive") {
      return errorResponse(res, "College account is inactive. Please contact support.", 403);
    }

    const token = generateToken(college._id, "college");
    college.password = undefined;

    return successResponse(
      res,
      "College login successful",
      {
        token,
        college,
      },
      200
    );
  } catch (error) {
    console.error("College login error:", error);
    return errorResponse(res, error.message || "College login failed", 500);
  }
};

// ==========================================
// PROFILE MANAGEMENT
// ==========================================

// Get Current College Profile
export const getCollegeProfile = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments({ college: req.college._id });

    return successResponse(
      res,
      "College profile fetched successfully",
      {
        ...req.college.toObject(),
        totalStudents: studentCount,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update College Profile
export const updateCollegeProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "phone",
      "code",
      "website",
      "address",
      "city",
      "state",
      "description",
      "placementOfficerName",
      "placementOfficerEmail",
      "placementOfficerPhone",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedCollege = await College.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    return successResponse(
      res,
      "College profile updated successfully",
      updatedCollege,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// DASHBOARD ANALYTICS
// ==========================================

export const getCollegeDashboard = async (req, res) => {
  try {
    const collegeId = req.user.id;

    // College student pool count
    const studentIds = await Student.find({ college: collegeId }).distinct("_id");
    const totalStudents = studentIds.length;

    // Application analytics for college students
    const totalApplications = await Application.countDocuments({ student: { $in: studentIds } });
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

    // Active recruitment drives across platform
    const activeDrivesCount = await Project.countDocuments({ status: "Open" });

    // Recent applications from students of this college
    const recentApplications = await Application.find({ student: { $in: studentIds } })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("student", "name email branch semester skills")
      .populate("project", "title location stipend")
      .populate("company", "name location");

    return successResponse(
      res,
      "College dashboard analytics fetched successfully",
      {
        stats: {
          totalStudents,
          placedStudentsCount: selectedStudents.length,
          placementPercentage: totalStudents > 0 ? ((selectedStudents.length / totalStudents) * 100).toFixed(1) : 0,
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
    console.error("College dashboard error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// STUDENT MANAGEMENT IN COLLEGE POOL
// ==========================================

// Add Student to College Pool
export const addStudentToCollege = async (req, res) => {
  try {
    const { name, email, phone, branch, semester, password, skills } = req.body;

    if (!name || !email) {
      return errorResponse(res, "Please provide student name and email", 400);
    }

    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      // If student exists, associate with this college
      existingStudent.college = req.college._id;
      if (branch) existingStudent.branch = branch;
      if (semester) existingStudent.semester = Number(semester);
      if (skills) {
        existingStudent.skills = Array.isArray(skills)
          ? skills
          : skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
      await existingStudent.save();

      await College.findByIdAndUpdate(req.college._id, {
        $addToSet: { students: existingStudent._id },
      });

      return successResponse(res, "Student linked to college pool successfully", existingStudent, 200);
    }

    const skillsArray = skills
      ? Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      password: password || "Student@123456",
      college: req.college._id,
      branch: branch || "Computer Science",
      semester: Number(semester) || 6,
      skills: skillsArray,
      status: "Active",
    });

    await College.findByIdAndUpdate(req.college._id, {
      $addToSet: { students: student._id },
    });

    const safeStudent = await Student.findById(student._id).select("-password");

    return successResponse(
      res,
      "Student added to college pool successfully",
      safeStudent,
      201
    );
  } catch (error) {
    console.error("Add student error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// Get All Students in College Pool
export const getCollegeStudents = async (req, res) => {
  try {
    const { search, branch, semester } = req.query;

    const query = { college: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (branch) {
      query.branch = { $regex: branch, $options: "i" };
    }

    if (semester) {
      query.semester = Number(semester);
    }

    const students = await Student.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      "College students fetched successfully",
      students,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Single Student by ID in College Pool
export const getCollegeStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const student = await Student.findOne({ _id: id, college: req.user.id }).select("-password");

    if (!student) {
      return errorResponse(res, "Student not found in this college pool", 404);
    }

    const applications = await Application.find({ student: student._id })
      .populate("project", "title location stipend status")
      .populate("company", "name industry location");

    return successResponse(
      res,
      "Student details fetched successfully",
      {
        student,
        applications,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Student in College Pool
export const updateCollegeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const student = await Student.findOne({ _id: id, college: req.user.id });
    if (!student) {
      return errorResponse(res, "Student not found in this college pool", 404);
    }

    const updateData = { ...req.body };
    if (updateData.skills) {
      updateData.skills = Array.isArray(updateData.skills)
        ? updateData.skills
        : updateData.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    return successResponse(
      res,
      "Student details updated successfully",
      updatedStudent,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Delete / Unlink Student from College Pool
export const deleteCollegeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid student ID format", 400);
    }

    const student = await Student.findOne({ _id: id, college: req.user.id });
    if (!student) {
      return errorResponse(res, "Student not found in this college pool", 404);
    }

    student.college = undefined;
    await student.save();

    await College.findByIdAndUpdate(req.user.id, {
      $pull: { students: id },
    });

    return successResponse(
      res,
      "Student removed from college pool successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// DRIVES / OPPORTUNITIES OVERVIEW
// ==========================================

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
    return errorResponse(res, error.message, 500);
  }
};
