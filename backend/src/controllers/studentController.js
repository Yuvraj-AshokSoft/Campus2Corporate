import mongoose from "mongoose";
import Student from "../models/student.js";
import Application from "../models/application.js";
import Project from "../models/project.js";
import AIInterview from "../models/AIInterview.js";
import generateToken from "../utils/generateToken.js";
import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

const emailRegex =
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

const toNumber = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
};

const clampPercentage = (value) => {
  const parsed = toNumber(value);

  if (parsed === undefined) {
    return undefined;
  }

  return Math.min(100, Math.max(0, parsed));
};

const isValidObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value);

const isStudentRole = (role) =>
  !role ||
  String(role).toLowerCase() === "student";

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
  resumeUrl:
    student.resumeUrl || student.resume,
  bio: student.bio,
  location: student.location,
  linkedIn: student.linkedIn,
  github: student.github,
  portfolio: student.portfolio,
  status: student.status,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
});

const authPayload = (
  student,
  message,
  statusCode,
  res,
) => {
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

const getAuthenticatedStudent = async (
  req,
  res,
) => {
  const studentId =
    req.user?.id || req.student?._id;

  if (!studentId) {
    errorResponse(
      res,
      "Authentication required",
      401,
    );

    return null;
  }

  const student = await Student.findById(
    studentId,
  ).select("+password");

  if (!student) {
    errorResponse(
      res,
      "Student account not found",
      404,
    );

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

const findSkill = (
  student,
  skillIdOrName,
) => {
  const needle = String(
    skillIdOrName || "",
  )
    .trim()
    .toLowerCase();

  return student.skillDetails.find(
    (skill) =>
      skill._id?.toString() === skillIdOrName ||
      skill.name.toLowerCase() === needle,
  );
};

const buildSkillList = (student) => {
  const mapped = new Map();

  for (const skill of student.skillDetails || []) {
    mapped.set(
      skill.name.toLowerCase(),
      skill,
    );
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
  const numericValues = values.filter(
    (value) => Number.isFinite(value),
  );

  if (!numericValues.length) {
    return 0;
  }

  return (
    numericValues.reduce(
      (sum, value) => sum + value,
      0,
    ) / numericValues.length
  );
};

const calculateScoreBreakdown = (
  student,
) => {
  const skillValues = (
    student.skillDetails || []
  ).map((skill) =>
    clampPercentage(skill.proficiency),
  );

  const fallbackSkillScore = Math.min(
    (student.skills || []).length * 10,
    100,
  );

  const skillsScore = skillValues.length
    ? average(skillValues)
    : fallbackSkillScore;

  const learningScore = average(
    (student.learningProgress || []).map(
      (module) =>
        clampPercentage(
          module.progressPercentage,
        ),
    ),
  );

  const assignmentScore = average(
    (student.assignmentSubmissions || []).map(
      (submission) =>
        clampPercentage(submission.score),
    ),
  );

  const quizScore = average(
    (student.quizSubmissions || []).map(
      (submission) =>
        clampPercentage(submission.score),
    ),
  );

  const weights = {
    skills: 0.4,
    learningProgress: 0.25,
    assignments: 0.2,
    quizzes: 0.15,
  };

  const total =
    skillsScore * weights.skills +
    learningScore *
      weights.learningProgress +
    assignmentScore * weights.assignments +
    quizScore * weights.quizzes;

  const skillScore = Math.round(total);

  return {
    skillScore,
    eligibilityStatus:
      skillScore >= 70
        ? "Eligible"
        : "Not Eligible",

    breakdown: {
      skills: {
        score: Math.round(skillsScore),
        weight: weights.skills,
        count:
          skillValues.length ||
          (student.skills || []).length,
      },

      learningProgress: {
        score: Math.round(learningScore),
        weight: weights.learningProgress,
        count:
          (student.learningProgress || [])
            .length,
      },

      assignments: {
        score: Math.round(assignmentScore),
        weight: weights.assignments,
        count:
          (student.assignmentSubmissions || [])
            .length,
      },

      quizzes: {
        score: Math.round(quizScore),
        weight: weights.quizzes,
        count:
          (student.quizSubmissions || [])
            .length,
      },
    },
  };
};

export const registerStudent = async (
  req,
  res,
) => {
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

    const displayName = String(
      name || fullName || "",
    ).trim();

    const normalizedEmail =
      normalizeEmail(email);

    if (!isStudentRole(role)) {
      return errorResponse(
        res,
        "This endpoint supports student registration only",
        400,
      );
    }

    if (
      !displayName ||
      !normalizedEmail ||
      !password
    ) {
      return errorResponse(
        res,
        "Name, email, and password are required",
        400,
      );
    }

    if (!emailRegex.test(normalizedEmail)) {
      return errorResponse(
        res,
        "Please provide a valid email address",
        400,
      );
    }

    if (String(password).length < 8) {
      return errorResponse(
        res,
        "Password must be at least 8 characters long",
        400,
      );
    }

    const existingStudent =
      await Student.findOne({
        email: normalizedEmail,
      });

    if (existingStudent) {
      return errorResponse(
        res,
        "A student with this email already exists",
        409,
      );
    }

    const student =
      await Student.create({
        name: displayName,
        email: normalizedEmail,
        phone,
        password,
        college:
          college || undefined,
        branch,
        semester: toNumber(semester),
      });

    return authPayload(
      student,
      "Student registered successfully",
      201,
      res,
    );
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        "A student with this email already exists",
        409,
      );
    }

    return errorResponse(
      res,
      error.message ||
        "Student registration failed",
      500,
    );
  }
};

export const loginStudent = async (
  req,
  res,
) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    const normalizedEmail =
      normalizeEmail(email);

    if (!isStudentRole(role)) {
      return errorResponse(
        res,
        "This endpoint supports student login only",
        400,
      );
    }

    if (!normalizedEmail || !password) {
      return errorResponse(
        res,
        "Email and password are required",
        400,
      );
    }

    const student =
      await Student.findOne({
        email: normalizedEmail,
      }).select("+password");

    if (
      !student ||
      !(await student.comparePassword(
        password,
      ))
    ) {
      return errorResponse(
        res,
        "Invalid email or password",
        401,
      );
    }

    if (student.status !== "Active") {
      return errorResponse(
        res,
        "Student account is inactive",
        403,
      );
    }

    return authPayload(
      student,
      "Student logged in successfully",
      200,
      res,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message ||
        "Student login failed",
      500,
    );
  }
};

