import mongoose from "mongoose";
import College from "../models/college.js";
import Student from "../models/student.js";
import Project from "../models/project.js";
import Application from "../models/application.js";
import PlacementDrive from "../models/placementDrive.js";
import Broadcast from "../models/broadcast.js";
import Company from "../models/company.js";
import Recruiter from "../models/recruiter.js";
import EligibilityPreset from "../models/eligibilityPreset.js";
import CollegeNotification from "../models/collegeNotification.js";
import CollegeActivityLog from "../models/collegeActivityLog.js";
import ApplicationStatusHistory from "../models/applicationStatusHistory.js";

import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { recordsToCsv, parseCsv } from "../utils/csvHelper.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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

    const normalizedEmail = email.toLowerCase().trim();

    const existingCollege = await College.findOne({ email: normalizedEmail });

    if (existingCollege) {
      return errorResponse(res, "College already exists", 400);
    }

    const college = await College.create({
      name,
      email: normalizedEmail,
      phone,
      password,
      address,
      website,
      university,
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
    if (placementOfficerName !== undefined)
      req.college.placementOfficerName = placementOfficerName;
    if (placementOfficerEmail !== undefined)
      req.college.placementOfficerEmail = placementOfficerEmail;
    if (placementOfficerPhone !== undefined)
      req.college.placementOfficerPhone = placementOfficerPhone;

    await req.college.save();

    return successResponse(
      res,
      "College profile updated successfully",
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

// ================= Bulk Student Import =================

export const bulkImportStudents = async (req, res) => {
  try {
    let rawStudents = [];

    // Support JSON array, JSON object with students, or CSV data
    if (Array.isArray(req.body)) {
      rawStudents = req.body;
    } else if (req.body && Array.isArray(req.body.students)) {
      rawStudents = req.body.students;
    } else if (
      req.body &&
      typeof req.body.csvData === "string" &&
      req.body.csvData.trim()
    ) {
      rawStudents = parseCsv(req.body.csvData);
    } else if (typeof req.body === "string" && req.body.trim()) {
      rawStudents = parseCsv(req.body);
    }

    if (!rawStudents || rawStudents.length === 0) {
      return errorResponse(res, "No student data provided for import", 400);
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    const seenEmailsInBatch = new Set();
    const candidateEmails = [];
    const parsedRows = [];

    // Step 1: Pre-process and validate structure per row
    rawStudents.forEach((row, index) => {
      const rowNum = index + 1;
      const name = (row.name || row.studentname || "").trim();
      const email = (row.email || row.studentemail || "").toLowerCase().trim();
      const phone = (row.phone || row.contact || row.phonenumber || "").trim();
      const branch = (row.branch || row.department || "Computer Science").trim();
      const semesterRaw =
        row.semester !== undefined && row.semester !== ""
          ? Number(row.semester)
          : 6;
      const percentageRaw =
        row.percentage !== undefined && row.percentage !== ""
          ? Number(row.percentage)
          : NaN;
      const status =
        row.status && ["Active", "Inactive"].includes(row.status)
          ? row.status
          : "Active";

      let skills = [];
      if (Array.isArray(row.skills)) {
        skills = row.skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof row.skills === "string" && row.skills.trim()) {
        skills = row.skills
          .split(/[;,]/)
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const errors = [];

      if (!name) {
        errors.push("Student name is required");
      }

      if (!email) {
        errors.push("Email is required");
      } else if (!emailRegex.test(email)) {
        errors.push("Please enter a valid email address");
      } else if (seenEmailsInBatch.has(email)) {
        errors.push("Duplicate email within the import batch");
      } else {
        seenEmailsInBatch.add(email);
        candidateEmails.push(email);
      }

      if (isNaN(percentageRaw) || percentageRaw < 0 || percentageRaw > 100) {
        errors.push("Valid percentage between 0 and 100 is required");
      }

      if (isNaN(semesterRaw) || semesterRaw < 1 || semesterRaw > 12) {
        errors.push("Semester must be a number between 1 and 12");
      }

      parsedRows.push({
        row: rowNum,
        name,
        email,
        phone,
        branch: branch || "Computer Science",
        semester: !isNaN(semesterRaw) ? semesterRaw : 6,
        percentage: percentageRaw,
        skills,
        status,
        errors,
      });
    });

    // Step 2: Check for existing emails in database
    const existingInDb = await Student.find({
      email: { $in: candidateEmails },
    }).select("email");
    const existingEmailSet = new Set(
      existingInDb.map((s) => s.email.toLowerCase())
    );

    const validToInsert = [];
    const failedRows = [];

    parsedRows.forEach((item) => {
      const rowErrors = [...item.errors];

      if (item.email && existingEmailSet.has(item.email)) {
        rowErrors.push("Student with this email already exists");
      }

      if (rowErrors.length > 0) {
        failedRows.push({
          row: item.row,
          name: item.name,
          email: item.email || undefined,
          errors: rowErrors,
        });
      } else {
        validToInsert.push({
          name: item.name,
          email: item.email,
          phone: item.phone,
          branch: item.branch,
          semester: item.semester,
          percentage: item.percentage,
          skills: item.skills,
          status: item.status,
          college: req.college._id,
          collegeName: req.college.name,
        });
      }
    });

    let importedStudents = [];

    if (validToInsert.length > 0) {
      importedStudents = await Student.insertMany(validToInsert, {
        ordered: false,
      });

      const insertedIds = importedStudents.map((s) => s._id);

      // Synchronize with College.students array
      await College.findByIdAndUpdate(req.college._id, {
        $addToSet: { students: { $each: insertedIds } },
      });
    }

    return successResponse(
      res,
      `Bulk import completed: ${importedStudents.length} imported, ${failedRows.length} failed`,
      {
        total: rawStudents.length,
        importedCount: importedStudents.length,
        failedCount: failedRows.length,
        importedStudents,
        insertedStudents: importedStudents,
        failedRows,
      },
      importedStudents.length > 0 ? 201 : 200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Export Students to CSV =================

export const exportStudentsCSV = async (req, res) => {
  try {
    const { search, branch, semester, status, minPercentage } = req.query;

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
    if (minPercentage !== undefined && minPercentage !== "") {
      const minP = Number(minPercentage);
      if (!isNaN(minP)) {
        query.percentage = { $gte: minP };
      }
    }

    const students = await Student.find(query)
      .select(
        "name email phone branch semester percentage status skills createdAt"
      )
      .sort({ createdAt: -1 });

    const columns = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "branch", label: "Branch" },
      { key: "semester", label: "Semester" },
      { key: "percentage", label: "Percentage" },
      { key: "status", label: "Status" },
      { key: "skills", label: "Skills" },
      { key: "createdAt", label: "Registered At" },
    ];

    const records = students.map((s) => ({
      name: s.name || "",
      email: s.email || "",
      phone: s.phone || "",
      branch: s.branch || "",
      semester: s.semester !== undefined ? s.semester : "",
      percentage: s.percentage !== undefined ? s.percentage : "",
      status: s.status || "Active",
      skills: Array.isArray(s.skills) ? s.skills.join(", ") : "",
      createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : "",
    }));

    const csvOutput = recordsToCsv(records, columns);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="students_export.csv"'
    );

    return res.status(200).send(csvOutput);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Bulk Update Students =================

export const bulkUpdateStudents = async (req, res) => {
  try {
    let itemsToUpdate = [];

    // Support format 1: { updates: [ { id: "...", ...fields }, ... ] }
    // Support format 2: { studentIds: ["id1", "id2"], updates: { status: "Inactive", ... } }
    // Support format 3: [ { id: "...", ...fields }, ... ]
    if (Array.isArray(req.body)) {
      itemsToUpdate = req.body;
    } else if (req.body && Array.isArray(req.body.updates)) {
      itemsToUpdate = req.body.updates;
    } else if (
      req.body &&
      Array.isArray(req.body.studentIds) &&
      req.body.updates &&
      typeof req.body.updates === "object"
    ) {
      const commonUpdate = { ...req.body.updates };
      delete commonUpdate.id;
      delete commonUpdate._id;
      itemsToUpdate = req.body.studentIds.map((id) => ({
        id,
        ...commonUpdate,
      }));
    }

    if (!itemsToUpdate || itemsToUpdate.length === 0) {
      return errorResponse(res, "No student update data provided", 400);
    }

    const allowedFields = [
      "branch",
      "semester",
      "percentage",
      "status",
      "skills",
      "phone",
      "bio",
      "location",
      "resumeUrl",
      "interests",
      "linkedIn",
      "github",
      "portfolio",
    ];

    const updatedStudents = [];
    const errors = [];

    for (let i = 0; i < itemsToUpdate.length; i++) {
      const item = itemsToUpdate[i];
      const studentId = item.id || item._id;

      if (!studentId || !isValidObjectId(studentId)) {
        errors.push({
          index: i + 1,
          id: studentId || null,
          error: "Invalid or missing student ID format",
        });
        continue;
      }

      // Check student exists and belongs to authenticated college
      const student = await Student.findOne({
        _id: studentId,
        college: req.college._id,
      });

      if (!student) {
        errors.push({
          index: i + 1,
          id: studentId,
          error: "Student not found or does not belong to your college",
        });
        continue;
      }

      // Filter and sanitize update fields
      const cleanUpdate = {};
      allowedFields.forEach((field) => {
        if (item[field] !== undefined) {
          cleanUpdate[field] = item[field];
        }
      });

      if (cleanUpdate.skills) {
        if (typeof cleanUpdate.skills === "string") {
          cleanUpdate.skills = cleanUpdate.skills
            .split(/[;,]/)
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }

      if (cleanUpdate.percentage !== undefined) {
        const p = Number(cleanUpdate.percentage);
        if (isNaN(p) || p < 0 || p > 100) {
          errors.push({
            index: i + 1,
            id: studentId,
            error: "Percentage must be a number between 0 and 100",
          });
          continue;
        }
        cleanUpdate.percentage = p;
      }

      if (cleanUpdate.semester !== undefined) {
        const s = Number(cleanUpdate.semester);
        if (isNaN(s) || s < 1 || s > 12) {
          errors.push({
            index: i + 1,
            id: studentId,
            error: "Semester must be a number between 1 and 12",
          });
          continue;
        }
        cleanUpdate.semester = s;
      }

      if (
        cleanUpdate.status !== undefined &&
        !["Active", "Inactive"].includes(cleanUpdate.status)
      ) {
        errors.push({
          index: i + 1,
          id: studentId,
          error: "Status must be either 'Active' or 'Inactive'",
        });
        continue;
      }

      if (Object.keys(cleanUpdate).length === 0) {
        errors.push({
          index: i + 1,
          id: studentId,
          error: "No valid updatable fields provided",
        });
        continue;
      }

      try {
        const updated = await Student.findByIdAndUpdate(
          studentId,
          cleanUpdate,
          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

        updatedStudents.push(updated);
      } catch (err) {
        errors.push({
          index: i + 1,
          id: studentId,
          error: err.message || "Failed to update student",
        });
      }
    }

    return successResponse(
      res,
      `Bulk update completed: ${updatedStudents.length} updated, ${errors.length} failed`,
      {
        total: itemsToUpdate.length,
        updatedCount: updatedStudents.length,
        failedCount: errors.length,
        updatedStudents,
        errors,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Create Student =================
export const createStudent = async (req, res) => {
  try {
    const student = await Student.create({
      ...req.body,
      college: req.college._id, // Logged-in college
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
    return errorResponse(res, error.message, 500);
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

    if (page !== undefined || limit !== undefined) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
      const total = await Student.countDocuments(query);
      const students = await Student.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
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

    const students = await Student.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

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

// ================= Application Summary =================

export const getApplicationSummary = async (req, res) => {
  try {
    const studentIds = await Student.find({
      college: req.college._id,
    }).distinct("_id");

    const initialStatusCounts = {
      "Applied": 0,
      "Under Review": 0,
      "Shortlisted": 0,
      "Interview": 0,
      "Interviewed": 0,
      "Offered": 0,
      "Selected": 0,
      "Placed": 0,
      "Rejected": 0,
    };

    if (studentIds.length === 0) {
      return successResponse(
        res,
        "Application summary fetched successfully",
        {
          totalApplications: 0,
          statusCounts: initialStatusCounts,
          uniqueStudentsApplied: 0,
          placedCount: 0,
          placementRate: 0,
        },
        200
      );
    }

    const aggregationResult = await Application.aggregate([
      {
        $match: {
          student: { $in: studentIds },
        },
      },
      {
        $facet: {
          total: [{ $count: "count" }],
          statusCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          uniqueStudents: [
            {
              $group: {
                _id: "$student",
              },
            },
            {
              $count: "count",
            },
          ],
          placed: [
            {
              $match: { status: { $in: ["Selected", "Placed"] } },
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const result = aggregationResult[0] || {};
    const totalApplications = result.total?.[0]?.count || 0;
    const uniqueStudentsApplied = result.uniqueStudents?.[0]?.count || 0;
    const placedCount = result.placed?.[0]?.count || 0;

    const statusCounts = { ...initialStatusCounts };
    if (Array.isArray(result.statusCounts)) {
      result.statusCounts.forEach((item) => {
        if (item._id && statusCounts.hasOwnProperty(item._id)) {
          statusCounts[item._id] = item.count;
        }
      });
    }

    const placementRate =
      uniqueStudentsApplied > 0
        ? Number(((placedCount / uniqueStudentsApplied) * 100).toFixed(2))
        : 0;

    return successResponse(
      res,
      "Application summary fetched successfully",
      {
        totalApplications,
        statusCounts,
        uniqueStudentsApplied,
        placedCount,
        placementRate,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ================= Application Status History =================

export const getApplicationStatusHistory = async (req, res) => {
  try {
    const appId = req.params.id;
    if (!isValidObjectId(appId)) {
      return errorResponse(res, "Invalid application ID format", 400);
    }

    const application = await Application.findById(appId).populate("student");

    if (
      !application ||
      !application.student ||
      application.student.college?.toString() !== req.college._id.toString()
    ) {
      return errorResponse(
        res,
        "Application not found or does not belong to your college",
        404
      );
    }

    const history = await ApplicationStatusHistory.find({
      application: appId,
      college: req.college._id,
    })
      .sort({ changedAt: -1, createdAt: -1 })
      .populate("changedBy", "name email");

    return successResponse(
      res,
      "Application status history fetched successfully",
      history,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Create Application
export const createApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);

    // Record initial status history
    try {
      await ApplicationStatusHistory.create({
        application: application._id,
        college: req.college._id,
        oldStatus: null,
        newStatus: application.status || "Applied",
        changedBy: req.college._id,
        changedByRole: "college",
        remarks: req.body.remarks || "Application created",
        changedAt: new Date(),
      });
    } catch (histErr) {
      console.error("Failed to record status history on creation:", histErr.message);
    }

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
    const {
      status,
      companyId,
      projectId,
      studentId,
      startDate,
      endDate,
      page,
      limit,
    } = req.query;

    const studentIds = await Student.find({
      college: req.college._id,
    }).distinct("_id");

    const query = {
      student: { $in: studentIds },
    };

    if (status) {
      const validStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Interviewed",
        "Offered",
        "Selected",
        "Placed",
        "Rejected",
      ];
      if (!validStatuses.includes(status)) {
        return errorResponse(res, "Invalid application status", 400);
      }
      query.status = status;
    }

    if (companyId) {
      if (!isValidObjectId(companyId)) {
        return errorResponse(res, "Invalid company ID format", 400);
      }
      query.company = companyId;
    }

    if (projectId) {
      if (!isValidObjectId(projectId)) {
        return errorResponse(res, "Invalid project ID format", 400);
      }
      query.project = projectId;
    }

    if (studentId) {
      if (!isValidObjectId(studentId)) {
        return errorResponse(res, "Invalid student ID format", 400);
      }
      const studentBelongs = studentIds.some(
        (id) => id.toString() === studentId.toString()
      );
      if (!studentBelongs) {
        return errorResponse(
          res,
          "Student not found or does not belong to your college",
          404
        );
      }
      query.student = studentId;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate) {
      if (!dateRegex.test(startDate) || isNaN(Date.parse(startDate))) {
        return errorResponse(
          res,
          "Invalid startDate format. Expected YYYY-MM-DD",
          400
        );
      }
    }
    if (endDate) {
      if (!dateRegex.test(endDate) || isNaN(Date.parse(endDate))) {
        return errorResponse(
          res,
          "Invalid endDate format. Expected YYYY-MM-DD",
          400
        );
      }
    }
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return errorResponse(
          res,
          "Invalid date range: startDate cannot be after endDate",
          400
        );
      }
      query.createdAt = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    } else if (startDate) {
      query.createdAt = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
      };
    } else if (endDate) {
      query.createdAt = {
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    if (page !== undefined || limit !== undefined) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
      const total = await Application.countDocuments(query);
      const applications = await Application.find(query)
        .populate("student", "-password")
        .populate("recruiter")
        .populate("company")
        .populate("project")
        .populate("placementDrive")
        .sort({ createdAt: -1 })
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
      .populate("project")
      .populate("placementDrive")
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      "Applications fetched successfully",
      applications,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Application By ID
export const getApplicationById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid application ID format", 400);
    }

    const application = await Application.findById(req.params.id)
      .populate("student", "-password")
      .populate("recruiter")
      .populate("company")
      .populate("project")
      .populate("placementDrive");

    if (
      !application ||
      !application.student ||
      application.student.college?.toString() !== req.college._id.toString()
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
    return errorResponse(res, error.message, 500);
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
      existingApp.student.college?.toString() !== req.college._id.toString()
    ) {
      return errorResponse(res, "Application not found or access denied", 404);
    }

    const oldStatus = existingApp.status;
    const isStatusChanged = req.body.status && req.body.status !== oldStatus;

    delete req.body.student;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("student", "-password")
      .populate("recruiter")
      .populate("company")
      .populate("project")
      .populate("placementDrive");

    if (isStatusChanged) {
      await ApplicationStatusHistory.create({
        application: application._id,
        college: req.college._id,
        oldStatus,
        newStatus: application.status,
        changedBy: req.college._id,
        changedByRole: "college",
        remarks: req.body.remarks || "",
        changedAt: new Date(),
      });
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
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, "Invalid application ID format", 400);
    }

    const existingApp = await Application.findById(req.params.id).populate(
      "student"
    );

    if (
      !existingApp ||
      !existingApp.student ||
      existingApp.student.college?.toString() !== req.college._id.toString()
    ) {
      return errorResponse(res, "Application not found or access denied", 404);
    }

    await Application.findByIdAndDelete(req.params.id);

    // Clean up status history linked to this application
    await ApplicationStatusHistory.deleteMany({ application: req.params.id });

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

    logCollegeActivity({
      collegeId,
      action: "CREATE_DRIVE",
      module: "PlacementDrive",
      description: `Created placement drive: ${drive.companyName} - ${drive.jobRole}`,
      metadata: { driveId: drive._id, companyName: drive.companyName, jobRole: drive.jobRole },
      ipAddress: req.ip || "",
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

    logCollegeActivity({
      collegeId,
      action: "SEND_BROADCAST",
      module: "Broadcast",
      description: `Sent broadcast announcement: ${broadcast.title}`,
      metadata: { broadcastId: broadcast._id, title: broadcast.title },
      ipAddress: req.ip || "",
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

// ====================== ELIGIBILITY PRESET MANAGEMENT ======================

// Create Eligibility Preset
export const createEligibilityPreset = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const {
      name,
      minCgpa,
      eligibleBranches,
      maxActiveBacklogs,
      allowedPassingYears,
      description,
    } = req.body;

    if (!name || (typeof name === "string" && !name.trim())) {
      return errorResponse(res, "Preset name is required", 400);
    }

    const preset = await EligibilityPreset.create({
      college: collegeId,
      name,
      minCgpa: minCgpa !== undefined ? minCgpa : 0,
      eligibleBranches: eligibleBranches || [],
      maxActiveBacklogs: maxActiveBacklogs !== undefined ? maxActiveBacklogs : 0,
      allowedPassingYears: allowedPassingYears || [],
      description: description || "",
    });

    logCollegeActivity({
      collegeId,
      action: "CREATE_PRESET",
      module: "EligibilityPreset",
      description: `Created eligibility preset: ${preset.name}`,
      metadata: { presetId: preset._id, name: preset.name },
      ipAddress: req.ip || "",
    });

    return successResponse(
      res,
      "Eligibility preset created successfully",
      preset,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Get All Eligibility Presets for Authenticated College
export const getEligibilityPresets = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = { college: collegeId };

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const presets = await EligibilityPreset.find(filter).sort({ createdAt: -1 });

    return successResponse(
      res,
      "Eligibility presets fetched successfully",
      presets,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Single Eligibility Preset By ID for Authenticated College
export const getEligibilityPresetById = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid eligibility preset ID format", 400);
    }

    const preset = await EligibilityPreset.findById(req.params.id);

    if (!preset) {
      return errorResponse(res, "Eligibility preset not found", 404);
    }

    if (preset.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Eligibility preset belongs to another college",
        403
      );
    }

    return successResponse(
      res,
      "Eligibility preset fetched successfully",
      preset,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Eligibility Preset for Authenticated College
export const updateEligibilityPreset = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid eligibility preset ID format", 400);
    }

    const preset = await EligibilityPreset.findById(req.params.id);

    if (!preset) {
      return errorResponse(res, "Eligibility preset not found", 404);
    }

    if (preset.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Eligibility preset belongs to another college",
        403
      );
    }

    const updatedPreset = await EligibilityPreset.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return successResponse(
      res,
      "Eligibility preset updated successfully",
      updatedPreset,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Delete Eligibility Preset for Authenticated College
export const deleteEligibilityPreset = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid eligibility preset ID format", 400);
    }

    const preset = await EligibilityPreset.findById(req.params.id);

    if (!preset) {
      return errorResponse(res, "Eligibility preset not found", 404);
    }

    if (preset.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Eligibility preset belongs to another college",
        403
      );
    }

    await EligibilityPreset.findByIdAndDelete(req.params.id);

    return successResponse(
      res,
      "Eligibility preset deleted successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ====================== PLACEMENT DRIVE WORKFLOW & PARTICIPANTS ======================

// Get Drive Participants (Applications) for Authenticated College
export const getDriveParticipants = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const { driveId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(driveId)) {
      return errorResponse(res, "Invalid placement drive ID format", 400);
    }

    const drive = await PlacementDrive.findById(driveId);

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

    const filter = {
      $or: [{ placementDrive: driveId }, { drive: driveId }],
    };

    if (req.query.status || req.query.stage) {
      filter.status = req.query.status || req.query.stage;
    }

    const participants = await Application.find(filter)
      .populate("student", "name email phone branch percentage cgpa backlogs activeBacklogs passingYear graduationYear resume resumeUrl")
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      "Drive participants fetched successfully",
      participants,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Participant Stage Status in a Placement Drive
export const updateParticipantStatus = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const { driveId, participantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(driveId)) {
      return errorResponse(res, "Invalid placement drive ID format", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return errorResponse(res, "Invalid participant ID format", 400);
    }

    const drive = await PlacementDrive.findById(driveId);

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

    let application = await Application.findOne({
      _id: participantId,
      $or: [{ placementDrive: driveId }, { drive: driveId }],
    });

    if (!application) {
      application = await Application.findOne({
        student: participantId,
        $or: [{ placementDrive: driveId }, { drive: driveId }],
      });
    }

    if (!application) {
      application = await Application.findById(participantId);
    }

    if (!application) {
      return errorResponse(res, "Participant application record not found", 404);
    }

    const { status, stage, stageStatus } = req.body;
    const newStatus = status || stage || stageStatus;

    if (!newStatus) {
      return errorResponse(res, "Status parameter is required", 400);
    }

    application.status = newStatus;
    await application.save();

    // Recalculate drive applied/participant count
    const totalApplied = await Application.countDocuments({
      $or: [{ placementDrive: driveId }, { drive: driveId }],
    });
    drive.appliedCount = totalApplied;
    await drive.save();

    const updatedParticipant = await Application.findById(application._id).populate(
      "student",
      "name email phone branch percentage cgpa backlogs activeBacklogs passingYear graduationYear resume resumeUrl"
    );

    logCollegeActivity({
      collegeId,
      action: "UPDATE_PARTICIPANT_STATUS",
      module: "PlacementDrive",
      description: `Updated participant status to ${newStatus}`,
      metadata: { driveId, applicationId: application._id, studentId: application.student, newStatus },
      ipAddress: req.ip || "",
    });

    return successResponse(
      res,
      "Participant status updated successfully",
      updatedParticipant,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Evaluate College Enrolled Students against Drive Criteria/Presets
export const evaluateDriveEligibleStudents = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const { driveId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(driveId)) {
      return errorResponse(res, "Invalid placement drive ID format", 400);
    }

    const drive = await PlacementDrive.findById(driveId).populate("eligibilityPreset");

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

    let minCgpa = drive.minCgpa || 0;
    let eligibleBranches = drive.eligibleBranches || [];
    let maxActiveBacklogs = drive.maxActiveBacklogs || 0;
    let allowedPassingYears = drive.allowedPassingYears || [];

    if (drive.eligibilityPreset) {
      minCgpa = drive.eligibilityPreset.minCgpa !== undefined ? drive.eligibilityPreset.minCgpa : minCgpa;
      eligibleBranches = drive.eligibilityPreset.eligibleBranches && drive.eligibilityPreset.eligibleBranches.length > 0
        ? drive.eligibilityPreset.eligibleBranches
        : eligibleBranches;
      maxActiveBacklogs = drive.eligibilityPreset.maxActiveBacklogs !== undefined ? drive.eligibilityPreset.maxActiveBacklogs : maxActiveBacklogs;
      allowedPassingYears = drive.eligibilityPreset.allowedPassingYears && drive.eligibilityPreset.allowedPassingYears.length > 0
        ? drive.eligibilityPreset.allowedPassingYears
        : allowedPassingYears;
    }

    const students = await Student.find({ college: collegeId }).select("-password");

    const evaluations = students.map((student) => {
      const studentCgpa = student.cgpa !== undefined && student.cgpa !== null ? student.cgpa : (student.percentage ? student.percentage / 10 : 0);
      const studentBacklogs = student.activeBacklogs !== undefined && student.activeBacklogs !== null
        ? student.activeBacklogs
        : (student.backlogs !== undefined ? student.backlogs : 0);
      const studentPassingYear = student.passingYear || student.graduationYear;
      const studentBranch = student.branch || "";

      const cgpaMatch = studentCgpa >= minCgpa;
      const branchMatch = eligibleBranches.length === 0 || eligibleBranches.some((b) => b.toLowerCase() === studentBranch.toLowerCase());
      const backlogMatch = studentBacklogs <= maxActiveBacklogs;
      const passingYearMatch = allowedPassingYears.length === 0 || (studentPassingYear && allowedPassingYears.includes(Number(studentPassingYear)));

      const isEligible = cgpaMatch && branchMatch && backlogMatch && passingYearMatch;
      const passedChecks = (cgpaMatch ? 1 : 0) + (branchMatch ? 1 : 0) + (backlogMatch ? 1 : 0) + (passingYearMatch ? 1 : 0);
      const matchScore = Math.round((passedChecks / 4) * 100);

      return {
        student,
        isEligible,
        matchScore,
        evaluation: {
          cgpa: { studentValue: studentCgpa, requiredMin: minCgpa, pass: cgpaMatch },
          branch: { studentValue: studentBranch, allowedBranches: eligibleBranches, pass: branchMatch },
          backlogs: { studentValue: studentBacklogs, maxAllowed: maxActiveBacklogs, pass: backlogMatch },
          passingYear: { studentValue: studentPassingYear || null, allowedYears: allowedPassingYears, pass: passingYearMatch },
        },
      };
    });

    return successResponse(
      res,
      "Drive eligible students evaluated successfully",
      evaluations,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ====================== COLLEGE NOTIFICATIONS MANAGEMENT ======================

// Get College Notifications with unread count summary and filtering
export const getCollegeNotifications = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = { college: collegeId };

    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === "true" || req.query.isRead === true;
    }

    const typeFilter = req.query.type || req.query.category;
    if (typeFilter) {
      filter.$or = [
        { type: { $regex: new RegExp(`^${typeFilter}$`, "i") } },
        { category: { $regex: new RegExp(`^${typeFilter}$`, "i") } },
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await CollegeNotification.countDocuments(filter);
    const unreadCount = await CollegeNotification.countDocuments({
      college: collegeId,
      isRead: false,
    });

    const notifications = await CollegeNotification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(
      res,
      "College notifications fetched successfully",
      {
        notifications,
        unreadCount,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Mark Single Notification As Read
export const markNotificationAsRead = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid notification ID format", 400);
    }

    const notification = await CollegeNotification.findById(id);

    if (!notification) {
      return errorResponse(res, "Notification not found", 404);
    }

    if (notification.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Notification belongs to another college",
        403
      );
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return successResponse(
      res,
      "Notification marked as read successfully",
      notification,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Mark All Unread Notifications As Read for Authenticated College
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const result = await CollegeNotification.updateMany(
      { college: collegeId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return successResponse(
      res,
      "All notifications marked as read successfully",
      { modifiedCount: result.modifiedCount },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Delete College Notification
export const deleteCollegeNotification = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid notification ID format", 400);
    }

    const notification = await CollegeNotification.findById(id);

    if (!notification) {
      return errorResponse(res, "Notification not found", 404);
    }

    if (notification.college.toString() !== collegeId.toString()) {
      return errorResponse(
        res,
        "Access denied. Notification belongs to another college",
        403
      );
    }

    await CollegeNotification.findByIdAndDelete(id);

    return successResponse(
      res,
      "Notification deleted successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ====================== ACTIVITY & AUDIT LOGS MANAGEMENT ======================

// Helper function to log college activity
export const logCollegeActivity = async ({
  collegeId,
  action,
  module = "General",
  description,
  metadata = {},
  ipAddress = "",
  performedBy,
}) => {
  try {
    if (!collegeId || !action || !description) return null;
    return await CollegeActivityLog.create({
      college: collegeId,
      action,
      module,
      description,
      performedBy: performedBy || collegeId,
      metadata,
      ipAddress,
    });
  } catch (error) {
    console.error("Failed to record college activity log:", error.message);
    return null;
  }
};

// Get College Activity Logs with filtering and pagination
export const getCollegeActivityLogs = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = { college: collegeId };

    if (req.query.module) {
      filter.module = req.query.module;
    }

    if (req.query.action) {
      filter.action = req.query.action;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await CollegeActivityLog.countDocuments(filter);
    const logs = await CollegeActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(
      res,
      "College activity logs fetched successfully",
      {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ====================== ENHANCED RECRUITER COORDINATION & VISITS ======================

// Get Campus Visits Categorized into Upcoming vs Past
export const getCampusVisits = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const filter = { college: collegeId };

    if (req.query.search) {
      filter.$or = [
        { companyName: { $regex: req.query.search, $options: "i" } },
        { jobRole: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const drives = await PlacementDrive.find(filter)
      .populate("company", "name logo website industry location description")
      .sort({ driveDate: 1, createdAt: -1 });

    const now = new Date();
    const upcoming = drives.filter((d) => new Date(d.driveDate) >= now);
    const past = drives.filter((d) => new Date(d.driveDate) < now);

    const timeline = (req.query.timeline || "all").toLowerCase();
    let resultDrives = drives;
    if (timeline === "upcoming") {
      resultDrives = upcoming;
    } else if (timeline === "past") {
      resultDrives = past;
    }

    return successResponse(
      res,
      "Campus visits fetched successfully",
      {
        visits: resultDrives,
        upcoming,
        past,
        totalCount: drives.length,
        upcomingCount: upcoming.length,
        pastCount: past.length,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Aggregated Placement Metrics Grouped by Company for Authenticated College
export const getCompanyPlacementSummary = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const collegeDrives = await PlacementDrive.find({ college: collegeId }).lean();
    const collegeDriveIds = collegeDrives.map((d) => d._id);

    const collegeApplications = await Application.find({
      $or: [
        { placementDrive: { $in: collegeDriveIds } },
        { drive: { $in: collegeDriveIds } },
      ],
    }).lean();

    const companyMap = new Map();

    for (const drive of collegeDrives) {
      const key = drive.company ? drive.company.toString() : drive.companyName.toLowerCase().trim();
      if (!companyMap.has(key)) {
        companyMap.set(key, {
          companyId: drive.company || null,
          companyName: drive.companyName,
          drives: [],
        });
      }
      companyMap.get(key).drives.push(drive);
    }

    const summaries = await Promise.all(
      Array.from(companyMap.values()).map(async (group) => {
        let companyDetails = null;
        if (group.companyId) {
          companyDetails = await Company.findById(group.companyId).select("name logo website industry location").lean();
        }

        const driveIds = group.drives.map((d) => d._id.toString());
        const driveApps = collegeApplications.filter((app) => {
          const appDriveId = (app.placementDrive || app.drive || "").toString();
          return driveIds.includes(appDriveId);
        });

        const activeStatuses = ["Upcoming", "Ongoing", "REGISTRATION OPEN", "INTERVIEWING", "TESTING STAGE"];
        const activeDrivesCount = group.drives.filter((d) => activeStatuses.includes(d.status)).length;
        const totalApplicants = driveApps.length;

        const shortlistedStatuses = ["Shortlisted", "Interview", "Interviewed"];
        const shortlistedCount = driveApps.filter((app) => shortlistedStatuses.includes(app.status)).length;

        const placedStatuses = ["Placed", "Selected"];
        const placedCount = driveApps.filter((app) => placedStatuses.includes(app.status)).length;

        let highestPackageLPA = 0;
        group.drives.forEach((d) => {
          if (d.packageLPA !== undefined && d.packageLPA !== null) {
            let val = 0;
            if (typeof d.packageLPA === "number") {
              val = d.packageLPA;
            } else if (typeof d.packageLPA === "string") {
              const match = d.packageLPA.match(/[\d.]+/);
              if (match) val = parseFloat(match[0]);
            }
            if (val > highestPackageLPA) highestPackageLPA = val;
          }
        });

        return {
          companyId: group.companyId,
          companyName: companyDetails?.name || group.companyName,
          industry: companyDetails?.industry || "N/A",
          logo: companyDetails?.logo || "",
          website: companyDetails?.website || "",
          location: companyDetails?.location || "",
          totalDrives: group.drives.length,
          activeDrivesCount,
          totalApplicants,
          shortlistedCount,
          placedCount,
          highestPackageLPA,
        };
      })
    );

    return successResponse(
      res,
      "Company placement summary fetched successfully",
      summaries,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Recruiter Placement Summary for Authenticated College
export const getRecruiterPlacementSummary = async (req, res) => {
  try {
    const collegeId = req.college?._id || req.user?._id;

    if (!collegeId) {
      return errorResponse(res, "College authorization context missing", 401);
    }

    const collegeDrives = await PlacementDrive.find({ college: collegeId }).lean();
    const collegeCompanyIds = collegeDrives.map((d) => d.company).filter(Boolean);

    const filter = {};
    if (collegeCompanyIds.length > 0) {
      filter.company = { $in: collegeCompanyIds };
    }

    const recruiters = await Recruiter.find(filter)
      .populate("company", "name logo industry website")
      .lean();

    const recruiterSummaries = recruiters.map((recruiter) => {
      const recCompanyId = recruiter.company?._id?.toString() || recruiter.company?.toString();
      const recruiterDrives = collegeDrives.filter(
        (d) => d.company && d.company.toString() === recCompanyId
      );

      let lastVisitDate = null;
      if (recruiterDrives.length > 0) {
        const sortedDates = recruiterDrives
          .map((d) => new Date(d.driveDate))
          .sort((a, b) => b - a);
        lastVisitDate = sortedDates[0];
      }

      return {
        recruiterId: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        phone: recruiter.phone,
        designation: recruiter.designation || "Recruiter",
        company: recruiter.company,
        driveCount: recruiterDrives.length,
        lastVisitDate,
      };
    });

    return successResponse(
      res,
      "Recruiter placement summary fetched successfully",
      recruiterSummaries,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};



