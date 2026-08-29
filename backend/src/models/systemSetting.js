import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global_platform_settings",
    },
    aiReadinessWeights: {
      academicWeight: { type: Number, min: 0, max: 100, default: 40 },
      softSkillsWeight: { type: Number, min: 0, max: 100, default: 30 },
      techProjectsWeight: { type: Number, min: 0, max: 100, default: 20 },
      extracurricularWeight: { type: Number, min: 0, max: 100, default: 10 },
    },
    maintenanceMode: {
      enabled: { type: Boolean, default: false },
      message: {
        type: String,
        default:
          "System maintenance in progress. Only Super Admins retain access.",
      },
    },
    apiIntegrations: {
      linkedIn: { type: Boolean, default: true },
      youTube: { type: Boolean, default: true },
      leetCode: { type: Boolean, default: false },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SystemSetting", systemSettingSchema);