export const logoutStudent = (
  req,
  res,
) =>
  successResponse(
    res,
    "Logged out successfully",
    { token: null },
  );

export const getStudentProfile = async (
  req,
  res,
) => {
  try {
    return successResponse(
      res,
      "Student profile fetched successfully",
      {
        student: publicStudent(
          req.student,
        ),
      },
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message ||
        "Failed to fetch student profile",
      500,
    );
  }
};
export const getStudentDashboard = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);

    if (!student) {
      return null;
    }

    const [
      applicationsCount,
      aiInterviewsCount,
    ] = await Promise.all([
      Application ? Application.countDocuments({ student: student._id }) : Promise.resolve(0),
      AIInterview ? AIInterview.countDocuments({ candidateId: student._id }) : Promise.resolve(0),
    ]);

    const learningScore = student.learningProgress?.length 
      ? average(student.learningProgress.map(m => clampPercentage(m.progressPercentage))) 
      : 0;

    const streak = 0; // TODO: Calculate from login history

    // Structure matching DashboardData frontend interface
    return successResponse(
      res,
      "Student dashboard fetched successfully",
      {
        profile: {
          id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          profile: student.profile,
          branch: student.branch,
          semester: student.semester,
        },
        stats: {
          registeredCourses: student.assignmentSubmissions?.length || 0, // Fallback for Projects
          completed: student.learningProgress?.filter(l => l.progressPercentage === 100).length || 0,
          pending: 0,
          certificates: aiInterviewsCount,
          appliedProjects: applicationsCount,
          unreadNotifications: 0,
          closingThisWeek: 0,
          learningScore: learningScore,
          currentStreak: streak
        },
        modules: (student.learningProgress || []).map(m => ({
          id: m.moduleId,
          title: m.moduleName || "Learning Module",
          category: "Course",
          progress: clampPercentage(m.progressPercentage) || 0,
          color: "#7c3aed"
        })),
        performanceData: [],
        upcomingActivities: []
      }
    );
  } catch (error) {
    console.error(
      "getStudentDashboard error:",
      error,
    );

    return errorResponse(
      res,
      "Failed to fetch student dashboard",
      500,
    );
  }
};

export const updateStudentProfile =
  async (req, res) => {
    try {
      const student =
        await getAuthenticatedStudent(
          req,
          res,
        );

      if (!student) {
        return null;
      }

      const allowedFields = [
        "name",
        "fullName",
        "email",
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
        if (
          req.body[field] !== undefined
        ) {
          if (field === "fullName") {
            student.name = String(
              req.body[field],
            ).trim();
          } else if (
            field === "semester"
          ) {
            student.semester =
              toNumber(
                req.body[field],
              );
          } else if (
            field === "email"
          ) {
            const normalizedEmail = normalizeEmail(req.body[field]);
            if (!emailRegex.test(normalizedEmail)) {
              return errorResponse(res, "Please provide a valid email address", 400);
            }
            const existingStudent = await Student.findOne({ email: normalizedEmail });
            if (existingStudent && String(existingStudent._id) !== String(student._id)) {
                return errorResponse(res, "Email already in use", 409);
            }
            student.email = normalizedEmail;
          } else {
            student[field] =
              req.body[field];
          }
        }
      }

      if (
        Array.isArray(
          req.body.interests,
        )
      ) {
        student.interests =
          req.body.interests
            .map((interest) =>
              String(interest).trim(),
            )
            .filter(Boolean);
      }

      if (
        Array.isArray(
          req.body.education,
        )
      ) {
        student.education =
          req.body.education;
      }

      if (
        Array.isArray(
          req.body.skills,
        )
      ) {
        student.skills =
          req.body.skills
            .map((skill) =>
              String(skill).trim(),
            )
            .filter(Boolean);
      }

      if (
        student.resumeUrl &&
        !student.resume
      ) {
        student.resume =
          student.resumeUrl;
      }

      if (
        student.resume &&
        !student.resumeUrl
      ) {
        student.resumeUrl =
          student.resume;
      }

      syncSkillNames(student);

      await student.save();

      return successResponse(
        res,
        "Student profile updated successfully",
        {
          student:
            publicStudent(student),
        },
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message ||
          "Failed to update student profile",
        500,
      );
    }
  };

export const getStudentSkills = async (
  req,
  res,
) => {
  try {
    return successResponse(
      res,
      "Student skills fetched successfully",
      {
        skills: buildSkillList(
          req.student,
        ),
      },
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message ||
        "Failed to fetch student skills",
      500,
    );
  }
};

export const addStudentSkill = async (
  req,
  res,
) => {
  try {
    const student =
      await getAuthenticatedStudent(
        req,
        res,
      );

    if (!student) {
      return null;
    }

    const name = String(
      req.body.name ||
        req.body.skill ||
        "",
    ).trim();

    const proficiency =
      clampPercentage(
        req.body.proficiency,
      ) ?? 0;

    if (!name) {
      return errorResponse(
        res,
        "Skill name is required",
        400,
      );
    }

    const stringSkillExists = (
      student.skills || []
    ).some(
      (skill) =>
        String(skill).toLowerCase() ===
        name.toLowerCase(),
    );

    if (
      findSkill(student, name) ||
      stringSkillExists
    ) {
      return errorResponse(
        res,
        "Skill already exists",
        409,
      );
    }

    student.skillDetails.push({
      name,
      proficiency,
      category: req.body.category,
      yearsOfExperience:
        toNumber(
          req.body.yearsOfExperience,
        ) || 0,
    });

    syncSkillNames(student);

    await student.save();

    return successResponse(
      res,
      "Skill added successfully",
      {
        skill:
          student.skillDetails[
            student.skillDetails.length - 1
          ],
        skills:
          buildSkillList(student),
      },
      201,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message ||
        "Failed to add skill",
      500,
    );
  }
};

