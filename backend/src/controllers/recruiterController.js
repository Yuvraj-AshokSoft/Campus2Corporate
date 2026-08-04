import Recruiter from "../models/recruiter.js";
import Company from "../models/company.js";
import Project from "../models/project.js";
import Application from "../models/application.js";
import Student from "../models/student.js";
import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// ==========================================
// AUTHENTICATION
// ==========================================

// Register Recruiter
export const registerRecruiter = async (req, res) => {
  try {
    const { name, email, phone, password, designation, companyName, companyId, website, location, industry, linkedin } = req.body;

    if (!name || !email || !phone || !password || !designation) {
      return errorResponse(res, "Please provide all required fields: name, email, phone, password, designation", 400);
    }

    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return errorResponse(res, "An account with this email already exists", 400);
    }

    let targetCompanyId = companyId;

    // If companyId is not provided, check or create Company by companyName
    if (!targetCompanyId) {
      if (!companyName) {
        return errorResponse(res, "Please specify a company name or select an existing company", 400);
      }

      let company = await Company.findOne({ name: { $regex: new RegExp(`^${companyName}$`, "i") } });
      if (!company) {
        company = await Company.create({
          name: companyName,
          industry: industry || "Technology",
          website: website || "",
          location: location || "",
          email: email,
          phone: phone,
        });
      }
      targetCompanyId = company._id;
    }

    const recruiter = await Recruiter.create({
      name,
      email,
      phone,
      password,
      designation,
      company: targetCompanyId,
      linkedin: linkedin || "",
      status: "Active",
    });

    // Append recruiter to company's recruiter list
    await Company.findByIdAndUpdate(targetCompanyId, {
      $addToSet: { recruiters: recruiter._id },
    });

    const token = generateToken(recruiter._id, "recruiter");
    const populatedRecruiter = await Recruiter.findById(recruiter._id).select("-password").populate("company");

    return successResponse(
      res,
      "Recruiter registered successfully",
      {
        token,
        recruiter: populatedRecruiter,
      },
      201
    );
  } catch (error) {
    console.error("Recruiter register error:", error);
    return errorResponse(res, error.message || "Registration failed", 500);
  }
};

// Login Recruiter
export const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Please provide email and password", 400);
    }

    const recruiter = await Recruiter.findOne({ email }).select("+password").populate("company");
    if (!recruiter) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isMatch = await recruiter.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (recruiter.status === "Inactive") {
      return errorResponse(res, "Account is inactive. Please contact support.", 403);
    }

    const token = generateToken(recruiter._id, "recruiter");
    recruiter.password = undefined;

    return successResponse(
      res,
      "Login successful",
      {
        token,
        recruiter,
      },
      200
    );
  } catch (error) {
    console.error("Recruiter login error:", error);
    return errorResponse(res, error.message || "Login failed", 500);
  }
};

