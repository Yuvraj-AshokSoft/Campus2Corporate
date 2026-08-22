import mongoose from "mongoose";

const collegeActivityLogSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "College reference is required"],
      index: true,
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      trim: true,
    },
    module: {
      type: String,
      enum: [
        "PlacementDrive",
        "Project",
        "Broadcast",
        "EligibilityPreset",
        "Student",
        "Company",
        "Recruiter",
        "General",
      ],
      default: "General",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CollegeActivityLog", collegeActivityLogSchema);