export const updateStudentSkill =
  async (req, res) => {
    try {
      const student =
        await getAuthenticatedStudent(
          req,
          res,
        );

      if (!student) {
        return null;
      }

      const skill = findSkill(
        student,
        req.params.skillId ||
          req.body.skillId ||
          req.body.name,
      );

      let skillToUpdate = skill;

      if (!skillToUpdate) {
        const existingSkillName =
          (
            student.skills || []
          ).find(
            (name) =>
              String(name).toLowerCase() ===
              String(
                req.params.skillId ||
                  req.body.skillId ||
                  req.body.name,
              ).toLowerCase(),
          );

        if (!existingSkillName) {
          return errorResponse(
            res,
            "Skill not found",
            404,
          );
        }

        student.skillDetails.push({
          name: existingSkillName,
          proficiency: 0,
        });

        skillToUpdate =
          student.skillDetails[
            student.skillDetails.length - 1
          ];
      }

      if (
        req.body.name !== undefined
      ) {
        const nextName = String(
          req.body.name,
        ).trim();

        const duplicate =
          student.skillDetails.find(
            (item) =>
              item._id.toString() !==
                skillToUpdate._id.toString() &&
              item.name.toLowerCase() ===
                nextName.toLowerCase(),
          );

        if (duplicate) {
          return errorResponse(
            res,
            "Another skill with this name already exists",
            409,
          );
        }

        skillToUpdate.name =
          nextName;
      }

      if (
        req.body.proficiency !==
        undefined
      ) {
        skillToUpdate.proficiency =
          clampPercentage(
            req.body.proficiency,
          );
      }

      if (
        req.body.category !==
        undefined
      ) {
        skillToUpdate.category =
          req.body.category;
      }

      if (
        req.body.yearsOfExperience !==
        undefined
      ) {
        skillToUpdate.yearsOfExperience =
          toNumber(
            req.body.yearsOfExperience,
          ) || 0;
      }

      syncSkillNames(student);

      await student.save();

      return successResponse(
        res,
        "Skill updated successfully",
        {
          skill: skillToUpdate,
          skills:
            buildSkillList(student),
        },
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message ||
          "Failed to update skill",
        500,
      );
    }
  };

export const deleteStudentSkill =
  async (req, res) => {
    try {
      const student =
        await getAuthenticatedStudent(
          req,
          res,
        );

      if (!student) {
        return null;
      }

      const skill = findSkill(
        student,
        req.params.skillId ||
          req.body.skillId ||
          req.body.name,
      );

      const skillName =
        skill?.name ||
        req.params.skillId ||
        req.body.name;

      const hadStringSkill = (
        student.skills || []
      ).some(
        (name) =>
          String(name).toLowerCase() ===
          String(
            skillName,
          ).toLowerCase(),
      );

      if (skill) {
        student.skillDetails.pull(
          skill._id,
        );
      }

      student.skills = (
        student.skills || []
      ).filter(
        (name) =>
          String(name).toLowerCase() !==
          String(
            skillName,
          ).toLowerCase(),
      );

      if (
        !skill &&
        !hadStringSkill
      ) {
        return errorResponse(
          res,
          "Skill not found",
          404,
        );
      }

      syncSkillNames(student);

      await student.save();

      return successResponse(
        res,
        "Skill deleted successfully",
        {
          skills:
            buildSkillList(student),
        },
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message ||
          "Failed to delete skill",
        500,
      );
    }
  };

export const getLearningModules = (
  req,
  res,
) =>
  successResponse(
    res,
    "Learning modules fetched successfully",
    {
      modules:
        req.student.learningProgress ||
        [],
    },
  );

export const updateLearningProgress =
  async (req, res) => {
    try {
      const student =
        await getAuthenticatedStudent(
          req,
          res,
        );

      if (!student) {
        return null;
      }

      const moduleId = String(
        req.params.moduleId ||
          req.body.moduleId ||
          "",
      ).trim();

      const title = String(
        req.body.title ||
          req.body.moduleTitle ||
          moduleId,
      ).trim();

      const progressPercentage =
        clampPercentage(
          req.body.progressPercentage,
        );

      if (!moduleId) {
        return errorResponse(
          res,
          "Module id is required",
          400,
        );
      }

      if (
        progressPercentage ===
        undefined
      ) {
        return errorResponse(
          res,
          "Progress percentage is required",
          400,
        );
      }

      let module =
        student.learningProgress.find(
          (item) =>
            item.moduleId === moduleId,
        );

      const status =
        progressPercentage >= 100
          ? "completed"
          : progressPercentage > 0
          ? "in-progress"
          : "enrolled";

      if (!module) {
        student.learningProgress.push(
          {
            moduleId,
            title,
            description:
              req.body.description,
            progressPercentage,
            status,
            completedAt:
              status === "completed"
                ? new Date()
                : undefined,
            history: [
              {
                progressPercentage,
                status,
                note: req.body.note,
              },
            ],
          },
        );

        module =
          student.learningProgress[
            student.learningProgress.length -
              1
          ];
      } else {
        module.title =
          title || module.title;

        if (
          req.body.description !==
          undefined
        ) {
          module.description =
            req.body.description;
        }

        module.progressPercentage =
          progressPercentage;

        module.status = status;

        module.completedAt =
          status === "completed"
            ? new Date()
            : undefined;

        module.history.push({
          progressPercentage,
          status,
          note: req.body.note,
        });
      }

      await student.save();

      return successResponse(
        res,
        "Learning progress updated successfully",
        {
          module,
          modules:
            student.learningProgress,
        },
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message ||
          "Failed to update learning progress",
        500,
      );
    }
  };

export const markModuleComplete = (
  req,
  res,
) => {
  req.body = req.body || {};
  req.body.progressPercentage = 100;

  return updateLearningProgress(
    req,
    res,
  );
};

