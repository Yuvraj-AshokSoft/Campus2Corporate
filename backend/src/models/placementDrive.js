import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "College reference is required"],
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    jobRole: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },

    packageLPA: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Package LPA is required"],
    },

    driveDate: {
      type: Date,
      required: [true, "Drive date is required"],
    },

    mode: {
      type: String,
      enum: ["Virtual", "On-Campus"],
      default: "Virtual",
    },

    eligibilityPreset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EligibilityPreset",
    },

    minCgpa: {
      type: Number,
      default: 0,
    },

    maxActiveBacklogs: {
      type: Number,
      default: 0,
    },

    allowedPassingYears: [
      {
        type: Number,
      },
    ],

    eligibleBranches: [
      {
        type: String,
        trim: true,
      },
    ],

    eligibilityCriteria: {
      type: String,
      trim: true,
      default: "",
    },

    capacityLimit: {
      type: Number,
      default: 200,
    },

    appliedCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled", "REGISTRATION OPEN", "INTERVIEWING", "TESTING STAGE", "OFFERS RELEASED"],
      default: "Upcoming",
    },

    deadline: {
      type: Date,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PlacementDrive", placementDriveSchema);
