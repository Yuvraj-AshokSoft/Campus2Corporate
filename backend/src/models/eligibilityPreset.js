import mongoose from "mongoose";

const eligibilityPresetSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "College reference is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Preset name is required"],
      trim: true,
    },
    minCgpa: {
      type: Number,
      default: 0,
    },
    eligibleBranches: {
      type: [String],
      default: [],
    },
    maxActiveBacklogs: {
      type: Number,
      default: 0,
    },
    allowedPassingYears: {
      type: [Number],
      default: [],
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

export default mongoose.model("EligibilityPreset", eligibilityPresetSchema);