export const getLearningProgressHistory =
  (req, res) => {
    const moduleId =
      req.params.moduleId ||
      req.query.moduleId;

    const modules = moduleId
      ? (
          req.student
            .learningProgress || []
        ).filter(
          (module) =>
            module.moduleId ===
            moduleId,
        )
      : req.student.learningProgress ||
        [];

    return successResponse(
      res,
      "Learning progress history fetched successfully",
      {
        history: modules.flatMap(
          (module) =>
            (
              module.history || []
            ).map((entry) => {
              const historyEntry =
                entry.toObject?.() ||
                entry;

              return {
                moduleId:
                  module.moduleId,
                title: module.title,
                ...historyEntry,
              };
            }),
        ),
      },
    );
  };

export const getAssignments = (
  req,
  res,
) =>
  successResponse(
    res,
    "Assignments fetched successfully",
    {
      assignments:
        req.student
          .assignmentSubmissions ||
        [],
    },
  );

export const submitAssignment = async (
  req,
  res,
) => {
  try {
    const student =
      await getAuthenticatedStudent(
        req,
        res,
      );

    if (!student) {
      return null;
    }

    const assignmentId = String(
      req.params.assignmentId ||
        req.body.assignmentId ||
        "",
    ).trim();

    if (!assignmentId) {
      return errorResponse(
        res,
        "Assignment id is required",
        400,
      );
    }

    const duplicate =
      student.assignmentSubmissions.find(
        (submission) =>
          submission.assignmentId ===
          assignmentId,
      );

    if (
      duplicate &&
      !req.body.allowResubmit
    ) {
      return errorResponse(
        res,
        "Assignment already submitted",
        409,
      );
    }

    const score =
      clampPercentage(
        req.body.score,
      );

    const payload = {
      assignmentId,
      title: req.body.title,
      content: req.body.content,
      submissionUrl:
        req.body.submissionUrl,
      answers: req.body.answers,
      score,
      status:
        score === undefined
          ? "submitted"
          : "graded",
      feedback:
        req.body.feedback,
      submittedAt: new Date(),
    };

    let submission = duplicate;

    if (duplicate) {
      Object.assign(
        duplicate,
        payload,
      );
    } else {
      student.assignmentSubmissions.push(
        payload,
      );

      submission =
        student.assignmentSubmissions[
          student.assignmentSubmissions.length -
            1
        ];
    }

    await student.save();

    return successResponse(
      res,
      "Assignment submitted successfully",
      {
        submission,
      },
      duplicate ? 200 : 201,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message ||
        "Failed to submit assignment",
      500,
    );
  }
};

export const getQuizzes = (
  req,
  res,
) =>
  successResponse(
    res,
    "Quizzes fetched successfully",
    {
      quizzes:
        req.student.quizSubmissions ||
        [],
    },
  );

export const submitQuiz = async (
  req,
  res,
) => {
  try {
    const student =
      await getAuthenticatedStudent(
        req,
        res,
      );

    if (!student) {
      return null;
    }

    const quizId = String(
      req.params.quizId ||
        req.body.quizId ||
        "",
    ).trim();

    if (!quizId) {
      return errorResponse(
        res,
        "Quiz id is required",
        400,
      );
    }

    if (
      req.body.answers ===
      undefined
    ) {
      return errorResponse(
        res,
        "Quiz answers are required",
        400,
      );
    }

    const duplicate =
      student.quizSubmissions.find(
        (submission) =>
          submission.quizId ===
          quizId,
      );

    if (
      duplicate &&
      !req.body.allowResubmit
    ) {
      return errorResponse(
        res,
        "Quiz already submitted",
        409,
      );
    }

    const totalQuestions =
      toNumber(
        req.body.totalQuestions,
      );

    const correctAnswers =
      toNumber(
        req.body.correctAnswers,
      );

    const calculatedScore =
      totalQuestions &&
      correctAnswers !== undefined
        ? (correctAnswers /
            totalQuestions) *
          100
        : undefined;

    const score =
      clampPercentage(
        req.body.score ??
          calculatedScore,
      );

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
      Object.assign(
        duplicate,
        payload,
      );
    } else {
      student.quizSubmissions.push(
        payload,
      );

      submission =
        student.quizSubmissions[
          student.quizSubmissions.length -
            1
        ];
    }

    await student.save();

    return successResponse(
      res,
      "Quiz submitted successfully",
      {
        submission,
      },
      duplicate ? 200 : 201,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message ||
        "Failed to submit quiz",
      500,
    );
  }
};

export const getSkillScore = async (
  req,
  res,
) => {
  try {
    const result =
      calculateScoreBreakdown(
        req.student,
      );

    return successResponse(
      res,
      "Skill score calculated successfully",
      result,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message ||
        "Failed to calculate skill score",
      500,
    );
  }
};

export const calculateAndStoreSkillScore =
  async (req, res) => {
    try {
      const student =
        await getAuthenticatedStudent(
          req,
          res,
        );

      if (!student) {
        return null;
      }

      const result =
        calculateScoreBreakdown(
          student,
        );

      student.scoreHistory.push({
        score: result.skillScore,
        eligibilityStatus:
          result.eligibilityStatus,
        breakdown:
          result.breakdown,
      });

      await student.save();

      return successResponse(
        res,
        "Skill score calculated and stored successfully",
        result,
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message ||
          "Failed to store skill score",
        500,
      );
    }
  };

/*
 * =========================================================
 * START HIRING PROCESS
 * =========================================================
 *
 * POST /api/student/hiring/drives/:driveId/start
 *
 * This endpoint currently validates the authenticated
 * student and starts the hiring-process session.
 *
 * Application creation will be connected once the actual
 * hiring-drive data/model is connected to this flow.
 */

