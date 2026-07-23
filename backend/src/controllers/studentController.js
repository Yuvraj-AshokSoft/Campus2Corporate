import mongoose from "mongoose";
import Student from "../models/student.js";
import Project from "../models/project.js";
import Application from "../models/application.js";
import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const clampPercentage = (value) => {
  const parsed = toNumber(value);
  if (parsed === undefined) {
    return undefined;
  }

  return Math.min(100, Math.max(0, parsed));
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const isStudentRole = (role) => !role || String(role).toLowerCase() === "student";

const publicStudent = (student) => ({
  id: student._id,
  name: student.name,
  fullName: student.name,
  email: student.email,
  phone: student.phone,
  role: "student",
  college: student.college,
  branch: student.branch,
  semester: student.semester,
  skills: student.skills || [],
  skillDetails: student.skillDetails || [],
  interests: student.interests || [],
  education: student.education || [],
  resume: student.resume,
  resumeUrl: student.resumeUrl || student.resume,
  bio: student.bio,
  location: student.location,
  linkedIn: student.linkedIn,
  github: student.github,
  portfolio: student.portfolio,
  status: student.status,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
});

const authPayload = (student, message, statusCode, res) => {
  const token = generateToken(student);
  const profile = publicStudent(student);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    student: profile,
    user: profile,
    data: {
      token,
      student: profile,
    },
  });
};

const getAuthenticatedStudent = async (req, res) => {
  const studentId = req.user?.id || req.student?._id;

  if (!studentId) {
    errorResponse(res, "Authentication required", 401);
    return null;
  }

  const student = await Student.findById(studentId).select("+password");

  if (!student) {
    errorResponse(res, "Student account not found", 404);
    return null;
  }

  return student;
};

const syncSkillNames = (student) => {
  const skillNames = new Set();

  for (const skill of student.skills || []) {
    if (skill) {
      skillNames.add(String(skill).trim());
    }
  }

  for (const skill of student.skillDetails || []) {
    if (skill.name) {
      skillNames.add(skill.name.trim());
    }
  }

  student.skills = [...skillNames].filter(Boolean);
};

const findSkill = (student, skillIdOrName) => {
  const needle = String(skillIdOrName || "").trim().toLowerCase();

  return student.skillDetails.find(
    (skill) =>
      skill._id?.toString() === skillIdOrName ||
      skill.name.toLowerCase() === needle
  );
};

const buildSkillList = (student) => {
  const mapped = new Map();

  for (const skill of student.skillDetails || []) {
    mapped.set(skill.name.toLowerCase(), skill);
  }

  for (const skillName of student.skills || []) {
    const key = String(skillName).toLowerCase();
    if (!mapped.has(key)) {
      mapped.set(key, {
        id: key,
        _id: key,
        name: skillName,
        proficiency: 0,
        category: "",
        yearsOfExperience: 0,
      });
    }
  }

  return [...mapped.values()];
};

const average = (values) => {
  const numericValues = values.filter((value) => Number.isFinite(value));
  if (!numericValues.length) {
    return 0;
  }

  return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
};

const calculateScoreBreakdown = (student) => {
  const skillValues = (student.skillDetails || []).map((skill) =>
    clampPercentage(skill.proficiency)
  );
  const fallbackSkillScore = Math.min((student.skills || []).length * 10, 100);
  const skillsScore = skillValues.length ? average(skillValues) : fallbackSkillScore;

  const learningScore = average(
    (student.learningProgress || []).map((module) =>
      clampPercentage(module.progressPercentage)
    )
  );
  const assignmentScore = average(
    (student.assignmentSubmissions || []).map((submission) =>
      clampPercentage(submission.score)
    )
  );
  const quizScore = average(
    (student.quizSubmissions || []).map((submission) =>
      clampPercentage(submission.score)
    )
  );

  const weights = {
    skills: 0.4,
    learningProgress: 0.25,
    assignments: 0.2,
    quizzes: 0.15,
  };

  const total =
    skillsScore * weights.skills +
    learningScore * weights.learningProgress +
    assignmentScore * weights.assignments +
    quizScore * weights.quizzes;

  const skillScore = Math.round(total);

  return {
    skillScore,
    eligibilityStatus: skillScore >= 70 ? "Eligible" : "Not Eligible",
    breakdown: {
      skills: {
        score: Math.round(skillsScore),
        weight: weights.skills,
        count: skillValues.length || (student.skills || []).length,
      },
      learningProgress: {
        score: Math.round(learningScore),
        weight: weights.learningProgress,
        count: (student.learningProgress || []).length,
      },
      assignments: {
        score: Math.round(assignmentScore),
        weight: weights.assignments,
        count: (student.assignmentSubmissions || []).length,
      },
      quizzes: {
        score: Math.round(quizScore),
        weight: weights.quizzes,
        count: (student.quizSubmissions || []).length,
      },
    },
  };
};

const formatShortDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const formatLongDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const relativeTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) return `${Math.max(1, Math.round(diffMs / minute))}m ago`;
  if (diffMs < day) return `${Math.round(diffMs / hour)}h ago`;
  return `${Math.round(diffMs / day)}d ago`;
};

const normalizeApplicationStatus = (status) => {
  const map = {
    Applied: "Applied",
    "Under Review": "Under Review",
    Shortlisted: "Under Review",
    Interview: "Interview Scheduled",
    Selected: "Accepted",
    Rejected: "Rejected",
  };

  return map[status] || "Applied";
};

const projectCategory = (project) => {
  const source = [
    project.company?.industry,
    ...(project.requiredSkills || []),
    project.title,
    project.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/data|analytics|python|sql|power|tableau/.test(source)) return "Data Science";
  if (/ai|ml|machine|learning|nlp/.test(source)) return "AI / ML";
  if (/mobile|android|ios|react native|flutter/.test(source)) return "Mobile";
  if (/backend|node|express|api|mongo|java|spring/.test(source)) return "Backend";
  if (/frontend|react|ui|css|tailwind/.test(source)) return "Frontend";
  return "Full Stack";
};

const projectDifficulty = (project) => {
  const skillCount = (project.requiredSkills || []).length;
  if (skillCount >= 5) return "Advanced";
  if (skillCount >= 3) return "Intermediate";
  return "Beginner";
};

const projectView = (project, applicationCount = 0) => ({
  id: project._id.toString(),
  title: project.title,
  company: project.company?.name || "Company",
  companyId: project.company?._id?.toString(),
  recruiterId: project.recruiter?._id?.toString?.() || project.recruiter?.toString?.(),
  category: projectCategory(project),
  difficulty: projectDifficulty(project),
  duration: project.duration,
  techStack: project.requiredSkills || [],
  description: project.description,
  requirements: project.requiredSkills || [],
  applicants: applicationCount,
  slots: project.openings,
  deadline: formatShortDate(project.applicationDeadline),
  rawDeadline: project.applicationDeadline,
  stipend:
    Number(project.stipend) > 0
      ? `₹${Number(project.stipend).toLocaleString("en-IN")}/mo`
      : "Unpaid · Certificate",
  location: project.location,
  mode: project.mode,
  status: project.status,
  featured: applicationCount > 0,
});

const applicationView = (application) => {
  const project = application.project;

  return {
    id: application._id.toString(),
    projectId: project?._id?.toString?.() || "",
    title: project?.title || "Project application",
    company: application.company?.name || project?.company?.name || "Company",
    location: project?.location || application.company?.location || "",
    appliedOn: formatLongDate(application.createdAt),
    status: normalizeApplicationStatus(application.status),
    stipend:
      project && Number(project.stipend) > 0
        ? `₹${Number(project.stipend).toLocaleString("en-IN")}/mo`
        : "Unpaid · Certificate",
    skills: project?.requiredSkills || [],
    resume: application.resume,
    coverLetter: application.coverLetter,
  };
};

const defaultResumeData = (student) => ({
  fullName: student.name || "",
  title: [student.semester ? `Semester ${student.semester}` : "", student.branch].filter(Boolean).join(" · "),
  email: student.email || "",
  phone: student.phone || "",
  location: student.location || "",
  linkedin: student.linkedIn || "",
  github: student.github || "",
  targetRole: "",
  summary: student.bio || "",
  skills: student.skills || [],
  education: (student.education || []).map((entry) => ({
    id: entry._id?.toString() || new mongoose.Types.ObjectId().toString(),
    degree: entry.degree || "",
    institution: entry.institution || "",
    duration: [entry.startYear, entry.endYear].filter(Boolean).join(" - "),
    gpa: entry.grade || "",
  })),
  experience: [],
  certifications: (student.certificates || []).map((certificate) => ({
    id: certificate._id?.toString() || new mongoose.Types.ObjectId().toString(),
    name: certificate.title,
    issuer: certificate.issuer,
    date: formatLongDate(certificate.issuedOn),
  })),
});

