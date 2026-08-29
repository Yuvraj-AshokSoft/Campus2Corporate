import mongoose from "mongoose";

const contentRoadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Roadmap title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    category: {
      type: String,
      enum: ["Tech", "Business", "Non-Tech"],
      default: "Tech",
    },
    status: {
      type: String,
      enum: ["Published", "Under Review", "Draft"],
      default: "Published",
    },
    starred: {
      type: Boolean,
      default: false,
    },
    enrollments: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    modulesCount: {
      type: Number,
      default: 5,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

contentRoadmapSchema.index({ category: 1, status: 1 });

export default mongoose.model("ContentRoadmap", contentRoadmapSchema);