export const startHiringDrive = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);

    if (!student) {
      return null;
    }

    const { driveId } = req.params;

    if (!driveId) {
      return errorResponse(
        res,
        "Hiring drive id is required",
        400,
      );
    }

    /*
     * =====================================================
     * DUMMY HIRING DRIVES
     * =====================================================
     *
     * Temporary data until real Project/Hiring Drive
     * records are connected.
     */

    const dummyDrives = {
      "1": {
        id: "1",
        title: "Software Engineer Intern",
        company: "C2C Technologies",
        recruiter: "C2C Recruiter",
        location: "Remote",
        mode: "Remote",
        duration: "6 Months",
        stipend: 15000,
        status: "Open",
      },

      "2": {
        id: "2",
        title: "AI/ML Engineer Intern",
        company: "C2C Technologies",
        recruiter: "C2C Recruiter",
        location: "Remote",
        mode: "Remote",
        duration: "6 Months",
        stipend: 20000,
        status: "Open",
      },

      "google-sde-drive": {
        id: "google-sde-drive",
        title: "Software Engineer - Campus Placement",
        company: "Google",
        recruiter: "Google Campus Recruiting",
        location: "Bangalore / Hybrid",
        mode: "Hybrid",
        duration: "Full Time",
        stipend: 3200000,
        status: "Open",
      },

      "microsoft-swe-drive": {
        id: "microsoft-swe-drive",
        title: "Full Stack Engineer - Early Career",
        company: "Microsoft",
        recruiter: "Microsoft Campus Recruiting",
        location: "Hyderabad / Remote",
        mode: "Remote",
        duration: "Full Time",
        stipend: 2800000,
        status: "Open",
      },

      "amazon-sde-drive": {
        id: "amazon-sde-drive",
        title: "SDE-1 - Cloud & Distributed Systems",
        company: "Amazon",
        recruiter: "Amazon Campus Recruiting",
        location: "Bangalore",
        mode: "On-site",
        duration: "Full Time",
        stipend: 3400000,
        status: "Open",
      },
    };

    const drive = dummyDrives[String(driveId)];

    if (!drive) {
      return errorResponse(
        res,
        "Hiring drive not found",
        404,
      );
    }

    if (drive.status !== "Open") {
      return errorResponse(
        res,
        "This hiring drive is no longer accepting applications",
        400,
      );
    }

    /*
     * =====================================================
     * RESUME UPLOAD
     * =====================================================
     *
     * Resume comes from multer as req.file.
     *
     * Frontend sends:
     *
     * FormData:
     *   resume: <PDF file>
     *
     * The upload middleware stores the actual file on
     * the backend.
     */

    if (!req.file) {
      return errorResponse(
        res,
        "Resume file is required",
        400,
      );
    }

    const resumePath =
      `/uploads/resumes/${req.file.filename}`;

    /*
     * Save the uploaded resume against the student's
     * profile as well.
     */

    student.resume = resumePath;
    student.resumeUrl = resumePath;

    await student.save();

    /*
     * =====================================================
     * DUMMY APPLICATION
     * =====================================================
     *
     * We are NOT creating a MongoDB Application record yet.
     *
     * This allows the frontend hiring flow to work with
     * dummy drives until the real Project/Application
     * models are connected.
     */

    const applicationId =
      new mongoose.Types.ObjectId();

    const application = {
      _id: applicationId,
      id: applicationId,
      student: student._id,
      studentId: student._id,

      driveId: drive.id,
      projectId: drive.id,

      project: {
        id: drive.id,
        title: drive.title,
      },

      company: drive.company,
      recruiter: drive.recruiter,

      resume: resumePath,
      resumeUrl: resumePath,

      status: "submitted",

      submittedAt: new Date(),
    };

    return successResponse(
      res,
      "Application submitted successfully",
      {
        application,

        drive: {
          ...drive,
        },

        driveId: drive.id,
        studentId: student._id,
        applicationId,

        resume: resumePath,
        resumeUrl: resumePath,

        status: "submitted",
      },
      201,
    );
  } catch (error) {
    console.error(
      "startHiringDrive error:",
      error,
    );

    return errorResponse(
      res,
      error.message ||
        "Failed to submit application",
      500,
    );
  }
};

/*
 * =========================================================
 * PROJECTS & APPLICATIONS
 * =========================================================
 */

export const getStudentProjects = async (req, res) => {
  try {
    const { search, mode, location } = req.query;
    const query = { status: "Open" };

    if (mode && mode !== "All") {
      query.mode = mode;
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { requiredSkills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    let projects = await Project.find(query)
      .populate("company", "name logo website location")
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    if (!projects || projects.length === 0) {
      projects = [
        {
          _id: "google-sde-drive",
          id: "google-sde-drive",
          title: "Software Engineer - Campus Placement",
          description: "Build scalable cloud infrastructure, full-stack microservices, and AI-driven platforms.",
          company: { name: "Google", location: "Bangalore / Hybrid" },
          requiredSkills: ["React", "TypeScript", "Node.js", "Distributed Systems"],
          duration: "Full-Time",
          stipend: 266000,
          location: "Bangalore / Hybrid",
          mode: "Hybrid",
          openings: 15,
          status: "Open",
        },
        {
          _id: "microsoft-swe-drive",
          id: "microsoft-swe-drive",
          title: "Full Stack Engineer - Early Career",
          description: "Develop rich interactive user interfaces and cloud services on Azure.",
          company: { name: "Microsoft", location: "Hyderabad" },
          requiredSkills: ["JavaScript", "React", "C#", "SQL"],
          duration: "Full-Time",
          stipend: 233000,
          location: "Hyderabad",
          mode: "Remote",
          openings: 20,
          status: "Open",
        },
      ];
    }

    return successResponse(res, "Projects retrieved successfully", {
      projects,
      count: projects.length,
    });
  } catch (error) {
    console.error("getStudentProjects error:", error);
    return errorResponse(res, "Failed to retrieve projects", 500);
  }
};

export const applyToProject = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const { projectId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    let project = null;
    let recruiterId = null;
    let companyId = null;

    if (isValidObjectId(projectId)) {
      project = await Project.findById(projectId);
      if (project) {
        recruiterId = project.recruiter;
        companyId = project.company;
      }
    }

    if (project) {
      const existing = await Application.findOne({
        student: student._id,
        project: project._id,
      });
      if (existing) {
        return errorResponse(res, "You have already applied for this project", 400);
      }
    }

    const newApp = await Application.create({
      student: student._id,
      project: project ? project._id : undefined,
      recruiter: recruiterId || new mongoose.Types.ObjectId(),
      company: companyId || new mongoose.Types.ObjectId(),
      resume: resumeUrl || student.resumeUrl || student.resume || "",
      coverLetter: coverLetter || "",
      status: "Applied",
    });

    return successResponse(res, "Applied successfully", {
      application: newApp,
    }, 201);
  } catch (error) {
    console.error("applyToProject error:", error);
    return errorResponse(res, error.message || "Failed to apply to project", 500);
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const applications = await Application.find({ student: student._id })
      .populate("project")
      .populate("company", "name logo location")
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => {
      const p = app.project || {};
      const c = app.company || {};
      return {
        id: app._id.toString(),
        _id: app._id.toString(),
        title: p.title || "Software Engineer",
        company: c.name || "Enterprise Partner",
        location: p.location || "Bangalore / Hybrid",
        appliedOn: app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "Recent",
        status: app.status || "Applied",
        stipend: p.stipend ? `₹${p.stipend.toLocaleString()}/mo` : "₹32 LPA",
        skills: p.requiredSkills && p.requiredSkills.length > 0 ? p.requiredSkills : ["JavaScript", "React", "Node.js"],
        resume: app.resume || student.resumeUrl || student.resume || "",
        coverLetter: app.coverLetter || "",
      };
    });

    return successResponse(res, "Applications retrieved successfully", {
      applications: formatted,
      count: formatted.length,
    });
  } catch (error) {
    console.error("getStudentApplications error:", error);
    return errorResponse(res, "Failed to retrieve applications", 500);
  }
};