const buildSettingsPayload = (student) => ({
  email: student.email,
  settings: {
    notifications: {
      email: student.settings?.notifications?.email ?? true,
      sms: student.settings?.notifications?.sms ?? false,
      assignments: student.settings?.notifications?.assignments ?? true,
      assessments: student.settings?.notifications?.assessments ?? true,
      mentorSessions: student.settings?.notifications?.mentorSessions ?? true,
      interviews: student.settings?.notifications?.interviews ?? true,
      achievements: student.settings?.notifications?.achievements ?? false,
      push: student.settings?.notifications?.push ?? true,
      marketing: student.settings?.notifications?.marketing ?? true,
    },
    privacy: {
      recruiterVisible: student.settings?.privacy?.recruiterVisible ?? true,
      profileVisibleToRecruiters:
        student.settings?.privacy?.profileVisibleToRecruiters ?? true,
      leaderboard: student.settings?.privacy?.leaderboard ?? true,
      showActivityStatus: student.settings?.privacy?.showActivityStatus ?? true,
      shareDataWithPartners: student.settings?.privacy?.shareDataWithPartners ?? false,
      twoFactor: student.settings?.privacy?.twoFactor ?? false,
      twoFactorAuth: student.settings?.privacy?.twoFactorAuth ?? false,
    },
    theme: student.settings?.theme || "light",
    connectedAccounts: {
      github: student.settings?.connectedAccounts?.github ?? false,
      linkedIn: student.settings?.connectedAccounts?.linkedIn ?? false,
    },
  },
});

export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      phone,
      password,
      role,
      college,
      branch,
      semester,
    } = req.body;

    const displayName = String(name || fullName || "").trim();
    const normalizedEmail = normalizeEmail(email);

    if (!isStudentRole(role)) {
      return errorResponse(res, "This endpoint supports student registration only", 400);
    }

    if (!displayName || !normalizedEmail || !password) {
      return errorResponse(res, "Name, email, and password are required", 400);
    }

    if (!emailRegex.test(normalizedEmail)) {
      return errorResponse(res, "Please provide a valid email address", 400);
    }

    if (String(password).length < 8) {
      return errorResponse(res, "Password must be at least 8 characters long", 400);
    }

    if (college && !isValidObjectId(college)) {
      return errorResponse(res, "Invalid college id", 400);
    }

    const existingStudent = await Student.findOne({ email: normalizedEmail });
    if (existingStudent) {
      return errorResponse(res, "A student with this email already exists", 409);
    }

    const student = await Student.create({
      name: displayName,
      email: normalizedEmail,
      phone,
      password,
      college: college || undefined,
      branch,
      semester: toNumber(semester),
    });

    return authPayload(student, "Student registered successfully", 201, res);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, "A student with this email already exists", 409);
    }

    return errorResponse(res, error.message || "Student registration failed", 500);
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!isStudentRole(role)) {
      return errorResponse(res, "This endpoint supports student login only", 400);
    }

    if (!normalizedEmail || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const student = await Student.findOne({ email: normalizedEmail }).select("+password");

    if (!student || !(await student.comparePassword(password))) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (student.status !== "Active") {
      return errorResponse(res, "Student account is inactive", 403);
    }

    return authPayload(student, "Student logged in successfully", 200, res);
  } catch (error) {
    return errorResponse(res, error.message || "Student login failed", 500);
  }
};

export const logoutStudent = (req, res) =>
  successResponse(res, "Logged out successfully", { token: null });

