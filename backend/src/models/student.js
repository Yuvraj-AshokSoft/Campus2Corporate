import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startYear: { type: Number },
    endYear: { type: Number },
    grade: { type: String, trim: true },
  },
  { _id: true }
);

const skillDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    category: { type: String, trim: true },
    yearsOfExperience: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

const progressHistorySchema = new mongoose.Schema(
  {
    progressPercentage: { type: Number, min: 0, max: 100, required: true },
    status: {
      type: String,
      enum: ["enrolled", "in-progress", "completed"],
      required: true,
    },
    note: { type: String, trim: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const learningProgressSchema = new mongoose.Schema(
  {
    moduleId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    progressPercentage: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: ["enrolled", "in-progress", "completed"],
      default: "enrolled",
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    history: [progressHistorySchema],
  },
  { timestamps: true }
);

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    content: { type: String, trim: true },
    submissionUrl: { type: String, trim: true },
    answers: { type: mongoose.Schema.Types.Mixed },
    score: { type: Number, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },
    feedback: { type: String, trim: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const quizSubmissionSchema = new mongoose.Schema(
  {
    quizId: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    answers: { type: mongoose.Schema.Types.Mixed, required: true },
    score: { type: Number, min: 0, max: 100 },
    totalQuestions: { type: Number, min: 0 },
    correctAnswers: { type: Number, min: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const scoreHistorySchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 100, required: true },
    eligibilityStatus: {
      type: String,
      enum: ["Eligible", "Not Eligible"],
      required: true,
    },
    breakdown: { type: mongoose.Schema.Types.Mixed },
    calculatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["assignment", "assessment", "mentor", "interview", "system", "achievement"],
      default: "system",
    },
    title: { type: String, required: true, trim: true },
    desc: { type: String, trim: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    issuedOn: { type: Date },
    credentialId: { type: String, trim: true },
    downloadUrl: { type: String, trim: true },
    shareUrl: { type: String, trim: true },
    color: { type: String, trim: true },
    icon: { type: String, trim: true },
  },
  { timestamps: true }
);

const resumeBuilderSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    title: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    targetRole: { type: String, trim: true },
    summary: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    education: { type: [mongoose.Schema.Types.Mixed], default: [] },
    experience: { type: [mongoose.Schema.Types.Mixed], default: [] },
    certifications: { type: [mongoose.Schema.Types.Mixed], default: [] },
    template: {
      type: String,
      enum: ["modern", "minimal"],
      default: "modern",
    },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      assignments: { type: Boolean, default: true },
      assessments: { type: Boolean, default: true },
      mentorSessions: { type: Boolean, default: true },
      interviews: { type: Boolean, default: true },
      achievements: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true },
    },
    privacy: {
      recruiterVisible: { type: Boolean, default: true },
      profileVisibleToRecruiters: { type: Boolean, default: true },
      leaderboard: { type: Boolean, default: true },
      showActivityStatus: { type: Boolean, default: true },
      shareDataWithPartners: { type: Boolean, default: false },
      twoFactor: { type: Boolean, default: false },
      twoFactorAuth: { type: Boolean, default: false },
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "light",
    },
    connectedAccounts: {
      github: { type: Boolean, default: false },
      linkedIn: { type: Boolean, default: false },
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      minlength: 8,
    },
    phone: {
      type: String,
      trim: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    branch: {
      type: String,
      trim: true,
    },
    semester: {
      type: Number,
      min: 1,
      max: 12,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    skillDetails: [skillDetailSchema],
    interests: [{ type: String, trim: true }],
    education: [educationSchema],
    resume: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    learningProgress: [learningProgressSchema],
    assignmentSubmissions: [assignmentSubmissionSchema],
    quizSubmissions: [quizSubmissionSchema],
    scoreHistory: [scoreHistorySchema],
    notifications: [notificationSchema],
    certificates: [certificateSchema],
    resumeBuilder: resumeBuilderSchema,
    settings: {
      type: settingsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Student", studentSchema);