// Get Current Recruiter Profile
export const getRecruiterProfile = async (req, res) => {
  try {
    return successResponse(
      res,
      "Recruiter profile fetched successfully",
      req.recruiter,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Recruiter Profile
export const updateRecruiterProfile = async (req, res) => {
  try {
    const { name, phone, designation, linkedin, companyDetails } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (designation) updates.designation = designation;
    if (linkedin !== undefined) updates.linkedin = linkedin;

    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("company");

    if (companyDetails && req.recruiter.company) {
      await Company.findByIdAndUpdate(
        req.recruiter.company._id,
        { $set: companyDetails },
        { new: true }
      );
    }

    return successResponse(
      res,
      "Profile updated successfully",
      updatedRecruiter,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// DASHBOARD ANALYTICS
// ==========================================

export const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Total and active jobs posted by this recruiter
    const totalJobs = await Project.countDocuments({ recruiter: recruiterId });
    const activeDrives = await Project.countDocuments({ recruiter: recruiterId, status: "Open" });

    // Total applications for recruiter's projects
    const totalApplications = await Application.countDocuments({ recruiter: recruiterId });
    const pendingReviews = await Application.countDocuments({ recruiter: recruiterId, status: "Applied" });
    const shortlistedCandidates = await Application.countDocuments({ recruiter: recruiterId, status: "Shortlisted" });
    const interviewsScheduled = await Application.countDocuments({ recruiter: recruiterId, status: "Interview" });
    const selectedCandidates = await Application.countDocuments({ recruiter: recruiterId, status: "Selected" });

    // Total candidates in platform
    const totalCandidatesInPool = await Student.countDocuments({ status: "Active" });

    // Recent applications for candidate pipeline table
    const recentApplications = await Application.find({ recruiter: recruiterId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("student", "name email phone branch semester skills resume resumeUrl college")
      .populate({ path: "student", populate: { path: "college", select: "name" } })
      .populate("project", "title mode location stipend");

    // Upcoming interviews
    const upcomingInterviews = await Application.find({ recruiter: recruiterId, status: "Interview" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("student", "name email phone branch college")
      .populate({ path: "student", populate: { path: "college", select: "name" } })
      .populate("project", "title");

    return successResponse(
      res,
      "Dashboard metrics fetched successfully",
      {
        stats: {
          totalJobs,
          activeDrives,
          totalApplications,
          pendingReviews,
          shortlistedCandidates,
          interviewsScheduled,
          selectedCandidates,
          totalCandidatesInPool,
        },
        recentApplications,
        upcomingInterviews,
        company: req.recruiter.company,
      },
      200
    );
  } catch (error) {
    console.error("Recruiter dashboard error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// JOB MANAGEMENT (PROJECT CRUD)
// ==========================================

// Create Job Post
export const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, duration, stipend, location, mode, openings, applicationDeadline } = req.body;

    if (!title || !description || !requiredSkills || !duration || stipend === undefined || !location || !applicationDeadline) {
      return errorResponse(res, "Please provide all required job fields", 400);
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);

    const project = await Project.create({
      title,
      description,
      recruiter: req.user.id,
      company: req.recruiter.company._id || req.recruiter.company,
      requiredSkills: skillsArray,
      duration,
      stipend: Number(stipend),
      location,
      mode: mode || "On-site",
      openings: Number(openings) || 1,
      applicationDeadline: new Date(applicationDeadline),
      status: "Open",
    });

    const populatedProject = await Project.findById(project._id)
      .populate("company", "name industry location")
      .populate("recruiter", "name email designation");

    return successResponse(
      res,
      "Job post created successfully",
      populatedProject,
      201
    );
  } catch (error) {
    console.error("Create job error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// Get All Jobs Posted by Logged-In Recruiter
export const getRecruiterJobs = async (req, res) => {
  try {
    const projects = await Project.find({ recruiter: req.user.id })
      .sort({ createdAt: -1 })
      .populate("company", "name location industry");

    // Enhance each job with application counts
    const jobsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const applicantCount = await Application.countDocuments({ project: project._id });
        return {
          ...project.toObject(),
          applicantCount,
        };
      })
    );

    return successResponse(
      res,
      "Recruiter jobs fetched successfully",
      jobsWithCounts,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Single Job By ID
export const getJobById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, recruiter: req.user.id })
      .populate("company", "name location industry website")
      .populate("recruiter", "name email designation");

    if (!project) {
      return errorResponse(res, "Job post not found or access unauthorized", 404);
    }

    const applications = await Application.find({ project: project._id })
      .populate("student", "name email phone branch semester skills resumeUrl college")
      .populate({ path: "student", populate: { path: "college", select: "name" } });

    return successResponse(
      res,
      "Job details fetched successfully",
      {
        project,
        applications,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update Job Post
export const updateJob = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, recruiter: req.user.id });

    if (!project) {
      return errorResponse(res, "Job post not found or access unauthorized", 404);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("company", "name location")
      .populate("recruiter", "name email");

    return successResponse(
      res,
      "Job post updated successfully",
      updatedProject,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Delete / Close Job Post
export const deleteJob = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, recruiter: req.user.id });

    if (!project) {
      return errorResponse(res, "Job post not found or access unauthorized", 404);
    }

    return successResponse(
      res,
      "Job post deleted successfully",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// APPLICATION MANAGEMENT
// ==========================================

// Get All Applications Received for Recruiter's Jobs
export const getRecruiterApplications = async (req, res) => {
  try {
    const { status, projectId } = req.query;

    const query = { recruiter: req.user.id };
    if (status) query.status = status;
    if (projectId) query.project = projectId;

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .populate("student", "name email phone branch semester skills resume resumeUrl bio location college")
      .populate({ path: "student", populate: { path: "college", select: "name" } })
      .populate("project", "title mode location stipend duration status");

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

// Update Application Status (Under Review, Shortlisted, Interview, Selected, Rejected)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];

    if (!status || !allowedStatuses.includes(status)) {
      return errorResponse(
        res,
        `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        400
      );
    }

    const application = await Application.findOne({
      _id: req.params.id,
      recruiter: req.user.id,
    });

    if (!application) {
      return errorResponse(res, "Application not found or unauthorized", 404);
    }

    application.status = status;
    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate("student", "name email phone branch semester skills college")
      .populate({ path: "student", populate: { path: "college", select: "name" } })
      .populate("project", "title mode location");

    return successResponse(
      res,
      `Application status updated to ${status}`,
      updatedApplication,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// CANDIDATE SEARCH & TALENT POOL
// ==========================================

export const getCandidates = async (req, res) => {
  try {
    const { search, skill, branch } = req.query;

    const query = { status: "Active" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }

    if (skill) {
      query.skills = { $regex: skill, $options: "i" };
    }

    if (branch) {
      query.branch = { $regex: branch, $options: "i" };
    }

    const candidates = await Student.find(query)
      .select("-password")
      .populate("college", "name location")
      .sort({ createdAt: -1 })
      .limit(50);

    return successResponse(
      res,
      "Candidates fetched successfully",
      candidates,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==========================================
// INTERVIEWS QUEUE
// ==========================================

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Application.find({
      recruiter: req.user.id,
      status: "Interview",
    })
      .sort({ updatedAt: -1 })
      .populate("student", "name email phone branch college skills resumeUrl")
      .populate({ path: "student", populate: { path: "college", select: "name" } })
      .populate("project", "title mode location stipend");

    return successResponse(
      res,
      "Interviews fetched successfully",
      interviews,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