export const getStudentProfile = async (req, res) => {
  try {
    return successResponse(res, "Student profile fetched successfully", {
      student: publicStudent(req.student),
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to fetch student profile", 500);
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) {
      return null;
    }

    const allowedFields = [
      "name",
      "fullName",
      "phone",
      "college",
      "branch",
      "semester",
      "resume",
      "resumeUrl",
      "bio",
      "location",
      "linkedIn",
      "github",
      "portfolio",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "fullName") {
          student.name = String(req.body[field]).trim();
        } else if (field === "semester") {
          student.semester = toNumber(req.body[field]);
        } else if (field === "college") {
          if (req.body[field] && !isValidObjectId(req.body[field])) {
            return errorResponse(res, "Invalid college id", 400);
          }
          student.college = req.body[field] || undefined;
        } else {
          student[field] = req.body[field];
        }
      }
    }

    if (Array.isArray(req.body.interests)) {
      student.interests = req.body.interests.map((interest) => String(interest).trim()).filter(Boolean);
    }

    if (Array.isArray(req.body.education)) {
      student.education = req.body.education;
    }

    if (Array.isArray(req.body.skills)) {
      student.skills = req.body.skills.map((skill) => String(skill).trim()).filter(Boolean);
    }

    if (student.resumeUrl && !student.resume) {
      student.resume = student.resumeUrl;
    }

    if (student.resume && !student.resumeUrl) {
      student.resumeUrl = student.resume;
    }

    syncSkillNames(student);
    await student.save();

    return successResponse(res, "Student profile updated successfully", {
      student: publicStudent(student),
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to update student profile", 500);
  }
};

export const getStudentSkills = async (req, res) => {
  try {
    return successResponse(res, "Student skills fetched successfully", {
      skills: buildSkillList(req.student),
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to fetch student skills", 500);
  }
};

export const addStudentSkill = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) {
      return null;
    }

    const name = String(req.body.name || req.body.skill || "").trim();
    const proficiency = clampPercentage(req.body.proficiency) ?? 0;

    if (!name) {
      return errorResponse(res, "Skill name is required", 400);
    }

    const stringSkillExists = (student.skills || []).some(
      (skill) => String(skill).toLowerCase() === name.toLowerCase()
    );

    if (findSkill(student, name) || stringSkillExists) {
      return errorResponse(res, "Skill already exists", 409);
    }

    student.skillDetails.push({
      name,
      proficiency,
      category: req.body.category,
      yearsOfExperience: toNumber(req.body.yearsOfExperience) || 0,
    });
    syncSkillNames(student);
    await student.save();

    return successResponse(res, "Skill added successfully", {
      skill: student.skillDetails[student.skillDetails.length - 1],
      skills: buildSkillList(student),
    }, 201);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to add skill", 500);
  }
};

export const updateStudentSkill = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) {
      return null;
    }

    const skill = findSkill(student, req.params.skillId || req.body.skillId || req.body.name);
    let skillToUpdate = skill;

    if (!skillToUpdate) {
      const existingSkillName = (student.skills || []).find(
        (name) =>
          String(name).toLowerCase() ===
          String(req.params.skillId || req.body.skillId || req.body.name).toLowerCase()
      );

      if (!existingSkillName) {
        return errorResponse(res, "Skill not found", 404);
      }

      student.skillDetails.push({
        name: existingSkillName,
        proficiency: 0,
      });
      skillToUpdate = student.skillDetails[student.skillDetails.length - 1];
    }

    if (req.body.name !== undefined) {
      const nextName = String(req.body.name).trim();
      const duplicate = student.skillDetails.find(
        (item) =>
          item._id.toString() !== skillToUpdate._id.toString() &&
          item.name.toLowerCase() === nextName.toLowerCase()
      );

      if (duplicate) {
        return errorResponse(res, "Another skill with this name already exists", 409);
      }

      skillToUpdate.name = nextName;
    }

    if (req.body.proficiency !== undefined) {
      skillToUpdate.proficiency = clampPercentage(req.body.proficiency);
    }

    if (req.body.category !== undefined) {
      skillToUpdate.category = req.body.category;
    }

    if (req.body.yearsOfExperience !== undefined) {
      skillToUpdate.yearsOfExperience = toNumber(req.body.yearsOfExperience) || 0;
    }

    syncSkillNames(student);
    await student.save();

    return successResponse(res, "Skill updated successfully", {
      skill: skillToUpdate,
      skills: buildSkillList(student),
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to update skill", 500);
  }
};

