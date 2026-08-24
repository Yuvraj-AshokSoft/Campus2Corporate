import mongoose from "mongoose";

const interviewAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    technicalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    communicationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    feedback: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const aiInterviewSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    driveId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      default: "Software Engineer",
    },

    candidateContext: {
      type: String,
      default: "",
      maxlength: 12000,
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },

    topicsCovered: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    totalQuestions: {
      type: Number,
      default: 5,
    },

    currentQuestion: {
      type: Number,
      default: 1,
    },

    questions: {
      type: [
        {
          questionId: {
            type: String,
            required: true,
          },

          question: {
            type: String,
            required: true,
          },

          answered: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },

    answers: {
      type: [interviewAnswerSchema],
      default: [],
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    technicalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    communicationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendation: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    videoStorageKey: {
      type: String,
      default: "",
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const AIInterview = mongoose.model(
  "AIInterview",
  aiInterviewSchema,
);

export default AIInterview;
