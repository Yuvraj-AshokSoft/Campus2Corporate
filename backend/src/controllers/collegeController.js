import mongoose from "mongoose";
import College from "../models/college.js";
import Student from "../models/student.js";
import Project from "../models/project.js";
import Application from "../models/application.js";

import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { recordsToCsv, parseCsv } from "../utils/csvHelper.js";

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

// ================= Bulk Student Import =================

export const bulkImportStudents = async (req, res) => {
  try {
    let rawStudents = [];

    // Support JSON array, JSON object with students, or CSV data
    if (Array.isArray(req.body)) {
      rawStudents = req.body;
    } else if (req.body && Array.isArray(req.body.students)) {
      rawStudents = req.body.students;
    } else if (req.body && typeof req.body.csvData === "string" && req.body.csvData.trim()) {
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
      const semesterRaw = row.semester !== undefined && row.semester !== "" ? Number(row.semester) : 6;
      const percentageRaw = row.percentage !== undefined && row.percentage !== "" ? Number(row.percentage) : NaN;
      const status = row.status && ["Active", "Inactive"].includes(row.status) ? row.status : "Active";

      let skills = [];
      if (Array.isArray(row.skills)) {
        skills = row.skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof row.skills === "string" && row.skills.trim()) {
        skills = row.skills.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
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
    const existingEmailSet = new Set(existingInDb.map((s) => s.email.toLowerCase()));

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
        });
      }
    });

    let insertedStudents = [];

    if (validToInsert.length > 0) {
      insertedStudents = await Student.insertMany(validToInsert, {
        ordered: false,
      });

      const insertedIds = insertedStudents.map((s) => s._id);

      // Synchronize with College.students array
      await College.findByIdAndUpdate(req.college._id, {
        $addToSet: { students: { $each: insertedIds } },
      });
    }

    return successResponse(
      res,
      `Bulk import completed: ${insertedStudents.length} imported, ${failedRows.length} failed`,
      {
        total: rawStudents.length,
        importedCount: insertedStudents.length,
        failedCount: failedRows.length,
        importedStudents: insertedStudents,
        failedRows,
      },
      insertedStudents.length > 0 ? 201 : 200
    );
  } catch (error) {
    return handleControllerError(res, error);
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
      .select("name email phone branch semester percentage status skills createdAt")
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
    res.setHeader("Content-Disposition", 'attachment; filename="students_export.csv"');

    return res.status(200).send(csvOutput);
  } catch (error) {
    return handleControllerError(res, error);
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
    } else if (req.body && Array.isArray(req.body.studentIds) && req.body.updates && typeof req.body.updates === "object") {
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

      if (cleanUpdate.status !== undefined && !["Active", "Inactive"].includes(cleanUpdate.status)) {
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
        const updated = await Student.findByIdAndUpdate(studentId, cleanUpdate, {
          returnDocument: "after",
          runValidators: true,
        }).select("-password");

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
      percentage: req.body.percentage !== undefined ? Number(req.body.percentage) : 0,
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