export const getStudentApplicationById = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const { applicationId } = req.params;
    if (!isValidObjectId(applicationId)) {
      return errorResponse(res, "Invalid application ID", 400);
    }

    const app = await Application.findOne({
      _id: applicationId,
      student: student._id,
    })
      .populate("project")
      .populate("company", "name logo location")
      .populate("recruiter", "name email");

    if (!app) {
      return errorResponse(res, "Application not found", 404);
    }

    const p = app.project || {};
    const c = app.company || {};

    return successResponse(res, "Application details retrieved successfully", {
      application: {
        id: app._id.toString(),
        _id: app._id.toString(),
        title: p.title || "Software Engineer",
        company: c.name || "Enterprise Partner",
        location: p.location || "Bangalore / Hybrid",
        appliedOn: app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "Recent",
        status: app.status || "Applied",
        stipend: p.stipend ? `₹${p.stipend.toLocaleString()}/mo` : "₹32 LPA",
        skills: p.requiredSkills || ["JavaScript", "React"],
        resume: app.resume || student.resumeUrl || student.resume || "",
        coverLetter: app.coverLetter || "",
      },
    });
  } catch (error) {
    console.error("getStudentApplicationById error:", error);
    return errorResponse(res, "Failed to retrieve application details", 500);
  }
};

export const withdrawStudentApplication = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const { applicationId } = req.params;
    if (!isValidObjectId(applicationId)) {
      return errorResponse(res, "Invalid application ID", 400);
    }

    const app = await Application.findOneAndDelete({
      _id: applicationId,
      student: student._id,
    });

    if (!app) {
      return errorResponse(res, "Application not found", 404);
    }

    return successResponse(res, "Application withdrawn successfully", {
      applicationId,
    });
  } catch (error) {
    console.error("withdrawStudentApplication error:", error);
    return errorResponse(res, "Failed to withdraw application", 500);
  }
};

/*
 * =========================================================
 * NOTIFICATIONS
 * =========================================================
 */

export const getStudentNotifications = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    let notifications = student.notifications || [];
    if (notifications.length === 0) {
      notifications = [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Welcome to Campus2Corporate",
          message: "Complete your profile and upload your resume to unlock AI interview prep and corporate drives.",
          type: "system",
          read: false,
          createdAt: new Date(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Technical Round 1 Ready",
          message: "Your AI technical round is ready. Click Placement Prep to begin.",
          type: "assessment",
          read: false,
          createdAt: new Date(),
        },
      ];
    }

    return successResponse(res, "Notifications retrieved successfully", {
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("getStudentNotifications error:", error);
    return errorResponse(res, "Failed to retrieve notifications", 500);
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const { id } = req.params;
    const notif = student.notifications?.id(id);
    if (notif) {
      notif.read = true;
      await student.save();
    }

    return successResponse(res, "Notification marked as read", {
      id,
      notifications: student.notifications || [],
      unreadCount: (student.notifications || []).filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("markNotificationRead error:", error);
    return errorResponse(res, "Failed to update notification", 500);
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    if (student.notifications) {
      student.notifications.forEach((n) => {
        n.read = true;
      });
      await student.save();
    }

    return successResponse(res, "All notifications marked as read", {
      success: true,
      notifications: student.notifications || [],
      unreadCount: 0,
    });
  } catch (error) {
    console.error("markAllNotificationsRead error:", error);
    return errorResponse(res, "Failed to update notifications", 500);
  }
};

export const deleteStudentNotification = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const { id } = req.params;
    if (student.notifications) {
      student.notifications.pull({ _id: id });
      await student.save();
    }

    return successResponse(res, "Notification deleted successfully", {
      id,
      notifications: student.notifications || [],
      unreadCount: (student.notifications || []).filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("deleteStudentNotification error:", error);
    return errorResponse(res, "Failed to delete notification", 500);
  }
};

/*
 * =========================================================
 * CERTIFICATES
 * =========================================================
 */

const CERT_ICON_MAP = [
  { keywords: ["react", "javascript", "web", "frontend"], icon: "cpu" },
  { keywords: ["python", "ml", "ai", "data"], icon: "ai-brain" },
  { keywords: ["aws", "cloud", "azure", "gcp"], icon: "database" },
  { keywords: ["security", "cyber"], icon: "shield" },
  { keywords: ["project", "management", "pmp", "agile"], icon: "briefcase" },
];
const certIcon = (title = "") => {
  const lower = title.toLowerCase();
  for (const entry of CERT_ICON_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.icon;
  }
  return "award";
};

export const getStudentCertificates = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const all = student.certificates || [];
    // The frontend expects { earned: [...], inProgress: [...] }
    // We treat all stored certs as earned. inProgress can be populated later.
    const earned = all.map((cert) => ({
      id: cert._id?.toString() || cert.id,
      _id: cert._id?.toString() || cert.id,
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate || "",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      fileUrl: cert.fileUrl || "",
      icon: certIcon(cert.title),
      tags: [],
      verified: true,
    }));

    return successResponse(res, "Certificates retrieved successfully", {
      earned,
      inProgress: [],
      certificates: all,
    });
  } catch (error) {
    console.error("getStudentCertificates error:", error);
    return errorResponse(res, "Failed to retrieve certificates", 500);
  }
};