export const deleteStudentSkill = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) {
      return null;
    }

    const skill = findSkill(student, req.params.skillId || req.body.skillId || req.body.name);
    const skillName = skill?.name || req.params.skillId || req.body.name;
    const hadStringSkill = (student.skills || []).some(
      (name) => String(name).toLowerCase() === String(skillName).toLowerCase()
    );

    if (skill) {
      student.skillDetails.pull(skill._id);
    }

    student.skills = (student.skills || []).filter(
      (name) => String(name).toLowerCase() !== String(skillName).toLowerCase()
    );

    if (!skill && !hadStringSkill) {
      return errorResponse(res, "Skill not found", 404);
    }

    syncSkillNames(student);
    await student.save();

    return successResponse(res, "Skill deleted successfully", {
      skills: buildSkillList(student),
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to delete skill", 500);
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    const [applications, projectsClosingSoon] = await Promise.all([
      Application.find({ student: req.student._id }).populate("project company"),
      Project.countDocuments({
        status: "Open",
        applicationDeadline: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    const modules = (req.student.learningProgress || []).map((module, index) => ({
      id: module.moduleId,
      title: module.title,
      category: module.description || "Learning module",
      progress: module.progressPercentage || 0,
      status: module.status,
      color: ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e"][index % 5],
    }));

    const completedModules = modules.filter((module) => module.status === "completed").length;
    const pendingModules = modules.filter((module) => module.status !== "completed").length;
    const certificates = req.student.certificates || [];
    const unreadNotifications = (req.student.notifications || []).filter(
      (notification) => !notification.read
    ).length;
    const latestScore = calculateScoreBreakdown(req.student).skillScore;
    const performanceData = (req.student.scoreHistory || []).slice(-6).map((entry) => ({
      month: new Date(entry.calculatedAt).toLocaleDateString("en-IN", { month: "short" }),
      score: entry.score,
    }));

    const upcomingActivities = [
      ...(req.student.learningProgress || [])
        .filter((module) => module.status !== "completed")
        .slice(0, 4)
        .map((module) => ({
          id: module.moduleId,
          title: module.title,
          desc: module.description || "Learning module in progress",
          date: `${module.progressPercentage || 0}% complete`,
          tone: module.progressPercentage >= 75 ? "Low" : "Normal",
        })),
      ...(req.student.notifications || [])
        .filter((notification) => !notification.read)
        .slice(0, 4)
        .map((notification) => ({
          id: notification._id.toString(),
          title: notification.title,
          desc: notification.desc,
          date: relativeTime(notification.createdAt),
          tone: "Medium",
        })),
    ].slice(0, 4);

    return successResponse(res, "Student dashboard fetched successfully", {
      profile: publicStudent(req.student),
      stats: {
        registeredCourses: modules.length,
        completed: completedModules,
        pending: pendingModules,
        certificates: certificates.length,
        appliedProjects: applications.length,
        unreadNotifications,
        closingThisWeek: projectsClosingSoon,
        learningScore: latestScore,
      },
      modules,
      performanceData,
      upcomingActivities,
      recentActivities: (req.student.notifications || []).slice(0, 5).map((notification) => ({
        id: notification._id.toString(),
        title: notification.title,
        desc: notification.desc,
        time: relativeTime(notification.createdAt),
        read: notification.read,
      })),
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to fetch student dashboard", 500);
  }
};

export const getAvailableProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "Open" })
      .populate("company")
      .sort({ createdAt: -1 });

    const counts = await Application.aggregate([
      { $match: { project: { $in: projects.map((project) => project._id) } } },
      { $group: { _id: "$project", count: { $sum: 1 } } },
    ]);

    const countByProject = new Map(
      counts.map((item) => [item._id.toString(), item.count])
    );

    const applications = await Application.find({ student: req.student._id }).select("project");
    const appliedProjectIds = applications
      .map((application) => application.project?.toString())
      .filter(Boolean);

    return successResponse(res, "Projects fetched successfully", {
      projects: projects.map((project) =>
        projectView(project, countByProject.get(project._id.toString()) || 0)
      ),
      appliedProjectIds,
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to fetch projects", 500);
  }
};

export const applyToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("company");
    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    if (project.status !== "Open") {
      return errorResponse(res, "Project is not open for applications", 400);
    }

    const existing = await Application.findOne({
      student: req.student._id,
      project: project._id,
    });

    if (existing) {
      const populatedExisting = await Application.findById(existing._id).populate("project company");
      return successResponse(res, "Application already exists", {
        application: applicationView(populatedExisting),
      });
    }

    const application = await Application.create({
      student: req.student._id,
      recruiter: project.recruiter,
      company: project.company,
      project: project._id,
      resume: req.body.resume || req.student.resumeUrl || req.student.resume,
      coverLetter: req.body.coverLetter,
    });

    req.student.notifications.push({
      type: "system",
      title: "Application submitted",
      desc: `Your application for ${project.title} was submitted successfully.`,
      read: false,
    });
    await req.student.save();

    const populated = await Application.findById(application._id).populate("project company");
    return successResponse(
      res,
      "Application submitted successfully",
      { application: applicationView(populated) },
      201
    );
  } catch (error) {
    return errorResponse(res, error.message || "Failed to apply to project", 500);
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.student._id })
      .populate("project company")
      .sort({ createdAt: -1 });

    return successResponse(res, "Applications fetched successfully", {
      applications: applications.map(applicationView),
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to fetch applications", 500);
  }
};

export const getStudentNotifications = (req, res) =>
  successResponse(res, "Notifications fetched successfully", {
    notifications: (req.student.notifications || [])
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((notification) => ({
        id: notification._id.toString(),
        type: notification.type,
        title: notification.title,
        desc: notification.desc,
        time: relativeTime(notification.createdAt),
        read: notification.read,
        createdAt: notification.createdAt,
      })),
    preferences: buildSettingsPayload(req.student).settings.notifications,
    privacy: buildSettingsPayload(req.student).settings.privacy,
  });

export const markNotificationRead = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return null;

    if (req.params.notificationId === "all") {
      for (const notification of student.notifications || []) {
        notification.read = true;
      }
    } else {
      const notification = student.notifications.id(req.params.notificationId);
      if (!notification) {
        return errorResponse(res, "Notification not found", 404);
      }
      notification.read = true;
    }

    await student.save();
    return getStudentNotifications({ ...req, student }, res);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to update notification", 500);
  }
};

