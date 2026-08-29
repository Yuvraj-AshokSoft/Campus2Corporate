import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetModel: {
      type: String,
      enum: [
        "Student",
        "College",
        "Recruiter",
        "Company",
        "Project",
        "Application",
        "Broadcast",
        "ContentRoadmap",
        "SupportTicket",
        "SystemSetting",
        "Admin",
        "Auth",
      ],
      required: true,
    },
    targetId: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
      trim: true,
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1",
    },
    status: {
      type: String,
      enum: ["Success", "Failed", "Blocked"],
      default: "Success",
    },
  },
  {
    timestamps: true,
  }
);

adminActivitySchema.index({ createdAt: -1 });
adminActivitySchema.index({ admin: 1, createdAt: -1 });
adminActivitySchema.index({ action: 1 });

export default mongoose.model("AdminActivity", adminActivitySchema);