export const addStudentCertificate = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const { title, issuer, issueDate, credentialId, credentialUrl, fileUrl } = req.body;
    if (!title || !issuer) {
      return errorResponse(res, "Certificate title and issuer are required", 400);
    }

    const newCert = {
      _id: new mongoose.Types.ObjectId(),
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate || new Date().toISOString().split("T")[0],
      credentialId: credentialId || "",
      credentialUrl: credentialUrl || "",
      fileUrl: fileUrl || "",
    };

    if (!student.certificates) student.certificates = [];
    student.certificates.push(newCert);
    await student.save();

    return successResponse(res, "Certificate added successfully", {
      certificate: newCert,
    }, 201);
  } catch (error) {
    console.error("addStudentCertificate error:", error);
    return errorResponse(res, error.message || "Failed to add certificate", 500);
  }
};

export const updateStudentCertificate = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const { id } = req.params;
    const cert = student.certificates?.id(id);
    if (!cert) {
      return errorResponse(res, "Certificate not found", 404);
    }

    const { title, issuer, issueDate, credentialId, credentialUrl, fileUrl } = req.body;
    if (title) cert.title = title.trim();
    if (issuer) cert.issuer = issuer.trim();
    if (issueDate) cert.issueDate = issueDate;
    if (credentialId !== undefined) cert.credentialId = credentialId;
    if (credentialUrl !== undefined) cert.credentialUrl = credentialUrl;
    if (fileUrl !== undefined) cert.fileUrl = fileUrl;

    await student.save();

    return successResponse(res, "Certificate updated successfully", {
      certificate: cert,
    });
  } catch (error) {
    console.error("updateStudentCertificate error:", error);
    return errorResponse(res, "Failed to update certificate", 500);
  }
};

export const deleteStudentCertificate = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const { id } = req.params;
    if (student.certificates) {
      student.certificates.pull({ _id: id });
      await student.save();
    }

    return successResponse(res, "Certificate deleted successfully", {
      id,
    });
  } catch (error) {
    console.error("deleteStudentCertificate error:", error);
    return errorResponse(res, "Failed to delete certificate", 500);
  }
};

/*
 * =========================================================
 * SETTINGS
 * =========================================================
 */

/**
 * Build the nested settings response shape that the frontend expects:
 * { email, settings: { notifications: {key:bool}, privacy: {key:bool}, theme, connectedAccounts } }
 */
const buildSettingsResponse = (student) => {
  const s = student.settings || {};
  // Flat flags -> nested notifications keys
  const notifications = {
    email: s.emailNotifications !== undefined ? Boolean(s.emailNotifications) : true,
    sms: s.smsAlerts !== undefined ? Boolean(s.smsAlerts) : false,
    assignments: s.interviewReminders !== undefined ? Boolean(s.interviewReminders) : true,
    mentorSessions: s.mentorSessions !== undefined ? Boolean(s.mentorSessions) : true,
    marketing: s.jobAlerts !== undefined ? Boolean(s.jobAlerts) : true,
  };
  const privacy = {
    recruiterVisible: s.profileVisibility === "public",
    leaderboard: s.leaderboard !== undefined ? Boolean(s.leaderboard) : true,
    twoFactor: s.twoFactor !== undefined ? Boolean(s.twoFactor) : false,
  };
  return {
    email: student.email,
    settings: {
      notifications,
      privacy,
      theme: s.theme || "light",
      connectedAccounts: {
        github: Boolean(student.github),
        linkedIn: Boolean(student.linkedIn),
      },
    },
  };
};

export const getStudentSettings = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    return successResponse(res, "Settings retrieved successfully", buildSettingsResponse(student));
  } catch (error) {
    console.error("getStudentSettings error:", error);
    return errorResponse(res, "Failed to retrieve settings", 500);
  }
};