export const deleteStudentNotification = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return null;

    const notification = student.notifications.id(req.params.notificationId);
    if (!notification) {
      return errorResponse(res, "Notification not found", 404);
    }

    student.notifications.pull(notification._id);
    await student.save();
    return getStudentNotifications({ ...req, student }, res);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to delete notification", 500);
  }
};

export const getStudentCertificates = (req, res) => {
  const earned = (req.student.certificates || []).map((certificate, index) => ({
    id: certificate._id.toString(),
    title: certificate.title,
    issuer: certificate.issuer,
    issuedOn: formatLongDate(certificate.issuedOn || certificate.createdAt),
    credentialId: certificate.credentialId,
    downloadUrl: certificate.downloadUrl,
    shareUrl: certificate.shareUrl,
    color: certificate.color || ["#f59e0b", "#2563eb", "#10b981", "#8b5cf6"][index % 4],
    icon: certificate.icon || "award",
  }));

  const inProgress = (req.student.learningProgress || [])
    .filter((module) => module.status !== "completed")
    .map((module, index) => ({
      id: module.moduleId,
      title: module.title,
      progress: module.progressPercentage || 0,
      color: ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"][index % 4],
      icon: "book",
    }));

  return successResponse(res, "Certificates fetched successfully", {
    earned,
    inProgress,
  });
};

export const getStudentSettings = (req, res) =>
  successResponse(res, "Settings fetched successfully", buildSettingsPayload(req.student));

export const updateStudentSettings = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return null;

    if (req.body.email && normalizeEmail(req.body.email) !== student.email) {
      const email = normalizeEmail(req.body.email);
      if (!emailRegex.test(email)) {
        return errorResponse(res, "Please provide a valid email address", 400);
      }

      const existing = await Student.findOne({ email, _id: { $ne: student._id } });
      if (existing) {
        return errorResponse(res, "A student with this email already exists", 409);
      }

      student.email = email;
    }

    if (req.body.settings?.notifications) {
      student.settings.notifications = {
        ...(student.settings?.notifications?.toObject?.() || student.settings?.notifications || {}),
        ...req.body.settings.notifications,
      };
    }

    if (req.body.settings?.privacy) {
      student.settings.privacy = {
        ...(student.settings?.privacy?.toObject?.() || student.settings?.privacy || {}),
        ...req.body.settings.privacy,
      };
    }

    if (req.body.settings?.theme) {
      student.settings.theme = req.body.settings.theme;
    }

    if (req.body.currentPassword || req.body.newPassword) {
      if (!req.body.currentPassword || !req.body.newPassword) {
        return errorResponse(res, "Current and new password are required", 400);
      }

      if (!(await student.comparePassword(req.body.currentPassword))) {
        return errorResponse(res, "Current password is incorrect", 401);
      }

      if (String(req.body.newPassword).length < 8) {
        return errorResponse(res, "Password must be at least 8 characters long", 400);
      }

      student.password = req.body.newPassword;
    }

    await student.save();
    return successResponse(res, "Settings updated successfully", buildSettingsPayload(student));
  } catch (error) {
    return errorResponse(res, error.message || "Failed to update settings", 500);
  }
};

