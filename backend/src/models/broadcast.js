import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Broadcast title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [3000, "Message cannot exceed 3000 characters"],
    },
    targetAudience: {
      type: String,
      enum: ["all_students", "all_colleges", "all_recruiters", "mentors", "all"],
      default: "all_students",
    },
    priority: {
      type: String,
      enum: ["standard", "high", "urgent"],
      default: "standard",
    },
    status: {
      type: String,
      enum: ["Draft", "Delivered", "Scheduled"],
      default: "Delivered",
    },
    openRate: {
      type: String,
      default: "--",
    },
    clickRate: {
      type: String,
      default: "--",
    },
    sentAt: {
      type: Date,
      default: Date.now,
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

broadcastSchema.index({ targetAudience: 1, createdAt: -1 });
broadcastSchema.index({ status: 1 });

export default mongoose.model("Broadcast", broadcastSchema);