export const updateStudentSettings = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    // Accept both flat and nested shapes from the frontend
    const body = req.body;
    if (!student.settings) student.settings = {};

    // Flat top-level fields
    if (body.emailNotifications !== undefined) student.settings.emailNotifications = Boolean(body.emailNotifications);
    if (body.jobAlerts !== undefined) student.settings.jobAlerts = Boolean(body.jobAlerts);
    if (body.interviewReminders !== undefined) student.settings.interviewReminders = Boolean(body.interviewReminders);
    if (body.profileVisibility !== undefined) student.settings.profileVisibility = body.profileVisibility;
    if (body.theme !== undefined) student.settings.theme = body.theme;

    // Nested settings object { settings: { notifications: {...}, privacy: {...}, theme } }
    const nested = body.settings || {};
    if (nested.theme !== undefined) student.settings.theme = nested.theme;
    if (nested.notifications) {
      const n = nested.notifications;
      if (n.email !== undefined) student.settings.emailNotifications = Boolean(n.email);
      if (n.sms !== undefined) student.settings.smsAlerts = Boolean(n.sms);
      if (n.assignments !== undefined) student.settings.interviewReminders = Boolean(n.assignments);
      if (n.mentorSessions !== undefined) student.settings.mentorSessions = Boolean(n.mentorSessions);
      if (n.marketing !== undefined) student.settings.jobAlerts = Boolean(n.marketing);
    }
    if (nested.privacy) {
      const p = nested.privacy;
      if (p.recruiterVisible !== undefined) student.settings.profileVisibility = p.recruiterVisible ? "public" : "private";
      if (p.leaderboard !== undefined) student.settings.leaderboard = Boolean(p.leaderboard);
      if (p.twoFactor !== undefined) student.settings.twoFactor = Boolean(p.twoFactor);
    }

    // Update profile fields if sent
    if (body.email && body.email !== student.email) {
      student.email = body.email;
    }
    
    // Update connected accounts
    if (nested.connectedAccounts) {
      if (nested.connectedAccounts.github !== undefined) {
        student.github = nested.connectedAccounts.github ? "connected" : "";
      }
      if (nested.connectedAccounts.linkedIn !== undefined) {
        student.linkedIn = nested.connectedAccounts.linkedIn ? "connected" : "";
      }
    }

    // Password update
    if (body.currentPassword && body.newPassword) {
      const StudentModel = student.constructor;
      const studentWithPass = await StudentModel.findById(student._id).select("+password");
      if (!studentWithPass || !(await studentWithPass.comparePassword(body.currentPassword))) {
        return errorResponse(res, "Incorrect current password", 400);
      }
      if (String(body.newPassword).length < 8) {
        return errorResponse(res, "Password must be at least 8 characters long", 400);
      }
      student.password = body.newPassword;
    }

    await student.save();

    return successResponse(res, "Settings updated successfully", buildSettingsResponse(student));
  } catch (error) {
    console.error("updateStudentSettings error:", error);
    return errorResponse(res, "Failed to update settings", 500);
  }
};

/*
 * =========================================================
 * RESUME BUILDER
 * =========================================================
 */

export const getStudentResumeBuilder = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    const resumeBuilder = student.resumeBuilder || {
      personalInfo: {
        name: student.name,
        email: student.email,
        phone: student.phone || "",
        location: student.location || "",
        linkedIn: student.linkedIn || "",
        github: student.github || "",
        bio: student.bio || "",
      },
      education: student.education || [],
      skills: student.skills || [],
      experience: [],
      projects: [],
      certifications: student.certificates || [],
      summary: student.bio || "",
      templateId: "modern",
    };

    return successResponse(res, "Resume builder draft retrieved successfully", {
      resumeBuilder,
      data: resumeBuilder,
    });
  } catch (error) {
    console.error("getStudentResumeBuilder error:", error);
    return errorResponse(res, "Failed to retrieve resume builder", 500);
  }
};

export const saveStudentResumeBuilder = async (req, res) => {
  try {
    const student = await getAuthenticatedStudent(req, res);
    if (!student) return;

    student.resumeBuilder = {
      ...student.resumeBuilder,
      ...req.body,
      lastSaved: new Date(),
    };

    await student.save();

    return successResponse(res, "Resume builder draft saved successfully", {
      resumeBuilder: student.resumeBuilder,
    });
  } catch (error) {
    console.error("saveStudentResumeBuilder error:", error);
    return errorResponse(res, "Failed to save resume builder draft", 500);
  }
};

/*
 * =========================================================
 * HIRING DRIVES LIST
 * =========================================================
 */

export const getHiringDrives = async (req, res) => {
  try {
    const drives = [
      {
        id: "google-sde-drive",
        _id: "google-sde-drive",
        company: "Google",
        title: "Software Engineer - Campus Placement",
        role: "Software Engineer",
        location: "Bangalore / Hybrid",
        packageLabel: "₹32 LPA",
        deadline: "30 Aug 2026",
        eligibility: "B.Tech / M.Tech (CS, IT, ECE) with >= 70%",
        skills: ["Data Structures", "Algorithms", "React", "Node.js", "System Design"],
        rounds: [
          { name: "Aptitude Assessment", duration: "45 Mins", type: "aptitude" },
          { name: "Technical Round 1", duration: "30 Mins", type: "technical" },
          { name: "HR & Cultural Round", duration: "25 Mins", type: "hr" },
        ],
        status: "Open",
      },
      {
        id: "microsoft-swe-drive",
        _id: "microsoft-swe-drive",
        company: "Microsoft",
        title: "Full Stack Engineer - Early Career",
        role: "Full Stack Engineer",
        location: "Hyderabad / Remote",
        packageLabel: "₹28 LPA",
        deadline: "15 Sep 2026",
        eligibility: "B.Tech (All Branches) with >= 65%",
        skills: ["TypeScript", "React", "Cloud Architecture", "SQL"],
        rounds: [
          { name: "Aptitude Assessment", duration: "45 Mins", type: "aptitude" },
          { name: "Technical Round 1", duration: "30 Mins", type: "technical" },
          { name: "HR & Cultural Round", duration: "25 Mins", type: "hr" },
        ],
        status: "Open",
      },
      {
        id: "amazon-sde-drive",
        _id: "amazon-sde-drive",
        company: "Amazon",
        title: "SDE-1 - Cloud & Distributed Systems",
        role: "Software Development Engineer",
        location: "Bangalore",
        packageLabel: "₹34 LPA",
        deadline: "20 Sep 2026",
        eligibility: "B.Tech / M.Tech CS with >= 70%",
        skills: ["Java", "Distributed Systems", "AWS", "Databases"],
        rounds: [
          { name: "Aptitude Assessment", duration: "45 Mins", type: "aptitude" },
          { name: "Technical Round 1", duration: "30 Mins", type: "technical" },
          { name: "HR & Cultural Round", duration: "25 Mins", type: "hr" },
        ],
        status: "Open",
      },
    ];

    return successResponse(res, "Hiring drives retrieved successfully", {
      drives,
      count: drives.length,
    });
  } catch (error) {
    console.error("getHiringDrives error:", error);
    return errorResponse(res, "Failed to retrieve hiring drives", 500);
  }
};
export const getOpportunities = async (req, res) => {
  return successResponse(res, 'Opportunities fetched', []);
};

export const getHiringDriveDetails = async (req, res) => {
  return successResponse(res, 'Drive details fetched', {});
};

export const getDriveAssessment = async (req, res) => {
  return successResponse(res, 'Drive assessment fetched', {});
};