export const getResumeBuilder = (req, res) =>
  successResponse(res, "Resume builder fetched successfully", {
    resume: {
      ...defaultResumeData(req.student),
      ...(req.student.resumeBuilder?.toObject?.() || req.student.resumeBuilder || {}),
    },
    template: req.student.resumeBuilder?.template || "modern",
  });

export const saveResumeBuilder = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return null;

    student.resumeBuilder = {
      ...defaultResumeData(student),
      ...(student.resumeBuilder?.toObject?.() || student.resumeBuilder || {}),
      ...(req.body.resume || req.body),
      template: req.body.template || req.body.resume?.template || student.resumeBuilder?.template || "modern",
    };

    await student.save();
    return successResponse(res, "Resume builder saved successfully", {
      resume: student.resumeBuilder,
      template: student.resumeBuilder.template,
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to save resume builder", 500);
  }
};

export const getHiringDrives = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("company")
      .sort({ applicationDeadline: 1 });
    const applications = await Application.find({ student: req.student._id }).select("project status company");
    const appliedProjectIds = new Set(
      applications.map((application) => application.project?.toString()).filter(Boolean)
    );
    const shortlistedCount = applications.filter((application) =>
      ["Shortlisted", "Interview", "Selected"].includes(application.status)
    ).length;

    const drives = projects.map((project) => {
      const deadline = project.applicationDeadline ? new Date(project.applicationDeadline) : null;
      const isClosed =
        project.status === "Closed" ||
        (deadline && deadline.getTime() < Date.now());
      const closesSoon =
        deadline &&
        deadline.getTime() >= Date.now() &&
        deadline.getTime() <= Date.now() + 3 * 24 * 60 * 60 * 1000;

      return {
        id: project._id.toString(),
        company: project.company?.name || "Company",
        logoText: (project.company?.name || "C").slice(0, 3).toUpperCase(),
        logoGradient: "from-blue-500 to-cyan-500",
        category: projectCategory(project)
          .replace("AI / ML", "Analytics")
          .replace("Data Science", "Analytics"),
        roles: project.requiredSkills?.length ? project.requiredSkills.slice(0, 3) : [project.title],
        location: project.location,
        ctc:
          Number(project.stipend) > 0
            ? `₹${Number(project.stipend).toLocaleString("en-IN")}/mo`
            : "Unpaid",
        deadline: formatShortDate(project.applicationDeadline),
        status: isClosed ? "Closed" : closesSoon ? "Closing Soon" : "Open",
        applicants: 0,
        rounds: Math.max(2, Math.min(4, (project.requiredSkills || []).length)),
        eligibility: project.mode || "Open",
        applied: appliedProjectIds.has(project._id.toString()),
      };
    });

    return successResponse(res, "Hiring drives fetched successfully", {
      drives,
      appliedCount: applications.length,
      shortlistedCount,
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to fetch hiring drives", 500);
  }
};

export const getLearningModules = (req, res) =>
  successResponse(res, "Learning modules fetched successfully", {
    modules: req.student.learningProgress || [],
  });

export const updateLearningProgress = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) {
      return null;
    }

    const moduleId = String(req.params.moduleId || req.body.moduleId || "").trim();
    const title = String(req.body.title || req.body.moduleTitle || moduleId).trim();
    const progressPercentage = clampPercentage(req.body.progressPercentage);

    if (!moduleId) {
      return errorResponse(res, "Module id is required", 400);
    }

    if (progressPercentage === undefined) {
      return errorResponse(res, "Progress percentage is required", 400);
    }

    let module = student.learningProgress.find((item) => item.moduleId === moduleId);
    const status = progressPercentage >= 100 ? "completed" : progressPercentage > 0 ? "in-progress" : "enrolled";

    if (!module) {
      student.learningProgress.push({
        moduleId,
        title,
        description: req.body.description,
        progressPercentage,
        status,
        completedAt: status === "completed" ? new Date() : undefined,
        history: [{ progressPercentage, status, note: req.body.note }],
      });
      module = student.learningProgress[student.learningProgress.length - 1];
    } else {
      module.title = title || module.title;
      if (req.body.description !== undefined) {
        module.description = req.body.description;
      }
      module.progressPercentage = progressPercentage;
      module.status = status;
      module.completedAt = status === "completed" ? new Date() : undefined;
      module.history.push({ progressPercentage, status, note: req.body.note });
    }

    await student.save();

    return successResponse(res, "Learning progress updated successfully", {
      module,
      modules: student.learningProgress,
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to update learning progress", 500);
  }
};

export const markModuleComplete = async (req, res) => {
  req.body = req.body || {};
  req.body.progressPercentage = 100;
  return updateLearningProgress(req, res);
};

export const getLearningProgressHistory = (req, res) => {
  const moduleId = req.params.moduleId || req.query.moduleId;
  const modules = moduleId
    ? (req.student.learningProgress || []).filter((module) => module.moduleId === moduleId)
    : req.student.learningProgress || [];

  return successResponse(res, "Learning progress history fetched successfully", {
    history: modules.flatMap((module) =>
      (module.history || []).map((entry) => {
        const historyEntry = entry.toObject?.() || entry;

        return {
          moduleId: module.moduleId,
          title: module.title,
          ...historyEntry,
        };
      })
    ),
  });
};

export const getAssignments = (req, res) =>
  successResponse(res, "Assignments fetched successfully", {
    assignments: req.student.assignmentSubmissions || [],
  });

export const submitAssignment = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) {
      return null;
    }

    const assignmentId = String(req.params.assignmentId || req.body.assignmentId || "").trim();
    if (!assignmentId) {
      return errorResponse(res, "Assignment id is required", 400);
    }

    const duplicate = student.assignmentSubmissions.find(
      (submission) => submission.assignmentId === assignmentId
    );

    if (duplicate && !req.body.allowResubmit) {
      return errorResponse(res, "Assignment already submitted", 409);
    }

    const score = clampPercentage(req.body.score);

    const payload = {
      assignmentId,
      title: req.body.title,
      content: req.body.content,
      submissionUrl: req.body.submissionUrl,
      answers: req.body.answers,
      score,
      status: score === undefined ? "submitted" : "graded",
      feedback: req.body.feedback,
      submittedAt: new Date(),
    };

    let submission = duplicate;
    if (duplicate) {
      Object.assign(duplicate, payload);
    } else {
      student.assignmentSubmissions.push(payload);
      submission = student.assignmentSubmissions[student.assignmentSubmissions.length - 1];
    }

    await student.save();

    return successResponse(res, "Assignment submitted successfully", {
      submission,
    }, duplicate ? 200 : 201);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to submit assignment", 500);
  }
};

export const getQuizzes = (req, res) =>
  successResponse(res, "Quizzes fetched successfully", {
    quizzes: req.student.quizSubmissions || [],
  });

export const submitQuiz = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) {
      return null;
    }

    const quizId = String(req.params.quizId || req.body.quizId || "").trim();
    if (!quizId) {
      return errorResponse(res, "Quiz id is required", 400);
    }

    if (req.body.answers === undefined) {
      return errorResponse(res, "Quiz answers are required", 400);
    }

    const duplicate = student.quizSubmissions.find((submission) => submission.quizId === quizId);
    if (duplicate && !req.body.allowResubmit) {
      return errorResponse(res, "Quiz already submitted", 409);
    }

    const totalQuestions = toNumber(req.body.totalQuestions);
    const correctAnswers = toNumber(req.body.correctAnswers);
    const calculatedScore =
      totalQuestions && correctAnswers !== undefined
        ? (correctAnswers / totalQuestions) * 100
        : undefined;
    const score = clampPercentage(req.body.score ?? calculatedScore);

    const payload = {
      quizId,
      title: req.body.title,
      answers: req.body.answers,
      score,
      totalQuestions,
      correctAnswers,
      submittedAt: new Date(),
    };

    let submission = duplicate;
    if (duplicate) {
      Object.assign(duplicate, payload);
    } else {
      student.quizSubmissions.push(payload);
      submission = student.quizSubmissions[student.quizSubmissions.length - 1];
    }

    await student.save();

    return successResponse(res, "Quiz submitted successfully", {
      submission,
    }, duplicate ? 200 : 201);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to submit quiz", 500);
  }
};

export const getSkillScore = async (req, res) => {
  try {
    const result = calculateScoreBreakdown(req.student);

    return successResponse(res, "Skill score calculated successfully", result);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to calculate skill score", 500);
  }
};

export const calculateAndStoreSkillScore = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) {
      return null;
    }

    const result = calculateScoreBreakdown(student);

    student.scoreHistory.push({
      score: result.skillScore,
      eligibilityStatus: result.eligibilityStatus,
      breakdown: result.breakdown,
    });

    await student.save();

    return successResponse(res, "Skill score calculated and stored successfully", result);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to store skill score", 500);
  }
};
